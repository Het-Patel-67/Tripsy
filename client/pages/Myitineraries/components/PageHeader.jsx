export default function PageHeader({ totalTrips, totalDays, totalPlacesAll, loading }) {
  return (
    <div className="relative h-[50vh] sm:h-[75vh] overflow-hidden">
      <img
        src="/assets/tourist/tourist-on-rock.png"
        className="inset-0 h-[50vh] w-full object-cover sm:h-[75vh]"
        alt=""
      />

      <div className="absolute top-15 left-5 md:top-25 md:left-10 z-10 mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-md">
          <a href="/" className="text-white/60 transition-colors hover:text-white/90">Home</a>
          <span className="text-white">/</span>
          <span className="text-amber-400/80">My Itineraries</span>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full border border-amber-400/35 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              ✦ My Trips
            </span>
            <h1 className="font-playfair text-3xl font-bold text-white md:text-5xl">
              Saved <em className="italic text-amber-400 md:text-5xl">Itineraries</em>
            </h1>
            <p className="mt-2 text-sm md:text-lg text-white">
              All your planned adventures, in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}