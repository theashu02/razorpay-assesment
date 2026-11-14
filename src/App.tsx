import { useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
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
  const { filteredLinks, counts, filter, setFilter, createPaymentLink, recordPayment } = usePaymentLinks();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  function handleCreate(data: PaymentFormData) { createPaymentLink(data); setFilter("All"); }
  function handleSuccess(desc: string) {
    setToast("Payment link created for " + desc);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }
  function handleCreateClick() {
    setShowForm((s) => !s);
    requestAnimationFrame(() => { formRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); });
  }
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#f4f4f4] text-black lg:flex lg:h-screen lg:overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm">Skip to content</a>
      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="min-w-0 max-w-full flex-1 overflow-x-clip lg:h-screen lg:overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button type="button" onClick={() => setSideOpen(true)} aria-label="Open menu" className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540] lg:hidden">\u2630</button>
            <nav aria-label="Breadcrumb" className="min-w-0 text-[13px] text-neutral-500"><span>Home</span><span aria-hidden="true"> / </span><span className="font-medium text-black">Payment Links</span></nav>
            <div className="ml-auto hidden sm:block" role="search"><input type="search" placeholder="Search links..." aria-label="Search payment links" className="w-52 rounded-lg border border-neutral-200 bg-[#f4f4f4] px-3 py-1.5 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] lg:w-64" /></div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 sm:ml-0"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>
          </div>
        </header>
        <main id="main-content" className="mx-auto min-w-0 max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><DashboardHeader onCreate={handleCreateClick} /></div>
          <SummaryCards total={counts.total} active={counts.active} partially={counts.partially} paid={counts.paid} expired={counts.expired} />
          <div ref={formRef} className="scroll-mt-20">{showForm && <PaymentLinkForm onCreate={handleCreate} onSuccess={handleSuccess} />}</div>
          <section aria-label="Payment links list" className="min-w-0 max-w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[15px] font-bold tracking-tight">All Payment Links ({filteredLinks.length})</h2>
              <StatusFilters active={filter} onChange={setFilter} />
            </div>
            <div className="mt-4">{filteredLinks.length === 0 ? (<EmptyState filter={filter} />) : (<PaymentLinksTable links={filteredLinks} onRecordPayment={(id, amt) => { recordPayment(id, amt); setToast('Payment of ' + amt + ' recorded'); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(null), 4000); }} />)}</div>
          </section>
          <footer className="pt-1 text-center text-xs text-neutral-500">Mock dashboard - data stored in memory only.</footer>
        </main>
      </div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : <div role="status" aria-live="polite" className="sr-only">Ready</div>}
    </div>
  );
}





