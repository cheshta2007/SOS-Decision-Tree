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
Additional context (user description/follow-ups): "${context}".

Respond ONLY with a valid JSON object in the following format:
{
  "severity": "High" | "Medium" | "Low",
  "immediateActions": ["Action 1", "Action 2", ...],
  "secondaryMeasures": ["Measure 1", "Measure 2", ...],
  "followUpQuestions": ["Question 1?"]
}

Guidelines:
1. Provide 3-5 highly actionable, short, life-saving "immediateActions".
2. Provide 2-3 "secondaryMeasures" for precautions/prevention.
3. Keep tokens concise. 
4. If follow-up questions are needed to clarify (e.g., "Is the person breathing?"), include them.
5. Do not use markdown backticks in the response.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Strip possible markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Attempt to find JSON if there's surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini API Error:", err);
    return getFallbackInstructions(emergencyType);
  }
}

function getFallbackInstructions(type) {
  const fallbacks = {
    "Fire": {
      "severity": "High",
      "immediateActions": ["Evacuate the area immediately", "Stay low to avoid smoke", "Call Fire Dept once safe"],
      "secondaryMeasures": ["Close doors behind you to contain fire", "Do not use elevators"],
      "followUpQuestions": ["Is anyone trapped?", "What floor are you on?"]
    },
    "Medical Emergency": {
      "severity": "High",
      "immediateActions": ["Check if the person is responsive", "Call for an ambulance", "Begin CPR if not breathing"],
      "secondaryMeasures": ["Keep the person warm", "Do not give them water"],
      "followUpQuestions": ["Is the person conscious?", "Are they bleeding?"]
    }
  };
  
  return fallbacks[type] || {
    "severity": "Medium",
    "immediateActions": ["Seek safety immediately", "Call emergency services", "Wait for professionals"],
    "secondaryMeasures": ["Stay calm and observe surroundings", "Warn others nearby"],
    "followUpQuestions": ["Where exactly are you?", "What do you see?"]
  };
}
