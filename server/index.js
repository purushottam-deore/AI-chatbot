// 1. Imports
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// 2. Initialize App
const app = express();
app.use(cors());
app.use(express.json());

// 3. Initialize Gemini
// Ensure your .env file has GEMINI_API_KEY=your_key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("--- YOUR AVAILABLE MODELS ---");
    if (data.models) {
      data.models.forEach(m => console.log(m.name.replace('models/', '')));
    } else {
      console.log("No models found. Check if your API key is correct.");
    }
    console.log("------------------------------");
  } catch (err) {
    console.error("Could not list models:", err);
  }
}
checkModels();

// 4. The Route (Where your error was)
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // Try using 'gemini-1.5-flash-latest' first
    // Update this line inside your app.post
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContentStream(prompt);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    res.end();
  } catch (error) {
    console.error("Error details:", error);
    // If it's still 404, the server will send the message to the frontend
    res.status(500).json({ error: "Model not found or API error. Check server console." });
  }
});

// 5. Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});