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
When helpful, populate the set_ui_metadata tool to drive UI chips (challenge areas, appliesTo, actions, citations, quickSuggestions, checklistItems, showForm). Only include items you are confident about.`;

const uiMetadataTool = {
  type: "function" as const,
  name: "set_ui_metadata",
  description:
    "Populate dashboard metadata for the current reply: challenge areas, appliesTo chips, actions, citations, jurisdictions, quick suggestions, checklist items, and optional form to render.",
  parameters: {
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
      appliesTo: {
        type: "array",
        items: { type: "string" },
      },
      actions: {
        type: "array",
        items: { type: "string" },
      },
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
      quickSuggestions: {
        type: "array",
        items: { type: "string" },
      },
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
  },
};

export async function POST(request: Request) {
  if (!client) {
    return NextResponse.json(
      { error: "Azure OpenAI credentials are not configured." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);

  const userMessages =
    Array.isArray(body?.messages) && body.messages.length > 0
      ? body.messages
          .filter(
            (msg: any) =>
              typeof msg?.content === "string" &&
              (msg.role === "user" || msg.role === "assistant")
          )
          .map((msg: any) => ({
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
      tools: [uiMetadataTool],
      max_output_tokens: 800,
    });

    let content = response.output_text || "";
    let metadata: Record<string, unknown> | undefined;
    let showForm: string | undefined;

    if (!content && Array.isArray(response.output)) {
      const textParts: string[] = [];
      response.output.forEach((item: any) => {
        if (item.type === "message" && Array.isArray(item.content)) {
          item.content.forEach((part: any) => {
            if (part.type === "output_text" && typeof part.text === "string") {
              textParts.push(part.text);
            }
          });
        }
      });
      content = textParts.join("\n\n");
    }

    if (Array.isArray(response.output)) {
      response.output.forEach((item: any) => {
        if (item.type === "function_call" && item.name === "set_ui_metadata") {
          try {
            const parsed = JSON.parse(item.arguments || "{}");
            metadata = parsed || undefined;
            if (parsed?.showForm) {
              showForm = parsed.showForm;
            }
          } catch (error) {
            console.error("Failed to parse metadata tool arguments", error);
          }
        }
      });
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
