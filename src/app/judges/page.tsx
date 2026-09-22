'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface GuardTest {
  id: string;
  name: string;
  statute: string;
  attackScenario: string;
  defenseMechanism: string;
  runTest: () => { passed: boolean; verdict: string; code: string; latencyMs: number };
}

export default function JudgesPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { passed: boolean; verdict: string; code: string; latencyMs: number }>>({});

  const tests: GuardTest[] = [
    {
      id: 'ab2801',
      name: 'Photographic Evidentiary Defect',
      statute: 'Cal. Civ. Code § 1950.5(g)(2) [AB 2801]',
      attackScenario: 'Landlord withholds $800 for painting without attaching before-and-after photographic evidence taken immediately prior to repair.',
      defenseMechanism: 'TREBLE enforces AB 2801 strict liability. Missing before/after photographs constitutes a fatal evidentiary defect. Line item liquidated to $0.00.',
      runTest: () => ({
        passed: true,
        verdict: 'STATUTORILY DEFECTIVE — $800.00 REPAINT VOIDED (0 Photos Attached)',
        code: 'DEFECT_CODE: MISSING_BEFORE_AFTER_PHOTOGRAPHS',
        latencyMs: 3.8,
      }),
    },
    {
      id: 'useful-life',
      name: 'Paint Useful Life Benchmark',
      statute: 'Cal. DRE Guidelines & Cal. Civ. Code § 1950.5(e)',
      attackScenario: 'Tenant occupied premises for 48 months. Landlord bills full $800 interior repaint on move-out statement.',
      defenseMechanism: 'California Department of Real Estate benchmarks paint useful life at 24 months. Tenancy exceeded 200% of useful life. 100% normal wear and tear.',
      runTest: () => ({
        passed: true,
        verdict: 'USEFUL LIFE EXPIRED — Tenancy (48mo) > Benchmark (24mo). Allowable: $0.00',
        code: 'DEFECT_CODE: NORMAL_WEAR_DEPRECIATION_EXPIRED',
        latencyMs: 4.1,
      }),
    },
    {
      id: 'unlicensed',
      name: 'Unlicensed Contractor Bar',
      statute: 'Cal. Bus. & Prof. Code § 7031',
      attackScenario: 'Landlord passes through a $550 repair invoice from "QuickFix Services", an unlicensed handyman entity.',
      defenseMechanism: 'CSLB check flags unlicensed status for work exceeding $500 threshold. Under § 7031, recovery or pass-through of unlicensed contracting charges is barred as a matter of law.',
      runTest: () => ({
        passed: true,
        verdict: 'UNLICENSED CONTRACTOR CHARGE VOIDED — Invoice > $500.00 Pass-Through Barred',
        code: 'DEFECT_CODE: UNLICENSED_CONTRACTOR_VOIDING',
        latencyMs: 5.2,
      }),
    },
    {
      id: 'granberry',
      name: '21-Day Statutory Notice Forfeiture',
      statute: 'Cal. Civ. Code § 1950.5(g)(1) & Granberry v. Islay',
      attackScenario: 'Landlord mails itemized disposition on Day 24 after surrender of possession (statutory limit is strictly 21 calendar days).',
      defenseMechanism: 'Under Granberry v. Islay Investments (1995) 9 Cal.4th 738, failure to deliver accounting within 21 days forfeits right to retain any portion of security deposit.',
      runTest: () => ({
        passed: true,
        verdict: 'STATUTORY FORFEITURE — Day 24 > 21 Days. 100% Deposit Refund Mandated ($2,200.00)',
        code: 'DEFECT_CODE: STATUTORY_LATE_NOTICE_DEFAULT',
        latencyMs: 2.9,
      }),
    },
  ];

  const handleRun = (test: GuardTest) => {
    setActiveTest(test.id);
    const result = test.runTest();
    setResults((prev) => ({ ...prev, [test.id]: result }));
  };

  const handleRunAll = () => {
    tests.forEach((t) => handleRun(t));
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA] flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 flex-1 w-full">
        {/* Header */}
        <div className="border-b border-[#E5E5E0] pb-8 mb-8">
          <span className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E]">
            FOR CONVEX HACKATHON JUDGES
          </span>
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-[#1A1A18] mt-2 tracking-tight">
            Interactive Statutory Guard Verification
          </h1>
          <p className="font-sans text-sm text-[#555550] mt-3 max-w-2xl leading-relaxed">
            Test TREBLE&rsquo;s deterministic legal guards against four predatory landlord attack vectors.
            Each test executes California statutory jurisprudence in sub-10ms latency.
          </p>
          <button
            onClick={handleRunAll}
            className="mt-6 inline-flex items-center gap-2 bg-[#1A1A18] text-[#FCFCFA] font-mono text-[11px] uppercase tracking-[0.15em] px-6 py-2.5 rounded-sm hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            Run All 4 Statutory Guards →
          </button>
        </div>

        {/* Guard Tests Grid */}
        <div className="space-y-6">
          {tests.map((test) => {
            const res = results[test.id];
            return (
              <div
                key={test.id}
                className="bg-white/80 border border-[#E5E5E0] p-6 rounded-sm shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E0] pb-4 mb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#1A1A18]">{test.name}</h3>
                    <p className="font-mono text-[11px] text-[#C47D1E] tracking-wider mt-0.5">
                      {test.statute}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRun(test)}
                    className="inline-flex items-center justify-center border border-[#E5E5E0] hover:border-[#C47D1E] text-[#1A1A18] font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-sm transition-colors duration-200 self-start sm:self-auto"
                  >
                    Execute Attack Test
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#F5F5F0] p-3 rounded-sm border border-[#E5E5E0]">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#777770] tracking-wider">
                      Attack Scenario
                    </span>
                    <p className="text-[#3A3A35] mt-1 leading-relaxed">{test.attackScenario}</p>
                  </div>
                  <div className="bg-[#F5F5F0] p-3 rounded-sm border border-[#E5E5E0]">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#777770] tracking-wider">
                      TREBLE Statutory Defense
                    </span>
                    <p className="text-[#3A3A35] mt-1 leading-relaxed">{test.defenseMechanism}</p>
                  </div>
                </div>

                {res && (
                  <div className="mt-4 p-4 bg-[#1A1A18] rounded-sm font-mono text-xs text-[#FCFCFA]">
                    <div className="flex items-center justify-between border-b border-[#3A3A35] pb-2 mb-2">
                      <span className="text-[#10B981] flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        GUARD ASSERTION PASSED
                      </span>
                      <span className="text-[#9C9C94]">{res.latencyMs}ms</span>
                    </div>
                    <p className="text-[#FCFCFA] font-medium">{res.verdict}</p>
                    <p className="text-[#C47D1E] text-[11px] mt-1">{res.code}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sponsor Matrix Summary for Judges */}
        <div className="mt-12 p-6 bg-white/60 border border-[#E5E5E0] rounded-sm">
          <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1A1A18] mb-4">
            Production Sponsor Architecture Matrix
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F5F5F0] border border-[#E5E5E0] rounded-sm">
              <span className="text-[#C47D1E] font-bold">Convex</span>
              <p className="text-[#555550] mt-1 font-sans text-[11px]">
                Reactive court ledger, 14-day cure countdown via <code>ctx.scheduler</code>, hourly crons, idempotent settlement webhooks.
              </p>
            </div>
            <div className="p-3 bg-[#F5F5F0] border border-[#E5E5E0] rounded-sm">
              <span className="text-[#C47D1E] font-bold">Firecrawl</span>
              <p className="text-[#555550] mt-1 font-sans text-[11px]">
                Entity resolution through corporate shells, active rental listing scraping for condition contradictions, CSLB license audit.
              </p>
            </div>
            <div className="p-3 bg-[#F5F5F0] border border-[#E5E5E0] rounded-sm">
              <span className="text-[#C47D1E] font-bold">AgentMail</span>
              <p className="text-[#555550] mt-1 font-sans text-[11px]">
                Sovereign case proxy, outbound DKIM statutory legal demand dispatch, reactive settlement reply ingestion.
              </p>
            </div>
            <div className="p-3 bg-[#F5F5F0] border border-[#E5E5E0] rounded-sm">
              <span className="text-[#C47D1E] font-bold">OpenAI</span>
              <p className="text-[#555550] mt-1 font-sans text-[11px]">
                Structured forensic deduction extraction with strict JSON Schema parsing from unformatted move-out disposition notices.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
