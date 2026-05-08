import React, { useState } from "react";
import {
  generateItinerary,
  getHotelRecommendations
} from "../../src/services/apiService.js";

import HotelSection from "./Hotel.jsx";
import PreferencesSelect from "./components/PreferencesSelect.jsx";

function Trip() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [itinerary, setItinerary] = useState(null);
  const [itineraryId, setItineraryId] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [budget, setBudget] = useState("medium");
  const [preferences, setPreferences] = useState([]);
  const [style, setStyle] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const categories = [
  "Tourist",
  "Nature",
  "Adventure",
  "Historical",
  "Spiritual",
  "Culture",
  "Wildlife",
  "Beach",
  "Mountain",
  "Entertainment",
  "Shopping"
];

  const getEndDate = (start, duration) => {
    const [year, month, day] = start.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayCount = Math.max(1, Number(duration) || 1);
    date.setDate(date.getDate() + dayCount - 1);
    return date.toISOString().slice(0, 10);
  };

  const endDate = getEndDate(startDate, days);

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      // If already selected, remove it
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      // If not selected, add it
      setSelectedItems([...selectedItems, item]);
    }
  };
  const handleGenerate = async () => {
    try {
      const res = await generateItinerary({
        city,
        days: Number(days),
        budget: budget,
        startDate: new Date().toISOString(),
        preferences: selectedItems
      });
      
      setItinerary(res.data.itinerary);
      const itineraryId = res.data.savedItineraryId;
      setItineraryId(itineraryId);

      setLoadingHotels(true);

      try {
        const hotelRes = await getHotelRecommendations(
          itineraryId,
          budget
        );
        setHotels(hotelRes.hotels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHotels(false);
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-6 ">
      <div className="bg-white p-6 mt-6 md:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Destination</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">📍</span>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 pl-6 md:pl-10 md:pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Duration</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full outline-none appearance-none"
                min="1"
              />
              <span className="text-gray-500 text-sm ml-1">Days</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Start Date</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Budget</label>
            <div className="flex items-center border border-gray-200 rounded-xl  py-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
              <span className="mr-2">💰</span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-50  ml-1 bg-transparent outline-none appearance-none cursor-pointer"
              >
                <option value="low" >Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-12">
            <label className="block text-lg font-semibold text-gray-700 mb-3">What are you interested in?</label>
            <div id="preferences" className="flex flex-row flex-wrap lg:justify-center gap-2 p-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleSelection(cat)}
                  className={`border md:m-1.5 rounded-lg p-1 md:p-2 transition-all duration-200 ${selectedItems.includes(cat)
                    ? "bg-amber-100  border-orange-500 shadow-md"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}

                  {selectedItems.includes(cat) && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-12 flex justify-center mt-2">
            <button
              onClick={handleGenerate}
              disabled={loadingHotels}
              className="w-full md:w-auto bg-linear-to-r from-orange-500 to-orange-600 text-white px-5 md:px-10 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loadingHotels ? "✨ Creating Magic..." : "Generate Itinerary"}
            </button>
          </div>

        </div>
      </div>

      {itinerary && (
        <div className="max-w-7xl mx-auto mt-8">
          <h2 className="text-lg font-semibold mb-4">Your Plan</h2>

          <div className="grid md:grid-cols-3 gap-6">

            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden">

                <div className="bg-blue-100 p-4 flex items-center gap-3">
                  <img
                    src={
                      day.places[0]?.image ||
                      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400"
                    }
                    alt=""
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <h3 className="font-semibold">
                    Day {day.day} - {day.date}
                  </h3>
                </div>

                <div className="p-4 space-y-4">

                  {["Morning", "Afternoon", "Evening"].map((slot) => {
                    const filtered = day.places.filter(p => p.time === slot);

                    if (!filtered.length) return null;

                    return (
                      <div key={slot}>
                        <p className="text-sm text-gray-500 mb-1">
                          {slot === "Morning" && "🌅"}
                          {slot === "Afternoon" && "☀️"}
                          {slot === "Evening" && "🌇"} {slot}
                        </p>

                        {filtered.map((p, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
                          >
                            <span className="text-sm">{p.name}</span>
                            <button
                              onClick={() => setSelectedPlace(p)}
                              className="text-sm text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {day.places.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No places planned
                    </p>
                  )}

                </div>
              </div>
            ))}

          </div>
        </div>
      )}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          ></div>

          <div className="relative bg-white w-[95%] md:w-212.5 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-fadeIn">

            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-red-100 w-10 h-10 rounded-full shadow-md text-xl"
            >
              ✕
            </button>

            <div className="relative h-75">

              <img
                src={
                  selectedPlace.image
                }
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold">
                  {selectedPlace.name}
                </h2>

                <p className="text-sm opacity-90 mt-1">
                  {selectedPlace.category}
                </p>
              </div>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  ⭐ {selectedPlace.rating || "4.5"}
                </div>

                <div className="text-gray-500 text-sm">
                  Highly rated destination
                </div>

              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPlace.types?.map((type, idx) => (
                  <span
                    key={idx}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  About this place
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {selectedPlace.description ||
                    "No description available"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

                <h3 className="text-lg font-semibold mb-3">
                  Visitor Review
                </h3>

                <p className="text-gray-600 italic leading-relaxed">
                  “{selectedPlace.review || "Amazing place to visit."}”
                </p>

              </div>

            </div>
          </div>
        </div>
      )}
      
      {loadingHotels && (
        <p className="mt-6 text-center">Finding best hotels...</p>
      )}

      {hotels.length > 0 && (
        <div className="max-w-5xl mx-auto mt-6">
          <HotelSection hotels={hotels} />
        </div>
      )}
    </div>
  );
}

export default Trip;