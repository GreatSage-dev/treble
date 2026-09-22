'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface Milestone {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  telemetry: string;
  side: 'left' | 'right';
}

const milestones: Milestone[] = [
  {
    number: '01',
    eyebrow: 'INTAKE',
    title: 'Drop Your Statement',
    description:
      'Upload your deposit statement, lease, or move-out notice. No account needed. No signup. Just the document.',
    telemetry: '< 2s processing',
    side: 'left',
  },
  {
    number: '02',
    eyebrow: 'FORENSIC AUDIT',
    title: 'Every Dollar Examined',
    description:
      'Statutory depreciation math applied to each line item. AB 2801 photo documentation requirement checked. Every deduction tested against California Civil Code \u00a7 1950.5.',
    telemetry: '100% deterministic',
    side: 'right',
  },
  {
    number: '03',
    eyebrow: 'ENTITY RESOLUTION',
    title: 'Who Actually Owns the Building',
    description:
      'Firecrawl traces the LLC to the human. Active rental listings expose contradictions between \u201cdamage\u201d claims and \u201cmove-in ready\u201d marketing.',
    telemetry: 'Live Firecrawl',
    side: 'left',
  },
  {
    number: '04',
    eyebrow: 'DEMAND DISPATCH',
    title: 'The 14-Day Clock Starts',
    description:
      'Formal demand letter compiled from statute, dispatched via AgentMail. Cure deadline auto-scheduled. Every communication cryptographically logged.',
    telemetry: 'Live AgentMail',
    side: 'right',
  },
  {
    number: '05',
    eyebrow: 'CREDIT SHIELD',
    title: 'Your Credit, Protected',
    description:
      'Dispute formally lodged under California Rosenthal Act. CCRAA \u00a7 1785.25(a) requires disclosure of dispute status. Derogatory reporting blocked at the source.',
    telemetry: 'Rosenthal Act',
    side: 'left',
  },
];

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.35, y: 12, scale: 0.98 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0.35, y: 12, scale: 0.98 }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white/70 backdrop-blur-sm p-6 lg:p-8 rounded-sm transition-colors duration-500 ${inView ? 'border border-[#C47D1E]' : 'border border-[#E5E5E0]'}`}
    >
      <span className="inline-block font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E]">
        {milestone.number} // {milestone.eyebrow}
      </span>
      <h3 className="font-serif text-[clamp(1.5rem,2.5vw,1.75rem)] leading-[1.25] tracking-[-0.015em] text-[#1A1A18] mt-3">
        {milestone.title}
      </h3>
      <p className="font-sans text-sm text-[#555550] leading-relaxed mt-3">
        {milestone.description}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#F5F5F0] border border-[#E5E5E0] rounded-sm font-mono text-[12px] text-[#1A1A18]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        {milestone.telemetry}
      </div>
    </motion.div>
  );
}

export function SpineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="max-w-[1080px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-24">
          <span className="inline-block font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E] mb-3">
            THE ENGINE
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-[#1A1A18]">
            Five stages. One receipt.
          </h2>
        </div>

        {/* Spine container */}
        <div ref={containerRef} className="relative">
          {/* Static dashed spine */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, #D1D1CB 0px, #D1D1CB 4px, transparent 4px, transparent 10px)',
            }}
            aria-hidden="true"
          />

          {/* Traveling amber dot */}
          <motion.div
            style={{ top: dotTop }}
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FCFCFA] border-2 border-[#C47D1E] shadow-[0_0_14px_rgba(196,125,30,0.45)] items-center justify-center z-20 pointer-events-none"
            aria-hidden="true"
          >
            <span className="w-2 h-2 rounded-full bg-[#C47D1E]" />
          </motion.div>

          {/* Milestones */}
          <div className="space-y-24 lg:space-y-32">
            {milestones.map((m, idx) => (
              <div
                key={m.number}
                className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] gap-4 md:gap-0 items-center"
              >
                {m.side === 'left' ? (
                  <>
                    <div className="md:pr-12">
                      <MilestoneCard milestone={m} />
                    </div>
                    <div className="hidden md:block" />
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="hidden md:block" />
                    <div className="md:pl-12">
                      <MilestoneCard milestone={m} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpineSection;
