import React,{useState} from 'react'

function Trip() {

const categories = [
  "Nature",
  "Spiritual",
  "Beach",
  "Heritage",
  "Adventure",
  "1-Day Trips",
  "Weekend Getaways",
  "Fun Parks",
];

const destinations = [
  {
    id: 1,
    name: "Dwarka",
    category: "Spiritual",
    cost: "₹2.5k/day",
    image: "/dwarka.jpg",
  },
  {
    id: 2,
    name: "Girnar",
    category: "Nature",
    cost: "₹3k/day",
    image: "/Girnar.jpeg",
  },
  {
    id: 3,
    name: "Somnath",
    category: "Spiritual",
    cost: "₹2k/day",
    image: "/somnath.png",
  },
];

  const [budget, setBudget] = useState(10000);
  const [days, setDays] = useState(3);
  const [category, setCategory] = useState("Nature");
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <div className="text-slate-800 mt-10 px-6 sm:px-20">
      
      {/* 1️⃣ INTRO SECTION */}
      <section className="bg-orange-50/50 px-5 pt-10 pb-14">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Plan your trip, calmly.
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Tell us your budget, time, and travel style — we’ll plan the rest
            without clutter or stress.
          </p>
        </div>
      </section>

      {/* 2️⃣ TRIP PREFERENCES */}
      <section className="px-6  max-w-4xl">
        
        {/* Budget */}
        <div className="mb-8">
          <label className="text-sm font-medium">
            Budget (₹{budget} )
          </label>
          <div className="relative mt-3 w-80 max-w-full">
            <input
              type="range"
              min="3000"
              max="100000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full accent-orange-500"
              
            />
            {/* Flags */}
            <div className="absolute left-0 right-0 top-6 flex justify-between text-xs text-slate-500 select-none pointer-events-none">
              <span>10k</span>
              <span>30k</span>
              <span>50k</span>
              <span>70k</span>
              <span>90k</span>
            </div>
          </div>
          
        </div>
        <div className="mb-8">
          <label className="text-sm font-medium pr-3">
            Number of days
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-3 w-24 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">
            Travel style
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition
                  ${
                    category === cat
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ DESTINATION SELECTION */}
      <section className="px-5 py-12 bg-slate-50">
        <h2 className="text-xl font-semibold mb-6">
          Choose a destination in Gujarat
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="rounded-xl overflow-hidden bg-white"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="sm:h-70 h-60 w-full object-fill"
              />
              <div className="p-4">
                <h3 className="font-medium">{dest.name}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {dest.category} · {dest.cost}
                </p>
                <button
                  onClick={() => setSelectedDestination(dest)}
                  className="mt-4 text-sm text-orange-500 hover:underline cursor-pointer"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4️⃣ GENERATED OVERVIEW */}
      {selectedDestination && (
        <section className="px-5 max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">
            Your trip overview
          </h2>

          <div className="bg-orange-50/60 rounded-xl p-6 text-sm leading-relaxed">
            <p>
              <strong>{days}-day trip to {selectedDestination.name}</strong>
            </p>
            <p className="mt-2 text-slate-700">
              Estimated cost fits your budget. Travel style aligns with
              {` ${category.toLowerCase() } preferences.`}
            </p>
          </div>
        </section>
      )}

      {/* 5️⃣ TRIP DETAILS */}
      {selectedDestination && (
        <section className="px-5 max-w-4xl space-y-10">
          
          {/* Transport */}
          <div>
            <h3 className="font-semibold mb-2">🚗 Transport</h3>
            <p className="text-sm text-slate-600">
              Train / Bus available · Approx ₹800–₹1,200
            </p>
          </div>

          {/* Hotels */}
          <div>
            <h3 className="font-semibold mb-2">🏨 Stay options</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Budget Hotel — ₹1,200/night</li>
              <li>• Comfort Stay — ₹2,000/night</li>
            </ul>
          </div>

          {/* Food */}
          <div>
            <h3 className="font-semibold mb-2">🍽️ Food to try</h3>
            <p className="text-sm text-slate-600">
              Gujarati thali, local snacks, temple prasad
            </p>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="font-semibold mb-2">🗓️ Sample itinerary</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>Day 1 — Arrival & local visit</li>
              <li>Day 2 — Temple & exploration</li>
              <li>Day 3 — Leisure & return</li>
            </ul>
          </div>

        </section>
      )}

      {/* 6️⃣ RECOMMENDATIONS */}
      {selectedDestination && (
        <section className="px-5 py-12 bg-slate-50">
          <h3 className="font-semibold mb-4">
            You may also like
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {destinations
              .filter((d) => d.name !== selectedDestination.name)
              .map((d) => (
                <div
                  key={d.id}
                  className="min-w-40 bg-white rounded-lg p-3"
                >
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-slate-600">{d.category}</p>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default Trip