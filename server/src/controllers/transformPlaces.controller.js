import { mapCategory, extractPrice } from "../utils/categoryMapper.js";
import fetchWikiDescription from "../services/wikiService.js";
import {generateDescriptionsBatch } from "../services/geminiService.js"

async function transformPlaces(results = [], cityDoc, fallbackCategory) {
  try {


    const basePlaces = results.map((place) => {
      const category = mapCategory(place, fallbackCategory);
      
      return {
        name: place.title,
        category,
        city: cityDoc._id,
        types: place.types || [],
        rating: place.rating || 0,
        description: "",
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
      }
    });
   const touristPlaces = basePlaces.filter(
      p => p.category !== "hotel" && p.category !== "restaurant"
    );

    // 🔹 Step 3: Generate AI descriptions ONLY for tourist
    let aiDescriptions = [];
    if (touristPlaces.length > 0) {
      aiDescriptions = await generateDescriptionsBatch(touristPlaces);
    }

    // 🔹 Step 4: Merge descriptions
    const finalPlaces = basePlaces.map(place => {
      if (place.category === "hotel" || place.category === "restaurant") {
        return {
          ...place,
          description: place.description || "No description available"
        };
      }

      const aiMatch = aiDescriptions.find(d => d.name === place.name);

      return {
        ...place,
        description:
          aiMatch?.description ||
          "A popular tourist destination famous for its attractions."
      };
    });

    return finalPlaces;
  } catch (error) {
    console.error("Error transforming places:", error);
    return [];
  }
}

export default transformPlaces;