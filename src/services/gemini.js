import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let model = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function getEmergencyInstructions(emergencyType, context = "") {
  if (!model) {
    console.warn("Gemini API key is missing. Returning fallback mock data.");
    return getFallbackInstructions(emergencyType);
  }

  const prompt = `You are an emergency response AI designed for the "Critical First 60 Seconds" of an incident. 
The emergency is: "${emergencyType}".
Additional context from user: "${context}".

Respond ONLY with a JSON array of string steps. Give exactly 3 to 5 highly actionable, short, life-saving steps. Format them clearly. Do not use markdown backticks in the response text itself (just the raw JSON string).
Example: ["Check for breathing", "Call for help immediately", "Apply firm pressure to the wound"]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return getFallbackInstructions(emergencyType);
  }
}

function getFallbackInstructions(type) {
  const fallbacks = {
    "Fire": ["Evacuate the area immediately", "Stay low to avoid smoke", "Call 911 or Fire Dept once safe"],
    "Medical Emergency": ["Check if the person is responsive", "Call for an ambulance", "Begin CPR if not breathing"],
    "Accident": ["Ensure your own safety first", "Do not move the injured unless in immediate danger", "Call emergency services"],
    "Flood": ["Move to higher ground immediately", "Do not walk or drive through flood waters", "Wait for rescue services"],
    "Crime": ["Move to a safe location", "Do not confront the attacker", "Call police and provide a description"]
  };
  return fallbacks[type] || ["Seek safety immediately", "Call emergency services", "Wait for professionals"];
}
