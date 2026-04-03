import { asyncHandler } from "../../utils/asyncHandler.js";
import Itinerary from "../../models/itinerary.model.js";
import Place from "../../models/place.model.js";

export const replacePlaceInItinerary = asyncHandler(async (req, res) => {
    const { itineraryId, day, oldPlaceId, newPlaceId } = req.body;

    const itinerary = await Itinerary.findById(itineraryId);
    const newPlace = await Place.findById(newPlaceId);

    const dayPlan = itinerary.plan.find(d => d.day === day);

    const index = dayPlan.places.findIndex(
      p => p.placeId.toString() === oldPlaceId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Place not found" });
    }

    dayPlan.places[index] = {
      placeId: newPlace._id,
      name: newPlace.name,
      category: newPlace.category,
      location: newPlace.location,
      time: dayPlan.places[index].time 
    };

    await itinerary.save();

    res.json({ success: true, itinerary });

  
});