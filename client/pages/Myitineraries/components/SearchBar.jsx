export default function SearchBar({ search, onSearch, total, filteredCount }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Search input */}
      <div className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-[#FFFCF9] px-4 shadow-sm transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)] sm:w-72">
        <span className="text-base text-stone-300">🔍</span>
        <input
          type="text"
          placeholder="Search by city or state…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#1C1917] outline-none placeholder:text-stone-300"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="cursor-pointer text-base text-stone-300 hover:text-stone-500"
          >
            ✕
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-sm text-stone-400">
        {filteredCount === total
          ? `${total} saved trip${total !== 1 ? "s" : ""}`
          : `${filteredCount} of ${total} trips`}
      </p>
    </div>
  );
}