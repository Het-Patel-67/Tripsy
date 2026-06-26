import { mapCategory, extractPrice } from "../utils/categoryMapper.js";

function transformPlaces(results = [], cityDocs = [], fallbackCategory) {
  try {
    if (!Array.isArray(results) || !results.length) return [];  

    return results
      .map((place) => {
        const category = mapCategory(place, fallbackCategory);
        const matchedCity = cityDocs.find((city) => {
          const name = city.name.toLowerCase();
          return (
            place.address?.toLowerCase().includes(name) ||
            place.title?.toLowerCase().includes(name)
          );
        });

        const cityDoc = matchedCity || cityDocs[0] || null; 

        const lng = place.gps_coordinates?.longitude;
        const lat = place.gps_coordinates?.latitude;
        if (typeof lng !== "number" || typeof lat !== "number") return null;

        // Extract cityName/stateName from address as fallback
        const addressParts = place.address?.split(",").map(p => p.trim()) || [];
        const inferredCity  = cityDoc?.name  || addressParts.at(-3) || "";
        const inferredState = cityDoc?.state || addressParts.at(-2) || "";

        return {
          name:        place.title || "Unknown Place",
          category,
          city:        cityDoc?._id || null,      
          cityName:    inferredCity,
          stateName:   inferredState,
          types:       place.types || [],
          rating:      place.rating || 0,
          description: place.description || "",
          user_review: place.user_review || "",
          images:      [place.thumbnail].filter(Boolean),
          optimizedImage: "",
          imageUploaded:  false,
          price:       extractPrice(place.price),
          amenities:   place.amenities || [],
          rawCategory: place.type || place.title || null,
          location: {
            type:        "Point",
            coordinates: [lng, lat],
          },
          fetchedAt: new Date(),
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error transforming places:", error);
    return [];
  }
}

export default transformPlaces;