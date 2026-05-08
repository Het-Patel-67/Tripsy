import Place from "../../models/place.model.js";
import City from "../../models/city.model.js";
import Itinerary from "../../models/itinerary.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { processPlaces } from "../../utils/processPlaces.js";

const categoryMapper = {
  Tourist: [
    "tourist",
    "tourist_attraction",
    "point_of_interest"
  ],

  Nature: [
    "nature",
    "park",
    "garden",
    "lake",
    "waterfall",
    "national_park"
  ],

  Adventure: [
    "adventure",
    "campground",
    "hiking_area",
    "amusement_park"
  ],

  Historical: [
    "historical",
    "fort",
    "museum",
    "historical_landmark",
    "monument"
  ],

  Spiritual: [
    "spiritual",
    "hindu_temple",
    "mosque",
    "church",
    "jain_temple",
    "synagogue"
  ],

  Culture: [
    "culture",
    "art_gallery",
    "museum"
  ],

  Wildlife: [
    "wildlife",
    "zoo",
    "national_park",
    "safari"
  ],

  Beach: [
    "beach"
  ],

  Mountain: [
    "mountain",
    "hill_station"
  ],

  Entertainment: [
    "entertainment",
    "movie_theater",
    "amusement_park"
  ],

  Shopping: [
    "shopping_mall",
    "market"
  ]
};
// HAVERSINE DISTANCE

function getDistance(coord1, coord2) {

  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    (2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      ))
  );
}

function buildRoute(
  places,
  startLocation
) {

  let unvisited = [...places];

  let route = [];

  let current = startLocation;

  while (unvisited.length) {

    let nearestIndex = 0;

    let minDistance = Infinity;

    for (
      let i = 0;
      i < unvisited.length;
      i++
    ) {

      const dist = getDistance(
        current,
        unvisited[i].location.coordinates
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const next =
      unvisited.splice(nearestIndex, 1)[0];

    route.push(next);

    current =
      next.location.coordinates;
  }

  return route;
}

function divideIntoDays(
  route,
  days,
  startDate
) {

  const itinerary = [];

  const MIN_PER_DAY = 2;

  const MAX_PER_DAY = 4;

  let index = 0;

  for (let i = 0; i < days; i++) {

    const date = new Date(startDate);

    date.setDate(
      date.getDate() + i
    );

    const remainingPlaces =
      route.length - index;

    const remainingDays =
      days - i;

    let placesToday = Math.ceil(
      remainingPlaces / remainingDays
    );

    placesToday = Math.max(
      MIN_PER_DAY,
      Math.min(
        MAX_PER_DAY,
        placesToday
      )
    );

    // prevent overflow
    if (
      index + placesToday >
      route.length
    ) {
      placesToday =
        route.length - index;
    }

    itinerary.push({
      day: i + 1,

      date:
        date
          .toISOString()
          .split("T")[0],

      places: route.slice(
        index,
        index + placesToday
      )
    });

    index += placesToday;
  }

  return itinerary;
}

function addTimeSlots(plan) {

  return plan.map((day) => {

    const total =
      day.places.length;

    let distribution = [];

    if (total === 1) {

      distribution = ["Morning"];

    } else if (total === 2) {

      distribution = [
        "Morning",
        "Evening"
      ];

    } else if (total === 3) {

      distribution = [
        "Morning",
        "Afternoon",
        "Evening"
      ];

    } else {

      distribution = [
        "Morning",
        "Morning",
        "Afternoon",
        "Evening"
      ];
    }

    return {
      day: day.day,

      date: day.date,

      places: day.places.map(
        (p, i) => ({
          placeId: p._id,

          name: p.name,

          category:
            p.category || "",

          image:
            p.image || "",

          images:
            p.images || [],

          description:
            p.description || "",

          types:
            p.types || [],

          user_review:
            p.user_review || "",

          rating:
            p.rating || 0,

          location:
            p.location,

          cityName:
            p.cityName || "",

          stateName:
            p.stateName || "",

          time:
            distribution[i] ||
            "Evening"
        })
      )
    };
  });
}

export const generateItinerary =
  asyncHandler(
    async (req, res) => {

      const {
        city,
        days,
        preferences = [],
        startDate
      } = req.body;

      if (
        !city ||
        !days ||
        !startDate
      ) {
        return res.status(400).json({
          message:
            "City, days and startDate required"
        });
      }

      const cityDocs =
        await City.find({
          $or: [
            {
              name: {
                $regex: city,
                $options: "i"
              }
            },
            {
              state: {
                $regex: city,
                $options: "i"
              }
            }
          ]
        });

      if (!cityDocs.length) {
        return res.status(404).json({
          message:
            "City not found"
        });
      }
      let mappedPreferences = [];

      preferences.forEach((pref) => {

        if (
          categoryMapper[pref]
        ) {

          mappedPreferences.push(
            ...categoryMapper[pref]
          );
        }
      });

      mappedPreferences =
        mappedPreferences.map(
          (p) =>
            p.toLowerCase()
        );

      const MAX_PLACES_PER_DAY = 4;

      const totalPlacesNeeded =
        Number(days) *
        MAX_PLACES_PER_DAY;

      let allPlaces = [];

      for (const c of cityDocs) {

        if (
          !c.location?.coordinates
        ) continue;

        const places =
          await Place.aggregate([
            {
              $geoNear: {
                key: "location",

                near: {
                  type: "Point",

                  coordinates:
                    c.location.coordinates
                },

                distanceField:
                  "distance",

                spherical: true,

                query: {
                  city: c._id,

                  ...(mappedPreferences.length && {
                    $or: [
                      {
                        category: {
                          $in:
                            mappedPreferences
                        }
                      },

                      {
                        types: {
                          $in:
                            mappedPreferences
                        }
                      }
                    ]
                  })
                }
              }
            },

            {
              $addFields: {
                score: {
                  $add: [
                    {
                      $multiply: [
                        "$rating",
                        3
                      ]
                    },

                    {
                      $divide: [
                        100000,

                        {
                          $add: [
                            "$distance",
                            1000
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            },

            {
              $sort: {
                score: -1
              }
            },

            {
              $limit:
                totalPlacesNeeded * 3
            }
          ]);

        allPlaces.push(...places);
      }

      if (!allPlaces.length) {

        return res.status(404).json({
          message:
            "No places found"
        });
      }

      const processedPlaces =
        await processPlaces(
          allPlaces
        );

      const uniquePlaces =
        Array.from(
          new Map(
            processedPlaces.map(
              (p) => [
                p._id.toString(),
                p
              ]
            )
          ).values()
        );

      const usablePlaces =
        uniquePlaces.length >=
        days * 2
          ? uniquePlaces
          : processedPlaces;

      const startLocation =
        cityDocs[0].location.coordinates;

      const route =
        buildRoute(
          usablePlaces,
          startLocation
        );

      const divided =
        divideIntoDays(
          route,
          Number(days),
          startDate
        );

      const finalPlan =
        addTimeSlots(divided);

      let savedItinerary =
        null;

      if (req.user) {

        savedItinerary =
          await Itinerary.create({
            user: req.user._id,

            city:
              cityDocs[0]._id,

            cityName:
              cityDocs[0].name,

            stateName:
              cityDocs[0].state,

            days,

            startDate,

            plan: finalPlan
          });
      }

      return res.status(200).json({
        success: true,

        city:
          cityDocs[0].name,

        cityName:
          cityDocs[0].name,

        stateName:
          cityDocs[0].state,

        totalPlaces:
          usablePlaces.length,

        days,

        startDate,

        itinerary:
          finalPlan,

        savedItineraryId:
          savedItinerary?._id ||
          null
      });
    }
  );