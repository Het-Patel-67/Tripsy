import Itinerary from "../../models/itinerary.model.js";
import {asyncHandler} from "../../utils/asyncHandler.js";

export const removeItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const itinerary = await Itinerary.findByIdAndDelete(id);
    if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json({ message: "Itinerary removed successfully" });
});