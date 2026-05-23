import { useEffect, useState } from "react";
import { getMyItineraries }    from "../../src/services/apiService";
import { totalPlaces } from "../../src/utils/Itineraryhelper.js";

import PageHeader from "./components/PageHeader";
import SearchBar from "./components/SearchBar";
import SkeletonCard from "./components/SkeletonCard";
import ItineraryCard from "./components/ItineraryCard";
import ItineraryModal from "./components/ItineraryModal";
import { NoResults, EmptyState } from "./components/EmptyState.jsx";

/* ── Fonts + animations that Tailwind can't handle ─────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.19s; }
  .fade-up-4 { animation-delay: 0.26s; }
  .fade-up-5 { animation-delay: 0.33s; }
  .fade-up-6 { animation-delay: 0.40s; }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #ede8e0 25%, #f5f0e8 50%, #ede8e0 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }

  .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(28,25,23,0.13);
  }
`;

/* ══════════════════════════════════════════════════════════════════════════ */

function MyItineraries() {
  const [itineraries,       setItineraries]       = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [search,            setSearch]            = useState("");
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyItineraries();
        setItineraries(res.data.itineraries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Derived values ── */
  const filtered = itineraries.filter(
    (it) =>
      it.cityName?.toLowerCase().includes(search.toLowerCase()) ||
      it.stateName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalTrips    = itineraries.length;
  const totalDays     = itineraries.reduce((s, it) => s + (it.days || 0), 0);
  const totalPlacesAll= itineraries.reduce((s, it) => s + totalPlaces(it.plan), 0);

  /* ── Render ── */
  return (
    <>
      <style>{globalStyles}</style>

      <div className="font-dm min-h-screen bg-[#F5EFE6] text-[#1C1917]">

        {/* Hero banner */}
        <PageHeader
          totalTrips={totalTrips}
          totalDays={totalDays}
          totalPlacesAll={totalPlacesAll}
          loading={loading}
        />

        {/* Main content */}
        <div className="mx-auto max-w-6xl px-5 py-10 pb-20">

          {/* Search bar — only when there's something to search */}
          {!loading && totalTrips > 0 && (
            <SearchBar
              search={search}
              onSearch={setSearch}
              total={totalTrips}
              filteredCount={filtered.length}
            />
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)

            ) : search && filtered.length === 0 ? (
              <NoResults search={search} onClear={() => setSearch("")} />

            ) : itineraries.length === 0 ? (
              <EmptyState />

            ) : (
              filtered.map((item, index) => (
                <ItineraryCard
                  key={item._id}
                  item={item}
                  index={index}
                  onView={(it) => setSelectedItinerary(it)}
                />
              ))
            )}
          </div>

          {/* Plan another trip CTA */}
          {!loading && itineraries.length > 0 && (
            <div className="fade-up mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E7DDD0] bg-[#FFFCF9] py-10 text-center">
              <div>
                <p className="font-playfair text-lg font-bold text-[#1C1917]">
                  Plan another adventure
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  Your next great trip is just a few clicks away.
                </p>
              </div>
              <a
                href="/Plan-trip"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-amber-600 to-amber-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(217,119,6,0.4)]"
              >
                Plan New Trip
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal — rendered outside the grid so it overlays correctly */}
      {selectedItinerary && (
        <ItineraryModal
          item={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
    </>
  );
}

export default MyItineraries;