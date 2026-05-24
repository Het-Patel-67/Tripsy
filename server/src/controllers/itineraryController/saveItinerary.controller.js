import Itinerary from "../../models/itinerary.model.js";

import { asyncHandler }
from "../../utils/asyncHandler.js";

export const saveItinerary =
  asyncHandler(async (req, res) => {

    const {
      cityName,
      stateName,
      days,
      startDate,
      itinerary
    } = req.body;

    if (
      !cityName ||
      !days ||
      !startDate ||
      !itinerary
    ) {

      return res.status(400).json({
        message:
          "Missing required fields"
      });
    }

    // Prevent accidental duplicate save
    const daysNum = Number(days);
    const existing =
      await Itinerary.findOne({
        user: req.user._id,
        cityName,
        startDate,
        days: daysNum
      });

    if (existing) {

      return res.status(400).json({
        message:
          "Itinerary already saved"
      });
    }

    const saved =
      await Itinerary.create({

        user: req.user._id,

        cityName,

        stateName,

        days: daysNum,

        startDate,

        plan: itinerary
      });

    res.status(201).json({

      success: true,

      itinerary: saved
    });
});