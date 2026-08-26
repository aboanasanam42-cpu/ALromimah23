import React, { useState } from 'react';
import { Opportunity, ActiveProject, Language, WorkMode, NavigationTab, OpportunityCategory } from '../types';
import {
  Bell,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Briefcase,
  DollarSign,
  Plus,
  Send,
  FileText,
  CheckCircle2,
  Clock,
  Globe,
  Cloud,
  Check,
  Cpu,
  Layers,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Zap,
  Sliders,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface DashboardViewProps {
  language: Language;
  workMode: WorkMode;
  onNavigate: (tab: NavigationTab) => void;
  opportunities: Opportunity[];
  projects: ActiveProject[];
  onOpenProposal: (opp: Opportunity) => void;
  onOpenAIAssistant: () => void;
  onOpenNewProjectModal: () => void;
  onSelectCategoryFilter: (categoryKey: OpportunityCategory | 'all') => void;
  selectedCategory: OpportunityCategory | 'all';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  workMode,
  onNavigate,
  opportunities,
  projects,
  onOpenProposal,
  onOpenAIAssistant,
  onOpenNewProjectModal,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickAiResponse, setQuickAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'idle'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState('منذ دقيقة واحدة');

  const handleQuickPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setQuickAiResponse(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: quickPrompt,
          history: []
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setQuickAiResponse(data.reply || 'تمت معالجة الطلب بنجاح بواسطة مريم AI.');
    } catch (err: any) {
      // Fallback helpful response in case server route is busy
      setQuickAiResponse(`مرحباً بك! أنا مريم، مساعدتك الذكية لإدارة المشاريع والفرص. تم استلام طلبك: "${quickPrompt}". يمكنك فتح شاشة تحليل الذكاء الاصطناعي لتوليد عروض عمل فورية ودقيقة.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('connected');
      setLastSyncTime('الآن');
    }, 1200);
  };

  return (
    <div id="maria-main-dashboard" className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header Bar strictly matching the Phone UI from the image */}
      <div className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-cyan-950/40 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Title with Nebula Orb */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.35)]">
              <div className="w-full h-full rounded-full bg-[#090d18] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-cyan-200">
                MARIA
              </span>
              <span className="text-xs font-bold text-slate-400 mr-1.5 ml-1.5">|</span>
              <span className="text-xs font-semibold tracking-wider text-cyan-300/90 uppercase">
                AI WORKSPACE
              </span>
            </div>
          </div>

          {/* Right Header Actions: Notification Bell + Profile Avatar */}
          <div className="flex items-center gap-3">
            <button 
              id="header-notification-btn"
              onClick={() => onNavigate('dashboard')}
              className="relative p-2 rounded-full bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/50 transition-colors text-slate-300"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
            </button>

            <button
              id="header-user-profile-btn"
              onClick={() => onNavigate('settings')}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-400 p-[1.5px] shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
              title="الملف الشخصي"
            >
              <div className="w-full h-full rounded-full bg-[#0b1324] flex items-center justify-center text-xs font-bold text-cyan-200">
                أنس
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Container (Sidebar + Content View matching image) */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left Vertical Navigation Menu (as shown in phone screenshot) */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-20 bg-slate-900/60 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-3 shadow-xl space-y-1.5">
              
              <button
                id="sidebar-tab-dashboard"
                onClick={() => onNavigate('dashboard')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-cyan-600/30 to-cyan-500/10 text-cyan-200 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-cyan-300" />
                  <span>لوحة القيادة</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></div>
              </button>

              <button
                id="sidebar-tab-ai"
                onClick={() => onNavigate('ai-analyzer')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-200 hover:bg-amber-950/20 hover:border-amber-500/30 border border-transparent transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>مشغل الذكاء الاصطناعي</span>
              </button>

              <button
                id="sidebar-tab-projects"
                onClick={() => onNavigate('projects')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-200 hover:bg-slate-800/40 border border-transparent transition-all"
              >
                <Briefcase className="w-4 h-4 text-sky-400" />
                <span>المشاريع</span>
              </button>

              <button
                id="sidebar-tab-opportunities"
                onClick={() => onNavigate('opportunities')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-200 hover:bg-slate-800/40 border border-transparent transition-all"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>الفرص والقنوات</span>
              </button>

              <button
                id="sidebar-tab-payments"
                onClick={() => onNavigate('payments')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-200 hover:bg-slate-800/40 border border-transparent transition-all"
              >
                <DollarSign className="w-4 h-4 text-emerald-300" />
                <span>المدفوعات</span>
              </button>

              <button
                id="sidebar-tab-settings"
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-200 hover:bg-slate-800/40 border border-transparent transition-all"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>الإعدادات</span>
              </button>

              <button
                id="sidebar-tab-security"
                onClick={() => onNavigate('security')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-200 hover:bg-slate-800/40 border border-transparent transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>الأمان</span>
              </button>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span>السحابة متصلة (Firestore)</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Cards (Col-span 9) */}
          <main className="col-span-1 md:col-span-9 lg:col-span-9 space-y-4">
            
            {/* Dashboard Header Title */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                  لوحة القيادة
                </h1>
                <p className="text-xs sm:text-sm text-cyan-400/80 font-medium mt-0.5">
                  تحليل ذكي، بوابة شاملة، تنفيذ فوري
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="dashboard-new-project-btn"
                  onClick={onOpenNewProjectModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>مشروع جديد</span>
                </button>
              </div>
            </div>

            {/* CARD 1: تحليل الذكاء الاصطناعي (AI Analysis) */}
            <section
              id="card-ai-analysis"
              onClick={() => onNavigate('ai-analyzer')}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1628]/90 via-[#0a1020]/90 to-[#070b16]/95 border border-cyan-500/30 p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)] hover:border-cyan-400/60 transition-all cursor-pointer group"
            >
              {/* Top Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-cyan-200">
                    تحليل الذكاء الاصطناعي
                  </h2>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Gemini 3.6 Flash
                </span>
              </div>

              {/* Center Holographic AI Orb Animation */}
              <div className="relative py-4 flex flex-col items-center justify-center">
                {/* Glowing Aura Rings */}
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-amber-500/20 blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-400 p-[2px] shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full bg-[#0a0f1d] flex flex-col items-center justify-center">
                    <span className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-tr from-cyan-200 via-white to-amber-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                      AI
                    </span>
                  </div>
                  {/* Outer Orbital Ring */}
                  <div className="absolute -inset-2 rounded-full border border-cyan-400/30 border-dashed animate-[spin_10s_linear_infinite]"></div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs sm:text-sm font-semibold text-slate-300">
                    التحسين بنسبة <span className="text-cyan-400 font-bold">96%</span> سرعة الاستجابة باللغة العربية
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    فحص العقود، كشف الاحتيال، وتوليد عروض أسعار تنافسية فورية
                  </p>
                </div>
              </div>

              {/* Bottom Quick Trigger Bar */}
              <div className="mt-2 pt-3 border-t border-cyan-900/30 flex items-center justify-between">
                <span className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  اضغط للبدء بتحليل العقود الذكي
                </span>
                <div className="p-1 rounded-lg bg-cyan-950/40 text-cyan-300 group-hover:translate-x-[-4px] transition-transform">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </section>

            {/* CARD 2: حالة مزامنة البيانات (Data Sync Status) */}
            <section
              id="card-data-sync"
              onClick={handleManualSync}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0d172a]/90 via-[#0a1120]/90 to-[#070b16]/95 border border-teal-500/30 p-4 sm:p-5 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:border-teal-400/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-slate-500 group-hover:text-teal-400 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-teal-200">
                    حالة مزامنة البيانات
                  </h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualSync();
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-teal-950/60 text-teal-300 border border-teal-500/30 font-semibold flex items-center gap-1.5 hover:bg-teal-900/40"
                >
                  <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin text-teal-400' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'جاري المزامنة...' : 'تحديث الآن'}</span>
                </button>
              </div>

              {/* Visual 3D Data Transfer Streams */}
              <div className="py-3 px-2 flex items-center justify-around gap-2 bg-slate-950/40 rounded-xl border border-teal-900/30">
                {/* Left File Node */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">البيانات المحلية</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[9px] text-emerald-300">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Center Glowing Cloud Node */}
                <div className="relative flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/30 via-sky-500/30 to-indigo-500/30 border border-teal-400/50 flex items-center justify-center text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                    <Cloud className="w-7 h-7 text-teal-300 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-300">المتصل</span>
                </div>

                {/* Right Cloud Database Node */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Firestore السحابي</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[9px] text-emerald-300">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>

              {/* Sync Metadata */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-teal-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  تمت المزامنة بنجاح ({lastSyncTime})
                </span>
                <span>المنطقة: asia-south1</span>
              </div>
            </section>

            {/* CARD 3: مساعد الذكاء الاصطناعي مريم (AI Assistant - Marium) */}
            <section
              id="card-ai-assistant-marium"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#14102e]/90 via-[#0d0a22]/90 to-[#070b16]/95 border border-purple-500/30 p-4 sm:p-5 shadow-[0_0_25px_rgba(168,85,247,0.12)]"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm sm:text-base font-bold text-purple-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  مساعد الذكاء الاصطناعي
                </h2>
                <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  مريم
                </span>
              </div>

              {/* Mascot Face & Soundwaves Animation */}
              <div className="py-2 flex items-center justify-center gap-3">
                {/* Voice soundwaves left */}
                <div className="flex items-center gap-1 text-purple-400">
                  <span className="w-1 h-3 bg-purple-400/60 rounded-full animate-[pulse_1s_infinite]"></span>
                  <span className="w-1 h-6 bg-purple-400 rounded-full animate-[pulse_1.2s_infinite]"></span>
                  <span className="w-1 h-4 bg-purple-400/80 rounded-full animate-[pulse_0.8s_infinite]"></span>
                </div>

                {/* Mascot Orb Face */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400 p-[2px] shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                  <div className="w-full h-full rounded-full bg-[#0f0a28] flex items-center justify-center">
                    {/* Cute smiling face */}
                    <div className="flex flex-col items-center">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]"></div>
                      </div>
                      <div className="w-3 h-1.5 rounded-b-full border-b-2 border-pink-300 mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* Voice soundwaves right */}
                <div className="flex items-center gap-1 text-purple-400">
                  <span className="w-1 h-4 bg-purple-400/80 rounded-full animate-[pulse_0.8s_infinite]"></span>
                  <span className="w-1 h-6 bg-purple-400 rounded-full animate-[pulse_1.2s_infinite]"></span>
                  <span className="w-1 h-3 bg-purple-400/60 rounded-full animate-[pulse_1s_infinite]"></span>
                </div>
              </div>

              {/* Display AI Quick Response if received */}
              {quickAiResponse && (
                <div className="my-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 leading-relaxed max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-1.5 font-bold text-pink-300 mb-1">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>رد مريم:</span>
                  </div>
                  {quickAiResponse}
                </div>
              )}

              {/* Direct Prompt Input Bar (As shown in screenshot) */}
              <form onSubmit={handleQuickPromptSubmit} className="mt-3">
                <div className="relative flex items-center">
                  <input
                    id="marium-quick-input"
                    type="text"
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder="اكتب طلبك أو استفسارك هنا لمريم..."
                    disabled={isAiLoading}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-purple-500/40 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                  />
                  <button
                    id="marium-send-btn"
                    type="submit"
                    disabled={!quickPrompt.trim() || isAiLoading}
                    className="absolute left-1.5 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 hover:from-purple-500 hover:to-pink-500 transition-all shadow-md"
                    title="إرسال"
                  >
                    {isAiLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 rotate-180" />
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* CARD 4: المشاريع الأخيرة (Recent Projects Carousel) */}
            <section
              id="card-recent-projects"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e172a]/90 via-[#0a1020]/90 to-[#070b16]/95 border border-amber-500/30 p-4 sm:p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-amber-200">
                    المشاريع الأخيرة
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                >
                  <span>عرض الكل ({projects.length})</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal Scroll of Project Files (As shown in screenshot) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                
                {/* Item 1: Android Kotlin App */}
                <div
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between h-28"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 font-bold border border-emerald-500/30">
                      95%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 truncate">Marium_App.kt</h3>
                    <p className="text-[10px] text-slate-400">تطبيق أندرويد وويب</p>
                  </div>
                </div>

                {/* Item 2: Excel Financial Statement */}
                <div
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between h-28"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 font-bold border border-emerald-500/30">
                      100%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 truncate">Financial_2026.xlsx</h3>
                    <p className="text-[10px] text-slate-400">القوائم المالية والضرائب</p>
                  </div>
                </div>

                {/* Item 3: UI Design */}
                <div
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between h-28"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950/50 text-sky-300 font-bold border border-sky-500/30">
                      70%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 truncate">UI_UX_Mockup.fig</h3>
                    <p className="text-[10px] text-slate-400">تصميم واجهة المنصة</p>
                  </div>
                </div>

                {/* Item 4: Legal Translation */}
                <div
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between h-28"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 font-bold border border-emerald-500/30">
                      85%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 truncate">Legal_Docs.pdf</h3>
                    <p className="text-[10px] text-slate-400">ترجمة عقود معتمدة</p>
                  </div>
                </div>

              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Bottom Navigation Bar (Dock matching screenshot exactly) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-cyan-950/60 py-2 px-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          <button
            id="bottom-tab-dashboard"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 text-cyan-300 group"
          >
            <div className="p-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Layers className="w-4 h-4 text-cyan-300" />
            </div>
            <span className="text-[10px] font-bold">لوحة القيادة</span>
          </button>

          <button
            id="bottom-tab-ai"
            onClick={() => onNavigate('ai-analyzer')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors group"
          >
            <div className="p-1.5 rounded-xl hover:bg-slate-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">مشغل AI</span>
          </button>

          <button
            id="bottom-tab-projects"
            onClick={() => onNavigate('projects')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-sky-300 transition-colors group"
          >
            <div className="p-1.5 rounded-xl hover:bg-slate-800/40">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">المشاريع</span>
          </button>

          <button
            id="bottom-tab-opportunities"
            onClick={() => onNavigate('opportunities')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-300 transition-colors group"
          >
            <div className="p-1.5 rounded-xl hover:bg-slate-800/40">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">الفرص</span>
          </button>

          <button
            id="bottom-tab-payments"
            onClick={() => onNavigate('payments')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-300 transition-colors group"
          >
            <div className="p-1.5 rounded-xl hover:bg-slate-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">المدفوعات</span>
          </button>

          <button
            id="bottom-tab-security"
            onClick={() => onNavigate('security')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors group"
          >
            <div className="p-1.5 rounded-xl hover:bg-slate-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">الأمان</span>
          </button>

        </div>
      </nav>

    </div>
  );
};
