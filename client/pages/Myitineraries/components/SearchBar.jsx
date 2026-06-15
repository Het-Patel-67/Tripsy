export default function SearchBar({ search, onSearch, total, filteredCount }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Search input */}
      <div className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#E7DDD0] bg-[#FFFCF9] px-4 shadow-sm transition-all focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(217,119,6,0.1)] sm:w-72">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(240,187,64,1)"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>
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