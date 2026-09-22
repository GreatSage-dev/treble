export function GrievanceStrip() {
  const lines = [
    '$36 billion in security deposits are wrongfully withheld across the United States every year.',
    '84% of tenants never challenge the deduction.',
    'Not because they\u2019re wrong \u2014 because the process is designed to exhaust them.',
  ];

  return (
    <section className="bg-[#1A1A18] py-16 lg:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {lines.map((line, i) => (
          <p
            key={i}
            className="font-serif text-xl lg:text-2xl italic text-[#FCFCFA]/90 leading-relaxed mb-4"
          >
            {line}
          </p>
        ))}
        <p className="font-serif text-lg text-[#C47D1E] mt-8 not-italic font-medium">
          TREBLE makes exhaustion irrelevant.
        </p>
      </div>
    </section>
  );
}

export default GrievanceStrip;
