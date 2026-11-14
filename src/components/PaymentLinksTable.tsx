import { useState } from 'react';
import type { PaymentLink } from '../types/payment';
import { amountDue, formatDateOnly, formatDateTime, formatINR, getEffectiveStatus } from '../utils/paymentStatus';
import { validateRecordPayment } from '../utils/validation';
import StatusBadge from './StatusBadge';
function customerLabel(link: PaymentLink): string {
  const parts: string[] = [];
  if (link.customerEmail) parts.push(link.customerEmail);
  if (link.customerPhone) parts.push(link.customerPhone);
  return parts.join(' / ') || '\u2014';
}
export default function PaymentLinksTable({ links, onRecordPayment }: { links: PaymentLink[]; onRecordPayment: (id: string, amount: number) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [payValue, setPayValue] = useState('');
  const [payError, setPayError] = useState<string | null>(null);
  function startRecord(link: PaymentLink) {
    setOpenId(link.id);
    const min = link.allowPartial && link.minFirstPayment && link.amountPaid === 0 ? link.minFirstPayment : undefined;
    setPayValue(min !== undefined ? String(min) : '');
    setPayError(null);
  }
  function submitRecord(link: PaymentLink) {
    const err = validateRecordPayment(payValue, amountDue(link));
    if (err) { setPayError(err); return; }
    onRecordPayment(link.id, Number(payValue));
    setOpenId(null); setPayValue(''); setPayError(null);
  }
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Payment Link ID</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Amount</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Paid / Due</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Description</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Customer</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Created At</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Expiry Date</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((link) => {
              const effective = getEffectiveStatus(link);
              const due = amountDue(link);
              const canRecord = effective === 'Active' || effective === 'Partially paid';
              const isOpen = openId === link.id;
              return (
                <tr key={link.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-mono text-xs text-slate-900">{link.id}</div>
                    <a href={link.paymentUrl} onClick={(e) => e.preventDefault()} className="text-xs text-blue-600 hover:underline" title={link.paymentUrl}>{link.paymentUrl.replace('https://', '')}</a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{formatINR(link.amount)}{link.allowPartial && <span className="ml-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-200">Partial</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700"><span className="font-medium text-emerald-700">{formatINR(link.amountPaid)}</span><span className="text-slate-400"> / </span><span>{formatINR(due)} due</span></td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={link.description}>{link.description}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={customerLabel(link)}>{customerLabel(link)}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={effective} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDateTime(link.createdAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{link.expiryDate ? formatDateOnly(link.expiryDate) : 'No expiry'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {canRecord ? (
                      isOpen ? (
                        <div className="flex items-center gap-1">
                          <label htmlFor={'pay-' + link.id} className="sr-only">Payment amount for {link.id}</label>
                          <input id={'pay-' + link.id} type="text" inputMode="decimal" value={payValue} onChange={(e) => setPayValue(e.target.value)} placeholder="0.00" className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-[#0a2540] focus:outline-none focus:ring-1 focus:ring-[#0a2540]" />
                          <button type="button" onClick={() => submitRecord(link)} className="rounded-md bg-[#0a2540] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#133a6b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540]">Save</button>
                          <button type="button" onClick={() => setOpenId(null)} aria-label="Cancel recording payment" className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">Ã¢Å“â€¢</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => startRecord(link)} className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-black hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540]">Record payment</button>
                      )
                    ) : (<span className="text-xs text-slate-400">\u2014</span>)}
                    {isOpen && payError && (<p role="alert" className="mt-1 text-xs text-red-600">{payError}</p>)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
