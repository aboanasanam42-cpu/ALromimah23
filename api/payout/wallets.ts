import { OWNER_WALLETS } from '../../src/config/wallets';

interface ApiRequest {
  method?: string;
  body?: {
    walletId?: string;
    amount?: number | string;
    txHashOrRef?: string;
  };
}

interface ApiResponse {
  status: (code: number) => {
    json: (data: unknown) => void;
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === 'GET') {
    const activeWallets = OWNER_WALLETS.filter((w) => w.isActive);
    return res.status(200).json({
      success: true,
      wallets: activeWallets,
    });
  }

  if (req.method === 'POST') {
    try {
      const { walletId, amount, txHashOrRef } = req.body || {};
      const targetWallet = OWNER_WALLETS.find((w) => w.id === walletId);

      if (!targetWallet) {
        return res.status(400).json({ success: false, error: 'المحفظة أو الحساب المختار غير صالح' });
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
        altDestination: targetWallet.altAccountNumber || null,
        provider: targetWallet.provider,
        network: targetWallet.network || 'LOCAL_YE',
        currency: targetWallet.currency,
        amount: Number(amount),
        reference: txHashOrRef,
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return res.status(500).json({ success: false, error: message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
