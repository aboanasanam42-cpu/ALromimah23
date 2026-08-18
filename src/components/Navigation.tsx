import React from 'react';
import { NavigationTab, Language } from '../types';
import { t } from '../utils/localization';
import {
  LayoutGrid,
  TrendingUp,
  Briefcase,
  BrainCircuit,
  CreditCard,
  UploadCloud,
  ShieldAlert,
  Settings,
  Plus,
  FileText,
  User
} from 'lucide-react';

interface NavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
  onOpenCenterAction?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  language,
  onOpenCenterAction,
}) => {
  const topNavItems: { id: NavigationTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Home', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'opportunities', labelAr: 'الفرص المتاحة', labelEn: 'Jobs Feed', icon: <FileText className="w-4 h-4" /> },
    { id: 'projects', labelAr: 'المشاريع والتسليم', labelEn: 'My Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'payments', labelAr: 'الدخل والمحفظة', labelEn: 'Earnings & Wallet', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'ai-analyzer', labelAr: 'محلل العقود AI', labelEn: 'AI Contract Analyzer', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'cloud-sync', labelAr: 'المزامنة السحابية', labelEn: 'Firebase Sync', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'security', labelAr: 'الأمان وبصمة التطبيق', labelEn: 'Security & Keystore', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'settings', labelAr: 'الإعدادات و CI/CD', labelEn: 'Settings & Repo', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop Horizontal Navigation Tabs */}
      <nav className="hidden lg:block bg-[#0e0a29]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {topNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/60 border border-purple-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-purple-900/30'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Bottom Navigation Bar (Matching App Mobile Screenshot) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0926]/95 backdrop-blur-xl border-t border-purple-500/25 px-4 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* Tab 1: Home (الرئيسية) */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all flex-1 cursor-pointer ${
              activeTab === 'dashboard' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>

          {/* Tab 2: Opportunities (الفرص) */}
          <button
            onClick={() => onSelectTab('opportunities')}
            className={`flex flex-col items-center gap-1 transition-all flex-1 cursor-pointer ${
              activeTab === 'opportunities' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-bold">الفرص</span>
          </button>

          {/* Center Glowing Action Button (+) */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={onOpenCenterAction}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-xl shadow-purple-900/80 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-full h-full bg-[#17123f] rounded-full flex items-center justify-center text-white">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>

          {/* Tab 4: Projects (المشاريع) */}
          <button
            onClick={() => onSelectTab('projects')}
            className={`flex flex-col items-center gap-1 transition-all flex-1 cursor-pointer ${
              activeTab === 'projects' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-bold">المشاريع</span>
          </button>

          {/* Tab 5: Profile & Wallet (الملف الشخصي) */}
          <button
            onClick={() => onSelectTab('payments')}
            className={`flex flex-col items-center gap-1 transition-all flex-1 cursor-pointer ${
              activeTab === 'payments' || activeTab === 'settings' || activeTab === 'security'
                ? 'text-purple-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">الملف الشخصي</span>
          </button>
        </div>
      </nav>
    </>
  );
};
