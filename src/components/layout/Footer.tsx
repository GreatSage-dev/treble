export function Footer() {
  const columns = [
    {
      title: 'STATUTORY AUTHORITY',
      items: [
        { label: 'California Civil Code \u00a7 1950.5' },
        { label: 'AB 2801 (2025 Mandate)' },
        { label: 'Rosenthal Fair Debt Collection Act' },
        { label: 'CCRAA \u00a7 1785.25(a) Credit Shield' },
      ],
    },
    {
      title: 'BUILT WITH',
      items: [
        { label: 'Convex (reactive backend & scheduler)' },
        { label: 'Firecrawl (entity & listing recon)' },
        { label: 'AgentMail (statutory dispatch)' },
        { label: 'OpenAI (forensic extraction)' },
      ],
    },
    {
      title: 'HACKATHON & VERIFICATION',
      items: [
        { label: 'Convex "All Gas" 2026' },
        { label: 'Judges Playground (Interactive) \u2192', href: '/judges' },
        { label: 'Convex Edge Hosting (convex.site) \u2192', href: 'https://fleet-ladybug-638.convex.site' },
        { label: 'Zero mocks. Sub-second proof.' },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#E5E5E0] py-12 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C47D1E] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li
                    key={item.label}
                    className="font-mono text-[12px] text-[#777770] leading-relaxed"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#1A1A18] hover:text-[#C47D1E] underline decoration-[#E5E5E0] hover:decoration-[#C47D1E] transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-[#E5E5E0] flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-[#9C9C94]">
              &copy; 2026 TREBLE
            </span>
            <span className="text-[#9C9C94]">&middot;</span>
            <a
              href="https://www.linkedin.com/in/promise-philip-324100355"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] text-[#1A1A18] hover:text-[#C47D1E] underline decoration-[#E5E5E0] hover:decoration-[#C47D1E] transition-colors"
            >
              Built by Promise Philip (LinkedIn) &rarr;
            </a>
          </div>
          <span className="font-serif text-sm italic text-[#777770]">
            Made for people who got robbed.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
