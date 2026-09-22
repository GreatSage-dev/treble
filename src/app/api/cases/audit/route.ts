import { NextRequest, NextResponse } from "next/server";
import { runBackendAudit } from "@/lib/test-runner";
import { MARCUS_VANCE_FIXTURE } from "@/lib/test-fixtures";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const moveInDate = body.moveInDate || MARCUS_VANCE_FIXTURE.moveInDate;
    const moveOutDate = body.moveOutDate || MARCUS_VANCE_FIXTURE.moveOutDate;
    const noticeDate = body.noticeDate || MARCUS_VANCE_FIXTURE.noticeDate;
    const depositAmount = body.depositAmount ?? MARCUS_VANCE_FIXTURE.depositAmount;

    // Deductions to audit
    const deductions = body.deductions || [
      {
        description: "Full interior apartment repaint",
        claimedAmount: 800.0,
        category: "PAINTING",
        preRepairPhotoAttached: false, // California AB 2801 violation
        postRepairPhotoAttached: false,
        contractorLicensed: true,
        vendorReceiptAttached: false,
        hourlyLogAttached: false,
      },
      {
        description: "Plumbing repair & drywall remediation",
        claimedAmount: 550.0,
        category: "REPAIR_CONTRACTOR",
        preRepairPhotoAttached: false, // California AB 2801 violation
        postRepairPhotoAttached: false,
        contractorLicensed: false, // Cal. Bus. & Prof. Code § 7031 violation (> $500 unlicensed)
        vendorReceiptAttached: true,
        hourlyLogAttached: false,
      },
      {
        description: "Administrative move-out processing charge",
        claimedAmount: 300.0,
        category: "ADMINISTRATIVE",
        preRepairPhotoAttached: true,
        postRepairPhotoAttached: true,
        contractorLicensed: null,
        vendorReceiptAttached: false, // § 1950.5(g)(2)(A) violation
        hourlyLogAttached: false,
      },
    ];

    const auditResult = runBackendAudit(
      moveInDate,
      moveOutDate,
      noticeDate,
      depositAmount,
      deductions
    );

    return NextResponse.json({
      status: "AUDITED",
      ledger: {
        liquidatedUnlawfulDeductions: auditResult.unlawfulWithheld,
        statutoryLateNoticeDefault: auditResult.noticeDeadlineViolated,
        baseRefundOwed: auditResult.baseRefundOwed,
        badFaithExposure: auditResult.badFaithExposure,
        totalSmallClaimsLiability: auditResult.totalSmallClaimsLiability,
        cureAmountRequested: auditResult.unlawfulWithheld,
      },
      lineItems: auditResult.auditedItems,
      statutoryStandardsApplied: [
        "California AB 2801 Photographic Evidence Mandate (eff. Jan 1, 2025)",
        "California DRE 24-Month Paint Useful Life Benchmark",
        "California Business & Professions Code § 7031 (Unlicensed Contracting Bar)",
        "California Civil Code § 1950.5(g)(1) (21-Day Statutory Notice Deadline)",
        "California Civil Code § 1950.5(l) (Up to 2x Security Deposit Bad-Faith Penalty)",
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Audit processing failed" }, { status: 500 });
  }
}
