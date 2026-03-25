import axios from "axios";

// 🔹 Batch helper
function chunkArray(arr, size = 3) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export async function generateDescriptionsBatch(places = []) {
  try {
    const batches = chunkArray(places, 3);
    let finalResults = [];

    for (const batch of batches) {

      const prompt = `
Write a short, engaging 2-line travel description for each place.
Mention what the place is famous for, key highlights, and overall vibe.

Return ONLY JSON:
[
 {"name":"place","description":"text"}
]

Places:
${batch.map(p => p.name).join("\n")}
`;

      let parsed = [];

      try {
        const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  }
);

        const text =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // 🔹 Clean JSON
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");

        const cleanText =
          start !== -1 && end !== -1
            ? text.substring(start, end + 1)
            : text;

        parsed = JSON.parse(cleanText);

      } catch (err) {
        console.error("❌ Gemini REST Error:", err.response?.data || err.message);

        parsed = batch.map(p => ({
          name: p.name,
          description: "A popular tourist destination famous for its attractions."
        }));
      }

      finalResults.push(...parsed);
    }

    return finalResults;

  } catch (error) {
    console.error("Gemini error:", error);
    return [];
  }
}