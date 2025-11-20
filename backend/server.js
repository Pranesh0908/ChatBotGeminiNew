const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ===================== API ROUTE ======================
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ reply });
  } catch (err) {
    console.error('Error fetching Gemini API:', err.message);
    res.status(500).json({ reply: 'Error fetching response from Gemini API' });
  }
});

// ================== SERVE REACT FRONTEND ==================
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ===================== START SERVER ======================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
