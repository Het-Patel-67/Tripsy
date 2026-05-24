import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    // withCredentials no longer needed — auth is handled via Bearer token,
    // not cross-site cookies. Removing it avoids CORS preflight complications.
});

// Attach the JWT from localStorage to every outgoing request automatically.
// This runs before every API call, so the token is always fresh from storage.
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generateItinerary = (data) => API.post("/api/itinerary", data);

export const getItineraryById = (id) => API.get(`/api/itinerary/${id}`);

export const getMyItineraries = () => API.get("/api/itinerary/my-itineraries");

export const getHotelRecommendations = async (
    itinerary,
    budget,
    cityName,
    stateName
) => {
    try {
        const res = await API.post("/api/itinerary/hotel-recommendations", {
            itinerary,
            budget,
            cityName,
            stateName,
        });
 
        // The backend returns { success: true, hotels: [...] }.
        // Return the hotels array directly so callers can do:
        //   const hotels = await getHotelRecommendations(...)
        // instead of having to destructure res.hotels every time.
        return res.data.hotels;
    } catch (error) {
        console.error("Hotel API error:", error);
        throw error;
    }
};

export default API;