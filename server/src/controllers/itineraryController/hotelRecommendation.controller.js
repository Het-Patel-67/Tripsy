import axios from "axios";
import Itinerary from "../../models/itinerary.model.js";
import Place from "../../models/place.model.js";
import { processPlaces } from "../../utils/processPlaces.js";

export const getHotelRecommendations = async (req, res) => {
  try {
    const { itineraryId, budget } = req.body;

    const validBudgets = ["low", "medium", "high"];
    if (!budget || !validBudgets.includes(budget.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid budget. Must be 'low', 'medium', or 'high'"
      });
    }

    const getBudgetRange = (budget) => {
      switch (budget.toLowerCase()) {
        case "low":
          return { min: 0, max: 50 };
        case "medium":
          return { min: 50, max: 150 };
        case "high":
          return { min: 150, max: Infinity };
        default:
          return { min: 0, max: Infinity };
      }
    };

    const { min, max } = getBudgetRange(budget);

    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const firstPlace = itinerary.plan[0]?.places[0];

    if (!firstPlace) {
      return res.status(400).json({ message: "Invalid itinerary" });
    }

    const coordinates = firstPlace.location.coordinates;

    // ✅ FETCH HOTELS
    const hotels = await Place.aggregate([
      {
        $geoNear: {
          key: "location",
          near: { type: "Point", coordinates },
          distanceField: "distance",
          spherical: true,
          query: {
            category: "hotel"
          }
        }
      },
      { $sort: { rating: -1, distance: 1 } },
      { $limit: 50 }
    ]);

    if (!hotels.length) {
      return res.status(404).json({ message: "No hotels found" });
    }

    // ✅ FILTER BY CITY (SAFE)
    const aggregatedHotels = hotels.filter(h => {
      if (!itinerary.city) return true;
      return h.city && h.city.toString() === itinerary.city.toString();
    });

    // ✅ SAFE PRICE PARSER
    const parsePrice = (price) => {
      if (!price) return null;

      if (typeof price === "number") return price;

      if (typeof price === "object") {
        if (price.extracted) return price.extracted;
        if (price.value) return price.value;
        return null;
      }

      const cleaned = String(price).replace(/[^0-9.]/g, "");
      const num = parseFloat(cleaned);

      return isNaN(num) ? null : num;
    };

    // ✅ ADD PARSED PRICE
    const hotelsWithPrice = aggregatedHotels.map(h => ({
      ...h,
      parsedPrice: parsePrice(h.price)
    }));

    // ✅ FILTER BY BUDGET
    let filteredHotels = hotelsWithPrice.filter(h => {
      if (h.parsedPrice === null) return true;
      return h.parsedPrice >= min && h.parsedPrice <= max;
    });

    // ✅ FALLBACK IF EMPTY
    if (!filteredHotels.length) {
      filteredHotels = hotelsWithPrice;
    }

    // ✅ SCORING
    const scoredHotels = filteredHotels.map(h => {
      const ratingScore = h.rating || 0;
      const distanceScore = 1 / (h.distance + 1);

      return {
        ...h,
        score: (ratingScore * 0.7) + (distanceScore * 0.3)
      };
    });

    scoredHotels.sort((a, b) => b.score - a.score);

    // ✅ TOP 8 HOTELS
    const finalHotels = scoredHotels.slice(0, 8).map(h => ({
      ...h,
      reason: `Best match for ${budget} budget`
    }));

    // ✅ PRICE CONVERSION
    const convertToINR = (price) => {
      const num = parsePrice(price);
      if (!num) return null;
      return `₹${Math.round(num * 83)}`;
    };

    const hotelsWithImages = await processPlaces(finalHotels);
    // STEP 3: Final formatting
    const formattedHotels = hotelsWithImages.map((h, index) => ({
      ...h,
      price: convertToINR(h.price),

      // ✅ SMART IMAGE HANDLING
      image:
        h.image
    }));

    // ============================================

    res.json({
      success: true,
      hotels: formattedHotels
    });

  } catch (err) {
    console.error("Hotel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};