import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Place from "../models/place.model.js";
import City from "../models/city.model.js";
import { processPlaces } from "../utils/processPlaces.js";

const destinationApi = asyncHandler(async (req, res) => {
  const city = req.params.city;
  const cityDoc = await City.findOne({ name: city });

  if (!cityDoc) {
    throw new ApiError(404, "City not found");
  }
  const places = await Place.find({ city: cityDoc._id }).lean();
  const processed = processPlaces(places);
  
  if (!processed || processed.length === 0) {
    throw new ApiError(404, "No places found for the specified city");
  }

  res.json(new ApiResponse(200, {
    city,
    total: processed.length,
    places: processed
  }));
})

export default destinationApi