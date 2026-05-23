import Place from "../../models/place.model.js";
import { processPlaces } from "../../utils/processPlaces.js";

export const getHotelRecommendations = async (req, res) => {
  try {
    const { itinerary, budget, cityName, stateName } = req.body;

    const validBudgets = ["low", "medium", "high"];

    if (!budget || !validBudgets.includes(budget.toLowerCase())) {
      return res.status(400).json({ message: "Invalid budget" });
    }

    if (!itinerary || !itinerary.length) {
      return res.status(400).json({ message: "Itinerary required" });
    }

    const getBudgetRange = (budget) => {
      switch (budget.toLowerCase()) {
        case "low":    return { min: 0,   max: 50  };
        case "medium": return { min: 50,  max: 150 };
        case "high":   return { min: 150, max: Infinity };
        default:       return { min: 0,   max: Infinity };
      }
    };

    const { min, max } = getBudgetRange(budget);

    const firstPlace = itinerary[0]?.places?.[0];
    if (!firstPlace) {
      return res.status(400).json({ message: "Invalid itinerary" });
    }

    const coordinates = firstPlace.location.coordinates;

    const hotels = await Place.aggregate([
      {
        $geoNear: {
          key: "location",
          near: { type: "Point", coordinates },
          distanceField: "distance",
          spherical: true,
          query: { category: "hotel" },
        },
      },
      { $sort: { rating: -1, distance: 1 } },
      { $limit: 50 },
    ]);

    if (!hotels.length) {
      return res.status(404).json({ message: "No hotels found" });
    }


    const cityMatches = hotels.filter(
      (h) =>
        h.cityName &&
        cityName &&
        h.cityName.toLowerCase() === cityName.toLowerCase()
    );

    // Use city-level matches if any exist; only fall back to state if the
    // searched city genuinely has no hotels stored under that cityName.
    const filteredByLocation =
      cityMatches.length > 0
        ? cityMatches
        : hotels.filter(
            (h) =>
              h.stateName &&
              stateName &&
              h.stateName.toLowerCase() === stateName.toLowerCase()
          );

    const parsePrice = (price) => {
      if (!price) return null;
      if (typeof price === "number") return price;
      if (typeof price === "object") {
        if (price.extracted) return price.extracted;
        if (price.value)     return price.value;
        return null;
      }
      const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
      return isNaN(num) ? null : num;
    };

    const hotelsWithPrice = filteredByLocation.map((h) => ({
      ...h,
      parsedPrice: parsePrice(h.price),
    }));

    // ── Budget filtering ──────────────────────────────────────────────────────

    let filteredHotels = hotelsWithPrice.filter((h) => {
      // Hotels with no price info pass through (can't know their budget tier)
      if (h.parsedPrice === null) return true;
      return h.parsedPrice >= min && h.parsedPrice <= max;
    });

    // If budget filter wiped everything, relax it and use all location matches
    if (!filteredHotels.length) {
      filteredHotels = hotelsWithPrice;
    }

    // ── Score + rank ──────────────────────────────────────────────────────────

    const scoredHotels = filteredHotels
      .map((h) => ({
        ...h,
        score: (h.rating || 0) * 0.7 + (1 / (h.distance + 1)) * 0.3,
      }))
      .sort((a, b) => b.score - a.score);

    const finalHotels = scoredHotels
      .slice(0, 10)
      .map((h) => ({ ...h, reason: `Best match for ${budget} budget` }));

    // ── Format + respond ──────────────────────────────────────────────────────

    const convertToINR = (price) => {
      const num = parsePrice(price);
      if (!num) return null;
      return `₹${Math.round(num * 83)}`;
    };

    const hotelsWithImages = await processPlaces(finalHotels);

    const formattedHotels = hotelsWithImages.map((h) => ({
      ...h,
      price: convertToINR(h.price),
      image: h.image,
    }));

    res.json({ success: true, hotels: formattedHotels });

  } catch (err) {
    console.error("Hotel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};