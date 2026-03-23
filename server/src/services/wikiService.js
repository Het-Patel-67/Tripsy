import axios from "axios";
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

export default async function fetchWikiDescription(placeName) {
  try {
    // Step 1: search correct title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(placeName)}&format=json`;

    const searchRes = await axios.get(searchUrl, {
      headers: {
        "User-Agent": process.env.USER_AGENT
      }
    });

    const title = searchRes.data.query.search[0]?.title;

    if (!title) return "";

    // Step 2: get summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    const summaryRes = await axios.get(summaryUrl, {
      headers: {
        "User-Agent": process.env.USER_AGENT
      }
    });

    return summaryRes.data.extract || "";

  } catch (error) {
    return "";
  }
}