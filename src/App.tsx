import { useRef, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import PaymentLinkForm from './components/PaymentLinkForm';
import PaymentLinksTable from './components/PaymentLinksTable';
import StatusFilters from './components/StatusFilters';
import EmptyState from './components/EmptyState';
import { usePaymentLinks } from './hooks/usePaymentLinks';
import type { PaymentFormData } from './types/payment';
export default function App() {
  const { filteredLinks, counts, filter, setFilter, createPaymentLink } = usePaymentLinks();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  function handleCreate(data: PaymentFormData) {
    createPaymentLink(data);
    setFilter('All');
  }
  function handleSuccess(desc: string) {
    setToast(`Payment link created for "${desc}"`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }
  function handleCreateClick() {
    setShowForm((s) => !s);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">R</div>
          <div>
            <p className="text-sm font-semibold leading-none">Razorpay</p>
            <p className="text-xs text-slate-500">Merchant Dashboard</p>
          </div>
          <nav aria-label="Primary" className="ml-6 hidden gap-4 text-sm text-slate-600 md:flex">
            <span className="font-medium text-slate-900">Payment Links</span>
            <span>Payments</span>
            <span>Customers</span>
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <DashboardHeader onCreate={handleCreateClick} />
        <SummaryCards total={counts.total} active={counts.active} paid={counts.paid} expired={counts.expired} />
        {toast && (
          <div role="status" aria-live="polite" className="rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
            {toast}
          </div>
        )}
        <div ref={formRef}>
          {showForm && <PaymentLinkForm onCreate={handleCreate} onSuccess={handleSuccess} />}
        </div>
        <section aria-label="Payment links list" className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold">All Payment Links ({filteredLinks.length})</h2>
            <StatusFilters active={filter} onChange={setFilter} />
          </div>
          {filteredLinks.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <PaymentLinksTable links={filteredLinks} />
          )}
        </section>
        <footer className="pt-4 text-center text-xs text-slate-500">
          Mock dashboard for assessment - data is stored in memory only.
        </footer>
      </main>
    </div>
  );
}
