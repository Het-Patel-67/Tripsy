import axios from "axios"
import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
})

const url = "https://serpapi.com/search.json";

const apiKeys = [
  process.env.SERP_API_KEY,
  process.env.SERP_API_KEY2,
  process.env.SERP_API_KEY3,
].filter(Boolean); // removes undefined keys if not all are set


let currentKeyIndex = 0;

function getCurrentKey() {
  return apiKeys[currentKeyIndex];
}

function rotateKey() {
  currentKeyIndex++;
  if (currentKeyIndex >= apiKeys.length) {
    throw new Error("All SERP API keys have exceeded their limits.");
  }
  // console.warn(`Rotating to API key #${currentKeyIndex + 1}`);
  return apiKeys[currentKeyIndex];
}

// Wraps any axios call with automatic key rotation on rate-limit errors
async function fetchWithKeyRotation(buildParams) {
  let lastError = null;

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];

    try {
      const params = buildParams(apiKey);

      // console.log("\n==============================");
      // console.log(`🔑 Trying API Key #${i + 1}`);
      // console.log(`🔍 Query: ${params.q}`);
      // console.log("==============================");

      const response = await axios.get(url, {
        params,
        timeout: 30000,
      });

      // Some APIs return 200 with an error message
      if (response.data?.error) {
        console.log(
          `⚠️ API Key #${i + 1} returned error:`,
          response.data.error
        );

        const errorMessage = response.data.error.toLowerCase();

        const shouldRotate =
          errorMessage.includes("run out of searches") ||
          errorMessage.includes("rate limit") ||
          errorMessage.includes("quota");

        if (shouldRotate) {
          // console.log(`🔄 Rotating from Key #${i + 1} to next key`);
          continue;
        }

        throw new Error(response.data.error);
      }

      // console.log(`✅ Success using API Key #${i + 1}`);
      return response;
    } catch (error) {
      lastError = error;

      const status = error?.response?.status;
      const data = error?.response?.data;

      // console.log(`❌ Request failed using API Key #${i + 1}`);
      // console.log("Status:", status);
      // console.log("Response Data:", data);
      console.log("Message:", error.message);

      const apiError =
        data?.error ||
        data?.message ||
        error.message ||
        "";

      const shouldRotate =
        status === 429 ||
        status === 401 ||
        apiError.toLowerCase().includes("run out of searches") ||
        apiError.toLowerCase().includes("rate limit") ||
        apiError.toLowerCase().includes("quota");

      if (shouldRotate) {
        console.log(`🔄 Rotating from Key #${i + 1} to next key`);
        continue;
      }

      console.log("🚨 Non-rate-limit error detected");
      throw error;
    }
  }

  console.log("❌ All API keys exhausted");
  throw new Error("All SERP API keys have exceeded their limits.");
}

const attractionCategories = [
  { type: "tourist",    queries: ["best tourist attractions"] },
  { type: "nature",     queries: ["nature places", "waterfalls"] },
  { type: "historical", queries: ["historical places"] },
  { type: "spiritual",  queries: ["temples"] },
  { type: "adventure",  queries: ["adventure activities"] },
  { type: "wildlife",   queries: ["wildlife sanctuary"] },
  { type: "beach",      queries: ["beaches"] },
];

async function fetchHotels(city) {
  try {
    const response = await fetchWithKeyRotation((apiKey) => ({
      engine: "google_maps",
      q: `hotels in ${city}`,
      type: "search",
      api_key: apiKey,
    }));
    return response.data.local_results || [];
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    return [];
  }
}

async function fetchAttractions(city) {
  try {
    const requests = [];

    for (const category of attractionCategories) {
      for (const query of category.queries) {
        requests.push(
          fetchWithKeyRotation((apiKey) => ({
            engine: "google_maps",
            q: `${query} in ${city}`,
            type: "search",
            api_key: apiKey,
          })).then((res) => ({
            category: category.type,
            results: res.data.local_results || [],
          }))
        );
      }
    }

    const responses = await Promise.all(requests);
    const uniquePlaces = new Map();

    for (const response of responses) {
      for (const place of response.results) {
        const key = place.place_id || `${place.title}-${place.address}`;

        if (!uniquePlaces.has(key)) {
          uniquePlaces.set(key, { ...place, categories: [response.category] });
        } else {
          const existing = uniquePlaces.get(key);
          if (!existing.categories.includes(response.category)) {
            existing.categories.push(response.category);
          }
        }
      }
    }

    return Array.from(uniquePlaces.values());
  } catch (error) {
    console.error("Error fetching attractions:", error.message);
    return [];
  }
}

// async function fetchRestaurants(city) {
//   try {
//     const response = await fetchWithKeyRotation((apiKey) => ({
//       engine: "google_maps",
//       q: `restaurants in ${city}`,
//       api_key: apiKey,
//     }));
//     return response.data.local_results || [];
//   } catch (error) {
//     console.error("Error fetching restaurants:", error.message);
//     return [];
//   }
// }

export { fetchHotels, fetchAttractions };