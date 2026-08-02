import React from 'react';
import { NavigationTab, Language } from '../types';
import { t } from '../utils/localization';
import {
  LayoutDashboard,
  BrainCircuit,
  TrendingUp,
  UploadCloud,
  ShieldAlert,
  CreditCard,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  language,
}) => {
  const navItems: { id: NavigationTab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelKey: 'navDashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'ai-analyzer', labelKey: 'navAiAnalyzer', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'opportunities', labelKey: 'navOpportunities', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'cloud-sync', labelKey: 'navCloudSync', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'security', labelKey: 'navSecurity', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'payments', labelKey: 'navPayments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', labelKey: 'navSettings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop Horizontal Tab Bar */}
      <nav className="hidden lg:block bg-white border-b border-slate-200 sticky top-[61px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{t(language, item.labelKey as any)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile/Tablet Scrollable Horizontal Bar */}
      <nav className="lg:hidden bg-white border-b border-slate-200 overflow-x-auto px-4 py-2 flex items-center gap-1 sticky top-[100px] sm:top-[61px] z-20 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              <span>{t(language, item.labelKey as any)}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
