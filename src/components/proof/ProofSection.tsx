'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const terminalLines = [
  { text: '$ treble audit --fixture marcus-vance', color: 'text-[#9C9C94]', delay: 0 },
  { text: '', color: '', delay: 0.1 },
  { text: '\u2713 Paint (48mo vs 24mo life)     ... $380.00', color: 'text-[#10B981]', delay: 0.2 },
  { text: '\u2713 Cleaning (no receipt)         ... $275.00', color: 'text-[#10B981]', delay: 0.3 },
  { text: '\u2713 Carpet (normal wear)          ... $1,200.00', color: 'text-[#10B981]', delay: 0.4 },
  { text: '\u2713 Photo compliance (AB 2801)    ... FAIL', color: 'text-[#DC2626]', delay: 0.5 },
  { text: '', color: '', delay: 0.6 },
  { text: '  Total Unlawful:  $2,150.00', color: 'text-[#FCFCFA] font-bold', delay: 0.7 },
  { text: '  Treble Exposure: $6,450.00', color: 'text-[#FCFCFA] font-bold', delay: 0.8 },
  { text: '  Elapsed:         38.42ms', color: 'text-[#9C9C94]', delay: 0.9 },
  { text: '', color: '', delay: 1.0 },
];

export function TerminalReceipt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="bg-[#1A1A18] p-6 lg:p-8 font-mono text-sm leading-relaxed overflow-x-auto">
      {terminalLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: line.delay }}
          className={line.color}
        >
          {line.text || '\u00a0'}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="text-[#10B981] flex items-center gap-2 mt-1"
      >
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        ALL ASSERTIONS PASSED
      </motion.div>
    </div>
  );
}

const realItems = [
  'Statutory math',
  'Live Firecrawl',
  'Live AgentMail',
  'AB 2801 check',
  'CSLB lookup',
  'Rosenthal Act',
];

const scopedItems = [
  'Testnet only',
  'No paid LLM',
  'Convex local',
  'CA jurisdiction only',
];

export function HonestyTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className="bg-white/70 backdrop-blur-sm border border-[#E5E5E0] p-6 lg:p-8 rounded-sm"
    >
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1A1A18] mb-4">
            What&rsquo;s Real
          </h4>
          {realItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-sm font-sans text-[#1A1A18]">{item}</span>
            </motion.div>
          ))}
        </div>
        <div>
          <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1A1A18] mb-4">
            What&rsquo;s Scoped
          </h4>
          {scopedItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-3 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full border border-[#777770] shrink-0" />
              <span className="text-sm font-sans text-[#777770]">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProofSection() {
  return (
    <section id="proof" className="py-20 lg:py-28 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E] mb-3">
            THE SPINE
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-[#1A1A18]">
            Drey-standard proof. Sub-second.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TerminalReceipt />
          <HonestyTable />
        </div>
      </div>
    </section>
  );
}

export default ProofSection;
