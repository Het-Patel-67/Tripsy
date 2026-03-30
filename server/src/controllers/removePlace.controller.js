import Itinerary from "../models/itinerary.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const removePlaceFromItinerary = asyncHandler(async (req, res) => {
  const { itineraryId, day, placeId } = req.body;

    const itinerary = await Itinerary.findById(itineraryId);

    const dayPlan = itinerary.plan.find(d => d.day === day);

    dayPlan.places = dayPlan.places.filter(
      p => p.placeId.toString() !== placeId
    );

    await itinerary.save();

    res.json({ success: true, itinerary });
})