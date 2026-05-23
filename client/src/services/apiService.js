import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const generateItinerary = (data) =>
  API.post("/api/itinerary", data);

export const getItineraryById = (id) =>
  API.get(`/api/itinerary/${id}`);

export const getMyItineraries = () =>
  API.get("/api/itinerary/my-itineraries");

export const getHotelRecommendations = async (
  itinerary, budget, cityName, stateName
) => {
  try {
    const res = await API.post(
      "/api/itinerary/hotel-recommendations",
      {
        itinerary,
        budget,
        cityName: cityName,
        stateName: stateName
      },
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
 

export default API ;