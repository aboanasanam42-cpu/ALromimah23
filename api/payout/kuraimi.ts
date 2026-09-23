export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      bank: "بنك الكريمي للتمويل الأصغر الإسلامي (Kuraimi Islamic Microfinance Bank)",
      capability: "merchant-payment-api",
      status: "not_configured",
      message: "لا يوجد اتصال مصرفي فعلي مهيأ. يجب الحصول على موافقة البنك ومواصفات API الرسمية قبل تفعيل التحويلات.",
    });
  }

  if (req.method === 'POST') {
    const { amount } = req.body || {};

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'مبلغ التحويل يجب أن يكون أكبر من 0' });
    }

    return res.status(503).json({
      success: false,
      error: "خدمة التحويل البنكي غير مفعّلة: لا توجد بيانات اعتماد أو مواصفات API رسمية لبنك الكريمي في الخادم.",
      code: "PAYOUT_PROVIDER_NOT_CONFIGURED",
      nextStep: "تواصل مع بنك الكريمي للحصول على خدمة الربط الإلكتروني API ومواصفات المصادقة وعمليات الصرف قبل إضافة المحول البرمجي.",
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
