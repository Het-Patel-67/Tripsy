import Place from "../models/place.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNearbyPlaces = asyncHandler(async (req, res) => {
 
    const { lat, lng, category } = req.query;

    const places = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "distance",
          spherical: true
        }
      },
      {
        $match: {
          ...(category && { category })
        }
      },
      {
        $limit: 10
      }
    ]);

    res.json(places);

  
});