const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function getSystemInstruction(pitchType) {
  let roleContext, evaluationCriteria, fieldDescriptions;
  
  if (pitchType === 'career') {
    roleContext = "You are an elite career coach and executive recruiter who has prepared candidates for rigorous interviews.";
    evaluationCriteria = "- Professional Background\\n- Goal / Role Applied For\\n- Key Impacts or Value Proposition";
    fieldDescriptions = {
      coreProblem: "1. Core Narrative: Describe the primary career objective or the gap the candidate is trying to fill. Focus on their 'why'.",
      targetAudience: "2. Target Employer: Define the target company or hiring manager. Why is this candidate a good fit for them?",
      proposedSolution: "3. Value Proposition: Summarize the candidate's unique strengths and how they solve the employer's needs.",
      leanPlan: [
        "Immediate Action step (e.g., tailoring resume)",
        "Networking/Outreach step",
        "Interview Preparation focus"
      ],
      vcQuestionsNote: "Brief note on what the interviewer is probing for."
    };
  } else if (pitchType === 'academic') {
    roleContext = "You are an experienced academic advisor and conference reviewer.";
    evaluationCriteria = "- Research Problem or Topic\\n- Methodology\\n- Potential Impact or Findings";
    fieldDescriptions = {
      coreProblem: "1. Research Gap: Describe the specific gap in current literature or problem being addressed.",
      targetAudience: "2. Audience Context: Define who this research is for (e.g., thesis committee, conference) and why they care.",
      proposedSolution: "3. Methodology & Findings: Summarize how the problem is studied and the core contributions.",
      leanPlan: [
        "Literature Review step",
        "Data Collection / Analysis step",
        "Publication / Defense step"
      ],
      vcQuestionsNote: "Brief note on what the committee member is probing for."
    };
  } else {
    // startup
    roleContext = "You are an experienced startup pitch coach who has mentored founders.";
    evaluationCriteria = "- What the product/service does\\n- Who it's for\\n- How it makes money (or plans to)";
    fieldDescriptions = {
      coreProblem: "1. Core Problem: Describe the specific pain point or gap in the market this idea addresses. Frame it from the customer's perspective. Be concrete — avoid vague language like 'people struggle with...'",
      targetAudience: "2. Target Audience: Define the primary customer segment. Include: Who they are, Estimated market size if inferable, Why this group feels the problem most acutely.",
      proposedSolution: "3. Proposed Solution: Summarize what the product/service does and what makes it different from existing alternatives. Identify the unique value proposition (UVP) in one sentence.",
      leanPlan: [
        "Validation step (proving the problem exists)",
        "MVP step (smallest testable version of the solution)",
        "Traction step (first measurable sign of demand)"
      ],
      vcQuestionsNote: "Brief note on what the investor is probing for."
    };
  }

  return `${roleContext}
When a user describes a pitch idea, analyze it and return a structured pitch analysis.
Before giving the full analysis, evaluate whether the description includes enough detail about:
${evaluationCriteria}

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
    "coreProblem": "${fieldDescriptions.coreProblem}",
    "targetAudience": "${fieldDescriptions.targetAudience}",
    "proposedSolution": "${fieldDescriptions.proposedSolution}",
    "leanPlan": ${JSON.stringify(fieldDescriptions.leanPlan)},
    "vcQuestions": [
      {
        "question": "Question 1",
        "note": "${fieldDescriptions.vcQuestionsNote}"
      },
      {
        "question": "Question 2",
        "note": "${fieldDescriptions.vcQuestionsNote}"
      },
      {
        "question": "Question 3",
        "note": "${fieldDescriptions.vcQuestionsNote}"
      }
    ]
  }
}

RULES:
- Be direct and honest. If the idea has a fundamental flaw, say so constructively in the analysis.
- Do not flatter or sugarcoat.
- Use plain language. Avoid jargon unless defining it.
- Keep the total analysis concise — aim for 400-600 words total across all sections.`;
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { idea, pitchType } = req.body;

    if (!idea || idea.trim() === '') {
      return res.status(400).json({ error: "Idea description is required." });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: idea,
      config: {
        systemInstruction: getSystemInstruction(pitchType || 'startup'),
        responseMimeType: "application/json",
      }
    });

    let text = response.text.trim();

    // Strip out markdown formatting if Gemini wrapped the JSON response in ```json ... ```
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    }

    const jsonParsed = JSON.parse(text);

    res.json(jsonParsed);
  } catch (error) {
    console.error("Error analyzing pitch:", error);
    res.status(500).json({ error: "Failed to analyze the pitch idea." });
  }
});

function getDeliveryCritiquePrompt(pitchType) {
  let roleContext, weakLanguageExamples;
  
  if (pitchType === 'career') {
    roleContext = "You are an elite executive interview coach who prepares candidates for top-tier hiring panels. You analyze HOW candidates speak, not just what they say.";
    weakLanguageExamples = '"I think", "maybe", "sort of", "kind of", "hopefully", "we were trying to", "I guess"';
  } else if (pitchType === 'academic') {
    roleContext = "You are an elite academic speaking coach who prepares PhDs for thesis defenses and major symposiums. You analyze HOW researchers speak, not just what they say.";
    weakLanguageExamples = '"I think", "maybe", "sort of", "we hope to show", "potentially"';
  } else {
    // startup
    roleContext = `You are an elite pitch delivery coach who has prepared 
founders for Y Combinator Demo Day, Sequoia pitch meetings, and Andreessen Horowitz 
partner presentations. You analyze HOW founders speak, not just what they say.`;
    weakLanguageExamples = '"I think", "maybe", "sort of", "kind of", "hopefully", "we are trying to", "we want to", "pretty much"';
  }

  return `${roleContext}

You receive a speaker's spoken pitch (transcribed from audio) and real-time speech 
analytics captured during their delivery.

=== SPEECH TRANSCRIPT ===
${transcript}

=== DELIVERY METRICS ===
- Total words spoken: ${metrics.totalWords}
- Speaking duration: ${metrics.durationInSeconds} seconds
- Speaking pace: ${metrics.wordsPerMinute} words per minute
- Total filler words detected: ${metrics.totalFillers} (${metrics.fillerPercentage}% of speech)
- Filler word breakdown: ${JSON.stringify(metrics.fillerCounts)}
- Stuttered words (repeated back-to-back): ${metrics.repeatedWords && metrics.repeatedWords.length > 0 ? metrics.repeatedWords.join(', ') : 'None detected'}
- Repeated phrases: ${metrics.repeatedPhrases && metrics.repeatedPhrases.length > 0 ? metrics.repeatedPhrases.join('; ') : 'None detected'}

=== INSTRUCTIONS ===

Analyze this founder's DELIVERY and provide a brutally honest but constructive critique. 
You are coaching them the night before Demo Day. Be specific — reference their exact 
words from the transcript. Never give generic advice.

Respond in this exact structure:

**DELIVERY SCORE: X/10**
One sentence justifying the score. Most first attempts are 4-6. A 10 means 
investor-ready. Be honest, not kind.

**FILLER WORDS**
- List every filler word they used with its count
- Explain what each filler signals to investors (e.g., "um" = uncertainty, 
  "like" = lack of precision, "you know" = assuming shared context, 
  "basically" = oversimplifying or nervousness, "so" = stalling for time)
- If filler percentage exceeds 5%, flag it as a serious problem
- Give one specific elimination technique per filler 
  (e.g., "Replace every 'um' with a silent 1-second pause. Silence sounds 
  confident. 'Um' sounds lost.")

**STUTTERING & REPETITION**
- Call out every instance of back-to-back repeated words from the transcript 
  (e.g., "we we", "the the") — these signal nervousness
- Identify repeated phrases where they said the same idea twice in different words — 
  this signals they do not trust the audience understood them the first time
- Rate their confidence: HIGH / MEDIUM / LOW and explain why

**PACING**
- Evaluate their words-per-minute: below 120 = too slow and boring, 
  120-150 = conversational and confident, 150-180 = slightly rushed, 
  above 180 = racing through nerves
- Did they cover the right amount of content for their duration?
- Identify if they likely spoke in one continuous stream (no pauses) or 
  used strategic pauses — and coach them on which moments needed a pause

**WEAK LANGUAGE**
- Find every hedge word or phrase: ${weakLanguageExamples}
- Explain why each one kills credibility
- Provide a power replacement for each 

**TOP 3 FIXES**
List exactly 3 things to fix before their next attempt. For each:
1. The problem (with a direct quote from their transcript)
2. Why investors care
3. A concrete 2-minute practice drill they can do right now

**WHAT WORKED**
Identify 1-2 genuine strengths in their delivery. If nothing stood out, say: 
"No clear delivery strengths yet — that is normal for a first take. They will 
come with repetition."

Remember: every sentence of your feedback must reference something specific from 
their transcript or metrics. Zero generic advice.`;
}

// Build the prompt by literally replacing placeholders since the prompt is a string template
function buildDeliveryPrompt(transcript, metrics, pitchType) {
  let promptText = getDeliveryCritiquePrompt(pitchType || 'startup').replace('\${transcript}', transcript);
  promptText = promptText.replace('\${metrics.totalWords}', metrics.totalWords);
  promptText = promptText.replace('\${metrics.durationInSeconds}', metrics.durationInSeconds);
  promptText = promptText.replace('\${metrics.wordsPerMinute}', metrics.wordsPerMinute);
  promptText = promptText.replace('\${metrics.totalFillers}', metrics.totalFillers);
  promptText = promptText.replace('\${metrics.fillerPercentage}', metrics.fillerPercentage);
  promptText = promptText.replace('\${JSON.stringify(metrics.fillerCounts)}', JSON.stringify(metrics.fillerCounts || {}));

  const stutterString = (metrics.repeatedWords && metrics.repeatedWords.length > 0) ? metrics.repeatedWords.join(', ') : 'None detected';
  const repeatString = (metrics.repeatedPhrases && metrics.repeatedPhrases.length > 0) ? metrics.repeatedPhrases.join('; ') : 'None detected';

  promptText = promptText.replace("\${metrics.repeatedWords && metrics.repeatedWords.length > 0 ? metrics.repeatedWords.join(', ') : 'None detected'}", stutterString);
  promptText = promptText.replace("\${metrics.repeatedPhrases && metrics.repeatedPhrases.length > 0 ? metrics.repeatedPhrases.join('; ') : 'None detected'}", repeatString);

  return promptText;
}

app.post('/api/analyze-voice', async (req, res) => {
  try {
    const { transcript, metrics, pitchType } = req.body;

    if (!transcript || transcript.trim() === '') {
      return res.status(400).json({ error: "Transcript is required." });
    }

    const promptText = buildDeliveryPrompt(transcript, metrics, pitchType);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error analyzing voice pitch:", error);
    res.status(500).json({ error: "Failed to analyze the voice pitch." });
  }
});

function getMediaCritiquePrompt(pitchType) {
  let roleContext;
  
  if (pitchType === 'career') {
    roleContext = "You are an elite executive interview coach preparing candidates for major hiring panels. You analyze HOW candidates speak, not just what they say.";
  } else if (pitchType === 'academic') {
    roleContext = "You are an elite academic speaking coach preparing scholars for thesis defenses and symposiums. You analyze HOW speakers deliver academic material.";
  } else {
    roleContext = "You are an elite pitch delivery coach who has prepared founders for YC Demo Day and Sequoia. You analyze HOW founders speak, not just what they say.";
  }

  return `${roleContext}

You receive a spoken presentation as an audio file.

=== INSTRUCTIONS ===

Analyze this speaker's DELIVERY and provide a brutally honest but constructive critique. 
Be specific — reference quotes from their delivery. Never give generic advice.

Respond in this exact structure:

**DELIVERY SCORE: X/10**
One sentence justifying the score.

**FILLER WORDS & STUTTERING**
- Identify if they used excessive filler words ("um", "like", "you know") or stuttered.
- Explain what this signals to investors.
- Give one specific elimination technique.

**PACING & CONFIDENCE**
- Evaluate their speaking pace. Was it too fast? Too slow? Did they pause effectively?
- Rate their confidence: HIGH / MEDIUM / LOW and explain why

**WEAK LANGUAGE**
- Find any hedge words or weak phrases used.
- Explain why each kills credibility and provide a power replacement for each.

**TOP 3 FIXES**
List exactly 3 things to fix before their next attempt.

**WHAT WORKED**
Identify 1-2 genuine strengths in their delivery.`;
}

app.post('/api/analyze-media', async (req, res) => {
  try {
    const { file, pitchType } = req.body;

    if (!file || !file.data || !file.mimeType) {
      return res.status(400).json({ error: "Audio file data is required." });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            data: file.data,
            mimeType: file.mimeType
          }
        },
        { text: getMediaCritiquePrompt(pitchType || 'startup') }
      ]
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error analyzing media pitch:", error);
    res.status(500).json({ error: "Failed to analyze the media pitch." });
  }
});

app.listen(port, () => {
  console.log(`Pitch analyzer app backend listening at http://localhost:${port}`);
});
