import React from 'react';
import { Language, WorkMode } from '../types';
import { t } from '../utils/localization';
import { Cpu, Globe, ShieldCheck, Cloud, HardDrive, RefreshCw, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  workMode: WorkMode;
  onWorkModeChange: (mode: WorkMode) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
  currentUser?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  workMode,
  onWorkModeChange,
  isSyncing,
  onTriggerSync,
  currentUser,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0d0a27]/95 backdrop-blur-md border-b border-purple-500/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {language === 'ar' ? 'مريم AI' : 'Miriam AI'}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Firebase Connected
                </span>
              </h1>
              <p className="text-[11px] text-purple-300/70 font-medium">
                {language === 'ar' ? 'منصة العمل السحابي والذكاء الاصطناعي' : 'Cloud Workspace & Opportunity Engine'}
              </p>
            </div>
          </div>

          {/* Mobile Sync Indicator */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="sm:hidden p-2 text-slate-300 hover:text-purple-400 rounded-lg hover:bg-purple-900/30 transition-colors"
            title="Sync Now"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        </div>

        {/* Right Controls: Mode Selector, Language Toggle, Auth Status */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Work Mode Badge / Selector */}
          <div className="flex items-center bg-[#151034] p-1 rounded-xl border border-purple-500/30">
            <button
              onClick={() => onWorkModeChange('local')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'local'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={t(language, 'localMode')}
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{t(language, 'localMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'محلي' : 'Local'}</span>
            </button>
            <button
              onClick={() => onWorkModeChange('cloud')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'cloud'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={t(language, 'cloudMode')}
            >
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">{t(language, 'cloudMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'سحابي' : 'Cloud'}</span>
            </button>
            <button
              onClick={() => onWorkModeChange('hybrid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                workMode === 'hybrid'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={t(language, 'hybridMode')}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{t(language, 'hybridMode')}</span>
              <span className="md:hidden">{language === 'ar' ? 'مزدوج' : 'Hybrid'}</span>
            </button>
          </div>

          {/* Sync Trigger Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#151034] hover:bg-purple-900/40 text-purple-200 text-xs font-semibold rounded-xl border border-purple-500/30 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
            <span>{isSyncing ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (language === 'ar' ? 'مزامنة السحابة' : 'Cloud Sync')}</span>
          </button>

          {/* Firebase Google Auth Button / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#151034] border border-purple-500/30 px-2.5 py-1 rounded-xl">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full border border-purple-400"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate hidden md:inline">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل دخول Google' : 'Sign in with Google'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 text-xs font-bold rounded-xl border border-purple-500/30 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
