import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})
import mongoose from "mongoose";
import City from "../models/city.model.js";
import data from "./cities.json" with {type: "json"}

async function seedCities() {
  await mongoose.connect(process.env.MONGODB_URI + "/" + process.env.DB_NAME);

  const formattedCities = data.map(city => ({
    name: city.City,
    state: city.State,
    location: {
      type: "Point",
      coordinates: [city.Longitude, city.Latitude]
    }
  }));

  await City.insertMany(formattedCities);

  console.log("Cities inserted successfully");
  process.exit();
}

seedCities();