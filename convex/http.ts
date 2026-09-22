import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * HEALTH CHECK ENDPOINT
 * GET /api/health
 */
http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "OK",
        service: "TREBLE Statutory Tenant Escrow Defense Engine",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

/**
 * AGENTMAIL WEBHOOK RECEIVER
 * POST /api/agentmail-webhook
 * Receives incoming emails, parses landlord responses, and reactively mutates dispute status.
 */
http.route({
  path: "/api/agentmail-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      const eventType = payload.event || payload.type || "message.received";
      const messageData = payload.data || payload.message || payload;

      const inboxId = messageData.inbox_id || messageData.inboxId;
      const messageId = messageData.message_id || messageData.id || `inbound_${Date.now()}`;
      const sender = messageData.from || messageData.sender || "unknown-sender@domain.com";
      const recipient = messageData.to || messageData.recipient || "agent@treble.agentmail.to";
      const subject = messageData.subject || "Re: Security Deposit Notice";
      const bodyText = messageData.text || messageData.body || "";
      const dkimVerified = messageData.dkim_verified ?? true;

      // Find the case matching this inbox or recipient
      const allCases = await ctx.runQuery(api.cases.listCases, {});
      const matchedCase = allCases.find(
        (c: any) => (inboxId && c.agentMailInboxId === inboxId) || (c.agentMailAddress && recipient.includes(c.agentMailAddress))
      );

      if (!matchedCase) {
        // Return 200 to acknowledge unmapped test deliveries
        return new Response(
          JSON.stringify({ status: "RECEIVED_UNMAPPED_CASE", inboxId }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Record communication idempotently
      await ctx.runMutation(api.cases.recordCommunication, {
        caseId: matchedCase._id,
        inboxId: inboxId || matchedCase.agentMailInboxId || "default_inbox",
        direction: "INBOUND",
        messageId: messageId,
        sender: sender,
        recipient: recipient,
        subject: subject,
        bodyText: bodyText,
        dkimVerified: dkimVerified,
      });

      // Convex reactive queries (useQuery) automatically update all connected clients
      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          caseId: matchedCase._id,
          messageId: messageId,
          reactiveSyncTriggered: true,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      console.error("AgentMail webhook error:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Webhook processing error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * SOVEREIGN LANDING & EDGE ROUTING
 * Proxies and mirrors the primary Next.js Vercel UI on the Convex Edge.
 */
async function forwardToVercel(request: Request, fallbackPath: string = "/") {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? fallbackPath : url.pathname;
    const target = `https://treble-tawny.vercel.app${pathname}${url.search}`;
    
    const upstream = await fetch(target, {
      method: request.method,
      headers: {
        "Accept": request.headers.get("Accept") || "*/*",
        "User-Agent": "Convex-Edge-Sovereign-Mirror/1.0",
      },
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
    });

    const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";

    if (contentType.includes("text/html")) {
      const html = await upstream.text();
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=60, s-maxage=300",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const data = await upstream.arrayBuffer();
    return new Response(data, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Vercel forward error:", err);
    return new Response(
      `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=https://treble-tawny.vercel.app${new URL(request.url).pathname}"></head><body>Redirecting to TREBLE...</body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

// 1. Root landing page
http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return forwardToVercel(request, "/");
  }),
});

// 2. Judges playground
http.route({
  path: "/judges",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return forwardToVercel(request, "/judges");
  }),
});

// 3. Audit flow
http.route({
  path: "/audit",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return forwardToVercel(request, "/audit");
  }),
});

// 4. Next.js static assets and chunks
http.route({
  pathPrefix: "/_next/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return forwardToVercel(request);
  }),
});

// 5. Fonts
http.route({
  pathPrefix: "/fonts/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return forwardToVercel(request);
  }),
});

export default http;
