import axios from "axios";
import { useEffect, useState } from "react";
import { getLocalFallbackImage } from "../../src/utils/getLocalFallbackImage.js";

function Hotel() {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [hotels, setHotels] = useState([]);
  const [city, setCities] = useState("Ahmedabad");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await axios.get(
          `${VITE_URL}/api/destination/${city}`
        );

        const places = res.data.data.places;

        const hotelPlaces = Array.isArray(places) ? places.filter(
          (place) =>
            place.category?.toLowerCase().trim() === "hotel" || place.category?.toLowerCase().trim() === "resort"
        ) : [];
        console.log("Hotel images:", hotelPlaces);
        setHotels(hotelPlaces);
      } catch (error) {
        console.error("Error fetching places: ", error);
      }
    };

    fetchApi();
  }, [city]);

  return (
    <>
      <h1>Hotels</h1>

      {hotels.length === 0 && <p>No hotels found</p>}

      <div>
        {hotels.map((hotel, index) => (
          <div key={hotel._id}>
            <img
              src={
                hotel.image && hotel.image.trim() !== ""
                  ? hotel.image
                  : getLocalFallbackImage(hotel, index)
              }
              alt={hotel.name}
              onError={(e) => {
                if (!e.target.dataset.fallbackApplied) {
                  e.target.dataset.fallbackApplied = "true";
                  e.target.src = getLocalFallbackImage(hotel, index);
                }
              }}
            
              className="w-full max-w-100 h-62.5 object-cover"
            />
            <h2>{hotel.name}</h2>
            <p>{hotel.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Hotel;