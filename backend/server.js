// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getShortGreeting } = require('./gemini.js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- VARIABEL PENTING ---
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Ganti dengan Voice ID dari akun ElevenLabs Anda.
// Anda bisa menemukannya di Voice Lab > pilih suara > klik 'Add to Voice Library' > klik ikon 'ID'
const VOICE_ID = 'JaUVfDrFcfwGIsv8X2kN'; // Contoh Voice ID untuk "Rachel"

app.use(cors());
app.use(express.json());

// Endpoint /greet -> Menghasilkan teks sapaan dari Gemini
app.get('/greet', async (req, res) => {
  console.log("Menerima permintaan ke /greet");
  try {
    const greetingText = await getShortGreeting();
    res.json({ text: greetingText });
  } catch (error) {
    console.error("Error di endpoint /greet:", error);
    res.status(500).json({ error: 'Gagal menghasilkan sapaan' });
  }
});

// Endpoint /speak -> Mengubah teks menjadi suara dengan ElevenLabs
app.post('/speak', async (req, res) => {
  const { text } = req.body;
  console.log(`Menerima permintaan ke /speak dengan teks: "${text}"`);

  if (!text) {
    return res.status(400).json({ error: 'Teks tidak boleh kosong' });
  }

  const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const headers = {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': ELEVENLABS_API_KEY,
  };
  const body = JSON.stringify({
    text: text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  });

  try {
    const response = await fetch(elevenLabsUrl, { method: 'POST', headers, body });
    if (!response.ok) {
      throw new Error(`Gagal mengambil audio: ${response.statusText}`);
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (error) {
    console.error("Error di endpoint /speak:", error);
    res.status(500).json({ error: 'Gagal menghasilkan audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});