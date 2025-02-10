import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const CODESTRAL_API_URL = "https://codestral.mistral.ai/v1/chat/completions";
const API_KEY = process.env.CODESTRAL_API_KEY; // Store API key in .env

if (!API_KEY) {
  console.error(
    "API key is missing. Please set the CODESTRAL_API_KEY in your .env file."
  );
  process.exit(1);
}

console.log(API_KEY);

console.log("API Key loaded:", API_KEY);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      CODESTRAL_API_URL,
      {
        model: "codestral-latest", // ✅ Correct model name
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply =
      response.data.choices[0]?.message?.content ||
      "Sorry, I couldn't process that.";
    res.json({ botReply });
  } catch (error) {
    console.error(
      "🔥 Error with Codestral API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to get response from Codestral API.",
      details: error.response?.data || error.message, // Send error details in response
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
