import mongoose from "mongoose";
import City from "../models/city.model.js";
import Place from "../models/place.model.js";
import {
  fetchHotels,
  fetchAttractions,
} from "../services/apiServices.js";
import transformPlaces from "../controllers/transformPlaces.controller.js";

/**
 * Ensures a City document exists for the given name/state.
 * Creates one using coordinates from the first transformed place if missing.
 */
async function upsertCityDoc(cityName, stateName, transformedPlaces) {
  let cityDoc = await City.findOne({
    name: { $regex: new RegExp(`^${cityName}$`, "i") },
  });

  if (cityDoc) return cityDoc;

  const withCoords = transformedPlaces.find(
    (p) => p.location?.coordinates?.length === 2
  );

  if (!withCoords) {
    console.warn(` No coordinates to create city doc for ${cityName}`);
    return null;
  }

  cityDoc = await City.create({
    name: cityName,
    state: stateName || "",
    location: {
      type: "Point",
      coordinates: withCoords.location.coordinates,
    },
    isTouristCity: true,
  });

  console.log(`Created new city doc: ${cityName} (${stateName})`);
  return cityDoc;
}

/**
 * Fetches places for a city/state from SERP API, transforms, and saves to DB.
 * Exported so itineraryController can call it on a cache miss.
 *
 * KEY DESIGN:
 *  - If `input` is a state name (e.g. "Kerala"), every saved place gets
 *    stateName = "Kerala" explicitly. This lets hasFreshCachedPlaces() find
 *    them on the next request even though cityName values differ ("Kochi" etc).
 *  - fetchedAt is stamped explicitly on every place so the TTL query is
 *    reliable across all Mongoose versions.
 *
 * @param {string} input - city name or state name entered by the user
 * @returns {Promise<{ inserted: number, cityDocs: Document[] }>}
 */
export async function seedPlacesForInput(input) {
  console.log(`\n Processing: ${input}`);

  // ── 1. Check if input matches a state in City DB ──────────────────────────
  const stateMatches = await City.find({
    state: { $regex: new RegExp(input, "i") },
  });

  const isStateInput = stateMatches.length > 0;
  let cityDocs = isStateInput ? stateMatches : [];

  if (!isStateInput) {
    const singleCity = await City.findOne({
      name: { $regex: new RegExp(input, "i") },
    });
    if (singleCity) cityDocs = [singleCity];
  }

  // ── 2. Fetch fresh data from SERP API ─────────────────────────────────────
  console.log(`Fetching from SERP API: ${input}`);

  const [attractionsRaw, hotelsRaw] = await Promise.all([
    fetchAttractions(input),
    fetchHotels(input),

  ]);
 
  // ── 3. Transform raw SERP results ─────────────────────────────────────────
  const touristPlaces = transformPlaces(attractionsRaw, cityDocs, "tourist");
  const hotels = transformPlaces(hotelsRaw, cityDocs, "hotel");

  const allTransformed = [...touristPlaces, ...hotels];
  

  const withCoords = allTransformed.filter(p => p?.location?.coordinates?.length === 2);
  
  if (!allTransformed.length) {
    console.log(`No valid data from SERP API for: ${input}`);
    return { inserted: 0, cityDocs };
  }

  // ── 4. Stamp fetchedAt + fix stateName on every place ────────────────────
  //
  // WHY fetchedAt: insertMany bypasses Mongoose middleware so the schema
  // default may not fire. We stamp it manually to guarantee the TTL cache
  // check works correctly.
  //
  // WHY stateName: When input = "Kerala" (state), transformPlaces sets
  // cityName = "Kochi" / "Thiruvananthapuram" etc., but stateName may be
  // blank if the place address didn't contain the state string. We force
  // stateName = "Kerala" so hasFreshCachedPlaces("Kerala") finds these docs.
  const now = new Date();

  allTransformed.forEach((p) => {
    p.fetchedAt = now;
    if (isStateInput && !p.stateName) {
      p.stateName = input;
    }
  });

  // ── 5. Upsert City docs for any city not yet in DB ────────────────────────
  if (!cityDocs.length) {
    const sample = allTransformed[0];
    const inferredCity = sample.cityName || input;
    const inferredState = sample.stateName || (isStateInput ? input : "");

    const newCityDoc = await upsertCityDoc(
      inferredCity,
      inferredState,
      allTransformed
    );

    if (newCityDoc) {
      cityDocs = [newCityDoc];
      allTransformed.forEach((p) => {
        if (!p.city) p.city = newCityDoc._id;
        if (!p.cityName) p.cityName = newCityDoc.name;
        if (!p.stateName) p.stateName = newCityDoc.state;
      });
    }
  }


  const cityNames = [...new Set(allTransformed.map((p) => p.cityName).filter(Boolean))];

  if (cityNames.length) {
    await Place.deleteMany({ cityName: { $in: cityNames } });
    console.log(`🗑️  Cleared stale places for: ${cityNames.join(", ")}`);
  }

  await Place.insertMany(allTransformed);
  console.log(`✅ Inserted ${allTransformed.length} places for: ${input}`);

  return { inserted: allTransformed.length, cityDocs };
}

/**
 * CLI entry point — backward-compatible with running `node seedPlace.js`
 * for manual bulk seeding.
 */
async function runSeedCLI() {
  const inputs = ["Jammu and Kashmir", "Maharashtra", "Ahmedabad"];

  try {
    await mongoose.connect(
      process.env.MONGODB_URI + "/" + process.env.DB_NAME,
      { serverSelectionTimeoutMS: 30000 }
    );
    console.log("✅ Connected to MongoDB");

    for (const input of inputs) {
      await seedPlacesForInput(input);
    }

    console.log("\n🎉 Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding places:", error);
    process.exit(1);
  }
}
if (process.argv[1].endsWith("seedPlace.js")) {
  runSeedCLI();
}