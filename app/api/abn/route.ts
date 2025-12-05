import { NextResponse } from "next/server";

const ABR_GUID = process.env.ABR_GUID;

export async function POST(request: Request) {
  if (!ABR_GUID) {
    return NextResponse.json(
      { error: "ABR_GUID is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const abnInput = (body?.abn || "").replace(/\s+/g, "");

  if (!/^\d{11}$/.test(abnInput)) {
    return NextResponse.json(
      { error: "ABN must be 11 digits (numbers only)." },
      { status: 400 }
    );
  }

  const url = new URL("https://abr.business.gov.au/json/AbnDetails.aspx");
  url.searchParams.set("abn", abnInput);
  url.searchParams.set("guid", ABR_GUID);

  try {
    const abrResponse = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!abrResponse.ok) {
      throw new Error(`ABR returned status ${abrResponse.status}`);
    }

    const raw = (await abrResponse.text()) || "";

    // ABR returns JSONP: callback({...});
    const trimmed = raw.trim();
    const jsonPayload = trimmed.startsWith("{")
      ? trimmed
      : trimmed.replace(/^[^(]*\(/, "").replace(/\);?$/, "");

    const parsed = JSON.parse(jsonPayload || "{}");

    if (!parsed?.Abn) {
      return NextResponse.json(
        { error: "ABN not found in ABR lookup." },
        { status: 404 }
      );
    }

    const businessName =
      parsed.EntityName ||
      (Array.isArray(parsed.BusinessName) &&
        parsed.BusinessName[0]?.OrganisationName) ||
      parsed.MainName?.OrganisationName ||
      parsed.MainTradingName?.OrganisationName ||
      "Business";

    return NextResponse.json({
      abn: parsed.Abn,
      entityName: businessName,
      postcode:
        parsed.AddressPostcode || parsed.MainBusinessPhysicalAddressPostcode,
      state: parsed.AddressState || parsed.MainBusinessPhysicalAddressState,
      status: parsed.AbnStatus,
    });
  } catch (error) {
    console.error("ABR lookup failed", error);
    return NextResponse.json(
      { error: "ABR lookup failed. Please try again." },
      { status: 502 }
    );
  }
}
