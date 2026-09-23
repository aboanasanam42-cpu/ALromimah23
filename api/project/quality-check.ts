export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { completedStepsCount, totalSteps } = req.body || {};
  const isReady = completedStepsCount >= totalSteps;

  return res.status(200).json({
    success: true,
    readyToDeliver: isReady,
    qualityScore: isReady ? 98 : 75,
    issues: isReady ? [] : ["يرجى إكمال جميع خطوات المشروع قبل طلب فحص الجودة والتسليم."],
    recommendation: isReady
      ? "العمل جاهز للتسليم. لا يضمن هذا الفحص الدفع ولا ينفذ أي تحويل بنكي؛ يجب تأكيد الدفع عبر منصة العميل أو مزود رسمي."
      : "أكمل المهام المتبقية قبل التسليم؛ لا يتم إنشاء أو ضمان أي تحويل بنكي من خلال فحص الجودة."
  });
}
