import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listDeductions = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deductions")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();
  },
});

export const ingestDeductions = mutation({
  args: {
    caseId: v.id("cases"),
    deductions: v.array(
      v.object({
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
        photoMandateSatisfied: v.boolean(),
        contractorLicenseChecked: v.boolean(),
        contractorStatus: v.optional(v.string()),
        usefulLifeMonths: v.number(),
        tenancyDurationMonths: v.number(),
        statutoryVerdict: v.string(),
        statutoryCitation: v.string(),
        defectType: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Remove existing deductions for this case (idempotent replacement)
    const existing = await ctx.db
      .query("deductions")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();

    for (const d of existing) {
      await ctx.db.delete(d._id);
    }

    // 2. Insert new audited deduction items
    for (const d of args.deductions) {
      await ctx.db.insert("deductions", {
        caseId: args.caseId,
        description: d.description,
        claimedAmount: d.claimedAmount,
        allowableAmount: d.allowableAmount,
        category: d.category,
        photoMandateSatisfied: d.photoMandateSatisfied,
        contractorLicenseChecked: d.contractorLicenseChecked,
        contractorStatus: d.contractorStatus,
        usefulLifeMonths: d.usefulLifeMonths,
        tenancyDurationMonths: d.tenancyDurationMonths,
        statutoryVerdict: d.statutoryVerdict,
        statutoryCitation: d.statutoryCitation,
        defectType: d.defectType,
      });
    }

    // 3. Update the case ledger
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return;

    const totalClaimed = args.deductions.reduce((sum, d) => sum + d.claimedAmount, 0);
    const totalAllowed = args.deductions.reduce((sum, d) => sum + d.allowableAmount, 0);
    const unlawfulWithheld = totalClaimed - totalAllowed;

    const dIn = new Date(caseDoc.moveInDate);
    const dOut = new Date(caseDoc.moveOutDate);
    const dNotice = new Date(caseDoc.noticeDate);
    const noticeElapsedDays = Math.round((dNotice.getTime() - dOut.getTime()) / (1000 * 60 * 60 * 24));
    const noticeDeadlineViolated = noticeElapsedDays > 21;

    const baseRefundOwed = noticeDeadlineViolated
      ? caseDoc.depositAmount
      : caseDoc.depositAmount - totalAllowed;

    const badFaithExposure =
      noticeDeadlineViolated || unlawfulWithheld > 0 ? 2.0 * caseDoc.depositAmount : 0;

    const totalSmallClaimsLiability = baseRefundOwed + badFaithExposure;

    await ctx.db.patch(args.caseId, {
      ledger: {
        liquidatedUnlawfulDeductions: unlawfulWithheld,
        statutoryLateNoticeDefault: noticeDeadlineViolated,
        baseRefundOwed: baseRefundOwed,
        badFaithExposure: badFaithExposure,
        totalSmallClaimsLiability: totalSmallClaimsLiability,
        cureAmountRequested: unlawfulWithheld,
      },
      status: "AUDITED",
      updatedAt: new Date().toISOString(),
    });
  },
});
