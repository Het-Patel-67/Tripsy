import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


export const generateItinerary = (data) =>
  API.post("/api/itinerary", data);

// ✅ GET
export const getItineraryById = (id) =>
  API.get(`/api/itinerary/${id}`);

// ✅ ADD
export const addPlace = (data) =>
  API.post("/api/itinerary/add-place", data);

// ✅ REMOVE
export const removePlace = (data) =>
  API.delete("/api/itinerary/remove-place", { data });

// ✅ REPLACE
export const replacePlace = (data) =>
  API.put("/api/itinerary/replace-place", data);

// ✅ NEARBY
export const getNearby = (lat, lng) =>
  API.get(`/api/itinerary/nearby-suggestions?lat=${lat}&lng=${lng}`);

export const getHotelRecommendations = async (
  itineraryId,
  budget
) => {
  try {
    const res = await API.post(
      "/api/itinerary/hotel-recommendations",
      { itineraryId, budget },
      {
        withCredentials: true
      }
    );

    return res.data;
  } catch (error) {
    console.error("Hotel API error:", error);
    throw error;
  }
};

export default API;