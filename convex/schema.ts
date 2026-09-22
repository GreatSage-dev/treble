import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core dispute state machine
  cases: defineTable({
    tenantName: v.string(),
    tenantEmail: v.string(),
    propertyAddress: v.string(),
    moveInDate: v.string(),       // ISO string (YYYY-MM-DD)
    moveOutDate: v.string(),      // ISO string (YYYY-MM-DD)
    depositAmount: v.number(),     // Total original deposit ($)
    withheldAmount: v.number(),    // Amount landlord withheld ($)
    noticeDate: v.string(),       // Date landlord delivered deduction notice
    status: v.union(
      v.literal("INGESTED"),
      v.literal("AUDITED"),
      v.literal("RECON_COMPLETE"),
      v.literal("DEMAND_QUEUED"),
      v.literal("DEMAND_DISPATCHED"),
      v.literal("COUNTERPARTY_REPLIED"),
      v.literal("CURE_EXPIRED"),
      v.literal("RESOLVED_REFUNDED")
    ),
    // Entity Resolution & Correspondence Routing Data
    entityResolution: v.optional(
      v.object({
        deedOwnerName: v.string(),
        deedDocumentId: v.string(),
        registeredAgentName: v.string(),
        registeredAgentAddress: v.string(),
        sosEntityNumber: v.string(),
        propertyManagerName: v.string(),
        primaryNoticeEmail: v.string(),
      })
    ),
    // Settlement Ledger Totals
    ledger: v.optional(
      v.object({
        liquidatedUnlawfulDeductions: v.number(),
        statutoryLateNoticeDefault: v.boolean(),
        baseRefundOwed: v.number(),
        badFaithExposure: v.number(),
        totalSmallClaimsLiability: v.number(),
        cureAmountRequested: v.number(),
      })
    ),
    // Dedicated AgentMail Conduit
    agentMailInboxId: v.optional(v.string()),
    agentMailAddress: v.optional(v.string()),
    // Statutory Countdown
    cureDeadline: v.optional(v.string()), // ISO string for 14-day cure window
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_tenant_email", ["tenantEmail"]),

  // Itemized deductions under audit
  deductions: defineTable({
    caseId: v.id("cases"),
    description: v.string(),
    claimedAmount: v.number(),
    allowableAmount: v.number(),
    category: v.union(
      v.literal("PAINTING"),
      v.literal("CLEANING"),
      v.literal("REPAIR_CONTRACTOR"),
      v.literal("ADMINISTRATIVE"),
      v.literal("OTHER")
    ),
    // California AB 2801 Statutory Requirement (Pre/Post Photos)
    photoMandateSatisfied: v.boolean(),
    // Contractor Licensing Requirement (Cal. Bus. & Prof. Code § 7031)
    contractorLicenseChecked: v.boolean(),
    contractorStatus: v.optional(v.string()), // "ACTIVE", "UNLICENSED", "INTERNAL_STAFF", "EXEMPT"
    // Useful life & proration calculations (DRE 2-Year Benchmark)
    usefulLifeMonths: v.number(),
    tenancyDurationMonths: v.number(),
    statutoryVerdict: v.string(),
    statutoryCitation: v.string(),
    defectType: v.string(),
  }).index("by_case", ["caseId"]),

  // Forensic evidence gathered by Firecrawl
  evidence: defineTable({
    caseId: v.id("cases"),
    evidenceType: v.union(
      v.literal("LISTING_RECON"),       // Proof unit was re-listed without repairs
      v.literal("SOS_REGISTRY"),        // Corporate Secretary of State registration
      v.literal("CSLB_LICENSE"),        // Contractor state licensing board check
      v.literal("MUNICIPAL_VIOLATIONS") // Habitability code violations
    ),
    title: v.string(),
    sourceUrl: v.string(),
    extractedData: v.string(),         // JSON stringified payload
    timestamp: v.string(),
  }).index("by_case", ["caseId"]),

  // Two-way legal correspondence ledger (AgentMail)
  communications: defineTable({
    caseId: v.id("cases"),
    inboxId: v.string(),
    direction: v.union(v.literal("OUTBOUND"), v.literal("INBOUND")),
    messageId: v.string(),
    sender: v.string(),
    recipient: v.string(),
    subject: v.string(),
    bodyText: v.string(),
    dkimVerified: v.boolean(),
    receivedAt: v.string(),
  })
    .index("by_case", ["caseId"])
    .index("by_message_id", ["messageId"]),
});
