const terminalLines = [
  { text: '$ treble audit --fixture marcus-vance', color: 'text-[#9C9C94]' },
  { text: '', color: '' },
  { text: '\u2713 Paint (48mo vs 24mo life)     ... $380.00', color: 'text-[#10B981]' },
  { text: '\u2713 Cleaning (no receipt)         ... $275.00', color: 'text-[#10B981]' },
  { text: '\u2713 Carpet (normal wear)          ... $1,200.00', color: 'text-[#10B981]' },
  { text: '\u2713 Photo compliance (AB 2801)    ... FAIL', color: 'text-[#DC2626]' },
  { text: '', color: '' },
  { text: '  Total Unlawful:  $2,150.00', color: 'text-[#FCFCFA] font-bold' },
  { text: '  Treble Exposure: $6,450.00', color: 'text-[#FCFCFA] font-bold' },
  { text: '  Elapsed:         38.42ms', color: 'text-[#9C9C94]' },
  { text: '', color: '' },
];

export function TerminalReceipt() {
  return (
    <div className="bg-[#1A1A18] p-6 lg:p-8 font-mono text-sm leading-relaxed overflow-x-auto rounded-sm shadow-md">
      {terminalLines.map((line, i) => (
        <div key={i} className={line.color}>
          {line.text || '\u00a0'}
        </div>
      ))}
      <div className="text-[#10B981] flex items-center gap-2 mt-1 font-bold">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        ALL ASSERTIONS PASSED
      </div>
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
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#E5E5E0] p-6 lg:p-8 rounded-sm shadow-sm">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1A1A18] mb-4">
            What&rsquo;s Real
          </h4>
          {realItems.map((item) => (
            <div key={item} className="flex items-center gap-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-sm font-sans text-[#1A1A18] font-medium">{item}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1A1A18] mb-4">
            What&rsquo;s Scoped
          </h4>
          {scopedItems.map((item) => (
            <div key={item} className="flex items-center gap-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full border border-[#777770] shrink-0" />
              <span className="text-sm font-sans text-[#777770]">{item}</span>
            </div>
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
