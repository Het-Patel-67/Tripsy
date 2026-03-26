import { mapCategory, extractPrice } from "../utils/categoryMapper.js";

async function transformPlaces(results = [], cityDoc, fallbackCategory) {
  try {
    return Promise.all(
      results.map(async (place) => {
        const category = mapCategory(place, fallbackCategory)

        return {
          name: place.title,
          category,
          city: cityDoc._id,
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
            coordinates: [
              place.gps_coordinates?.longitude || 0,
              place.gps_coordinates?.latitude || 0
            ]
          },
          fetchedAt: new Date()
        };
      })
    );
  } catch (error) {
    console.error("Error transforming places:", error);
    return [];
  }
}

export default transformPlaces;