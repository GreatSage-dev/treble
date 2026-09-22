import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "HEALTHY",
    service: "TREBLE Statutory Tenant Escrow Defense Engine",
    version: "2.0.0",
    jurisdiction: "California Civil Code § 1950.5 (AB 2801 eff. 2025)",
    standards: [
      "California AB 2801 Photographic Evidence Mandate",
      "California DRE 24-Month Paint Useful Life Benchmark",
      "California Business & Professions Code § 7031 (CSLB License Bar)",
      "California Rosenthal Fair Debt Collection Practices Act & CCRAA § 1785.25(a)",
    ],
    timestamp: new Date().toISOString(),
  });
}
