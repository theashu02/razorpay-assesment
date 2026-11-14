import { useRef, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import PaymentLinkForm from "./components/PaymentLinkForm";
import PaymentLinksTable from "./components/PaymentLinksTable";
import StatusFilters from "./components/StatusFilters";
import EmptyState from "./components/EmptyState";
import Toast from "./components/Toast";
import { usePaymentLinks } from "./hooks/usePaymentLinks";
import type { PaymentFormData } from "./types/payment";
export default function App() {
  const { filteredLinks, counts, filter, setFilter, createPaymentLink } = usePaymentLinks();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  function handleCreate(data: PaymentFormData) {
    createPaymentLink(data);
    setFilter("All");
  }
  function handleSuccess(desc: string) {
    const msg = "Payment link created for " + desc;
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }
  function handleCreateClick() {
    setShowForm((s) => !s);
    requestAnimationFrame(() => { formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); });
  }
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm">Skip to content</a>
      <header className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0a2540] text-sm font-bold text-white ring-1 ring-white/20">R</div>
          <div>
            <p className="text-sm font-bold leading-none tracking-tight">Razorpay</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/60">Merchant Dashboard</p>
          </div>
          <nav aria-label="Primary" className="ml-8 hidden gap-1 text-sm md:flex">
            <span className="rounded-md bg-white px-3 py-1.5 font-medium text-black">Payment Links</span>
            <span className="rounded-md px-3 py-1.5 text-white/70 hover:bg-white/10 hover:text-white">Payments</span>
            <span className="rounded-md px-3 py-1.5 text-white/70 hover:bg-white/10 hover:text-white">Customers</span>
          </nav>
        </div>
        <div className="h-1 bg-[#0a2540]" aria-hidden="true" />
      </header>
      <main id="main-content" className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <DashboardHeader onCreate={handleCreateClick} />
        </div>
        <SummaryCards total={counts.total} active={counts.active} paid={counts.paid} expired={counts.expired} />
        <div ref={formRef}>
          {showForm && <PaymentLinkForm onCreate={handleCreate} onSuccess={handleSuccess} />}
        </div>
        <section aria-label="Payment links list" className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[15px] font-bold tracking-tight">All Payment Links ({filteredLinks.length})</h2>
            <StatusFilters active={filter} onChange={setFilter} />
          </div>
          <div className="mt-4">
            {filteredLinks.length === 0 ? (<EmptyState filter={filter} />) : (<PaymentLinksTable links={filteredLinks} />)}
          </div>
        </section>
        <footer className="pt-2 text-center text-xs text-neutral-500">Mock dashboard - data is stored in memory only.</footer>
      </main>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
