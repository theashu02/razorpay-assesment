import { useEffect, useMemo, useState } from 'react';
import type { PaymentFormData, StatusFilter } from '../types/payment';
import {
  applyPayment,
  buildPaymentLink,
  filterLinksByStatus,
  getStatusCounts,
} from '../utils/paymentStatus';
import { loadPaymentLinks, savePaymentLinks } from '../utils/storage';

export function usePaymentLinks() {
  const [links, setLinks] = useState(loadPaymentLinks);
  const [filter, setFilter] = useState<StatusFilter>('All');

  useEffect(() => {
    savePaymentLinks(links);
  }, [links]);

  const counts = useMemo(() => getStatusCounts(links), [links]);
  const filteredLinks = useMemo(() => filterLinksByStatus(links, filter), [links, filter]);

  function createPaymentLink(data: PaymentFormData) {
    const link = buildPaymentLink(data);
    setLinks((prev) => [link, ...prev]);
    return { link };
  }

  function recordPayment(id: string, amount: number) {
    setLinks((prev) => prev.map((l) => (l.id === id ? applyPayment(l, amount) : l)));
  }

  return { links, filteredLinks, counts, filter, setFilter, createPaymentLink, recordPayment };
}
