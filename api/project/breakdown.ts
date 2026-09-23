export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    steps: [
      { id: "s1", title: "مراجعة المتطلبات وجمع المصادر والملفات الأساسية", completed: true },
      { id: "s2", title: "إعداد المسودة الأولى ونموذج العمل الأولي", completed: false },
      { id: "s3", title: "إنجاز التعديلات وتطبيق معايير الجودة الشاملة", completed: false },
      { id: "s4", title: "تجهيز ملفات التسليم النهائي وتوثيق العمل", completed: false }
    ]
  });
}
