export function EmptyState() {
  return (
    <div className="fade-up col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: "rgba(217,119,6,0.08)",
          border: "1.5px dashed rgba(217,119,6,0.3)",
        }}
      >
        <span className="text-3xl">🗺️</span>
      </div>
      <h3 className="font-playfair mb-2 text-xl font-bold text-[#1C1917]">
        No itineraries yet
      </h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-stone-400">
        You haven't saved any trips yet. Plan your first adventure and save it to see it here.
      </p>
      <a
        href="/Plan-trip"
        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-amber-600 to-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(217,119,6,0.35)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(217,119,6,0.45)]"
      >
        ✦ Plan a Trip
      </a>
    </div>
  );
}

export function NoResults({ search, onClear }) {
  return (
    <div className="fade-up col-span-full py-16 text-center">
      <p className="mb-4 text-4xl">🔍</p>
      <h3 className="font-playfair mb-2 text-lg font-bold text-[#1C1917]">
        No results found
      </h3>
      <p className="text-sm text-stone-400">
        No itineraries match "
        <span className="text-amber-600">{search}</span>".{" "}
        <button
          onClick={onClear}
          className="cursor-pointer text-amber-600 underline"
        >
          Clear search
        </button>
      </p>
    </div>
  );
}