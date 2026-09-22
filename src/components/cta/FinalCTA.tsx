export function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="max-w-[720px] mx-auto text-center">
        <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-[#1A1A18]">
          Your deposit is not a negotiation.
        </h2>
        <p className="font-serif text-xl text-[#3A3A35] mt-2">
          It&rsquo;s math, statute, and a deadline.
        </p>
        <div className="mt-8">
          <a
            href="/audit"
            className="inline-flex items-center gap-1.5 bg-[#1A1A18] text-[#FCFCFA] font-mono text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-sm hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            Begin Your Audit <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
