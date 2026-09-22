/**
 * TEST FIXTURES & GROUND TRUTH CASSETTES
 * Model Case: Marcus Vance vs. Broadway Residential Owner IV LLC
 */

export const MARCUS_VANCE_FIXTURE = {
  tenantName: "Marcus Vance",
  tenantEmail: "marcus.vance@example.com",
  propertyAddress: "1428 Alice St, Apt 402, Oakland, CA 94612",
  moveInDate: "2022-08-01",
  moveOutDate: "2026-08-01", // 48 Months of Tenancy (200% of DRE 2-year paint life)
  noticeDate: "2026-08-25",  // 24 Days after move-out (> 21-day statutory window)
  depositAmount: 2200.0,
  withheldAmount: 1650.0,

  // Raw deduction letter text as sent by the property manager
  rawDeductionNoticeText: `
STATEMENT OF SECURITY DEPOSIT ACCOUNTING & DEDUCTIONS
Property: The Lyric at Alice Street, Unit 402, Oakland, CA 94612
Resident: Marcus Vance
Move-Out Date: August 1, 2026
Notice Date: August 25, 2026
Original Security Deposit: $2,200.00

ITEMIZED DEDUCTIONS:
1. Full interior apartment repaint: $800.00
   Description: Complete repainting of living room, bedroom, and kitchen walls due to scuffs and color wear.
   Photos: [None attached]
   Vendor: In-house turnover crew.

2. Plumbing repair & drywall remediation: $550.00
   Description: Bathroom drywall patching and plumbing leak drain check.
   Photos: [None attached]
   Vendor: QuickFix Maintenance Services (Invoice #QF-8912 attached, unlicensed general handyman).

3. Administrative move-out processing charge: $300.00
   Description: Standard file archival, key handling, and administrative turnover processing fee.
   Photos: [N/A]
   Receipt: [None attached]

Total Deductions: $1,650.00
Net Refund Due to Resident: $550.00
Balance Status: Check enclosed or pending dispute resolution within 14 days.
`.trim(),

  // Resolved corporate entity information from County GIS + Secretary of State
  entityResolution: {
    deedOwnerName: "Broadway Residential Owner IV LLC",
    deedDocumentId: "DOC-2021-084912-ALAMEDA",
    registeredAgentName: "CSC Lawyers Incorporating Service",
    registeredAgentAddress: "2710 Gateway Oaks Dr, Suite 150N, Sacramento, CA 95833",
    sosEntityNumber: "C3829104",
    propertyManagerName: "Greystar California Management Inc.",
    primaryNoticeEmail: "oakland-management@greystar-lyric.com",
  },
} as const;
