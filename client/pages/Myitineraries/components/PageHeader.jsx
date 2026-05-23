export default function PageHeader({ totalTrips, totalDays, totalPlacesAll, loading }) {
  return (
    <div
      className="relative overflow-hidden px-8 pt-20 pb-10"
      style={{ background: "linear-gradient(135deg, #1C1917 0%, #292524 60%, #1C3557 100%)" }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(217,119,6,0.15) 0%, transparent 50%), radial-gradient(ellipse at 85% 20%, rgba(14,165,233,0.1) 0%, transparent 40%)",
        }}
      />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5" />
      <div className="pointer-events-none absolute right-12 top-12 h-44 w-44 rounded-full border border-amber-500/10" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-md">
          <a href="/" className="text-white/35 transition-colors hover:text-white/60">Home</a>
          <span className="text-white/20">/</span>
          <span className="text-amber-400/80">My Itineraries</span>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              ✦ My Trips
            </span>
            <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
              Saved <em className="italic text-amber-400">Itineraries</em>
            </h1>
            <p className="mt-2 text-sm text-white/45">
              All your planned adventures, in one place.
            </p>
          </div>

          {/* Summary stats — only shown when data is loaded and non-empty */}
          {!loading && totalTrips > 0 && (
            <div className="flex gap-6">
              {[
                { value: totalTrips,      label: "Trips"  },
                { value: totalDays,       label: "Days"   },
                { value: totalPlacesAll,  label: "Places" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-playfair text-2xl font-bold text-amber-400">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}