'use client';

import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 lg:px-12 bg-[#FCFCFA]/90 backdrop-blur-md border-b border-[#E5E5E0] transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_8px_rgba(0,0,0,0.04)]' : ''}`}
    >
      <a href="#" className="font-serif text-xl text-[#1A1A18] tracking-tight">
        TREBLE
      </a>
      <a
        href="/audit"
        className="inline-flex items-center gap-1.5 bg-[#1A1A18] text-[#FCFCFA] font-mono text-[11px] uppercase tracking-[0.15em] px-5 py-2 rounded-sm hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        Begin Audit <span aria-hidden="true">→</span>
      </a>
    </nav>
  );
}

export default Navbar;
