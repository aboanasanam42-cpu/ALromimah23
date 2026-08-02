import React from 'react';
import { NavigationTab, Language, WorkMode, Opportunity } from '../types';
import { t } from '../utils/localization';
import {
  BrainCircuit,
  UploadCloud,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface DashboardViewProps {
  language: Language;
  workMode: WorkMode;
  onNavigate: (tab: NavigationTab) => void;
  opportunities: Opportunity[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  workMode,
  onNavigate,
  opportunities,
}) => {
  const cards = [
    {
      id: 'ai-analyzer' as NavigationTab,
      titleKey: 'cardAiTitle',
      descKey: 'cardAiDesc',
      icon: <BrainCircuit className="w-8 h-8 text-sky-600" />,
      badge: 'Gemini 3.6',
      bgColor: 'bg-sky-50 border-sky-100',
    },
    {
      id: 'cloud-sync' as NavigationTab,
      titleKey: 'cardSyncTitle',
      descKey: 'cardSyncDesc',
      icon: <UploadCloud className="w-8 h-8 text-indigo-600" />,
      badge: workMode === 'local' ? 'Local DB' : workMode === 'cloud' ? 'Firebase Live' : 'Hybrid Active',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      id: 'opportunities' as NavigationTab,
      titleKey: 'cardTrendsTitle',
      descKey: 'cardTrendsDesc',
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      badge: `${opportunities.length} Active`,
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      id: 'security' as NavigationTab,
      titleKey: 'cardSecurityTitle',
      descKey: 'cardSecurityDesc',
      icon: <ShieldAlert className="w-8 h-8 text-amber-600" />,
      badge: 'AES-256 Pass',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      id: 'payments' as NavigationTab,
      titleKey: 'cardPaymentsTitle',
      descKey: 'cardPaymentsDesc',
      icon: <CreditCard className="w-8 h-8 text-violet-600" />,
      badge: 'Escrow Ready',
      bgColor: 'bg-violet-50 border-violet-100',
    },
    {
      id: 'settings' as NavigationTab,
      titleKey: 'cardSettingsTitle',
      descKey: 'cardSettingsDesc',
      icon: <Settings className="w-8 h-8 text-slate-600" />,
      badge: language.toUpperCase(),
      bgColor: 'bg-slate-50 border-slate-200',
    },
  ];

  const modeBadgeText = 
    workMode === 'local' ? (language === 'ar' ? 'العمل عبر التطبيق' : 'Local Mode')
    : workMode === 'cloud' ? (language === 'ar' ? 'العمل عبر السحابة' : 'Cloud Mode')
    : (language === 'ar' ? 'الوضع المزدوج' : 'Hybrid Mode');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sky-500/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-extrabold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                {modeBadgeText}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'ar' ? 'محرّك التقييم متصل' : 'Scoring Engine Online'}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t(language, 'welcomeTitle')}
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              {t(language, 'welcomeSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs text-slate-200">
            <Lock className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="font-bold text-white">
                {language === 'ar' ? 'تشفير ومصادقة بيومترية' : 'Encrypted & Authenticated'}
              </div>
              <div className="text-slate-400 text-[11px]">
                {language === 'ar' ? 'حالة الأمان 100% موثوقة' : 'System Security Index 100%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Main Cards (Matches Kotlin Jetpack Compose LazyVerticalGrid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            {language === 'ar' ? 'أدوات ومميزات بيئة العمل' : 'Workspace Modules'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ar' ? 'اختر وحدة للانتقال المباشر' : 'Click to launch module'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-105 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {t(language, card.titleKey as any)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {t(language, card.descKey as any)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{language === 'ar' ? 'فتح الوحدة' : 'Open Module'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Overview Stats & Verified Gigs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scoring Engine Highlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {language === 'ar' ? 'أبرز الوظائف وتقييم 100 نقطة' : 'Top Opportunities & 100-Point Evaluation'}
              </h4>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'محسوبة عبر خوارزمية التقييم المعتمدة' : 'Scored with 5-factor weighting algorithm'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              {language === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('opportunities')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{opp.title}</span>
                    {opp.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {language === 'ar' ? 'موثوق' : 'Verified'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>{opp.company}</span>
                    <span>•</span>
                    <span>{opp.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">${opp.rawPayoutUSD} USD</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right rtl:text-left">
                    <div className="text-xs font-bold text-slate-900">
                      {opp.totalScore} / 100
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      opp.riskLevel === 'Verified' ? 'bg-emerald-100 text-emerald-800'
                      : opp.riskLevel === 'Low Risk' ? 'bg-sky-100 text-sky-800'
                      : opp.riskLevel === 'Medium Risk' ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                    }`}>
                      {opp.riskLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
                {language === 'ar' ? 'حالة بيئة العمل' : 'Environment Diagnostics'}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h4 className="text-lg font-bold text-white">
              CloudWorker Engine
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar' 
                ? 'جميع المكونات (تشفير AES، مزامنة السحابة، الذكاء الاصطناعي) تعمل بكفاءة عالية'
                : 'All subsystems (AES cipher, CloudSync worker, Gemini AI API) are active.'}
            </p>

            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">{language === 'ar' ? 'وضع العمل' : 'Operating Mode'}</span>
                <span className="font-bold text-sky-300 capitalize">{workMode}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">{language === 'ar' ? 'محرك الذكاء الاصطناعي' : 'AI Provider'}</span>
                <span className="font-bold text-emerald-400">Gemini 3.6 Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'التشفير والمزامنة' : 'Encryption / Sync'}</span>
                <span className="font-bold text-indigo-300">Firebase + AES-256</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-analyzer')}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{language === 'ar' ? 'تجربة تحليل النصوص' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
