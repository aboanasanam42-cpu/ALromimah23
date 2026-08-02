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

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <Settings className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(language, 'settingsHeader')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              {t(language, 'settingsSub')}
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t(language, 'settingsSavedMessage')}</span>
        </div>
      )}

      {/* Language Selector Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t(language, 'languageSelector')}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'يدعم التطبيق الواجهة باللغتين العربية والإنجليزية مع تعديل اتجاه النص RTL تلقائياً' : 'Dual-language support with automatic RTL text alignment'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onLanguageChange('en')}
            className={`p-4 rounded-xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
              language === 'en'
                ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇺🇸</span>
              <span>English (EN)</span>
            </div>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
          </button>

          <button
            onClick={() => onLanguageChange('ar')}
            className={`p-4 rounded-xl border-2 font-bold text-xs flex items-center justify-between transition-all ${
              language === 'ar'
                ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇸🇦</span>
              <span>العربية (AR)</span>
            </div>
            {language === 'ar' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
          </button>
        </div>
      </div>

      {/* Workspace Operating Mode Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t(language, 'workModeSelector')}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'ar' ? 'اختر وضعية تخزين ومزامنة البيانات المطلوبة' : 'Choose how data persistence and sync is executed'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onWorkModeChange('local')}
            className={`p-4 rounded-xl border-2 text-left rtl:text-right transition-all ${
              workMode === 'local'
                ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <HardDrive className="w-5 h-5 text-amber-600 mb-2" />
            <div className="text-xs font-bold">{t(language, 'localMode')}</div>
            <div className="text-[10px] text-amber-800 font-extrabold mt-0.5">{t(language, 'localModeAr')}</div>
          </button>

          <button
            onClick={() => onWorkModeChange('cloud')}
            className={`p-4 rounded-xl border-2 text-left rtl:text-right transition-all ${
              workMode === 'cloud'
                ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Cloud className="w-5 h-5 text-sky-600 mb-2" />
            <div className="text-xs font-bold">{t(language, 'cloudMode')}</div>
            <div className="text-[10px] text-sky-800 font-extrabold mt-0.5">{t(language, 'cloudModeAr')}</div>
          </button>

          <button
            onClick={() => onWorkModeChange('hybrid')}
            className={`p-4 rounded-xl border-2 text-left rtl:text-right transition-all ${
              workMode === 'hybrid'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <div className="text-xs font-bold">{t(language, 'hybridMode')}</div>
            <div className="text-[10px] text-emerald-800 font-extrabold mt-0.5">{t(language, 'hybridModeAr')}</div>
          </button>
        </div>
      </div>

      {/* Preferences Toggles */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          {language === 'ar' ? 'التفضيلات والإشعارات' : 'Preferences & Security Controls'}
        </h3>

        <div className="space-y-3 divide-y divide-slate-100">
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t(language, 'notificationsToggle')}</div>
                <div className="text-[11px] text-slate-500">Receive alert when high scam risk is detected in opportunities</div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                notificationsEnabled ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                notificationsEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t(language, 'biometricToggle')}</div>
                <div className="text-[11px] text-slate-500">Enforce BiometricWrapper security check on session boot</div>
              </div>
            </div>
            <button
              onClick={() => setBiometricsRequired(!biometricsRequired)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                biometricsRequired ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                biometricsRequired ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t(language, 'autoBackupToggle')}</div>
                <div className="text-[11px] text-slate-500">Automated background worker uploads encrypted snapshots</div>
              </div>
            </div>
            <button
              onClick={() => setAutoCloudSync(!autoCloudSync)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                autoCloudSync ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                autoCloudSync ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{t(language, 'saveSettingsBtn')}</span>
        </button>
      </div>
    </div>
  );
};
