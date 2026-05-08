import { getHotelRecommendations } from "../../src/services/apiService";

function HotelSection({ hotels }) {
  const fallbackImages = [
    "/assets/hotel/hotel1.avif",
    "/assets/hotel/hotel2.png",
    "/assets/hotel/hotel3.jpg",
    "/assets/hotel/hotel4.avif",
    "/assets/hotel/hotel5.jpg"
  ];
  return (
    <section className="px-5 py-12 bg-white">
      <h3 className="text-xl font-semibold mb-6">
        🏨 Recommended stays
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel, index) => (
          <div
            key={hotel._id}
            className="rounded-xl overflow-hidden shadow-sm border bg-white"
          >
            <img
              src={hotel.image || fallbackImages[index % fallbackImages.length]}
              alt={hotel.name}
              loading="lazy"
              className="h-48 w-full object-cover"
              onError={(e) => {
                e.target.src = fallbackImages[index % fallbackImages.length];
              }}
            />

            <div className="p-4">
              <h4 className="font-semibold text-base">
                {hotel.name}
              </h4>

              <p className="text-sm text-slate-600 mt-1">
                ⭐ {hotel.rating || "N/A"}
              </p>

              {hotel.price && (
                <p className="text-sm text-orange-500 mt-1">
                  {hotel.price}
                </p>
              )}

              <button className="mt-3 text-sm text-orange-500 hover:underline">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HotelSection;