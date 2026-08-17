import React, { useState } from 'react';
import { Language, WorkMode } from '../types';
import { t } from '../utils/localization';
import {
  Settings,
  Globe,
  HardDrive,
  Cloud,
  ShieldCheck,
  Bell,
  Fingerprint,
  Save,
  CheckCircle2,
  GitBranch,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Layers
} from 'lucide-react';

interface SettingsViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  workMode: WorkMode;
  onWorkModeChange: (mode: WorkMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onLanguageChange,
  workMode,
  onWorkModeChange,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsRequired, setBiometricsRequired] = useState(true);
  const [autoCloudSync, setAutoCloudSync] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17123d] via-[#1a1448] to-[#120d2f] rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-900/50 rounded-2xl border border-purple-500/30">
            <Settings className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'ar' ? 'الإعدادات والربط السحابي و CI/CD' : 'Settings & Cloud CI/CD'}
            </h2>
            <p className="text-purple-200/80 text-xs sm:text-sm mt-0.5">
              {language === 'ar'
                ? 'إدارة مفاتيح بصمة التطبيق، إعدادات GitHub Actions، ومزامنة Firebase'
                : 'Manage app keystore fingerprints, GitHub Actions CI/CD pipeline, and Firebase sync'}
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{t(language, 'settingsSavedMessage')}</span>
        </div>
      )}

      {/* GitHub Actions CI/CD Integration & Workflow Card */}
      <div className="bg-[#151034] rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-extrabold text-white">
              {language === 'ar' ? 'مستودع GitHub وخط سير العمل CI/CD' : 'GitHub Repository & CI/CD Workflow'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
            Workflow: main.yml Active ✓
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">مستودع الأكواد (Repository URL):</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    'https://github.com/aboanasanam42-cpu/https-github.com-aboanasanam42-cpu-ALromimah23.git',
                    'repo'
                  )
                }
                className="text-purple-300 hover:text-white flex items-center gap-1 font-bold"
              >
                {copiedKey === 'repo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'repo' ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
            <div className="font-mono text-purple-200 text-[11px] break-all bg-black/40 p-2 rounded-xl border border-purple-500/20">
              https://github.com/aboanasanam42-cpu/https-github.com-aboanasanam42-cpu-ALromimah23.git
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-1">
              <span className="text-slate-400 font-bold">ملف سير العمل الآلي (Action File):</span>
              <div className="font-mono text-emerald-400 font-bold">.github/workflows/main.yml</div>
            </div>
            <div className="p-3 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-1">
              <span className="text-slate-400 font-bold">الفرع الأساسي (Target Branch):</span>
              <div className="font-mono text-sky-400 font-bold">main (Production Ready)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Android Keystore Fingerprints & App Integrity (User Provided Credentials) */}
      <div className="bg-[#151034] rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">
              {language === 'ar' ? 'بصمات أمان التطبيق (Android App Integrity)' : 'Android Integrity Keystore Fingerprints'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
            Verified Debug Keys
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* SHA-1 Fingerprint */}
          <div className="p-3.5 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">SHA-1 Fingerprint (Google Sign-In / Firebase Auth):</span>
              <button
                onClick={() =>
                  copyToClipboard('62:12:9C:F6:07:4E:E8:AA:9B:BB:BD:FB:2A:A4:83:80:FB:19:B9:2C', 'sha1')
                }
                className="text-purple-300 hover:text-white flex items-center gap-1 font-bold"
              >
                {copiedKey === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sha1' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="font-mono text-emerald-400 text-[11px] break-all bg-black/40 p-2 rounded-xl border border-purple-500/20">
              62:12:9C:F6:07:4E:E8:AA:9B:BB:BD:FB:2A:A4:83:80:FB:19:B9:2C
            </div>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="p-3.5 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">SHA-256 Fingerprint (App Integrity / Phone Auth):</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    '13:78:40:C8:8D:07:E3:26:F9:06:35:4C:C0:79:18:20:DF:4A:A8:38:19:5D:71:A2:2E:B2:AD:65:D8:6B:FF:B5',
                    'sha256'
                  )
                }
                className="text-purple-300 hover:text-white flex items-center gap-1 font-bold"
              >
                {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sha256' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="font-mono text-cyan-400 text-[11px] break-all bg-black/40 p-2 rounded-xl border border-purple-500/20">
              13:78:40:C8:8D:07:E3:26:F9:06:35:4C:C0:79:18:20:DF:4A:A8:38:19:5D:71:A2:2E:B2:AD:65:D8:6B:FF:B5
            </div>
          </div>

          {/* MD5 Fingerprint */}
          <div className="p-3.5 bg-[#120d2c] rounded-2xl border border-purple-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">MD5 Fingerprint:</span>
              <button
                onClick={() => copyToClipboard('E7:A0:1E:94:EE:F4:A0:AD:E5:1C:DE:24:8E:BD:FC:53', 'md5')}
                className="text-purple-300 hover:text-white flex items-center gap-1 font-bold"
              >
                {copiedKey === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'md5' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="font-mono text-amber-400 text-[11px] break-all bg-black/40 p-2 rounded-xl border border-purple-500/20">
              E7:A0:1E:94:EE:F4:A0:AD:E5:1C:DE:24:8E:BD:FC:53
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Section */}
      <div className="bg-[#151034] rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-extrabold text-white">
            {t(language, 'languageSelector')}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onLanguageChange('en')}
            className={`p-4 rounded-2xl border font-bold text-xs flex items-center justify-between transition-all ${
              language === 'en'
                ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                : 'bg-[#120d2c] border-purple-500/20 text-slate-400 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span>English (EN)</span>
            </div>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
          </button>

          <button
            onClick={() => onLanguageChange('ar')}
            className={`p-4 rounded-2xl border font-bold text-xs flex items-center justify-between transition-all ${
              language === 'ar'
                ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                : 'bg-[#120d2c] border-purple-500/20 text-slate-400 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇸🇦</span>
              <span>العربية (AR)</span>
            </div>
            {language === 'ar' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-purple-900/50 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{t(language, 'saveSettingsBtn')}</span>
        </button>
      </div>
    </div>
  );
};
