// backend/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini dengan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getShortGreeting() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Mendapatkan jam saat ini dalam zona waktu Asia/Jakarta (WIB)
  const now = new Date();
  const hour = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta", hour: '2-digit', hour12: false });

  let timeOfDay;
  if (hour >= 4 && hour < 11) {
    timeOfDay = "pagi";
  } else if (hour >= 11 && hour < 15) {
    timeOfDay = "siang";
  } else if (hour >= 15 && hour < 19) {
    timeOfDay = "sore";
  } else {
    timeOfDay = "malam";
  }

  const prompt = `Buat sapaan super singkat untuk waktu ${timeOfDay} dalam bahasa Indonesia, maksimal 6 kata. Contoh: 'Selamat pagi, ada yang bisa dibantu?'`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Halo, ada yang salah dengan koneksi AI.";
  }
}

module.exports = { getShortGreeting };