export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0">
      <div className="flex items-start gap-3 rounded-lg bg-black px-4 py-3 text-white shadow-2xl ring-1 ring-white/10">
        <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold">✓</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">✕</button>
      </div>
    </div>
  );
}
