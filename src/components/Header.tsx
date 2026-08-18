import React from 'react';
import { Language, WorkMode } from '../types';
import { t } from '../utils/localization';
import { Cpu, Globe, ShieldCheck, Cloud, HardDrive, RefreshCw } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  workMode: WorkMode;
  onWorkModeChange: (mode: WorkMode) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  workMode,
  onWorkModeChange,
  isSyncing,
  onTriggerSync,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-sky-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                {t(language, 'appName')}
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  v1.0 AI
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'ar' ? 'منصة العمل السحابي والذكاء الاصطناعي' : 'Cloud Workspace & Opportunity Engine'}
              </p>
            </div>
          </div>

          {/* Mobile Sync Indicator */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="sm:hidden p-2 text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Sync Now"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>

        {/* Right Controls: Mode Selector, Language Toggle, Status */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Work Mode Badge / Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onWorkModeChange('local')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'local'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t(language, 'localMode')}
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">{t(language, 'localMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'تطبيق' : 'Local'}</span>
            </button>
            <button
              onClick={() => onWorkModeChange('cloud')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'cloud'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t(language, 'cloudMode')}
            >
              <Cloud className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">{t(language, 'cloudMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'سحابة' : 'Cloud'}</span>
            </button>
            <button
              onClick={() => onWorkModeChange('hybrid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'hybrid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t(language, 'hybridMode')}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">{t(language, 'hybridMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'مزدوج' : 'Hybrid'}</span>
            </button>
          </div>

          {/* Sync Trigger Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
            <span>{isSyncing ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (language === 'ar' ? 'مزامنة' : 'Sync')}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'en' ? 'العربية (AR)' : 'English (EN)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
