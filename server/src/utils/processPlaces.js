import { getHighQualityImage } from "./imageHelper.js";
import { uploadPlaceImage} from "./uploadPlaceImage.js";

export const processPlaces = async (places) => {
  try {

    if (!Array.isArray(places)) return [];

    const processedPlaces = await Promise.all(

      places.map(async (place) => {

        const highQualityImage = getHighQualityImage(place.images);

        let cloudinaryImage = null;

        if (highQualityImage) {
          cloudinaryImage =
            await uploadPlaceImage(highQualityImage, place._id);
        }

        return {
          ...place,

          image:
            cloudinaryImage ||
            highQualityImage ||
            null,

          images:
            cloudinaryImage
              ? [cloudinaryImage]
              : highQualityImage
              ? [highQualityImage]
              : []
        };
      })
    );

    return processedPlaces;

  } catch (error) {

    console.error(
      "Error in processPlaces:",
      error
    );

    return [];
  }
};