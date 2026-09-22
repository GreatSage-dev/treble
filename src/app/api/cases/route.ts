import { NextRequest, NextResponse } from "next/server";
import { MARCUS_VANCE_FIXTURE } from "@/lib/test-fixtures";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const caseData = {
      id: `case_${Date.now()}`,
      tenantName: body.tenantName || MARCUS_VANCE_FIXTURE.tenantName,
      tenantEmail: body.tenantEmail || MARCUS_VANCE_FIXTURE.tenantEmail,
      propertyAddress: body.propertyAddress || MARCUS_VANCE_FIXTURE.propertyAddress,
      moveInDate: body.moveInDate || MARCUS_VANCE_FIXTURE.moveInDate,
      moveOutDate: body.moveOutDate || MARCUS_VANCE_FIXTURE.moveOutDate,
      depositAmount: body.depositAmount ?? MARCUS_VANCE_FIXTURE.depositAmount,
      withheldAmount: body.withheldAmount ?? MARCUS_VANCE_FIXTURE.withheldAmount,
      noticeDate: body.noticeDate || MARCUS_VANCE_FIXTURE.noticeDate,
      status: "INGESTED",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      status: "SUCCESS",
      case: caseData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create case" }, { status: 500 });
  }
}
