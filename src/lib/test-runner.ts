/**
 * TREBLE BACKEND INTEGRATION TESTBENCH
 * Validates statutory proration formulas, AB 2801 checks, and ledger calculations in TypeScript.
 */

import { STATUTORY_LIMITS, STATUTORY_CITATIONS, STATUTORY_CREDIT_DISCLOSURE_TEXT } from "./legal-constants";
import { MARCUS_VANCE_FIXTURE } from "./test-fixtures";

interface TestDeduction {
  description: string;
  claimedAmount: number;
  category: "PAINTING" | "CLEANING" | "REPAIR_CONTRACTOR" | "ADMINISTRATIVE" | "OTHER";
  preRepairPhotoAttached: boolean;
  postRepairPhotoAttached: boolean;
  contractorLicensed: boolean | null;
  vendorReceiptAttached: boolean;
  hourlyLogAttached: boolean;
}

export function runBackendAudit(
  moveInDateStr: string,
  moveOutDateStr: string,
  noticeDateStr: string,
  depositAmount: number,
  deductions: TestDeduction[]
) {
  const dIn = new Date(moveInDateStr);
  const dOut = new Date(moveOutDateStr);
  const dNotice = new Date(noticeDateStr);

  const tenancyDays = Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24));
  const tenancyMonths = Math.round((tenancyDays / 30.4375) * 10) / 10;
  const noticeElapsedDays = Math.round((dNotice.getTime() - dOut.getTime()) / (1000 * 60 * 60 * 24));

  const noticeDeadlineViolated = noticeElapsedDays > STATUTORY_LIMITS.LANDLORD_NOTICE_WINDOW_DAYS;

  const auditedItems = deductions.map((item) => {
    const photosSatisfied = item.preRepairPhotoAttached && item.postRepairPhotoAttached;

    // 1. AB 2801 Photographic Evidence Rule
    if (!photosSatisfied && (item.category === "PAINTING" || item.category === "CLEANING" || item.category === "REPAIR_CONTRACTOR")) {
      return {
        description: item.description,
        claimedAmount: item.claimedAmount,
        allowableAmount: 0.0,
        verdict: "STATUTORILY DEFECTIVE (AB 2801)",
        citation: STATUTORY_CITATIONS.AB_2801_PHOTO_MANDATE,
        defect: "MISSING_BEFORE_AFTER_PHOTOS",
      };
    }

    // 2. Cal. Bus. & Prof. Code § 7031 Contractor License Check (> $500)
    if (item.claimedAmount > STATUTORY_LIMITS.CONTRACTOR_LICENSE_THRESHOLD_USD && item.contractorLicensed === false) {
      return {
        description: item.description,
        claimedAmount: item.claimedAmount,
        allowableAmount: 0.0,
        verdict: "UNLICENSED CONTRACTOR VOID",
        citation: STATUTORY_CITATIONS.CSLB_CONTRACTOR_BAR,
        defect: "UNLICENSED_CONTRACTOR_OVER_500",
      };
    }

    // 3. Administrative Surcharge Rule
    if (item.category === "ADMINISTRATIVE" && !item.vendorReceiptAttached && !item.hourlyLogAttached) {
      return {
        description: item.description,
        claimedAmount: item.claimedAmount,
        allowableAmount: 0.0,
        verdict: "UNRECEIPTED ADMINISTRATIVE SURCHARGE",
        citation: STATUTORY_CITATIONS.UNRECEIPTED_ADMIN_FEE,
        defect: "NO_INDEPENDENT_RECEIPT_OR_WAGE_LOG",
      };
    }

    // 4. DRE 24-Month Paint Useful Life Benchmark
    if (item.category === "PAINTING") {
      const paintLife = STATUTORY_LIMITS.DRE_PAINT_USEFUL_LIFE_MONTHS;
      if (tenancyMonths >= paintLife) {
        return {
          description: item.description,
          claimedAmount: item.claimedAmount,
          allowableAmount: 0.0,
          verdict: "UNLAWFUL WEAR & TEAR (USEFUL LIFE EXPIRED)",
          citation: STATUTORY_CITATIONS.DRE_PAINT_PRORATION,
          defect: "EXCEEDED_24_MONTH_DRE_PAINT_LIFE",
        };
      } else {
        const prorationRatio = Math.max(0, 1 - tenancyMonths / paintLife);
        const allowed = Math.round(item.claimedAmount * prorationRatio * 100) / 100;
        return {
          description: item.description,
          claimedAmount: item.claimedAmount,
          allowableAmount: allowed,
          verdict: `PRORATED DEDUCTION (${Math.round(prorationRatio * 100)}% REMAINING)`,
          citation: STATUTORY_CITATIONS.DRE_PAINT_PRORATION,
          defect: "PRORATED_WEAR",
        };
      }
    }

    // 5. Valid Documented Deduction
    return {
      description: item.description,
      claimedAmount: item.claimedAmount,
      allowableAmount: item.claimedAmount,
      verdict: "VALID DOCUMENTED DEDUCTION",
      citation: "Cal. Civ. Code § 1950.5(b)(3)",
      defect: "NONE",
    };
  });

  const totalClaimed = deductions.reduce((s, d) => s + d.claimedAmount, 0);
  const totalAllowed = auditedItems.reduce((s, d) => s + d.allowableAmount, 0);
  const unlawfulWithheld = totalClaimed - totalAllowed;

  const baseRefundOwed = noticeDeadlineViolated
    ? depositAmount
    : depositAmount - totalAllowed;

  const badFaithExposure =
    noticeDeadlineViolated || unlawfulWithheld > 0
      ? STATUTORY_LIMITS.BAD_FAITH_PUNITIVE_MULTIPLIER * depositAmount
      : 0.0;

  const totalSmallClaimsLiability = baseRefundOwed + badFaithExposure;

  return {
    tenancyMonths,
    noticeElapsedDays,
    noticeDeadlineViolated,
    totalClaimed,
    totalAllowed,
    unlawfulWithheld,
    baseRefundOwed,
    badFaithExposure,
    totalSmallClaimsLiability,
    auditedItems,
  };
}

// Self-executing verification
export function verifyEngine() {
  const marcusDeductions: TestDeduction[] = [
    {
      description: "Full interior apartment repaint",
      claimedAmount: 800.0,
      category: "PAINTING",
      preRepairPhotoAttached: false,
      postRepairPhotoAttached: false,
      contractorLicensed: true,
      vendorReceiptAttached: false,
      hourlyLogAttached: false,
    },
    {
      description: "Plumbing repair & drywall remediation",
      claimedAmount: 550.0,
      category: "REPAIR_CONTRACTOR",
      preRepairPhotoAttached: false,
      postRepairPhotoAttached: false,
      contractorLicensed: false,
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
      vendorReceiptAttached: false,
      hourlyLogAttached: false,
    },
  ];

  const result = runBackendAudit(
    MARCUS_VANCE_FIXTURE.moveInDate,
    MARCUS_VANCE_FIXTURE.moveOutDate,
    MARCUS_VANCE_FIXTURE.noticeDate,
    MARCUS_VANCE_FIXTURE.depositAmount,
    marcusDeductions
  );

  console.log("=== TREBLE TYPESCRIPT AUDIT VERIFICATION ===");
  console.log(`Tenancy: ${result.tenancyMonths} Months | Notice Elapsed: ${result.noticeElapsedDays} Days`);
  console.log(`Total Claimed: $${result.totalClaimed} | Allowable: $${result.totalAllowed}`);
  console.log(`Unlawful Withheld: $${result.unlawfulWithheld} | Base Refund Owed: $${result.baseRefundOwed}`);
  console.log(`Bad-Faith Statutory Exposure: $${result.badFaithExposure}`);
  console.log(`Total Small Claims Exposure: $${result.totalSmallClaimsLiability}`);

  if (
    result.totalAllowed === 0.0 &&
    result.unlawfulWithheld === 1650.0 &&
    result.baseRefundOwed === 2200.0 &&
    result.badFaithExposure === 4400.0 &&
    result.totalSmallClaimsLiability === 6600.0
  ) {
    console.log(">>> AUDIT LOGIC TEST: PASSED <<<");
  } else {
    throw new Error("Audit logic verification failed!");
  }
}

if (require.main === module) {
  verifyEngine();
}
