import mongoose from "mongoose";
import City from "../models/city.model.js";
import Place from "../models/place.model.js";
import { fetchHotels, fetchRestaurants, fetchAttractions } from "../services/apiServices.js";
import transformPlaces from "../controllers/transformPlaces.controller.js"

const cities = ["Ahmedabad"];

async function seedPlace() {
    try {
        await mongoose.connect(process.env.MONGODB_URI + "/" + process.env.DB_NAME, {
            serverSelectionTimeoutMS: 30000
        })
        console.log("Connected to MongoDB");
        for (const city of cities) {
            const cityDoc = await City.findOne({ name: city });

            if (!cityDoc) {
                console.log(`❌ City not found: ${city}`);
                continue;
            }

            let places = await Place.find({ city: cityDoc._id });

            if (places.length === 0) {
                console.log(`\n📍 Processing ${city}...`);

                const fetchPlaceRaw = await fetchAttractions(city);
                const hotelsRaw = await fetchHotels(city);
                const restaurantRaw = await fetchRestaurants(city);

                const touristPlaces = await transformPlaces(fetchPlaceRaw, cityDoc, null);
                const hotels = await transformPlaces(hotelsRaw, cityDoc, "hotel");
                const restaurants = await transformPlaces(restaurantRaw, cityDoc, "restaurant");
                
                const allData = [
                    ...(touristPlaces || []),
                    ...(hotels || []),
                    ...(restaurants || [])
                ];

                await Place.insertMany(allData);
                console.log(`✅ Data inserted for ${city}`);
            } else {
                console.log(`ℹ️ Data already exists for ${city}`);
            }
        }

        process.exit();
    } catch (error) {
        console.error("Error seeding places:", error);
        process.exit(1);
    }
}

seedPlace();