import { asyncHandler } from "../utils/asyncHandler.js"
import Place from "../models/place.model.js";

const destinationApi = asyncHandler(async (req, res) => {
  const city = req.params.city;

  const places = await Place.find({ city });

  res.json({
    city,
    total: places.length,
    places
  });
})

export default destinationApi