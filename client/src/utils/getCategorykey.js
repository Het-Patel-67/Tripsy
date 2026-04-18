export const getCategoryKey = (place) => {
    const types = place.types || [];
    const name = place.name?.toLowerCase() || "";
    const category = place.category?.toLowerCase().trim() || "";

    if (
        category === "hotel" ||
        category === "resort" ||
        types.includes("lodging") ||
        name.includes("hotel")
    ) {
        return "hotel";
    }

    if (types.includes("restaurant") || name.includes("restaurant") || category === "restaurant") {
        return "restaurant";
    }

    if (types.includes("tourist_attraction") || name.includes("tourist")) {
        return "tourist";
    }
    if (
        types.includes("amusement_park") ||
        name.includes("adventure") ||
        name.includes("zipline") ||
        name.includes("rafting")
    ) {
        return "adventure";
    }

    if (
        types.includes("natural_feature") ||
        name.includes("nature") ||
        name.includes("falls") ||
        name.includes("forest") ||
        name.includes("garden")
    ) {
        return "nature";
    }

    if (
        types.includes("museum") ||
        types.includes("art_gallery") ||
        name.includes("museum") ||
        name.includes("gallery") ||
        name.includes("cultural")
    ) {
        return "cultural";
    }

    if (
        types.includes("historic_site") ||
        types.includes("fort") ||
        name.includes("historic") ||
        name.includes("history") ||
        name.includes("monument")
    ) {
        return "historical";
    }

    if (
        types.includes("place_of_worship") ||
        types.includes("church") ||
        types.includes("mosque") ||
        name.includes("temple") ||
        name.includes("church") ||
        name.includes("mosque") ||
        name.includes("cathedral")
    ) {
        return "religious";
    }

    if (
        types.includes("night_club") ||
        types.includes("movie_theater") ||
        types.includes("bowling_alley") ||
        name.includes("entertainment") ||
        name.includes("theater") ||
        name.includes("concert")
    ) {
        return "entertainment";
    }

    if (
        types.includes("bakery") ||
        types.includes("cafe") ||
        types.includes("meal_takeaway") ||
        types.includes("meal_delivery") ||
        name.includes("food") ||
        name.includes("diner") ||
        name.includes("bakery")
    ) {
        return "food";
    }

    if (
        types.includes("shopping_mall") ||
        types.includes("clothing_store") ||
        types.includes("shoe_store") ||
        types.includes("jewelry_store") ||
        name.includes("shopping") ||
        name.includes("mall") ||
        name.includes("market")
    ) {
        return "shopping";
    }

    if (
        types.includes("resort") ||
        types.includes("guest_house") ||
        types.includes("apartment_hotel") ||
        name.includes("stay") ||
        name.includes("villa") ||
        name.includes("guesthouse")
    ) {
        return "stay";
    }

    if (
        types.includes("beach") ||
        types.includes("marina") ||
        name.includes("beach") ||
        name.includes("coast") ||
        name.includes("shore")
    ) {
        return "beach";
    }

    if (
        types.includes("mountain") ||
        types.includes("hiking") ||
        types.includes("ski_resort") ||
        name.includes("mountain") ||
        name.includes("alpine") ||
        name.includes("peak")
    ) {
        return "mountain";
    }
    return "default";
};