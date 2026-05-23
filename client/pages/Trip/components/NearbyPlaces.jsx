import React from "react";

function NearbyPlaces({ places = [], onPlaceClick }) {
  if (!places.length) return null;

  return (
    <div className="mt-10">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Nearby Attractions
        </h2>

        <span className="text-sm text-gray-500">
          Places around your trip
        </span>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">

        {places.map((place) => (
          <div
            key={place._id}
            className="min-w-70 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            onClick={() => onPlaceClick(place)}
          >
            
            <div className="h-44 overflow-hidden">

              <img
                src={
                  place.image ||
                  place.images?.[0]
                }
                alt={place.name}
                className="w-full h-full object-cover hover:scale-105 transition-all"
                loading="lazy"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <div className="flex justify-between items-center">

                <h3 className="font-semibold text-lg line-clamp-1">
                  {place.name}
                </h3>

                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  ⭐ {place.rating || "4.5"}
                </span>

              </div>

              <p className="text-sm text-orange-600 mt-2 capitalize">
                {place.category}
              </p>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {place.description || "Explore this amazing destination."}
              </p>

              <button className="mt-4 text-orange-600 font-medium">
                View Details →
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbyPlaces;