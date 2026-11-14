import type { PaymentStatus } from '../types/payment';

const styles: Record<PaymentStatus, string> = {
  Active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Paid: 'bg-green-50 text-green-700 ring-green-600/20',
  Expired: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

const dot: Record<PaymentStatus, string> = {
  Active: 'bg-blue-600',
  Paid: 'bg-green-600',
  Expired: 'bg-gray-500',
};

export default function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}
