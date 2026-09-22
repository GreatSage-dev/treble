import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * QUERIES
 */

export const getCase = query({
  args: { id: v.id("cases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listCases = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("INGESTED"),
        v.literal("AUDITED"),
        v.literal("RECON_COMPLETE"),
        v.literal("DEMAND_QUEUED"),
        v.literal("DEMAND_DISPATCHED"),
        v.literal("COUNTERPARTY_REPLIED"),
        v.literal("CURE_EXPIRED"),
        v.literal("RESOLVED_REFUNDED")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("cases")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("cases").order("desc").collect();
  },
});

export const getCaseWithDetails = query({
  args: { id: v.id("cases") },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.id);
    if (!caseDoc) return null;

    const deductions = await ctx.db
      .query("deductions")
      .withIndex("by_case", (q) => q.eq("caseId", args.id))
      .collect();

    const evidence = await ctx.db
      .query("evidence")
      .withIndex("by_case", (q) => q.eq("caseId", args.id))
      .collect();

    const communications = await ctx.db
      .query("communications")
      .withIndex("by_case", (q) => q.eq("caseId", args.id))
      .collect();

    return {
      caseDoc,
      deductions,
      evidence,
      communications,
    };
  },
});

/**
 * MUTATIONS
 */

export const createCase = mutation({
  args: {
    tenantName: v.string(),
    tenantEmail: v.string(),
    propertyAddress: v.string(),
    moveInDate: v.string(),
    moveOutDate: v.string(),
    depositAmount: v.number(),
    withheldAmount: v.number(),
    noticeDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const caseId = await ctx.db.insert("cases", {
      tenantName: args.tenantName,
      tenantEmail: args.tenantEmail,
      propertyAddress: args.propertyAddress,
      moveInDate: args.moveInDate,
      moveOutDate: args.moveOutDate,
      depositAmount: args.depositAmount,
      withheldAmount: args.withheldAmount,
      noticeDate: args.noticeDate,
      status: "INGESTED",
      createdAt: now,
      updatedAt: now,
    });
    return caseId;
  },
});

export const updateCaseStatus = mutation({
  args: {
    id: v.id("cases"),
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
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
    });
  },
});

export const setEntityResolution = mutation({
  args: {
    id: v.id("cases"),
    entityResolution: v.object({
      deedOwnerName: v.string(),
      deedDocumentId: v.string(),
      registeredAgentName: v.string(),
      registeredAgentAddress: v.string(),
      sosEntityNumber: v.string(),
      propertyManagerName: v.string(),
      primaryNoticeEmail: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      entityResolution: args.entityResolution,
      updatedAt: now,
    });
  },
});

export const setAgentMailInbox = mutation({
  args: {
    id: v.id("cases"),
    inboxId: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      agentMailInboxId: args.inboxId,
      agentMailAddress: args.address,
      updatedAt: now,
    });
  },
});

export const updateLedger = mutation({
  args: {
    id: v.id("cases"),
    ledger: v.object({
      liquidatedUnlawfulDeductions: v.number(),
      statutoryLateNoticeDefault: v.boolean(),
      baseRefundOwed: v.number(),
      badFaithExposure: v.number(),
      totalSmallClaimsLiability: v.number(),
      cureAmountRequested: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      ledger: args.ledger,
      status: "AUDITED",
      updatedAt: now,
    });
  },
});

export const recordCommunication = mutation({
  args: {
    caseId: v.id("cases"),
    inboxId: v.string(),
    direction: v.union(v.literal("OUTBOUND"), v.literal("INBOUND")),
    messageId: v.string(),
    sender: v.string(),
    recipient: v.string(),
    subject: v.string(),
    bodyText: v.string(),
    dkimVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Idempotency check: don't insert duplicate messageId
    const existing = await ctx.db
      .query("communications")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
      .first();

    if (existing) {
      return existing._id;
    }

    const commId = await ctx.db.insert("communications", {
      caseId: args.caseId,
      inboxId: args.inboxId,
      direction: args.direction,
      messageId: args.messageId,
      sender: args.sender,
      recipient: args.recipient,
      subject: args.subject,
      bodyText: args.bodyText,
      dkimVerified: args.dkimVerified,
      receivedAt: now,
    });

    // If inbound communication received, update case status reactively
    if (args.direction === "INBOUND") {
      await ctx.db.patch(args.caseId, {
        status: "COUNTERPARTY_REPLIED",
        updatedAt: now,
      });
    }

    return commId;
  },
});

export const onCureDeadlineExpired = internalMutation({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return;

    // Only transition if not already refunded or settled
    if (caseDoc.status !== "RESOLVED_REFUNDED") {
      await ctx.db.patch(args.caseId, {
        status: "CURE_EXPIRED",
        updatedAt: new Date().toISOString(),
      });
    }
  },
});

export const auditExpiringCureWindows = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const activeDispatches = await ctx.db
      .query("cases")
      .withIndex("by_status", (q) => q.eq("status", "DEMAND_DISPATCHED"))
      .collect();

    for (const c of activeDispatches) {
      if (c.cureDeadline && c.cureDeadline < now) {
        await ctx.db.patch(c._id, {
          status: "CURE_EXPIRED",
          updatedAt: now,
        });
      }
    }
  },
});

