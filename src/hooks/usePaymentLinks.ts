import { useEffect, useMemo, useState } from 'react';
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
