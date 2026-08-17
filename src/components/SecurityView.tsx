import React, { useState } from 'react';
import { Language, SecurityAuditItem } from '../types';
import { t } from '../utils/localization';
import {
  ShieldAlert,
  Fingerprint,
  KeyRound,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface SecurityViewProps {
  language: Language;
  auditLogs: SecurityAuditItem[];
}

export const SecurityView: React.FC<SecurityViewProps> = ({ language, auditLogs }) => {
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [plainInput, setPlainInput] = useState('CloudWorker Confidential Contract Payload');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [authStatusMsg, setAuthStatusMsg] = useState<string | null>(null);

  // Simple Base64 AES Simulator for client sandbox
  const handleEncrypt = () => {
    if (!plainInput) return;
    const encoded = btoa(encodeURIComponent(plainInput));
    setEncryptedOutput(`AES256::${encoded}`);
    setDecryptedOutput('');
  };

  const handleDecrypt = () => {
    if (!encryptedOutput) return;
    try {
      const stripped = encryptedOutput.replace('AES256::', '');
      const decoded = decodeURIComponent(atob(stripped));
      setDecryptedOutput(decoded);
    } catch {
      setDecryptedOutput('Invalid cipher text.');
    }
  };

  const handleSimulateBiometric = () => {
    setAuthStatusMsg(language === 'ar' ? 'جاري التحقق من البصمة البيومترية...' : 'Authenticating biometrics...');
    setTimeout(() => {
      setBiometricAuthenticated(true);
      setAuthStatusMsg(language === 'ar' ? 'تمت المصادقة البيومترية بنجاح ✓' : 'Biometric authentication succeeded ✓');
      setTimeout(() => setAuthStatusMsg(null), 3000);
    }, 800);
  };

  const handleCopy = () => {
    if (!encryptedOutput) return;
    navigator.clipboard.writeText(encryptedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(language, 'securityHeader')}
            </h2>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold rounded-full">
              BiometricWrapper
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {t(language, 'securitySub')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              {t(language, 'securityScoreLabel')}
            </div>
            <div className="text-xl font-extrabold text-white">98 / 100</div>
          </div>
        </div>
      </div>

      {/* Biometric & PIN Security Controls Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Biometrics Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {t(language, 'biometricStatus')}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'بصمة الإصبع أو التعرف على الوجه' : 'Touch ID / Face ID hardware wrapper'}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
              biometricAuthenticated ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {biometricAuthenticated ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'مقفل' : 'Locked')}
            </span>
          </div>

          <button
            onClick={handleSimulateBiometric}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{language === 'ar' ? 'اختبار التحقق البيومتري' : 'Test Biometric Authentication'}</span>
          </button>

          {authStatusMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center animate-fadeIn">
              {authStatusMsg}
            </div>
          )}
        </div>

        {/* PIN Code Protection Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {t(language, 'pinStatus')}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'رمز حماية مكون من 6 أرقام' : '6-digit encrypted fallback passkey'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPinEnabled(!pinEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                pinEnabled ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                  pinEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>{language === 'ar' ? 'رمز الحماية المسجل' : 'Registered Passkey'}</span>
            <span className="font-extrabold text-slate-900 font-mono">••••••</span>
          </div>
        </div>
      </div>

      {/* AES-256 Text Encryption Sandbox (Matches Kotlin BiometricWrapper encrypt & decrypt) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            {t(language, 'aesTesterTitle')}
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
            BiometricWrapper.encrypt() / decrypt()
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">
              {language === 'ar' ? 'النص الصريح (Plaintext Input)' : 'Plaintext Payload Input'}
            </label>
            <input
              type="text"
              value={plainInput}
              onChange={(e) => setPlainInput(e.target.value)}
              placeholder={t(language, 'encryptInputPlaceholder')}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEncrypt}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t(language, 'encryptBtn')}</span>
            </button>

            {encryptedOutput && (
              <button
                onClick={handleDecrypt}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{t(language, 'decryptBtn')}</span>
              </button>
            )}
          </div>

          {/* Cipher Text Result */}
          {encryptedOutput && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {t(language, 'encryptedOutput')}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl break-all">
                {encryptedOutput}
              </div>
            </div>
          )}

          {/* Decrypted Result */}
          {decryptedOutput && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">
                {t(language, 'decryptedOutput')}
              </span>
              <p className="text-xs font-bold text-emerald-900">
                {decryptedOutput}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Audit History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          {t(language, 'auditLogsTitle')}
        </h3>

        <div className="space-y-2">
          {auditLogs.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">{item.event}</div>
                <div className="text-[11px] text-slate-400">
                  {item.timestamp} • Category: {item.category}
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                {item.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
