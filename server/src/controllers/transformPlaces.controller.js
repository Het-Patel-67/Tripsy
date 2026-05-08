import { mapCategory, extractPrice } from "../utils/categoryMapper.js";

function transformPlaces(results = [], cityDocs = [], fallbackCategory) {
  try {
    if (!Array.isArray(results) || !cityDocs.length) return [];

    return results
      .map((place) => {
        const category = mapCategory(place, fallbackCategory);

        // 🔍 Smart city matching
        const matchedCity = cityDocs.find((city) => {
          const name = city.name.toLowerCase();

          return (
            place.address?.toLowerCase().includes(name) ||
            place.title?.toLowerCase().includes(name)
          );
        });

        // fallback → first city
        const cityDoc = matchedCity || cityDocs[0];

        const lng = place.gps_coordinates?.longitude;
        const lat = place.gps_coordinates?.latitude;

        // ❌ skip invalid coordinates
        if (
          typeof lng !== "number" ||
          typeof lat !== "number"
        ) {
          return null;
        }

        return {
          name: place.title || "Unknown Place",
          category,

          // ✅ FIXED RELATION
          city: cityDoc._id,
          cityName: cityDoc.name,
          stateName: cityDoc.state,

          types: place.types || [],
          rating: place.rating || 0,
          description: place.description || "",
          user_review: place.user_review || "",

          images: [
            place.thumbnail,
            place.serpapi_thumbnail
          ].filter(Boolean),

          price: extractPrice(place.price),
          amenities: place.amenities || [],
          rawCategory: place.type || place.title || null,

          location: {
            type: "Point",
            coordinates: [lng, lat]
          },

          fetchedAt: new Date()
        };
      })
      .filter(Boolean); // remove null entries
  } catch (error) {
    console.error("Error transforming places:", error);
    return [];
  }
}

export default transformPlaces;