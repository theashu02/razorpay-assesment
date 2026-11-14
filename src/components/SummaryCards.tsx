export default function SummaryCards({
  total,
  active,
  paid,
  expired,
}: {
  total: number;
  active: number;
  paid: number;
  expired: number;
}) {
  const cards = [
    { label: 'Total Links', value: total, sub: 'All payment links' },
    { label: 'Active', value: active, sub: 'Awaiting payment' },
    { label: 'Paid', value: paid, sub: 'Successfully collected' },
    { label: 'Expired', value: expired, sub: 'Past expiry date' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-sm font-medium text-slate-600">{c.label}</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</dd>
          <dd className="mt-0.5 text-xs text-slate-500">{c.sub}</dd>
        </div>
      ))}
    </dl>
  );
}
