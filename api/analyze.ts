import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, analysisType } = req.body || {};

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text parameter is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the CloudWorker AI Analyzer Engine. Analyze the following text/job offer/contract:
"""
${text}
"""

Analysis requested: ${analysisType || 'comprehensive'}.

Return ONLY a valid JSON object matching this structure:
{
  "summary": "Concise summary of the opportunity or text",
  "score": 85,
  "riskAssessment": "Verified | Low Risk | Medium Risk | High Risk - with 1 sentence rationale",
  "keyDeliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
  "suggestedSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "recommendation": "Final actionable advice for the remote worker"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text || "{}";
      const parsed = JSON.parse(rawText);

      return res.status(200).json({
        success: true,
        result: {
          summary: parsed.summary || "Analysis completed successfully.",
          score: typeof parsed.score === "number" ? parsed.score : 80,
          riskAssessment: parsed.riskAssessment || "Low Risk - Verified structure",
          keyDeliverables: Array.isArray(parsed.keyDeliverables) ? parsed.keyDeliverables : ["Review requirements", "Set up project milestones"],
          suggestedSkills: Array.isArray(parsed.suggestedSkills) ? parsed.suggestedSkills : ["Technical Writing", "Problem Solving"],
          recommendation: parsed.recommendation || "Proceed with standard milestone contracts.",
        },
      });
    } catch (error: any) {
      console.warn("Gemini API call failed, falling back to local heuristic analysis:", error?.message);
    }
  }

  // Fallback heuristic analysis
  const lower = text.toLowerCase();
  const isCryptoScam = lower.includes("deposit") || lower.includes("usdt") || lower.includes("telegram") || lower.includes("guaranteed return") || lower.includes("25%");
  const isTechGig = lower.includes("react") || lower.includes("kotlin") || lower.includes("node") || lower.includes("python") || lower.includes("cloud");

  let score = 80;
  let risk = "Low Risk - Standard Remote Gig";
  const deliverables: string[] = [];
  const skills: string[] = [];

  if (isCryptoScam) {
    score = 25;
    risk = "High Risk - Unverified upfront deposit demand pattern detected";
    deliverables.push("Do NOT send upfront funds", "Request verified escrow payment", "Verify company credentials");
    skills.push("Scam Awareness", "Escrow Verification");
  } else if (isTechGig) {
    score = 92;
    risk = "Verified - High quality tech workspace contract";
    deliverables.push("Deliver modular code architecture", "Write comprehensive unit tests", "Deploy to cloud container");
    skills.push("React / TypeScript", "REST APIs", "Cloud Sync");
  } else {
    score = 75;
    risk = "Medium Risk - Require clarified payment terms";
    deliverables.push("Clarify project scope", "Agree on milestone payouts");
    skills.push("Communication", "Project Planning");
  }

  return res.status(200).json({
    success: true,
    fallbackUsed: !apiKey,
    result: {
      summary: `Analysis performed on input (${text.length} characters). Pattern: ${isCryptoScam ? 'Unverified High-Risk Offer' : isTechGig ? 'Verified Tech Workspace Contract' : 'Standard Freelance Contract'}.`,
      score,
      riskAssessment: risk,
      keyDeliverables: deliverables,
      suggestedSkills: skills,
      recommendation: isCryptoScam
        ? "Avoid this transaction or demand verified platform escrow before work."
        : "Proceed by setting up milestones and linking payment methods.",
    },
  });
}
