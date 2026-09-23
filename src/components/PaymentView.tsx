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
  Copy,
  Check,
  ExternalLink,
  Coins,
  RefreshCw,
  Send,
  Download,
  AlertCircle,
  Edit3
} from 'lucide-react';

interface PaymentViewProps {
  language: Language;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  onAddPaymentMethod: (pm: PaymentMethod) => void;
  onUpdatePaymentMethod?: (pm: PaymentMethod) => void;
  onWithdrawToKuraimi?: (amount: number, currency: string, note?: string) => Promise<any> | void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  language,
  paymentMethods,
  transactions,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onWithdrawToKuraimi,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showEditKuraimiModal, setShowEditKuraimiModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Add account form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'wallet' | 'card'>('bank');
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('150');
  const [withdrawCurrency, setWithdrawCurrency] = useState<'USD' | 'YER' | 'SAR'>('USD');
  const [withdrawNote, setWithdrawNote] = useState('سحب أرباح إنجاز مشاريع مساحة العمل');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Currency display toggle for Kuraimi card
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'YER' | 'SAR'>('USD');
  const [copiedAccount, setCopiedAccount] = useState(false);

  const kuraimiAccount = paymentMethods.find(
    (pm) => pm.accountNumber === '3181903553' || pm.provider.includes('الكريمي')
  ) || paymentMethods[0];

  const currentAccountNumber = kuraimiAccount ? kuraimiAccount.accountNumber : '3181903553';
  const [editKuraimiAccountNumber, setEditKuraimiAccountNumber] = useState(currentAccountNumber);
  const [editKuraimiCurrency, setEditKuraimiCurrency] = useState(kuraimiAccount?.currency || 'USD');

  const kuraimiBalanceUSD = kuraimiAccount ? kuraimiAccount.balance : 0;
  const totalBalance = paymentMethods.reduce((acc, pm) => acc + pm.balance, 0);

  // Exchange rates for Kuraimi microfinance display
  const yerRate = 535; // USD to YER official commercial estimate
  const sarRate = 3.75; // USD to SAR

  const getConvertedKuraimiBalance = () => {
    if (displayCurrency === 'YER') {
      return (kuraimiBalanceUSD * yerRate).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' YER';
    }
    if (displayCurrency === 'SAR') {
      return (kuraimiBalanceUSD * sarRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' SAR';
    }
    return '$' + kuraimiBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
  };

  const handleCopyKuraimi = () => {
    navigator.clipboard.writeText(currentAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSaveKuraimiAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKuraimiAccountNumber) return;
    if (kuraimiAccount && onUpdatePaymentMethod) {
      onUpdatePaymentMethod({
        ...kuraimiAccount,
        accountNumber: editKuraimiAccountNumber.trim(),
        currency: editKuraimiCurrency,
      });
    }
    setShowEditKuraimiModal(false);
  };

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

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > kuraimiBalanceUSD) {
      alert(language === 'ar' ? 'المبلغ المطلوب أكبر من الرصيد المتاح في الحساب' : 'Requested amount exceeds available balance');
      return;
    }

    setIsProcessingWithdraw(true);
    setWithdrawError(null);

    try {
      const response = await fetch('/api/payout/kuraimi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          currency: withdrawCurrency,
          recipientAccount: currentAccountNumber,
          notes: withdrawNote,
        }),
      });

      const rawBody = await response.text();
      let payload: any = null;
      try {
        payload = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.success !== true) {
        const providerMessage = payload?.error || payload?.message;
        throw new Error(
          providerMessage ||
            (language === 'ar'
              ? `تعذر تنفيذ التحويل (HTTP ${response.status}). لم يتم خصم الرصيد ولم يُنشأ إيصال.`
              : `Transfer failed (HTTP ${response.status}). No balance was deducted and no receipt was created.`)
        );
      }

      const transaction = payload?.transaction;
      if (
        !transaction ||
        transaction.status !== 'completed' ||
        typeof transaction.id !== 'string' ||
        !transaction.id.trim()
      ) {
        throw new Error(
          language === 'ar'
            ? 'لم يؤكد مزود الدفع إتمام التحويل. لم يتم خصم الرصيد ولم يُنشأ إيصال نجاح.'
            : 'The payment provider did not confirm a completed transfer. No balance was deducted and no success receipt was created.'
        );
      }

      if (onWithdrawToKuraimi) {
        await onWithdrawToKuraimi(amountNum, withdrawCurrency, withdrawNote);
      }

      const receipt = {
        txId: transaction.referenceCode || transaction.id,
        date: transaction.timestamp
          ? new Date(transaction.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')
          : new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
        amount: Number(transaction.amount),
        currency: transaction.currency || withdrawCurrency,
        bank: transaction.bank || 'بنك الكريمي للتمويل الأصغر الإسلامي',
        account: transaction.accountNumber || currentAccountNumber,
        fee: transaction.fee || (language === 'ar' ? 'غير محددة من مزود الدفع' : 'Not provided by provider'),
      };

      setLastReceipt(receipt);
      setShowWithdrawModal(false);
      setShowReceiptModal(true);
    } catch (error) {
      console.error(error);
      setWithdrawError(
        error instanceof Error
          ? error.message
          : language === 'ar'
            ? 'تعذر الاتصال بخدمة التحويل. لم يتم تنفيذ العملية.'
            : 'Could not reach the transfer service. The operation was not executed.'
      );
    } finally {
      setIsProcessingWithdraw(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-emerald-500/20">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'ar' ? 'إدارة الحسابات البنكية والأرباح' : 'Bank Accounts & Earnings Hub'}
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-extrabold rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-300" />
              {language === 'ar' ? 'ربط API غير مفعّل' : 'Bank API not configured'}
            </span>
          </div>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            {language === 'ar'
              ? 'هذه شاشة لإدارة بيانات الاستلام فقط. لا يتم تنفيذ أي تحويل بنكي قبل تهيئة API رسمي ومصادقة البنك.'
              : 'This screen stores payout details only. No bank transfer is executed until an official, authenticated API is configured.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'ar' ? 'سحب إلى بنك الكريمي' : 'Withdraw to Kuraimi'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t(language, 'addPaymentMethod')}</span>
          </button>
        </div>
      </div>

      {/* Featured Primary Account: Al-Kuraimi Islamic Microfinance Bank */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 border-2 border-emerald-400/30 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-6">
          {/* Top row: Badges and Bank Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg text-emerald-950 font-black text-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {language === 'ar' ? 'بيانات حساب مدخلة' : 'Stored account details'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-300" />
                    {language === 'ar' ? 'لم يتم التحقق مصرفياً' : 'Not bank-verified'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  بنك الكريمي للتمويل الأصغر الإسلامي
                </h3>
                <span className="text-xs text-emerald-200/70 font-medium">
                  Kuraimi Islamic Microfinance Bank (KIMB)
                </span>
              </div>
            </div>

            {/* Currency switcher */}
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
              {(['USD', 'YER', 'SAR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setDisplayCurrency(curr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    displayCurrency === curr
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Account Details & Balance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-emerald-500/20">
            {/* Account Number Box */}
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                  {language === 'ar' ? 'رقم حساب الكريمي بالدولار' : 'Kuraimi Account (USD)'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-black">
                  USD ($) دولار
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl sm:text-2xl font-mono font-black text-emerald-100 tracking-wider">
                  {currentAccountNumber}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyKuraimi}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 transition-all flex items-center gap-1 text-xs font-bold"
                    title="نسخ رقم الحساب"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px]">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-[10px]">{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditKuraimiAccountNumber(currentAccountNumber);
                      setShowEditKuraimiModal(true);
                    }}
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-all flex items-center gap-1 text-xs font-bold"
                    title="تعديل أو تغيير رقم الحساب"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-emerald-200/70 block">
                {language === 'ar' ? 'رقم محفوظ محلياً؛ لا يمثل اتصالاً مصرفياً أو تفويضاً للتحويل' : 'Stored locally; this does not represent a bank connection or transfer authorization'}
              </span>
            </div>

            {/* Available Balance Box */}
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 space-y-1">
              <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                {language === 'ar' ? 'الرصيد المسجل محلياً' : 'Locally recorded balance'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {getConvertedKuraimiBalance()}
              </div>
              <span className="text-[10px] text-emerald-200/60 block">
                {language === 'ar' ? 'ليس رصيداً مصرفياً مؤكداً' : 'Not a bank-confirmed balance'}
              </span>
            </div>

            {/* Instant Actions & Services */}
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                  {language === 'ar' ? 'الخدمات غير المهيأة' : 'Unconfigured services'}
                </span>
                <span className="text-xs text-white/90 font-medium block mt-1">
                  الكريمي جوال • حاسب (Haseeb) • الكريمي إكسبرس
                </span>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'طلب سحب رصيد الآن' : 'Request Withdrawal Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Verification Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-emerald-950 block">
                {language === 'ar' ? 'حالة الربط المالي' : 'Financial integration status'}
            </span>
            <span className="text-slate-600">
              {language === 'ar'
                ? 'لا توجد حالياً خدمة تحويل مصرفي مفعّلة. تشفير Firebase يحمي بيانات التطبيق فقط ولا يحول الأموال.'
                : 'No bank transfer service is currently enabled. Firebase encryption protects app data only; it does not move money.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 shrink-0">
          <span className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg shadow-2xs">
            {language === 'ar' ? 'الرسوم: يحددها المزود' : 'Fees: provider-defined'}
          </span>
          <span className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg shadow-2xs">
            {language === 'ar' ? 'الحالة: غير مفعّلة' : 'Status: not enabled'}
          </span>
        </div>
      </div>

      {/* Connected Accounts & Wallets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t(language, 'connectedAccounts')}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ar' ? `إجمالي الأرصدة: $${totalBalance.toFixed(2)} USD` : `Total Balance: $${totalBalance.toFixed(2)} USD`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((pm) => {
            const isKuraimi = pm.accountNumber === '3181903553' || pm.provider.includes('الكريمي');

            return (
              <div
                key={pm.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs transition-all space-y-4 ${
                  isKuraimi
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isKuraimi
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-violet-50 text-violet-700'
                    }`}
                  >
                    {pm.type === 'bank' ? (
                      <Building2 className="w-6 h-6" />
                    ) : pm.type === 'wallet' ? (
                      <Wallet className="w-6 h-6" />
                    ) : (
                      <CreditCard className="w-6 h-6" />
                    )}
                  </div>

                  {pm.isDefault && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                      {language === 'ar' ? 'الحساب الافتراضي' : 'Default'}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{pm.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{pm.provider}</p>
                  <div className="text-xs font-mono font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                    <span>{pm.accountNumber}</span>
                    {isKuraimi && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-sans">
                        {language === 'ar' ? 'حساب جاري' : 'Current'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    {language === 'ar' ? 'الرصيد المتاح' : 'Balance'}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    ${pm.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} {pm.currency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t(language, 'transactionHistory')}
          </h3>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {language === 'ar' ? 'محدث وفوري' : 'Live Synced'}
          </span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => {
            const isKuraimiTx = tx.description.includes('3181903553') || tx.description.includes('الكريمي');

            return (
              <div
                key={tx.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs gap-3 transition-all ${
                  isKuraimiTx
                    ? 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      tx.amount > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{tx.description}</span>
                      {isKuraimiTx && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200/60 text-emerald-900 font-bold">
                          بنك الكريمي
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {tx.date} • {tx.type}
                    </div>
                  </div>
                </div>

                <div className="text-right rtl:text-left">
                  <div
                    className={`font-black text-sm ${
                      tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} {tx.currency}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Withdraw to Al-Kuraimi Bank */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-fadeIn border border-emerald-500/30">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    تحويل بنكي فوري
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {language === 'ar' ? 'سحب الأرباح إلى بنك الكريمي' : 'Withdraw to Kuraimi Bank'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'لن يظهر إيصال نجاح إلا بعد تأكيد API رسمي من مزود الدفع.'
                    : 'A success receipt appears only after confirmation from an official payment API.'}
                </p>
              </div>

              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
              {withdrawError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold leading-relaxed text-red-800" role="alert">
                  {withdrawError}
                </div>
              )}
              {/* Account summary display */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span>البنك المستلم:</span>
                  <span>بنك الكريمي للتمويل الأصغر الإسلامي</span>
                </div>
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span>نوع الحساب:</span>
                  <span>حساب جاري (Current Account)</span>
                </div>
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span>رقم الحساب:</span>
                  <span className="font-mono text-sm text-emerald-700 font-black">3181903553</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-emerald-200/60">
                  <span>الرصيد المتاح للسحب:</span>
                  <span className="font-extrabold text-slate-900">${kuraimiBalanceUSD.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'ar' ? 'المبلغ المطلوب سحبه' : 'Withdrawal Amount'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max={kuraimiBalanceUSD}
                    step="0.01"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full p-3 text-sm font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 pl-3 pr-16"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 right-3 font-bold text-xs text-slate-400">
                    USD ($)
                  </div>
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center gap-2 pt-1">
                  {[50, 100, 250, kuraimiBalanceUSD].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWithdrawAmount(val.toString())}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    >
                      {val === kuraimiBalanceUSD ? (language === 'ar' ? 'الكل' : 'All') : `$${val}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'ar' ? 'البيان / ملاحظات التحويل' : 'Transfer Note'}
                </label>
                <input
                  type="text"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isProcessingWithdraw}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessingWithdraw ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تأكيد السحب والتحويل' : 'Confirm Withdrawal'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Transfer Receipt */}
      {showReceiptModal && lastReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-fadeIn border border-emerald-500/40">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'ar' ? 'تأكيد تحويل من مزود الدفع' : 'Provider-confirmed transfer'}
              </h3>
              <p className="text-xs text-slate-500">
                  {language === 'ar'
                  ? 'تم عرض هذا الإيصال فقط بعد استلام تأكيد مكتمل من خادم مزود الدفع.'
                  : 'This receipt is shown only after the payment server confirms completion.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">رقم السند المرجعي:</span>
                <span className="font-mono font-bold text-slate-900">{lastReceipt.txId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">البنك المستلم:</span>
                <span className="font-bold text-slate-900">{lastReceipt.bank}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">رقم الحساب الجاري:</span>
                <span className="font-mono font-extrabold text-emerald-700">{lastReceipt.account}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">المبلغ المحول:</span>
                <span className="text-sm font-black text-emerald-700">${lastReceipt.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">رسوم المعالجة:</span>
                <span className="font-bold text-slate-900">{lastReceipt.fee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">تاريخ ووقت العملية:</span>
                <span className="font-medium text-slate-700">{lastReceipt.date}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all"
              >
                {language === 'ar' ? 'إغلاق ومتابعة الرصيد' : 'Done & View Balance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Kuraimi USD Account */}
      {showEditKuraimiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn border border-emerald-500/30">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    بنك الكريمي الإسلامي
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    عملة USD ($)
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {language === 'ar' ? 'تعديل أو تأكيد رقم الحساب بالدولار' : 'Edit Kuraimi USD Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'رقم حساب محفوظ محلياً؛ لا يعني اعتماداً مصرفياً أو تفويضاً للتحويل.'
                    : 'Account number stored locally; this does not mean bank verification or transfer authorization.'}
                </p>
              </div>
              <button
                onClick={() => setShowEditKuraimiModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKuraimiAccount} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'ar' ? 'رقم الحساب الجاري في بنك الكريمي (USD)' : 'Kuraimi Account Number (USD)'}
                </label>
                <input
                  type="text"
                  required
                  value={editKuraimiAccountNumber}
                  onChange={(e) => setEditKuraimiAccountNumber(e.target.value)}
                  placeholder="3181903553"
                  className="w-full p-3 font-mono font-bold text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  {language === 'ar' ? 'الرقم الافتراضي المعتمد: 3181903553' : 'Current default: 3181903553'}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'ar' ? 'عملة الحساب الأساسية' : 'Account Currency'}
                </label>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
                  <span>الدولار الأمريكي (USD - $)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditKuraimiModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs"
                >
                  {language === 'ar' ? 'حفظ وتحديث الحساب' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Other Payment Method */}
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
                <label className="text-xs font-bold text-slate-700">نوع الحساب</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bank', 'wallet', 'card'] as const).map((tType) => (
                    <button
                      key={tType}
                      type="button"
                      onClick={() => setType(tType)}
                      className={`py-2 text-xs font-bold rounded-xl capitalize transition-all border ${
                        type === tType
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">اسم الحساب / المحفظة</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حساب بنكي إضافي أو محفظة إلكترونية"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">اسم البنك أو المزود</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="مثال: بنك الكريمي أو PayPal أو محفظة USDT"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">رقم الحساب / العنوان</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. •••• 9012"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  حفظ الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
