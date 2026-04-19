const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDlvotBZuMXr-RISar-ioC02uwphzZVGmE"; // The user's provided key
const genAI = new GoogleGenerativeAI(API_KEY);

async function checkModels() {
  try {
    // There is no explicit listModels method in the JS SDK? 
    // Actually, according to google REST docs:
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
    } else {
      console.log("No models array found:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

checkModels();
