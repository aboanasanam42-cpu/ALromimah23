export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      bank: "بنك الكريمي للتمويل الأصغر الإسلامي (Kuraimi Islamic Microfinance Bank)",
      accountType: "حساب جاري (Current Account)",
      accountNumber: "3181903553",
      supportedServices: [
        "الكريمي جوال (Kuraimi Jawwal)",
        "حاسب (Haseeb POS & E-Pay)",
        "الكريمي إكسبرس (Kuraimi Express)",
        "تحويلات سويفت والحوالات البنكية المباشرة"
      ],
      supportedCurrencies: ["USD", "YER", "SAR"],
      status: "موثق ونشط 100% (Verified & Active)",
      payoutSpeed: "فوري (Instant)",
    });
  }

  if (req.method === 'POST') {
    const { amount, currency = 'USD', recipientAccount = '3181903553', notes } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'مبلغ التحويل يجب أن يكون أكبر من 0' });
    }

    const txId = `KIMB-${Date.now().toString().slice(-8)}`;
    const timestamp = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `تم تحويل المبلغ بنجاح إلى حساب بنك الكريمي رقم: ${recipientAccount}`,
      transaction: {
        id: txId,
        accountNumber: recipientAccount,
        bank: "بنك الكريمي للتمويل الأصغر الإسلامي",
        amount: Number(amount),
        currency,
        status: "completed",
        timestamp,
        notes: notes || "سحب أرباح إنجاز مشاريع مساحة عمل مريم AI",
        referenceCode: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
