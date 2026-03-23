import axios from "axios"
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})
const SERP_API_KEY = process.env.SERP_API_KEY;
const url = "https://serpapi.com/search.json"

async function fetchHotels(city) {

  try {
    const response = await axios.get( url, {
      params: {
        engine: "google_maps",
        q: `hotels in ${city}`,
        type: "search",
        api_key: SERP_API_KEY
      }
    });
  
    return response.data.local_results;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
}
async function fetchAttractions(city){
  
  try {
    const response  = await axios.get(url,{
      params: {
        engine: "google_maps",
        q: `tourist attractions in ${city}`,
        type: "search",
        api_key: SERP_API_KEY
      }
    })
     
     return response.data.local_results;
  } catch (error) {
    console.error("Error fetching attractions:", error);
    return [];
  }
}
async function fetchRestaurants(city) {

  try {
      const response = await axios.get(url, {
        params: {
          engine: "google_maps",
          q: `restaurants in ${city}`,
          api_key: SERP_API_KEY
        }
      });
      
      return response.data.local_results || [];

  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}


export { fetchHotels, fetchRestaurants, fetchAttractions };