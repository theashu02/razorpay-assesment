import type { PaymentLink, PaymentStatus, StatusFilter } from '../types/payment';

export function getEffectiveStatus(link: PaymentLink, now: number = Date.now()): PaymentStatus {
  if (link.status === 'Paid') return 'Paid';
  if (link.expiryDate) {
    const expiry = new Date(link.expiryDate).getTime();
    if (!Number.isNaN(expiry) && expiry <= now) return 'Expired';
  }
  return 'Active';
}

export interface StatusCounts {
  total: number;
  active: number;
  paid: number;
  expired: number;
}

export function getStatusCounts(links: PaymentLink[], now: number = Date.now()): StatusCounts {
  let active = 0;
  let paid = 0;
  let expired = 0;
  for (const link of links) {
    const s = getEffectiveStatus(link, now);
    if (s === 'Active') active += 1;
    else if (s === 'Paid') paid += 1;
    else expired += 1;
  }
  return { total: links.length, active, paid, expired };
}

export function filterLinksByStatus(
  links: PaymentLink[],
  filter: StatusFilter,
  now: number = Date.now(),
): PaymentLink[] {
  if (filter === 'All') return links;
  return links.filter((l) => getEffectiveStatus(l, now) === filter);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatDateOnly(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function generateLinkId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `plink_${time}${rand}`;
}

export function buildPaymentUrl(id: string): string {
  return `https://rzp.io/l/${id.replace(/^plink_/, '').toLowerCase()}`;
}
