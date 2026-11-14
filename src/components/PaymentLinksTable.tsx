import type { PaymentLink } from '../types/payment';
import { formatDateOnly, formatDateTime, formatINR, getEffectiveStatus } from '../utils/paymentStatus';
import StatusBadge from './StatusBadge';

function customerLabel(link: PaymentLink): string {
  const parts: string[] = [];
  if (link.customerEmail) parts.push(link.customerEmail);
  if (link.customerPhone) parts.push(link.customerPhone);
  return parts.join(' / ') || '—';
}

export default function PaymentLinksTable({ links }: { links: PaymentLink[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Payment Link ID</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Amount</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Description</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Customer</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Created At</th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-600">Expiry Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((link) => {
              const effective = getEffectiveStatus(link);
              return (
                <tr key={link.id} className="hover:bg-[#f4f4f4]/60">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-mono text-xs text-slate-900">{link.id}</div>
                    <a
                      href={link.paymentUrl}
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-blue-600 hover:underline"
                      title={link.paymentUrl}
                    >
                      {link.paymentUrl.replace('https://', '')}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{formatINR(link.amount)}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={link.description}>
                    {link.description}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={customerLabel(link)}>
                    {customerLabel(link)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={effective} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDateTime(link.createdAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {link.expiryDate ? formatDateOnly(link.expiryDate) : 'No expiry'}
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
