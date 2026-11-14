import { useMemo, useState } from 'react';
import type { PaymentFormData, PaymentLink, StatusFilter } from '../types/payment';
import { mockPaymentLinks } from '../data/mockPayments';
import { filterLinksByStatus, generateLinkId, buildPaymentUrl, getStatusCounts } from '../utils/paymentStatus';

export interface CreateResult {
  link: PaymentLink;
}

export function usePaymentLinks() {
  const [links, setLinks] = useState<PaymentLink[]>(mockPaymentLinks);
  const [filter, setFilter] = useState<StatusFilter>('All');

  const counts = useMemo(() => getStatusCounts(links), [links]);
  const filteredLinks = useMemo(() => filterLinksByStatus(links, filter), [links, filter]);

  function createPaymentLink(data: PaymentFormData): CreateResult {
    const id = generateLinkId();
    const link: PaymentLink = {
      id,
      amount: Number(Number(data.amount).toFixed(2)),
      description: data.description.trim(),
      customerEmail: data.customerEmail.trim() || undefined,
      customerPhone: data.customerPhone.trim() || undefined,
      status: 'Active',
      paymentUrl: buildPaymentUrl(id),
      createdAt: new Date().toISOString(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
    };
    setLinks((prev) => [link, ...prev]);
    return { link };
  }

  return { links, filteredLinks, counts, filter, setFilter, createPaymentLink };
}
