function mapCategory(place, fallbackCategory) {

  const text = (place.title + " " + (place.type || "")).toLowerCase();

  // 🏨 Hotels
  if (fallbackCategory === "hotel") return "hotel";

  // 🍽 Restaurants
  if (fallbackCategory === "restaurant") return "restaurant";

   if (text.includes("park") || text.includes("garden") || text.includes("lake") || text.includes("waterfall")) {
        return "nature";
    }

    // 🏛️ Historical
    if (text.includes("fort") || text.includes("heritage") || text.includes("monument") || text.includes("palace")) {
        return "historical";
    }

    // 🎭 Cultural
    if (text.includes("museum") || text.includes("art") || text.includes("gallery")) {
        return "cultural";
    }

    // 🛕 Religious
    if (text.includes("temple") || text.includes("mosque") || text.includes("church")) {
        return "religious";
    }

    // 🧗 Adventure
    if (text.includes("trek") || text.includes("camp") || text.includes("adventure")) {
        return "adventure";
    }

    // 🎢 Entertainment
    if (text.includes("amusement") || text.includes("water park") || text.includes("theme park")) {
        return "entertainment";
    }

    // 🍽️ Food
    if (text.includes("restaurant") || text.includes("cafe") || text.includes("food")) {
        return "food";
    }

    // 🛍️ Shopping
    if (text.includes("market") || text.includes("mall")) {
        return "shopping";
    }

    // 🏨 Stay
    if (text.includes("hotel") || text.includes("resort")) {
        return "stay";
    }

    // Beach
    if (text.includes("beach")) {
        return "beach";
    }

    // Mountain
    if (text.includes("mountain")) {
        return "mountain";
    }

  return "tourist";
}

function extractPrice(priceStr) {

  if (!priceStr) return null;

  const num = priceStr.replace(/[^0-9]/g, "");

  return Number(num) || null;
}

export { mapCategory, extractPrice };