import Place from "../models/place.model.js";
import { uploadPlaceImage } from "./uploadPlaceImage.js";

const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const processPlaceImagesInBackground =
  async (places) => {

    try {
      const importantPlaces = places
        .filter(p => p.rating >= 4.3)
        .slice(0, 3);

      for (const place of importantPlaces)
        try {
          if (
            place.imageUploaded ||
            !place.images?.length
          ) {
            continue;
          }

          console.log(
            "Uploading:",
            place.name
          );

          const uploadedUrl =
            await uploadPlaceImage(
              place.images[0],
              place._id
            );

          if (!uploadedUrl) {
            continue;
          }

          await Place.findByIdAndUpdate(place._id, {
            optimizedImage: uploadedUrl,
            imageUploaded: true
          });

          console.log(
            "Uploaded:",
            place.name
          );

          await delay(1000);

        } catch (err) {

          console.log(
            "Single Place Upload Error:",
            err.message
          );
        }


    } catch (error) {

      console.log(
        "Background Processor Error:",
        error.message
      );
    }
  };