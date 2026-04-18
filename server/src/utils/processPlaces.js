import { getHighQualityImage } from "./imageHelper.js";

export const processPlaces = async (places) => {
  try {
    
    if (!Array.isArray(places)) return [];

    const processed = places.map((place) => {
      const image = getHighQualityImage(place.images);

      return {
        ...place,
        image: image || null, 
      };
    });

    return processed;
  } catch (error) {
    console.error("Error in processPlaces:", error);
    return [];
  }
};