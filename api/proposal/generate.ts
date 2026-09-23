import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { opportunityTitle, category, client, reward, description } = req.body || {};
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

      const prompt = `You are the Marium AI Workspace Proposal Engine (مريم AI - مساحة العمل عن بُعد).
Generate a winning, professional freelance proposal for this remote job:
Title: ${opportunityTitle}
Client: ${client}
Category: ${category}
Reward: $${reward}
Description: ${description}

Return ONLY valid JSON matching this schema:
{
  "coverLetter": "Persuasive and respectful cover letter in Arabic highlighting expertise, past relevant projects, and prompt delivery.",
  "proposedPrice": ${reward || 150},
  "deliveryDays": 3,
  "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
  "clientQuestions": ["Clarifying question 1 for the client", "Clarifying question 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.status(200).json({
        success: true,
        proposal: parsed,
      });
    } catch (err: any) {
      console.warn("Gemini proposal generation fallback:", err?.message);
    }
  }

  return res.status(200).json({
    success: true,
    proposal: {
      coverLetter: `مرحباً ${client || 'عزيزي العميل'}،\n\nقرأت بعناية متطلبات مشروع "${opportunityTitle || 'العمل المطروح'}"، ويسعدني تنفيذ العمل بأعلى معايير الدقة والاحترافية. أمتلك خبرة عملية واسعة في مجال ${category || 'العمل عن بُعد'}، ويمكنني تسليم المخرجات كاملة قبل الموعد المحدد مع مراجعة وتعديلات مجانية.\n\nأتطلع لبدء العمل والتعاون معكم فوراً.`,
      proposedPrice: reward || 150,
      deliveryDays: 3,
      milestones: [
        "دراسة المتطلبات وإعداد المسودة الأولية",
        "تنفيذ المهام وتطبيق التعديلات",
        "المراجعة وضمان الجودة والتسليم النهائي"
      ],
      clientQuestions: [
        "هل توجد نماذج أو مراجع معينة تفضلون الاعتماد عليها؟",
        "هل ترغبون في استلام المخرجات بصيغ محددة (PDF / Word / Source files)؟"
      ]
    }
  });
}
