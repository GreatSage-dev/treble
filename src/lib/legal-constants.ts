/**
 * TREBLE LEGAL & STATUTORY CONSTANTS
 * Jurisdiction: California Civil Code § 1950.5 (as amended by AB 2801, eff. Jan 1, 2025)
 * Additional Authorities:
 *   - California Department of Real Estate (DRE) Reference Book (24-Month Paint Class Life)
 *   - California Business & Professions Code § 7031 (Contractor Licensing Bar)
 *   - California Civil Code § 1785.25(a) (California Consumer Credit Reporting Agencies Act)
 *   - California Civil Code § 1788 et seq. (Rosenthal Fair Debt Collection Practices Act)
 */

export const STATUTORY_LIMITS = {
  // Cal. Civ. Code § 1950.5(g)(1): Landlord must deliver itemized accounting and refund within 21 days
  LANDLORD_NOTICE_WINDOW_DAYS: 21,

  // Statutory cure window offered to lessor before filing small claims petition
  STATUTORY_CURE_WINDOW_DAYS: 14,

  // Cal. DRE Reference Book standard illustrative useful life for residential interior paint (months)
  DRE_PAINT_USEFUL_LIFE_MONTHS: 24,

  // Standard carpet useful life in California residential rentals (months)
  CARPET_USEFUL_LIFE_MONTHS: 60,

  // Cal. Bus. & Prof. Code § 7031: Work exceeding this threshold requires active CSLB license
  CONTRACTOR_LICENSE_THRESHOLD_USD: 500.0,

  // Cal. Civ. Code § 1950.5(l): Bad faith retention multiplier for punitive statutory damages
  BAD_FAITH_PUNITIVE_MULTIPLIER: 2.0,
} as const;

export const STATUTORY_CITATIONS = {
  AB_2801_PHOTO_MANDATE: "Cal. Civ. Code § 1950.5(g)(2) [AB 2801 Photographic Evidence Requirement]",
  DRE_PAINT_PRORATION: "Cal. Civ. Code § 1950.5(e) & Cal. DRE Reference Guide (24-Mo Useful Life)",
  CSLB_CONTRACTOR_BAR: "Cal. Bus. & Prof. Code § 7031 (Unlicensed Contracting Recovery Bar)",
  UNRECEIPTED_ADMIN_FEE: "Cal. Civ. Code § 1950.5(g)(2)(A) (Unverified Employee Wage / Surcharge Bar)",
  LATE_NOTICE_FORFEITURE: "Cal. Civ. Code § 1950.5(g)(1) (Forfeiture of Retention Rights post 21 Days)",
  BAD_FAITH_TREBLE_PENALTY: "Cal. Civ. Code § 1950.5(l) (Up to 2x Security Deposit Statutory Damages)",
  ROSENTHAL_DISPUTE_DISCLOSURE: "Cal. Civ. Code § 1785.25(a) & Rosenthal Fair Debt Collection Practices Act",
} as const;

export const STATUTORY_CREDIT_DISCLOSURE_TEXT = `
NOTICE OF STATUTORY DISPUTE & MANDATORY CREDIT REPORTING DISCLOSURE
This alleged balance is formally disputed in its entirety under the California Rosenthal Fair Debt Collection Practices Act (Cal. Civ. Code § 1788 et seq.). Pursuant to the California Consumer Credit Reporting Agencies Act (Cal. Civ. Code § 1785.25(a)), any furnisher of consumer credit information is statutorily prohibited from reporting information to any consumer credit reporting agency (including Equifax, Experian, or TransUnion) without explicitly disclosing that the debt is disputed by the consumer. Derogatory reporting of this disputed sum constitutes a willful statutory violation giving rise to civil liability, actual damages, and statutory attorney fees.
`.trim();
