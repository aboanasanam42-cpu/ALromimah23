export interface WalletConfig {
  id: string;
  provider: 'shamel_money' | 'one_cash' | 'binance_usdt';
  nameAr: string;
  nameEn: string;
  network?: 'TRC20' | 'BEP20' | 'ERC20' | 'SOL';
  accountNumber: string;
  altAccountNumber?: string;
  minDeposit?: number;
  currency: 'YER' | 'USDT';
  isActive: boolean;
}

export const OWNER_WALLETS: WalletConfig[] = [
  {
    id: 'shamel-money-ye',
    provider: 'shamel_money',
    nameAr: 'شامل موني (اليمن)',
    nameEn: 'Shamel Money',
    accountNumber: '771134103',
    currency: 'YER',
    isActive: true,
  },
  {
    id: 'one-cash-ye',
    provider: 'one_cash',
    nameAr: 'ون كاش (اليمن)',
    nameEn: 'OneCash',
    accountNumber: '730768718',
    altAccountNumber: '146158879',
    currency: 'YER',
    isActive: true,
  },
  {
    id: 'binance-usdt-trc20',
    provider: 'binance_usdt',
    nameAr: 'بينانس USDT (شبكة TRC20)',
    nameEn: 'Binance USDT (Tron TRC20)',
    network: 'TRC20',
    accountNumber: 'TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv',
    minDeposit: 0.01,
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-bep20',
    provider: 'binance_usdt',
    nameAr: 'بينانس USDT (شبكة BEP20)',
    nameEn: 'Binance USDT (BNB Smart Chain)',
    network: 'BEP20',
    accountNumber: '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a',
    minDeposit: 0.01,
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-erc20',
    provider: 'binance_usdt',
    nameAr: 'بينانس USDT (شبكة ERC20)',
    nameEn: 'Binance USDT (Ethereum)',
    network: 'ERC20',
    accountNumber: '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a',
    minDeposit: 0.001,
    currency: 'USDT',
    isActive: true,
  },
  {
    id: 'binance-usdt-sol',
    provider: 'binance_usdt',
    nameAr: 'بينانس USDT (شبكة Solana)',
    nameEn: 'Binance USDT (Solana)',
    network: 'SOL',
    accountNumber: '85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj',
    minDeposit: 0.001,
    currency: 'USDT',
    isActive: true,
  },
];
