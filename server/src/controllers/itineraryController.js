import Place from "../models/place.js";
import City from "../models/city.js";
import Itinerary from "../models/itinerary.js";
import asyncHandler from "../utils/asyncHandler.js"

// 🌍 Haversine Distance Function (Accurate)
function getDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371; // Earth radius in KM

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


// 🧭 Build Optimized Route (Nearest Neighbor)
function buildRoute(places, startLocation) {
  let unvisited = [...places];
  let route = [];
  let current = startLocation;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const place = unvisited[i];

      const dist = getDistance(
        current,
        place.location.coordinates
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextPlace = unvisited.splice(nearestIndex, 1)[0];

    route.push(nextPlace);
    current = nextPlace.location.coordinates;
  }

  return route;
}


// 🗓️ Divide Route into Days
function divideIntoDays(route, days) {
  const MAX_PER_DAY = 5; // limit per day

  let itinerary = [];
  let index = 0;

  for (let i = 0; i < days; i++) {
    itinerary.push({
      day: i + 1,
      places: route.slice(index, index + MAX_PER_DAY)
    });
    index += MAX_PER_DAY;
  }

  return itinerary;
}


// ⏰ Add Time Slots
function addTimeSlots(dayPlan) {
  const timeSlots = ["Morning", "Afternoon", "Evening"];

  return dayPlan.map(day => ({
    day: day.day,
    places: day.places.map((place, index) => ({
      placeId: place._id,
      name: place.name,
      category: place.category,
      rating: place.rating,
      location: place.location,
      time: timeSlots[index % 3]
    }))
  }));
}



// 🚀 MAIN CONTROLLER
export const generateItinerary = async (req, res) => {
  try {
    const {
      city,
      days = 1,
      preferences = [],
    } = req.body;

    
    // ✅ Validate input
    if (!city) {
      return res.status(400).json({
        message: "City is required"
      });
    }

    // 🏙️ Step 1: Find City dynamically
    const cityDoc = await City.findOne({
      name: { $regex: new RegExp(city, "i") }
    });
    
    const userLocation = cityDoc.location;

    if (!cityDoc) {
      return res.status(404).json({
        message: "City not found"
      });
    }

    // 📍 Step 2: Aggregation using GeoNear
    const places = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              userLocation.lng,
              userLocation.lat
            ]
          },
          distanceField: "distance",
          spherical: true
        }
      },
      {
        $match: {
          city: cityDoc._id,
          ...(preferences.length > 0 && {
            category: { $in: preferences }
          })
        }
      },
      {
        $sort: { rating: -1 }
      },
      {
        $limit: 25
      }
    ]);

    if (!places.length) {
      return res.status(404).json({
        message: "No places found"
      });
    }

    // 🧭 Step 3: Build optimized route
    const route = buildRoute(
      places,
      [userLocation.lng, userLocation.lat]
    );

    // 🗓️ Step 4: Divide into days
    const divided = divideIntoDays(route, days);

    // ⏰ Step 5: Add time slots
    const finalPlan = addTimeSlots(divided);

    // 💾 Step 6: Save itinerary (optional if user exists)
    let savedItinerary = null;

    if (req.user) {
      savedItinerary = await Itinerary.create({
        user: req.user._id,
        city: cityDoc._id,
        days,
        plan: finalPlan
      });
    }

    // 📤 Response
    res.status(200).json({
      success: true,
      city: cityDoc.name,
      totalPlaces: places.length,
      itinerary: finalPlan,
      savedItineraryId: savedItinerary?._id || null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};