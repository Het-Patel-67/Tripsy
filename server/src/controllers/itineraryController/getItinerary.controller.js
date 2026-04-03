import { asyncHandler } from "../../utils/asyncHandler.js";
import Itinerary from "../../models/itinerary.model.js";

export const getItineraryById = asyncHandler (async (req, res) => {
    const { id } = req.params;

    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({ message: "Not found" });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(itinerary);
});