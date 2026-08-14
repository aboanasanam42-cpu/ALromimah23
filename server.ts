import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { aggregateRemoteJobs } from "./src/server/jobAggregator";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ status: "ok", appName: "Marium AI Workspace", timestamp: new Date().toISOString(), serverPort: PORT }));

  // Live remote-work aggregation. Sources are queried server-side to avoid mobile/browser CORS limits.
  app.get("/api/jobs", async (req, res) => {
    try {
      const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
      const result = await aggregateRemoteJobs(search);
      res.json({ success: true, ...result, fetchedAt: new Date().toISOString() });
    } catch (error: any) {
      res.status(502).json({ success: false, jobs: [], sources: [], warnings: [error?.message || "تعذر جلب الوظائف"] });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    const { text, analysisType } = req.body || {};
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Text parameter is required." });
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "Marium-AI-Workspace" } } });
        const prompt = `حلل فرصة العمل التالية بالعربية. نوع التحليل: ${analysisType || 'comprehensive'}.\n${text}\nأعد JSON فقط: {"summary":"","score":0,"riskAssessment":"","keyDeliverables":[],"suggestedSkills":[],"recommendation":""}`;
        const response = await ai.models.generateContent({ model: "gemini-3.6-flash", contents: prompt, config: { responseMimeType: "application/json" } });
        const parsed = JSON.parse(response.text || "{}");
        return res.json({ success: true, result: {
          summary: parsed.summary || "تم التحليل",
          score: Number(parsed.score) || 70,
          riskAssessment: parsed.riskAssessment || "Medium Risk",
          keyDeliverables: Array.isArray(parsed.keyDeliverables) ? parsed.keyDeliverables : [],
          suggestedSkills: Array.isArray(parsed.suggestedSkills) ? parsed.suggestedSkills : [],
          recommendation: parsed.recommendation || "تحقق من شروط الدفع قبل البدء."
        }});
      } catch (error) { console.warn("Gemini analysis failed", error); }
    }
    const lower = text.toLowerCase();
    const suspicious = ["deposit", "usdt", "telegram", "guaranteed return", "رسوم قبل العمل", "ادفع قبل"].some((x) => lower.includes(x));
    res.json({ success: true, fallbackUsed: true, result: {
      summary: suspicious ? "العرض يحتوي مؤشرات تستوجب الحذر." : "عرض عمل عن بعد يحتاج تحققاً قبل التنفيذ.",
      score: suspicious ? 25 : 72,
      riskAssessment: suspicious ? "High Risk" : "Medium Risk",
      keyDeliverables: suspicious ? ["لا تدفع أي مبلغ مقدماً", "تحقق من صاحب العمل"] : ["تحقق من نطاق العمل", "اتفق على الدفع والمراحل"],
      suggestedSkills: [],
      recommendation: suspicious ? "لا تدفع رسوماً أو عملة رقمية قبل التحقق من منصة دفع موثوقة." : "استخدم وسيلة دفع أو ضمان معروفة ولا تبدأ قبل وضوح شروط الدفع."
    }});
  });

  app.post("/api/sync", (req, res) => res.json({ success: true, timestamp: new Date().toISOString(), mode: req.body?.mode || "hybrid", message: "تمت مزامنة بيانات مساحة العمل.", snapshotId: `snap-${Math.random().toString(36).slice(2, 11)}` }));

  app.get("/api/opportunities", async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const result = await aggregateRemoteJobs(search);
    res.json({ success: true, ...result });
  });

  app.patch("/api/opportunities/:id/status", (req, res) => res.json({ success: true, id: req.params.id, status: req.body?.status || "updated", timestamp: new Date().toISOString() }));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Marium AI Workspace server listening on ${PORT}`));
}

startServer();
