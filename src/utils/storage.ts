import type { PaymentLink } from '../types/payment';
import { mockPaymentLinks } from '../data/mockPayments';

export const STORAGE_KEY = 'rzp-payment-links-v1';

function sanitizeLink(raw: unknown): PaymentLink {
  const r = raw as Record<string, unknown>;
  const amount = typeof r.amount === 'number' ? r.amount : 0;
  const status = r.status === 'Paid' ? ('Paid' as const) : ('Active' as const);
  return {
    id: String(r.id ?? ''),
    amount,
    description: String(r.description ?? ''),
    customerEmail: typeof r.customerEmail === 'string' ? r.customerEmail : undefined,
    customerPhone: typeof r.customerPhone === 'string' ? r.customerPhone : undefined,
    status,
    paymentUrl: String(r.paymentUrl ?? ''),
    createdAt: String(r.createdAt ?? new Date().toISOString()),
    expiryDate: typeof r.expiryDate === 'string' ? r.expiryDate : null,
    allowPartial: r.allowPartial === true,
    minFirstPayment: typeof r.minFirstPayment === 'number' ? r.minFirstPayment : undefined,
    amountPaid:
      typeof r.amountPaid === 'number' ? r.amountPaid : status === 'Paid' ? amount : 0,
  };
}

export function loadPaymentLinks(): PaymentLink[] {
  if (typeof window === 'undefined') return mockPaymentLinks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockPaymentLinks;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return mockPaymentLinks;
    return parsed.map(sanitizeLink);
  } catch {
    return mockPaymentLinks;
  }
}

export function savePaymentLinks(links: PaymentLink[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    /* storage unavailable in this browser */
  }
}
