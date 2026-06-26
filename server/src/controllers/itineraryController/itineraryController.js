import Place from "../../models/place.model.js";
import City from "../../models/city.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { seedPlacesForInput } from "../../data/seed.place.js"

import {
  processPlaceImagesInBackground,
} from "../../utils/backgroundImageProcessor.js";

import { getBestPlaceImage } from "../../utils/getBestPlaceImage.js";


const MAX_PLACES_PER_DAY = 4;

const CACHE_TTL_DAYS = 30;

const categoryMapper = {
  Tourist: ["tourist", "tourist_attraction", "point_of_interest"],
  Nature: ["nature", "park", "garden", "lake", "waterfall", "national_park"],
  Adventure: ["adventure", "campground", "hiking_area", "amusement_park"],
  Historical: ["historical", "fort", "museum", "historical_landmark", "monument"],
  Spiritual: ["spiritual", "hindu_temple", "mosque", "church", "jain_temple", "synagogue"],
  Culture: ["culture", "art_gallery", "museum"],
  Wildlife: ["wildlife", "zoo", "national_park", "safari"],
  Beach: ["beach"],
  Mountain: ["mountain", "hill_station"],
  Entertainment: ["entertainment", "movie_theater", "amusement_park"],
  Shopping: ["shopping_mall", "market"],
};

function getDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildRoute(places, startLocation) {
  let unvisited = [...places];
  let route = [];
  let current = startLocation;

  while (unvisited.length) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(current, unvisited[i].location.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const next = unvisited.splice(nearestIndex, 1)[0];
    route.push(next);
    current = next.location.coordinates;
  }

  return route;
}

function divideIntoDays(route, days, startDate) {
  const itinerary = [];
  const MIN_PER_DAY = 2;
  let index = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const remainingPlaces = route.length - index;
    const remainingDays = days - i;

    let placesToday = Math.ceil(remainingPlaces / remainingDays);
    placesToday = Math.max(MIN_PER_DAY, Math.min(MAX_PLACES_PER_DAY, placesToday));

    if (index + placesToday > route.length) {
      placesToday = route.length - index;
    }

    itinerary.push({
      day: i + 1,
      date: date.toISOString().split("T")[0],
      places: route.slice(index, index + placesToday),
    });

    index += placesToday;
  }

  return itinerary;
}

function addTimeSlots(plan) {
  const distributions = {
    1: ["Morning"],
    2: ["Morning", "Evening"],
    3: ["Morning", "Afternoon", "Evening"],
    4: ["Morning", "Morning", "Afternoon", "Evening"],
  };

  return plan.map((day) => ({
    day: day.day,
    date: day.date,
    places: day.places.map((p, i) => {
      const dist = distributions[day.places.length] || distributions[4];
      return {
        placeId: p._id,
        name: p.name,
        category: p.category || "",
        image: getBestPlaceImage(p),
        images: p.images || [],
        description: p.description || "",
        types: p.types || [],
        user_review: p.user_review || "",
        rating: p.rating || 0,
        location: p.location,
        cityName: p.cityName || "",
        stateName: p.stateName || "",
        time: dist[i] || "Evening",
      };
    }),
  }));
}
// processedPlaces
// ─── Cache check ──────────────────────────────────────────────────────────────

/**
 * Returns true when Place DB already has enough fresh data for the
 * given city OR state name, so we can skip the SERP API call.
 *
 * Why both cityName + stateName?
 *   When the user types "Kerala" (a state), transformPlaces stores
 *   individual city names like "Kochi" in `cityName` but stores
 *   "Kerala" in `stateName`. Querying only `cityName` would always
 *   miss state-level inputs.
 *
 * "Enough" = at least (days * 2) tourist/attraction places fetched
 * within CACHE_TTL_DAYS. Hotels and restaurants are excluded because
 * they are supplementary and fetched separately.
 */
async function hasFreshCachedPlaces(input, daysNeeded, mappedPreferences = []) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - CACHE_TTL_DAYS);
  const nameRegex = new RegExp(input.trim(), "i");

  const query = {
    $or: [{ cityName: nameRegex }, { stateName: nameRegex }],
    category: { $nin: ["hotel", "restaurant"] },
    fetchedAt: { $gte: cutoff },
    ...(mappedPreferences.length && {
      $or: [
        { category: { $in: mappedPreferences } },
        { types: { $in: mappedPreferences } },
      ],
    }),
  };

  const count = await Place.countDocuments(query);
  console.log(`Cache check for "${input}": ${count} places (need ${daysNeeded * 2})`);
  return count >= daysNeeded * 2;
}

export const generateItinerary = asyncHandler(async (req, res) => {
  const { city: trimmedCity, days, preferences = [], startDate } = req.body;
  const city = trimmedCity.trim();
  if (!city || !days || !startDate) {
    return res.status(400).json({ message: "City, days and startDate required" });
  }

  const totalPlacesNeeded = Number(days) * MAX_PLACES_PER_DAY;
  let mappedPreferences = preferences.flatMap(
    (pref) => categoryMapper[pref] || []
  ).map((p) => p.toLowerCase());
  const cached = await hasFreshCachedPlaces(city, Number(days));

  if (!cached) {
    console.log(`🌐 Cache miss for "${city}" — fetching from SERP API...`);

    try {
      await seedPlacesForInput(city);
    } catch (err) {
      console.error(`❌ SERP fetch failed for "${city}":`, err.message);
    }
  } else {
    console.log(`✅ Cache hit for "${city}" — using DB data`);
  }

  let cityDocs = await City.find({
  $or: [
    { name:  { $regex: city, $options: "i" } },
    { state: { $regex: city, $options: "i" } },
  ],
});

// City not in DB even after seeding — create it from seeded places
if (!cityDocs.length) {
  const samplePlace = await Place.findOne({
    $or: [{ cityName: new RegExp(city, "i") }, { stateName: new RegExp(city, "i") }],
    "location.coordinates": { $exists: true },
  });

  if (samplePlace?.location?.coordinates) {
    const newCity = await City.create({
      name: samplePlace.cityName || city,
      state: samplePlace.stateName || "",
      location: {
        type: "Point",
        coordinates: samplePlace.location.coordinates,
      },
      isTouristCity: true,
    });
    cityDocs = [newCity];
   
  } else {
    return res.status(404).json({ message: `No data found for "${city}". Try a nearby major city.` });
  }
}

  const limitedCityDocs = cityDocs.slice(0, 5);

  let allPlaces = [];

  for (const c of limitedCityDocs) {
    if (!c.location?.coordinates) continue;

    const places = await Place.aggregate([
      {
        $geoNear: {
          key: "location",
          near: { type: "Point", coordinates: c.location.coordinates },
          distanceField: "distance",
          spherical: true,
          query: {
            city: c._id,
            ...(mappedPreferences.length && {
              $or: [
                { category: { $in: mappedPreferences } },
                { types: { $in: mappedPreferences } },
              ],
            }),
          },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$rating", 3] },
              { $divide: [100000, { $add: ["$distance", 1000] }] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: Math.min(totalPlacesNeeded * 2, 20) },
    ]);

    allPlaces.push(...places);
  }

  if (!allPlaces.length) {
    return res.status(404).json({ message: "No places found for the given city" });
  }


  const processedPlaces = allPlaces.map((p) => {

    // cloudinary image
    const optimized = p.optimizedImage;

    // original serp image
    const original =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : null;

    return {
      ...p,


      image:
        optimized ||
        original,


      images: p.images || [],

      optimizedImage: optimized || null
    };
  });

  setImmediate(() => processPlaceImagesInBackground(processedPlaces));

  const uniquePlaces = Array.from(
    new Map(processedPlaces.map((p) => [p._id.toString(), p])).values()
  );

  const usablePlaces =
    uniquePlaces.length >= days * 2 ? uniquePlaces : processedPlaces;


  const startLocation = cityDocs[0].location.coordinates;
  const limitedPlaces = usablePlaces.slice(0, totalPlacesNeeded);
  const route = buildRoute(limitedPlaces, startLocation);
  const divided = divideIntoDays(route, Number(days), startDate);
  const finalPlan = addTimeSlots(divided);

  return res.status(200).json({
    success: true,
    city: limitedCityDocs[0].name,
    cityName: limitedCityDocs[0].name,
    stateName: limitedCityDocs[0].state,
    totalPlaces: usablePlaces.length,
    days,
    startDate,
    itinerary: finalPlan,
  });
});