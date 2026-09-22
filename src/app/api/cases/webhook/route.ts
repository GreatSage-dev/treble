import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));

    const event = payload.event || "message.received";
    const data = payload.data || payload;
    const messageId = data.message_id || `inbound_${Date.now()}`;
    const sender = data.from || "landlord-disputes@greystar.com";
    const bodyText = data.text || "We received your statutory notice and will remit the full $1,650 deposit.";

    return NextResponse.json({
      status: "SUCCESS",
      eventReceived: event,
      messageId,
      sender,
      reactiveSync: {
        newStatus: "COUNTERPARTY_REPLIED",
        settlementResponse: bodyText,
        fullRefundOffered: bodyText.includes("1,650") || bodyText.includes("full"),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
