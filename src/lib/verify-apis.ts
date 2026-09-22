/**
 * VERIFY LIVE API CREDENTIALS
 * Tests real network connectivity to OpenAI, Firecrawl, and AgentMail
 */

import OpenAI from "openai";
import FirecrawlApp from "@mendable/firecrawl-js";
import fs from "fs";
import path from "path";

// Load .env.local manually if running outside Next.js runtime
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of envLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [k, ...v] = trimmed.split("=");
        if (k && v.length > 0) {
          process.env[k.trim()] = v.join("=").trim();
        }
      }
    }
  }
} catch (e) {
  // Ignore
}

async function verifyAllApis() {
  console.log("==================== TESTING LIVE SPONSOR APIS ====================");

  const openaiKey = process.env.OPENAI_API_KEY;
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  const agentmailKey = process.env.AGENTMAIL_API_KEY;

  // 1. TEST OPENAI / GITHUB MODELS
  console.log("\n[1/3] Testing OpenAI / GitHub Models API connectivity...");
  const rawKey = process.env.GITHUB_TOKEN || openaiKey;
  const isGithubToken = rawKey?.startsWith("ghp_") || rawKey?.startsWith("github_pat_");
  try {
    const openai = new OpenAI({
      apiKey: rawKey,
      baseURL: isGithubToken ? "https://models.inference.ai.azure.com" : undefined,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Reply with the exact word 'AUTHENTICATED'" }],
      max_tokens: 10,
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    console.log(`✓ OpenAI API Response (${isGithubToken ? "via GitHub Models Free Tier" : "Direct OpenAI"}):`, reply);
  } catch (err: any) {
    console.error("✗ OpenAI API Error:", err.message);
  }

  // 2. TEST FIRECRAWL
  console.log("\n[2/3] Testing Firecrawl API connectivity...");
  try {
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });
    // Scrape a fast lightweight test URL
    const scrapeRes = await firecrawl.scrapeUrl("https://example.com", {
      formats: ["markdown"],
    });
    if (scrapeRes.success) {
      console.log("✓ Firecrawl API Success: Scraped example.com markdown length =", scrapeRes.markdown?.length);
    } else {
      console.error("✗ Firecrawl Scrape Failed:", scrapeRes.error);
    }
  } catch (err: any) {
    console.error("✗ Firecrawl API Error:", err.message);
  }

  // 3. TEST AGENTMAIL
  console.log("\n[3/3] Testing AgentMail API connectivity...");
  try {
    const inboxEndpoint = agentmailKey?.startsWith("am_us_inbox_")
      ? "https://api.agentmail.to/v0/inboxes/mrsage@agentmail.to/messages"
      : "https://api.agentmail.to/v0/inboxes";

    const res = await fetch(inboxEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${agentmailKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✓ AgentMail HTTP Status:", res.status, res.statusText);
    if (res.ok) {
      const data = await res.json();
      console.log("✓ AgentMail Live Connectivity: Verified (Inbox: mrsage@agentmail.to)");
    } else {
      const errText = await res.text();
      console.log("  AgentMail Response Body:", errText);
    }
  } catch (err: any) {
    console.error("✗ AgentMail API Error:", err.message);
  }

  console.log("\n====================================================================");
}

verifyAllApis();
