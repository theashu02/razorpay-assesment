import type { PaymentFormData, PaymentLink, PaymentStatus, StatusFilter } from '../types/payment';

/** Tolerance (in rupees) for treating a link as fully paid. */
const PAID_EPSILON = 0.009;

export function amountDue(link: PaymentLink): number {
  return Math.max(0, Number((link.amount - link.amountPaid).toFixed(2)));
}

export function getEffectiveStatus(link: PaymentLink, now: number = Date.now()): PaymentStatus {
  if (link.status === 'Paid' || link.amountPaid >= link.amount - PAID_EPSILON) return 'Paid';
  if (link.expiryDate) {
    const expiry = new Date(link.expiryDate).getTime();
    if (!Number.isNaN(expiry) && expiry <= now) return 'Expired';
  }
  if (link.amountPaid > 0) return 'Partially paid';
  return 'Active';
}

export interface StatusCounts {
  total: number;
  active: number;
  partially: number;
  paid: number;
  expired: number;
}

export function getStatusCounts(links: PaymentLink[], now: number = Date.now()): StatusCounts {
  let active = 0;
  let partially = 0;
  let paid = 0;
  let expired = 0;
  for (const link of links) {
    const s = getEffectiveStatus(link, now);
    if (s === 'Active') active += 1;
    else if (s === 'Partially paid') partially += 1;
    else if (s === 'Paid') paid += 1;
    else expired += 1;
  }
  return { total: links.length, active, partially, paid, expired };
}

export function filterLinksByStatus(
  links: PaymentLink[],
  filter: StatusFilter,
  now: number = Date.now(),
): PaymentLink[] {
  if (filter === 'All') return links;
  return links.filter((l) => getEffectiveStatus(l, now) === filter);
}

export function generateLinkId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return 'plink_' + time + rand;
}

export function buildPaymentUrl(id: string): string {
  return 'https://rzp.io/l/' + id.replace(/^plink_/, '').toLowerCase();
}

/** Builds a new PaymentLink entity from validated form data. */
export function buildPaymentLink(data: PaymentFormData): PaymentLink {
  const amount = Number(Number(data.amount).toFixed(2));
  const id = generateLinkId();
  return {
    id,
    amount,
    description: data.description.trim(),
    customerEmail: data.customerEmail.trim() || undefined,
    customerPhone: data.customerPhone.trim() || undefined,
    status: 'Active',
    paymentUrl: buildPaymentUrl(id),
    createdAt: new Date().toISOString(),
    expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
    allowPartial: data.allowPartial,
    minFirstPayment: data.allowPartial ? Number(Number(data.minFirstPayment).toFixed(2)) : undefined,
    amountPaid: 0,
  };
}

/** Returns a copy of the link with a payment applied, clamped to the amount due. */
export function applyPayment(link: PaymentLink, amount: number): PaymentLink {
  const pay = Math.min(Math.max(0, Number(amount.toFixed(2))), amountDue(link));
  if (pay <= 0) return link;
  const amountPaid = Number((link.amountPaid + pay).toFixed(2));
  const status = amountPaid >= link.amount - PAID_EPSILON ? ('Paid' as const) : link.status;
  return { ...link, amountPaid, status };
}
