const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an experienced startup pitch coach who has mentored founders.
When a user describes a business idea, analyze it and return a structured pitch analysis.
Before giving the full analysis, evaluate whether the idea description includes enough detail about:
- What the product/service does
- Who it's for
- How it makes money (or plans to)

If any of these are missing or unclear, you must ask 2-3 targeted clarifying questions. Do NOT guess or fill in gaps yourself.

If you DO have enough information, return the analysis.

You MUST always return a valid JSON object. 
If you need to ask clarifying questions, return this JSON format:
{
  "type": "questions",
  "questions": ["Question 1", "Question 2", "Question 3"]
}

If you have enough information and can provide the analysis, return this JSON format:
{
  "type": "analysis",
  "analysis": {
    "coreProblem": "1. Core Problem: Describe the specific pain point or gap in the market this idea addresses. Frame it from the customer's perspective. Be concrete — avoid vague language like 'people struggle with...'",
    "targetAudience": "2. Target Audience: Define the primary customer segment. Include: Who they are, Estimated market size if inferable, Why this group feels the problem most acutely.",
    "proposedSolution": "3. Proposed Solution: Summarize what the product/service does and what makes it different from existing alternatives. Identify the unique value proposition (UVP) in one sentence.",
    "leanPlan": [
      "Validation step (proving the problem exists)",
      "MVP step (smallest testable version of the solution)",
      "Traction step (first measurable sign of demand)"
    ],
    "vcQuestions": [
      {
        "question": "Question 1",
        "note": "Brief note on what the investor is probing for."
      },
      {
        "question": "Question 2",
        "note": "Brief note on what the investor is probing for."
      },
      {
        "question": "Question 3",
        "note": "Brief note on what the investor is probing for."
      }
    ]
  }
}

RULES:
- Be direct and honest. If the idea has a fundamental flaw, say so constructively in the analysis.
- Do not flatter or sugarcoat. Founders benefit from candor.
- Use plain language. Avoid startup jargon unless defining it.
- Keep the total analysis concise — aim for 400-600 words total across all sections.`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || idea.trim() === '') {
      return res.status(400).json({ error: "Idea description is required." });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: idea,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    const jsonParsed = JSON.parse(text);
    
    res.json(jsonParsed);
  } catch (error) {
    console.error("Error analyzing pitch:", error);
    res.status(500).json({ error: "Failed to analyze the pitch idea." });
  }
});

app.listen(port, () => {
  console.log(`Pitch analyzer app backend listening at http://localhost:${port}`);
});
