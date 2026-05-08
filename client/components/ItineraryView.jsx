import React, { useState } from "react";
import {
  addPlace,
  removePlace,
  replacePlace,
  getNearby,
} from "../src/services/apiService.js";

function ItineraryView({ itinerary, itineraryId, setItinerary }) {
  const [nearby, setNearby] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // ➕ ADD
  const handleAdd = async (day, placeId) => {
    const res = await addPlace({
      itineraryId,
      day,
      placeId,
    });

    setItinerary(res.data.itinerary.plan);
  };

  // ❌ REMOVE
  const handleRemove = async (day, placeId) => {
    const res = await removePlace({
      itineraryId,
      day,
      placeId,
    });

    setItinerary(res.data.itinerary.plan);
  };

  // 🔄 REPLACE
  const handleReplace = async (day, oldPlaceId, newPlaceId) => {
    const res = await replacePlace({
      itineraryId,
      day,
      oldPlaceId,
      newPlaceId,
    });

    setItinerary(res.data.itinerary.plan);
  };

  // 📍 NEARBY
  const handleNearby = async (place) => {
    const [lng, lat] = place.location.coordinates;

    const res = await getNearby(lat, lng);
    setNearby(res.data.data || []);
    setSelectedPlace(place);
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">Your Plan</h2>

      {itinerary.map((dayObj) => (
        <div key={dayObj.day} className="mt-4 border p-3">
          <h3>
            Day {dayObj.day} - {dayObj.date}
          </h3>

          {dayObj.places.map((place) => (
            <div key={place.placeId} className="flex justify-between mt-2">
              <span>
                {place.name} ({place.category}) - {place.time}
              </span>

              <div className="space-x-2">
                <button
                  onClick={() =>
                    handleRemove(dayObj.day, place.placeId)
                  }
                  className="text-red-500"
                >
                  Remove
                </button>

                <button
                  onClick={() => handleNearby(place)}
                  className="text-blue-500"
                >
                  Nearby
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* NEARBY */}
      {nearby.length > 0 && (
        <div className="mt-6">
          <h3>Nearby Suggestions</h3>

          {nearby.map((p) => (
            <div key={p._id} className="flex justify-between mt-2">
              <span>{p.name}</span>

              <button
                onClick={() =>
                  handleReplace(1, selectedPlace.placeId, p._id)
                }
                className="text-green-500"
              >
                Replace
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItineraryView;