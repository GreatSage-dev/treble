'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function GrievanceStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const lines = [
    '$36 billion in security deposits are wrongfully withheld across the United States every year.',
    '84% of tenants never challenge the deduction.',
    'Not because they\u2019re wrong \u2014 because the process is designed to exhaust them.',
  ];

  return (
    <section className="bg-[#1A1A18] py-16 lg:py-24 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-xl lg:text-2xl italic text-[#FCFCFA]/90 leading-relaxed mb-4"
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-lg text-[#C47D1E] mt-8 not-italic"
        >
          TREBLE makes exhaustion irrelevant.
        </motion.p>
      </div>
    </section>
  );
}

export default GrievanceStrip;
