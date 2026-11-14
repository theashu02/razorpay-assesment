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
    expect(getStatusCounts(links, now)).toEqual({ total: 3, active: 1, paid: 1, expired: 1 });
    expect(filterLinksByStatus(links, 'Active', now).map((l) => l.id)).toEqual(['1']);
    expect(filterLinksByStatus(links, 'Paid', now).map((l) => l.id)).toEqual(['2']);
    expect(filterLinksByStatus(links, 'Expired', now).map((l) => l.id)).toEqual(['3']);
    expect(filterLinksByStatus(links, 'All', now)).toHaveLength(3);
  });
});
