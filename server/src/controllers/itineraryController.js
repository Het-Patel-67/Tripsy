import Place from "../models/place.js";
import City from "../models/city.js";
import Itinerary from "../models/itinerary.js";
import asyncHandler from "../utils/asyncHandler.js"

//  Haversine Distance Function
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

function divideIntoDays(route, days, startDate) {
  const MAX_PER_DAY = 5;

  let itinerary = [];
  let index = 0;

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    itinerary.push({
      day: i + 1,
      date: currentDate.toISOString().split("T")[0],
      places: route.slice(index, index + MAX_PER_DAY)
    });
    index += MAX_PER_DAY;
  }

  return itinerary;
}

function addTimeSlots(dayPlan) {
  const timeSlots = ["Morning", "Afternoon", "Evening"];

  return dayPlan.map(day => ({
    day: day.day,
    date: day.date,
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

export const generateItinerary = asyncHandler(async (req, res) => {
  const {
    city,
    days,
    preferences = [],
    startDate
  } = req.body;


  if (!city || !days || !startDate) {
    return res.status(400).json({
      message: "City, days, and start date are required"
    });
  }

  //  Find City without Spelling mismatch
  const cityDoc = await City.findOne({
    name: { $regex: new RegExp(city, "i") }
  });

  const userLocation = cityDoc.location;

  if (!cityDoc) {
    return res.status(404).json({
      message: "City not found"
    });
  }

  // Aggregation using GeoNear
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
    }
  ]);

  if (!places.length) {
    return res.status(404).json({
      message: "No places found"
    });
  }

  const route = buildRoute(
    places,
    [userLocation.lng, userLocation.lat]
  );

  const divided = divideIntoDays(route, days, startDate);

  const finalPlan = addTimeSlots(divided);

  let savedItinerary = null;

  if (req.user) {
    savedItinerary = await Itinerary.create({
      user: req.user._id,
      city: cityDoc._id,
      days,
      startDate,
      plan: finalPlan
    });
  }

  res.status(200).json({
    success: true,
    city: cityDoc.name,
    totalPlaces: places.length,
    startDate,
    days,
    itinerary: finalPlan,
    savedItineraryId: savedItinerary?._id || null
  });

})