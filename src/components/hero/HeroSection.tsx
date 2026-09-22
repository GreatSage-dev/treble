'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
      <div className="max-w-[720px] text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E] mb-6"
        >
          01 // Statutory Deposit Defense Engine
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.025em] text-[#1A1A18] text-balance"
        >
          Your landlord kept $2,150.{' '}
          <br className="hidden sm:block" />
          California law says{' '}
          <br className="hidden sm:block" />
          that&rsquo;s worth $6,450.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 font-sans text-base text-[#555550] leading-relaxed max-w-xl mx-auto"
        >
          An autonomous legal engine that reads your deposit statement, finds
          every unlawful deduction, and dispatches a formal statutory demand
          &mdash; in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/audit"
            className="inline-flex items-center gap-1.5 bg-[#1A1A18] text-[#FCFCFA] font-mono text-[11px] uppercase tracking-[0.15em] px-6 py-3 rounded-sm hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            Begin Your Audit <span aria-hidden="true">→</span>
          </a>
          <a
            href="#proof"
            className="inline-flex items-center gap-1.5 border border-[#E5E5E0] text-[#1A1A18] font-mono text-[11px] uppercase tracking-[0.15em] px-6 py-3 rounded-sm hover:border-[#C47D1E] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            See the proof <span aria-hidden="true">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
