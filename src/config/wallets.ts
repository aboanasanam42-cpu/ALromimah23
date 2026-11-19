export interface WalletConfig {
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

export const OWNER_WALLETS: WalletConfig[] = [
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
