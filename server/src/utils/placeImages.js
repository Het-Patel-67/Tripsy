import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

async function fetchPlaceImages(photos_link) {
  try {
    const res = await axios.get(photos_link, {
      params: { api_key: process.env.SERP_API_KEY }
    });

    return res.data.photos?.map(p => p.thumbnail) || [];
  } catch (err) {
    return [];
  }
}

export default fetchPlaceImages