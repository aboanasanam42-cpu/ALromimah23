interface WalletConfig {
  id: string;
  provider: 'kuraimi_bank' | 'shamel_money' | 'one_cash' | 'binance_usdt';
  nameAr: string;
  nameEn: string;
  network?: 'TRC20' | 'BEP20' | 'ERC20' | 'SOL';
  networkLabel?: string;
  accountNumber: string;
  altAccountNumber?: string;
  email?: string;
  branch?: string;
  minDeposit?: number;
  minDepositLabel?: string;
  noteAr?: string;
  noteEn?: string;
  currency: 'USD' | 'YER' | 'USDT';
  isDefault?: boolean;
  isActive: boolean;
}

const OWNER_WALLETS: WalletConfig[] = [
  {
    id: 'kuraimi-bank-usd',
    provider: 'kuraimi_bank',
    nameAr: 'بنك الكريمي للتمويل الأصغر الإسلامي (جاري - تعز)',
    nameEn: 'Al-Kuraimi Islamic Microfinance Bank (Current - Taiz)',
    accountNumber: '3181903553',
    branch: 'جاري - تعز',
    currency: 'USD',
    isDefault: true,
    isActive: true,
  },
  {
    id: 'shamel-money-ye',
    provider: 'shamel_money',
    nameAr: 'شامل موني (Shamel Money)',
    nameEn: 'Shamel Money (Yemen)',
    accountNumber: '771134103',
    email: 'aboanasanam42@gmail.com',
    currency: 'YER',
    isActive: true,
  },
  {
    id: 'one-cash-ye',
    provider: 'one_cash',
    nameAr: 'ون كاش (OneCash)',
    nameEn: 'OneCash (Yemen)',
    accountNumber: '730768718',
    altAccountNumber: '146158879',
    currency: 'YER',
    isActive: true,
  },
  {
    id: 'binance-usdt-trc20',
    provider: 'binance_usdt',
    nameAr: 'Binance USDT — Tron (TRC20)',
    nameEn: 'Binance USDT — Tron (TRC20)',
    network: 'TRC20',
    networkLabel: 'Tron (TRC20)',
    accountNumber: 'TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv',
    minDeposit: 0.01,
    minDepositLabel: '>0.01 USDT',
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-bep20',
    provider: 'binance_usdt',
    nameAr: 'Binance USDT — BNB Smart Chain (BEP20)',
    nameEn: 'Binance USDT — BNB Smart Chain (BEP20)',
    network: 'BEP20',
    networkLabel: 'BNB Smart Chain (BEP20)',
    accountNumber: '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a',
    minDeposit: 0.01,
    minDepositLabel: '>0.01 USDT',
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-erc20',
    provider: 'binance_usdt',
    nameAr: 'Binance USDT — Ethereum (ERC20)',
    nameEn: 'Binance USDT — Ethereum (ERC20)',
    network: 'ERC20',
    networkLabel: 'Ethereum (ERC20)',
    accountNumber: '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a',
    minDeposit: 0.001,
    minDepositLabel: '>0.001 USDT',
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-sol',
    provider: 'binance_usdt',
    nameAr: 'Binance USDT — Solana (SOL)',
    nameEn: 'Binance USDT — Solana (SOL)',
    network: 'SOL',
    networkLabel: 'Solana (SOL)',
    accountNumber: '85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj',
    minDeposit: 0.001,
    minDepositLabel: '>0.001 USDT',
    noteAr: 'ملاحظة: العنوان حساس لحالة الأحرف (Case-sensitive)',
    noteEn: 'Note: Case-sensitive',
    currency: 'USDT',
    isActive: true,
  },
];

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
      count: activeWallets.length,
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
        walletId: targetWallet.id,
        label: targetWallet.nameAr,
        destination: targetWallet.accountNumber,
        altDestination: targetWallet.altAccountNumber || null,
        email: targetWallet.email || null,
        provider: targetWallet.provider,
        network: targetWallet.networkLabel || targetWallet.network || 'LOCAL_YE',
        minDeposit: targetWallet.minDepositLabel || null,
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
