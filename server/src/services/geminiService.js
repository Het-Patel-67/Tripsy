import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 Chunk helper (batching)
function chunkArray(arr, size = 10) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

// 🔹 Generate descriptions in batches
export async function generateDescriptionsBatch(places = []) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7
            }
        });

        const batches = chunkArray(places, 10);
        let finalResults = [];

        for (const batch of batches) {
            const prompt = `
        Write a short 2-line tourist-friendly description for each place.

        Each description MUST include:
        - what the place is famous for
        - key highlight

        Keep it concise and engaging.

        Return ONLY JSON:
        [
        { "name": "place name", "description": "text" }
        ]

        Places:
        ${batch.map(p => `${p.name} (${p.cityName})`).join("\n")}
        `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            try {
                const parsed = JSON.parse(text);
                finalResults.push(...parsed);
            } catch (err) {
                console.error("❌ JSON parse failed:", text);
            }
        }

        return finalResults;

    } catch (error) {
        console.error("Gemini error:", error);
        return [];
    }
}