import { describe, expect, it } from 'vitest';
import { filterLinksByStatus, getEffectiveStatus, getStatusCounts } from './paymentStatus';
import type { PaymentLink } from '../types/payment';
const base: PaymentLink = {
  id: 'plink_TEST',
  amount: 100,
  description: 'Test',
  status: 'Active',
  paymentUrl: 'https://rzp.io/l/test',
  createdAt: new Date().toISOString(),
  expiryDate: null,
  allowPartial: false,
  amountPaid: 0,
};
describe('payment status calculation', () => {
  it('keeps active when no expiry or future expiry', () => {
    expect(getEffectiveStatus(base)).toBe('Active');
    const future = { ...base, expiryDate: new Date(Date.now() + 86400000).toISOString() };
    expect(getEffectiveStatus(future)).toBe('Active');
  });
  it('marks expired when expiry passed', () => {
    const past = { ...base, expiryDate: new Date(Date.now() - 1000).toISOString() };
    expect(getEffectiveStatus(past)).toBe('Expired');
  });
  it('paid takes precedence over expiry', () => {
    const paidPast: PaymentLink = {
      ...base,
      status: 'Paid',
      expiryDate: new Date(Date.now() - 86400000).toISOString(),
    };
    expect(getEffectiveStatus(paidPast)).toBe('Paid');
  });
  it('counts and filters correctly', () => {
    const now = Date.now();
    const links: PaymentLink[] = [
      { ...base, id: '1', status: 'Active', expiryDate: null },
      { ...base, id: '2', status: 'Paid', expiryDate: new Date(now - 1000).toISOString() },
      { ...base, id: '3', status: 'Active', expiryDate: new Date(now - 1000).toISOString() },
    ];
    expect(getStatusCounts(links, now)).toEqual({ total: 3, active: 1, partially: 0, paid: 1, expired: 1 });
    expect(filterLinksByStatus(links, 'Active', now).map((l) => l.id)).toEqual(['1']);
    expect(filterLinksByStatus(links, 'Paid', now).map((l) => l.id)).toEqual(['2']);
    expect(filterLinksByStatus(links, 'Expired', now).map((l) => l.id)).toEqual(['3']);
    expect(filterLinksByStatus(links, 'All', now)).toHaveLength(3);
  });
});

describe('partial payments', () => {
  it('marks partially paid and full paid', async () => {
    const m = await import('./paymentStatus');
    const base2: PaymentLink = { id: 'p1', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: null, allowPartial: true, minFirstPayment: 100, amountPaid: 0 };
    expect(m.getEffectiveStatus(base2)).toBe('Active');
    expect(m.getEffectiveStatus({ ...base2, amountPaid: 400 })).toBe('Partially paid');
    expect(m.getEffectiveStatus({ ...base2, amountPaid: 1000 })).toBe('Paid');
    expect(m.amountDue({ ...base2, amountPaid: 400 })).toBe(600);
  });
  it('expired wins over partial, paid never expires', async () => {
    const m = await import('./paymentStatus');
    const past = new Date(Date.now() - 1000).toISOString();
    const part: PaymentLink = { id: 'p2', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: past, allowPartial: true, amountPaid: 200 };
    expect(m.getEffectiveStatus(part)).toBe('Expired');
    const paidPast: PaymentLink = { ...part, amountPaid: 1000 };
    expect(m.getEffectiveStatus(paidPast)).toBe('Paid');
  });
});

