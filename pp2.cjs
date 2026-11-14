const fs = require("fs");
// MOCK
fs.writeFileSync("src/data/mockPayments.ts", `import type { PaymentLink } from '../types/payment';
function iso(daysOffset: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
export const mockPaymentLinks: PaymentLink[] = [
  { id: 'plink_MOCK01', amount: 2500, description: 'Website design advance', customerEmail: 'priya.sharma@example.com', customerPhone: '+919876543210', status: 'Paid', paymentUrl: 'https://rzp.io/l/mock01', createdAt: iso(-9), expiryDate: iso(-2), allowPartial: false, amountPaid: 2500 },
  { id: 'plink_MOCK02', amount: 12999.5, description: 'Annual SaaS subscription', customerEmail: 'rahul.verma@example.com', status: 'Active', paymentUrl: 'https://rzp.io/l/mock02', createdAt: iso(-4), expiryDate: iso(6), allowPartial: true, minFirstPayment: 2000, amountPaid: 4000 },
  { id: 'plink_MOCK03', amount: 499, description: 'T-shirt order #4821', customerPhone: '+919112223334', status: 'Active', paymentUrl: 'https://rzp.io/l/mock03', createdAt: iso(-6), expiryDate: iso(-1), allowPartial: false, amountPaid: 0 },
  { id: 'plink_MOCK04', amount: 75000, description: 'Consulting invoice Jan', customerEmail: 'accounts@acmecorp.in', status: 'Active', paymentUrl: 'https://rzp.io/l/mock04', createdAt: iso(-2), expiryDate: null, allowPartial: true, minFirstPayment: 5000, amountPaid: 0 },
  { id: 'plink_MOCK05', amount: 1599.99, description: 'Online course fee', customerEmail: 'sneha.k@example.com', customerPhone: '9812345678', status: 'Paid', paymentUrl: 'https://rzp.io/l/mock05', createdAt: iso(-12), expiryDate: iso(10), allowPartial: false, amountPaid: 1599.99 },
  { id: 'plink_MOCK06', amount: 3200, description: 'Freelance logo design', customerEmail: 'kabir@example.com', status: 'Active', paymentUrl: 'https://rzp.io/l/mock06', createdAt: iso(-15), expiryDate: iso(-10), allowPartial: false, amountPaid: 0 },
];
`);
// HOOK with localStorage
fs.writeFileSync("src/hooks/usePaymentLinks.ts", `import { useEffect, useMemo, useState } from 'react';
import type { PaymentFormData, PaymentLink, StatusFilter } from '../types/payment';
import { mockPaymentLinks } from '../data/mockPayments';
import { filterLinksByStatus, generateLinkId, buildPaymentUrl, getStatusCounts, amountDue } from '../utils/paymentStatus';
const KEY = 'rzp-payment-links-v1';
function load(): PaymentLink[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return mockPaymentLinks;
    const parsed = JSON.parse(raw) as PaymentLink[];
    if (!Array.isArray(parsed)) return mockPaymentLinks;
    return parsed.map((l) => ({ allowPartial: false, amountPaid: l.status === 'Paid' ? l.amount : (l.amountPaid ?? 0), ...l }));
  } catch { return mockPaymentLinks; }
}
export function usePaymentLinks() {
  const [links, setLinks] = useState<PaymentLink[]>(() => (typeof window === 'undefined' ? mockPaymentLinks : load()));
  const [filter, setFilter] = useState<StatusFilter>('All');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(links)); } catch {} }, [links]);
  const counts = useMemo(() => getStatusCounts(links), [links]);
  const filteredLinks = useMemo(() => filterLinksByStatus(links, filter), [links, filter]);
  function createPaymentLink(data: PaymentFormData) {
    const amount = Number(Number(data.amount).toFixed(2));
    const id = generateLinkId();
    const link: PaymentLink = {
      id, amount, description: data.description.trim(),
      customerEmail: data.customerEmail.trim() || undefined,
      customerPhone: data.customerPhone.trim() || undefined,
      status: 'Active', paymentUrl: buildPaymentUrl(id), createdAt: new Date().toISOString(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
      allowPartial: data.allowPartial,
      minFirstPayment: data.allowPartial ? Number(Number(data.minFirstPayment).toFixed(2)) : undefined,
      amountPaid: 0,
    };
    setLinks((prev) => [link, ...prev]);
    return { link };
  }
  function recordPayment(id: string, amount: number) {
    setLinks((prev) => prev.map((l) => {
      if (l.id !== id) return l;
      const due = amountDue(l);
      const pay = Math.min(Math.max(0, Number(amount.toFixed(2))), due);
      if (pay <= 0) return l;
      const amountPaid = Number((l.amountPaid + pay).toFixed(2));
      const status = amountPaid >= l.amount - 0.009 ? 'Paid' as const : l.status;
      return { ...l, amountPaid, status };
    }));
  }
  return { links, filteredLinks, counts, filter, setFilter, createPaymentLink, recordPayment };
}
`);
// BADGE
fs.writeFileSync("src/components/StatusBadge.tsx", `import type { PaymentStatus } from '../types/payment';
const styles: Record<PaymentStatus, string> = {
  Active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Partially paid': 'bg-amber-50 text-amber-800 ring-amber-600/20',
  Paid: 'bg-green-50 text-green-700 ring-green-600/20',
  Expired: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};
const dot: Record<PaymentStatus, string> = {
  Active: 'bg-blue-600', 'Partially paid': 'bg-amber-500', Paid: 'bg-green-600', Expired: 'bg-gray-500',
};
export default function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ' + styles[status]}>
      <span aria-hidden="true" className={'h-1.5 w-1.5 rounded-full ' + dot[status]} />
      {status}
    </span>
  );
}
`);
// FILTERS
fs.writeFileSync("src/components/StatusFilters.tsx", `import type { StatusFilter } from '../types/payment';
const TABS: StatusFilter[] = ['All', 'Active', 'Partially paid', 'Paid', 'Expired'];
export default function StatusFilters({ active, onChange }: { active: StatusFilter; onChange: (f: StatusFilter) => void }) {
  return (
    <div role="tablist" aria-label="Filter payment links by status" className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const selected = t === active;
        return (
          <button key={t} role="tab" aria-selected={selected} onClick={() => onChange(t)}
            className={'rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset focus:outline-none focus-visible:ring-2 focus-visible:ring-black ' + (selected ? 'bg-black text-white ring-black' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 hover:text-slate-900')}>
            {t}
          </button>
        );
      })}
    </div>
  );
}
`);
// SUMMARY
fs.writeFileSync("src/components/SummaryCards.tsx", `export default function SummaryCards({ total, active, partially, paid, expired }: { total: number; active: number; partially: number; paid: number; expired: number }) {
  const cards = [
    { label: 'Total Links', value: total, sub: 'All payment links', accent: 'bg-black' },
    { label: 'Active', value: active, sub: 'Nothing paid', accent: 'bg-[#0a2540]' },
    { label: 'Partially paid', value: partially, sub: 'In progress', accent: 'bg-amber-500' },
    { label: 'Paid', value: paid, sub: 'Collected', accent: 'bg-emerald-600' },
    { label: 'Expired', value: expired, sub: 'Past expiry', accent: 'bg-neutral-400' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className={'h-2 w-2 rounded-full ' + c.accent} />
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">{c.label}</dt>
          </div>
          <dd className="mt-2 text-[28px] font-bold leading-none text-black">{c.value}</dd>
          <dd className="mt-1 text-xs text-neutral-500">{c.sub}</dd>
        </div>
      ))}
    </dl>
  );
}
`);
console.log("part2 done");
