export default function SummaryCards({ total, active, paid, expired }: { total: number; active: number; paid: number; expired: number }) {
  const cards = [
    { label: 'Total Links', value: total, sub: 'All payment links', accent: 'bg-black' },
    { label: 'Active', value: active, sub: 'Awaiting payment', accent: 'bg-[#0a2540]' },
    { label: 'Paid', value: paid, sub: 'Collected', accent: 'bg-emerald-600' },
    { label: 'Expired', value: expired, sub: 'Past expiry', accent: 'bg-neutral-400' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${c.accent}`} />
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">{c.label}</dt>
          </div>
          <dd className="mt-2 text-[28px] font-bold leading-none text-black">{c.value}</dd>
          <dd className="mt-1 text-xs text-neutral-500">{c.sub}</dd>
        </div>
      ))}
    </dl>
  );
}
