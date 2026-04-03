import Place from "../../models/place.model.js";
import Itinerary from "../../models/itinerary.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addPlaceToItinerary = asyncHandler(async (req, res) => {
  
    const { itineraryId, day, placeId } = req.body;
    const itinerary = await Itinerary.findById(itineraryId);
    const place = await Place.findById(placeId);

    if (!itinerary || !place) {
      return res.status(404).json({ message: "Not found" });
    }

    const dayPlan = itinerary.plan.find(d => d.day === day);

    if (!dayPlan) {
      return res.status(404).json({ message: "Day not found" });
    }

    // Prevent duplicates
    const exists = dayPlan.places.some(
      p => p.placeId.toString() === placeId
    );

    if (exists) {
      return res.status(400).json({
        message: "Place already exists in itinerary"
      });
    }

    dayPlan.places.push({
      placeId: place._id,
      name: place.name,
      category: place.category,
      location: place.location,
      time: "custom"
    });

    await itinerary.save();

    res.json({ success: true, itinerary });
   
});