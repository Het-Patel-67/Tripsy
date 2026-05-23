import cloudinary from "../config/cloudinary.js";
import axios from "axios";
export const uploadPlaceImage = async (
  imageUrl,
  placeId
) => {

  try {

    if (!imageUrl) return null;

    const uploaded =
      await cloudinary.uploader.upload(
        imageUrl,
        {
          folder: "tripsy/places",

          public_id: `place_${placeId}`,

          overwrite: false,

          transformation: [
            {
              width: 1200,
              crop: "limit",
              quality: "auto"
            }
          ]
        }
      );

    return uploaded.secure_url;

  } catch (error) {

    console.log(
      "Cloudinary Upload Error:",
      error.message
    );

    return null;
  }
};