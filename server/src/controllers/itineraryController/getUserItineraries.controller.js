import Itinerary
from "../../models/itinerary.model.js";

import { asyncHandler }
from "../../utils/asyncHandler.js";

export const getUserItineraries =
  asyncHandler(async (req, res) => {

    const itineraries =
      await Itinerary.find({
        user: req.user._id
      })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      itineraries
    });
});