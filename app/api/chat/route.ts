import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

const azureEndpoint =
  process.env.AZURE_OPENAI_API_URI?.split("/openai")[0] ||
  process.env.AZURE_OPENAI_API_URI;

const client =
  azureEndpoint && process.env.AZURE_OPENAI_API_KEY
    ? new AzureOpenAI({
        endpoint: azureEndpoint,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: "2025-04-01-preview",
      })
    : null;

const SYSTEM_PROMPT = `You are "RedTape", an officious Australian government liaison. Respond like a policy fact sheet: formal, concise, and a touch over-documented. Always:
- Lead with the direct answer before outlining steps.
- Reference forms, lodgment pathways, and contact channels.
- Flag caveats, eligibility checks, and timelines.
- Keep replies crisp (aim for ~120 words) while sounding bureaucratic.
- Always return a user-facing answer plus optional UI metadata in the JSON schema.
- Use showForm when the user is clearly asking about ABN/GST/permits/business setup (abn, business-details), job loss (jobseeker-details), caring (carer-details), student benefits (student-details), or document analysis (document-upload/bank-integration).`;

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
    metadata: {
      type: "object",
      additionalProperties: false,
      properties: {
        challengeAreas: {
          type: "array",
          items: {
            type: "string",
            enum: ["tax", "services", "data", "compliance"],
          },
        },
        appliesTo: { type: "array", items: { type: "string" } },
        actions: { type: "array", items: { type: "string" } },
        citations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              source: { type: "string" },
              url: { type: "string" },
            },
          },
        },
        jurisdictions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              level: {
                type: "string",
                enum: ["federal", "state", "local"],
              },
              name: { type: "string" },
              role: { type: "string" },
            },
          },
        },
        quickSuggestions: { type: "array", items: { type: "string" } },
        checklistItems: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              dueDate: { type: "string" },
              agency: { type: "string" },
              priority: {
                type: "string",
                enum: ["high", "medium", "low"],
              },
              category: {
                type: "string",
                enum: ["tax", "services", "data", "compliance"],
              },
            },
          },
        },
      },
    },
    showForm: {
      type: "string",
      enum: [
        "abn",
        "business-details",
        "bank-integration",
        "document-upload",
        "jobseeker-details",
        "carer-details",
        "student-details",
      ],
    },
  },
  required: ["answer"],
};

export async function POST(request: Request) {
  if (!client) {
    return NextResponse.json(
      { error: "Azure OpenAI credentials are not configured." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);

  type IncomingMessage = { role: "user" | "assistant"; content: string };

  const userMessages: IncomingMessage[] =
    Array.isArray(body?.messages) && body.messages.length > 0
      ? body.messages
          .filter((msg: unknown): msg is IncomingMessage => {
            return (
              typeof msg === "object" &&
              msg !== null &&
              (msg as { role?: unknown }).role !== undefined &&
              (msg as { content?: unknown }).content !== undefined &&
              typeof (msg as IncomingMessage).content === "string" &&
              ((msg as IncomingMessage).role === "user" ||
                (msg as IncomingMessage).role === "assistant")
            );
          })
          .map((msg: IncomingMessage) => ({
            role: msg.role,
            content: msg.content,
            type: "message" as const,
          }))
      : [];

  const portfolioSummary =
    body?.portfolio && Object.keys(body.portfolio || {}).length > 0
      ? `Portfolio context: ${JSON.stringify(body.portfolio).slice(0, 1200)}`
      : "No portfolio context supplied.";

  try {
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: userMessages,
      instructions: `${SYSTEM_PROMPT}\n${portfolioSummary}`,
      text: {
        format: {
          type: "json_schema",
          name: "redtape_payload",
          schema: RESPONSE_SCHEMA,
          strict: false,
        },
        verbosity: "low",
      },
      reasoning: { effort: "low" },
    });

    let content = "";
    let metadata: Record<string, unknown> | undefined;
    let showForm: string | undefined;

    if (response.output_text) {
      try {
        const parsed = JSON.parse(response.output_text);
        content = parsed?.answer || "";
        metadata = parsed?.metadata || undefined;
        showForm = parsed?.showForm || undefined;
      } catch (error) {
        console.error("Failed to parse structured output", error);
        content = response.output_text;
      }
    }

    if (!content && Array.isArray(response.output)) {
      const textParts: string[] = [];
      response.output.forEach((item: unknown) => {
        if (
          typeof item === "object" &&
          item !== null &&
          (item as { type?: string }).type === "message" &&
          Array.isArray((item as { content?: unknown[] }).content)
        ) {
          (item as { content: unknown[] }).content.forEach((part: unknown) => {
            if (
              typeof part === "object" &&
              part !== null &&
              (part as { type?: string }).type === "output_text" &&
              typeof (part as { text?: unknown }).text === "string"
            ) {
              textParts.push((part as { text: string }).text);
            }
          });
        }
      });
      content = textParts.join("\n\n");
    }

    return NextResponse.json({
      message: {
        content:
          content ||
          "I was unable to draft a compliant response. Please try again shortly.",
        metadata,
        showForm,
      },
    });
  } catch (error) {
    console.error("Azure OpenAI error", error);
    return NextResponse.json(
      {
        error: "The compliance desk is unavailable. Please retry.",
      },
      { status: 500 }
    );
  }
}
