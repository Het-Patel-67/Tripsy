import mongoose from "mongoose";
import City from "../models/city.model.js";
import Place from "../models/place.model.js";
import {
  fetchHotels,
  fetchRestaurants,
  fetchAttractions
} from "../services/apiServices.js";
import transformPlaces from "../controllers/transformPlaces.controller.js";

const inputs = ["Ahmedabad", "Uttarakhand", "Rajasthan"];

async function seedPlace() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI + "/" + process.env.DB_NAME,
      { serverSelectionTimeoutMS: 30000 }
    );

    console.log("✅ Connected to MongoDB");

    for (const input of inputs) {
      console.log(`\n📍 Processing: ${input}`);

      let cityDocs = [];

      // 🔍 Check if input is a state
      const stateMatches = await City.find({
        state: { $regex: new RegExp(input, "i") }
      });

      if (stateMatches.length > 0) {
        cityDocs = stateMatches;
      } else {
        const singleCity = await City.findOne({
          name: { $regex: new RegExp(input, "i") }
        });

        if (singleCity) cityDocs = [singleCity];
      }

      if (!cityDocs.length) {
        console.log(`❌ No city found for ${input}`);
        continue;
      }

      // 🔥 OPTIONAL: Clean old data (avoid duplicates)
      await Place.deleteMany({
        cityName: { $in: cityDocs.map(c => c.name) }
      });

      console.log(`🧠 Fetching data from APIs...`);

      const [attractionsRaw, hotelsRaw, restaurantsRaw] =
        await Promise.all([
          fetchAttractions(input),
          fetchHotels(input),
          fetchRestaurants(input)
        ]);

      console.log(`🔄 Transforming data...`);

      const touristPlaces = transformPlaces(attractionsRaw, cityDocs, "tourist");
      const hotels = transformPlaces(hotelsRaw, cityDocs, "hotel");
      const restaurants = transformPlaces(
        restaurantsRaw,
        cityDocs,
        "restaurant"
      );

      const allData = [
        ...(touristPlaces || []),
        ...(hotels || []),
        ...(restaurants || [])
      ].filter(p => p.location && p.location.coordinates.length === 2);

      if (!allData.length) {
        console.log(`⚠️ No valid data to insert for ${input}`);
        continue;
      }

      await Place.insertMany(allData);

      console.log(`✅ Inserted ${allData.length} places for ${input}`);
    }

    console.log("\n🎉 Seeding completed!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding places:", error);
    process.exit(1);
  }
}

seedPlace();