import { getHotelRecommendations } from "../../src/services/apiService";
import { useRef, useState } from 'react'
function HotelSection({ hotels }) {
  const fallbackImages = [
    "/assets/hotel/hotel1.avif",
    "/assets/hotel/hotel2.png",
    "/assets/hotel/hotel3.jpg",
    "/assets/hotel/hotel4.avif",
    "/assets/hotel/hotel5.jpg"
  ];
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const totalScrollableWidth = scrollWidth - clientWidth;

    if (totalScrollableWidth <= 0) {
      setScrollProgress(0);
      return;
    }

    const currentProgress = (scrollLeft / totalScrollableWidth) * 100;
    setScrollProgress(currentProgress);
  };
  return (
    <section className="px-5 py-12 bg-white">
      <h3 className="text-xl font-semibold mb-6">
        Recommended stays
      </h3>

      <div className="w-full flex flex-col gap-4">
        
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {hotels.map((hotel, index) => (
            <div
              key={hotel._id}
              className="min-w-[85%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.33%-16px)] rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-white flex flex-col snap-start"
            >
              <img
                src={hotel.image || fallbackImages[index % fallbackImages.length]}
                alt={hotel.name}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.target.src = fallbackImages[index % fallbackImages.length];
                }}
              />

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div className="h-12 overflow-hidden">
                  <h4 className="font-semibold text-base line-clamp-2 text-gray-900 leading-tight">
                    {hotel.name}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 flex items-center gap-1 font-medium">
                    <span className="text-amber-500">⭐</span> {hotel.rating || "N/A"}
                  </p>

                  {hotel.price && (
                    <p className="text-base font-semibold text-orange-500">
                      {hotel.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-75 ease-out"
            style={{
              width: `${Math.max(10, scrollProgress)}%`, 
              transform: `translateX(${scrollProgress * 0.9}%)`
            }}
          />
        </div>
      </div>

    </section>
  );
}

export default HotelSection;