import { GoogleGenAI } from '@google/genai';

interface ApiRequest {
  method?: string;
  body?: {
    title?: string;
    description?: string;
    targetLang?: 'ar' | 'en';
  };
}

interface ApiResponse {
  status: (code: number) => {
    json: (data: unknown) => void;
  };
}

async function fallbackTranslateText(text: string, targetLang: 'ar' | 'en'): Promise<string> {
  if (!text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback translation HTTP ${response.status}`);
  }
  const data = (await response.json()) as unknown[];
  const segments = Array.isArray(data?.[0]) ? (data[0] as unknown[][]) : [];
  return segments.map((seg) => (typeof seg?.[0] === 'string' ? seg[0] : '')).join('');
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { title = '', description = '', targetLang = 'ar' } = req.body || {};

    if (!title.trim() && !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'يرجى إرسال عنوان الوظيفة أو وصفها للترجمة',
      });
    }

    const langCode: 'ar' | 'en' = targetLang === 'en' ? 'en' : 'ar';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt =
          langCode === 'ar'
            ? `ترجم عنوان الوظيفة ووصفها التاليين إلى اللغة العربية الفصحى المهنية بأسلوب واضح ومباشر. أعد النتيجة بصيغة JSON فقط بهذا الشكل: {"title": "...", "description": "..."}\n\nTitle: ${title}\nDescription: ${description}`
            : `Translate the following remote job title and description into clear, professional English. Return ONLY valid JSON in this exact format: {"title": "...", "description": "..."}\n\nTitle: ${title}\nDescription: ${description}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText) as { title?: string; description?: string };

        if (parsed.title || parsed.description) {
          return res.status(200).json({
            success: true,
            targetLang: langCode,
            title: parsed.title || title,
            description: parsed.description || description,
          });
        }
      } catch {
        // الانتقال تلقائياً للبديل في حال تعذر الوصول لـ Gemini
      }
    }

    const [translatedTitle, translatedDescription] = await Promise.all([
      fallbackTranslateText(title, langCode),
      fallbackTranslateText(description, langCode),
    ]);

    return res.status(200).json({
      success: true,
      targetLang: langCode,
      title: translatedTitle || title,
      description: translatedDescription || description,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation error';
    return res.status(500).json({ success: false, error: message });
  }
    }
