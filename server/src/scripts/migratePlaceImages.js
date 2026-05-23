import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";

import Place from "../models/place.model.js";

import { uploadPlaceImage }
from "../utils/uploadPlaceImage.js";

import { getHighQualityImage }
from "../utils/imageHelper.js";

await mongoose.connect(process.env.MONGODB_URI + "/" + process.env.DB_NAME);

console.log("MongoDB Connected");

const places = await Place.find();

for (const place of places) {

  try {

    console.log(
      "Processing:",
      place.name
    );

    // skip only cloudinary images
    if (
      place.image &&
      place.image.includes("cloudinary")
    ) {
      console.log(
        "Already uploaded"
      );

      continue;
    }

    const image =
      getHighQualityImage(
        place.images
      );

    if (!image) {

      console.log(
        "No image found"
      );

      continue;
    }

    console.log(
      "Uploading image..."
    );

    const cloudinaryImage =
      await uploadImageToCloudinary(
        image
      );

    if (!cloudinaryImage) {

      console.log(
        "Upload failed"
      );

      continue;
    }

    place.image = cloudinaryImage;

    place.images = [cloudinaryImage];

    await place.save();

    console.log(
      "Updated:",
      place.name
    );

  } catch (error) {

    console.log(
      "Error:",
      place.name,
      error.message
    );
  }
}

console.log("Migration completed");

process.exit();