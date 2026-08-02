import React, { useState } from 'react';
import { PaymentMethod, Transaction, Language } from '../types';
import { t } from '../utils/localization';
import {
  CreditCard,
  Building2,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Lock,
  X,
  ShieldCheck,
} from 'lucide-react';

interface PaymentViewProps {
  language: Language;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  onAddPaymentMethod: (pm: PaymentMethod) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  language,
  paymentMethods,
  transactions,
  onAddPaymentMethod,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'wallet' | 'card'>('bank');
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const totalBalance = paymentMethods.reduce((acc, pm) => acc + pm.balance, 0);

  const handleCreatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !provider) return;

    const newPm: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type,
      name,
      provider,
      accountNumber: accountNumber || '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      balance: 0,
      currency: 'USD',
      isDefault: false,
    };

    onAddPaymentMethod(newPm);
    setShowAddModal(false);
    setName('');
    setProvider('');
    setAccountNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(language, 'paymentsHeader')}
            </h2>
            <span className="px-2.5 py-0.5 bg-violet-500/20 text-violet-300 border border-violet-400/30 text-[11px] font-bold rounded-full">
              PaymentDataSource
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {t(language, 'paymentsSub')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t(language, 'addPaymentMethod')}</span>
        </button>
      </div>

      {/* Wallet Balance Summary Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t(language, 'totalBalance')}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="text-sm text-slate-400 font-semibold ml-1.5">USD</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ar' ? 'محفوظات مشفرة AES' : 'AES Encrypted Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Connected Payout Accounts & Wallets */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t(language, 'connectedAccounts')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-violet-300 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700">
                  {pm.type === 'bank' ? (
                    <Building2 className="w-6 h-6" />
                  ) : pm.type === 'wallet' ? (
                    <Wallet className="w-6 h-6" />
                  ) : (
                    <CreditCard className="w-6 h-6" />
                  )}
                </div>

                {pm.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Default
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{pm.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{pm.provider}</p>
                <div className="text-xs font-mono text-slate-400 mt-1">{pm.accountNumber}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Balance</span>
                <span className="text-sm font-extrabold text-slate-900">
                  ${pm.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} {pm.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t(language, 'transactionHistory')}
        </h3>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div>
                  <div className="font-bold text-slate-900">{tx.description}</div>
                  <div className="text-[11px] text-slate-400">{tx.date} • {tx.type}</div>
                </div>
              </div>

              <div className="text-right rtl:text-left">
                <div className={`font-extrabold ${tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} {tx.currency}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Payment Method */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t(language, 'addPaymentMethod')}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePaymentMethod} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bank', 'wallet', 'card'] as const).map((tType) => (
                    <button
                      key={tType}
                      type="button"
                      onClick={() => setType(tType)}
                      className={`py-2 text-xs font-bold rounded-xl capitalize transition-all border ${
                        type === tType
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account / Wallet Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Primary Checking"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bank or Provider</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Chase Bank or Firebase Wallet"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Number / Address</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. •••• 9012"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
