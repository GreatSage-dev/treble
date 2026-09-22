import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordEvidence = mutation({
  args: {
    caseId: v.id("cases"),
    evidenceType: v.union(
      v.literal("LISTING_RECON"),
      v.literal("SOS_REGISTRY"),
      v.literal("CSLB_LICENSE"),
      v.literal("MUNICIPAL_VIOLATIONS")
    ),
    title: v.string(),
    sourceUrl: v.string(),
    extractedData: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("evidence", {
      caseId: args.caseId,
      evidenceType: args.evidenceType,
      title: args.title,
      sourceUrl: args.sourceUrl,
      extractedData: args.extractedData,
      timestamp: new Date().toISOString(),
    });
  },
});

export const getEvidenceByCase = query({
  args: {
    caseId: v.id("cases"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("evidence")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();
  },
});
