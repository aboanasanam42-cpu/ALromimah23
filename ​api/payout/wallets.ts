import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OWNER_WALLETS } from '../../src/config/wallets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const activeWallets = OWNER_WALLETS.filter((w) => w.isActive);
    return res.status(200).json({
      success: true,
      wallets: activeWallets,
    });
  }

  if (req.method === 'POST') {
    try {
      const { walletId, amount, txHashOrRef } = req.body;
      const targetWallet = OWNER_WALLETS.find((w) => w.id === walletId);
      if (!targetWallet) {
        return res.status(400).json({ success: false, error: 'المحفظة المختارة غير صالحة' });
      }
      if (!amount || Number(amount) <= 0 || !txHashOrRef) {
        return res.status(400).json({
          success: false,
          error: 'يرجى إدخال المبلغ ورقم المرجع أو هاش المعاملة (TxHash)',
        });
      }

      return res.status(200).json({
        success: true,
        status: 'recorded',
        destination: targetWallet.accountNumber,
        provider: targetWallet.provider,
        network: targetWallet.network || 'LOCAL_YE',
        amount: Number(amount),
        reference: txHashOrRef,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
