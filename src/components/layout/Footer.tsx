export function Footer() {
  const columns = [
    {
      title: 'STATUTORY AUTHORITY',
      items: [
        'California Civil Code \u00a7 1950.5',
        'AB 2801 (2025)',
        'Rosenthal Fair Debt Collection Act',
        'CCRAA \u00a7 1785.25(a)',
      ],
    },
    {
      title: 'BUILT WITH',
      items: [
        'Convex (reactive backend)',
        'OpenAI (structured extraction)',
        'Firecrawl (entity resolution)',
        'AgentMail (dispatch)',
      ],
    },
    {
      title: 'HACKATHON',
      items: [
        'Convex "All Gas" 2026',
        'Built in 48 hours',
        'Zero mocks. All live.',
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
                    key={item}
                    className="font-mono text-[12px] text-[#777770] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-[#E5E5E0] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-mono text-[12px] text-[#9C9C94]">
            &copy; 2026 TREBLE
          </span>
          <span className="font-serif text-sm italic text-[#777770]">
            Made for people who got robbed.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
