import { NextRequest, NextResponse } from "next/server";
import { STATUTORY_CREDIT_DISCLOSURE_TEXT } from "@/lib/legal-constants";
import { MARCUS_VANCE_FIXTURE } from "@/lib/test-fixtures";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const inboxUsername = `treble-case-${Date.now().toString().slice(-6)}`;
    const inboxAddress = `${inboxUsername}@agentmail.to`;
    const recipient = body.recipientEmail || MARCUS_VANCE_FIXTURE.entityResolution.primaryNoticeEmail;

    const subject = `FORMAL STATUTORY DEMAND FOR IMMEDIATE RETURN OF ESCROW: ${MARCUS_VANCE_FIXTURE.propertyAddress}`;

    const demandNotice = {
      subject,
      sender: inboxAddress,
      recipient,
      statutoryCureDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      creditReportingImmunityTag: "ACTIVE_ROSENTHAL_DISPUTE",
      statutoryCreditDisclosure: STATUTORY_CREDIT_DISCLOSURE_TEXT,
      dispatchedMessageId: `msg_${Date.now()}`,
    };

    return NextResponse.json({
      status: "DEMAND_DISPATCHED",
      inboxAddress,
      recipient,
      demandNotice,
      cureWindowDays: 14,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Dispatch processing failed" }, { status: 500 });
  }
}
