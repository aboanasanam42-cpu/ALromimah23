import React, { useState } from 'react';
import { Opportunity, ActiveProject, Language, WorkMode, NavigationTab, OpportunityCategory } from '../types';
import { CATEGORIES_LIST } from '../data/mockData';
import {
  Bell,
  Menu,
  Sparkles,
  SlidersHorizontal,
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  TrendingUp,
  Briefcase,
  PieChart,
  DollarSign,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Laptop,
  BookOpen,
  Palette,
  LayoutGrid,
  Languages,
  GraduationCap,
  Brain,
  Stethoscope,
  Send,
  Pencil,
  FileText,
  CheckCircle2,
  Clock,
  Globe
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
  onSelectCategoryFilter,
  selectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedOpportunities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to render dynamic category icons matching the exact uploaded image
  const renderCategoryIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Laptop':
        return <Laptop className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      case 'LayoutGrid':
        return <LayoutGrid className={className} />;
      case 'Languages':
        return <Languages className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Stethoscope':
        return <Stethoscope className={className} />;
      default:
        return <LayoutGrid className={className} />;
    }
  };

  // Filter opportunities based on category and search query
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      opp.categoryKey === selectedCategory ||
      (selectedCategory === 'accounting' && opp.category.includes('حسابات')) ||
      (selectedCategory === 'design' && opp.category.includes('تصميم')) ||
      (selectedCategory === 'research' && opp.category.includes('بحوث')) ||
      (selectedCategory === 'translation' && opp.category.includes('ترجمة')) ||
      (selectedCategory === 'office_ai' && (opp.category.includes('Office') || opp.category.includes('ذكاء'))) ||
      (selectedCategory === 'education' && opp.category.includes('تعليم')) ||
      (selectedCategory === 'personal_dev' && opp.category.includes('تنمية')) ||
      (selectedCategory === 'medical' && opp.category.includes('طب'));

    const matchesSearch =
      !searchQuery.trim() ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 text-white max-w-5xl mx-auto">
      {/* Top App Header (Matching Screenshot) */}
      <div className="flex items-center justify-between pt-1 pb-2">
        {/* Notification Bell with Badge */}
        <button
          onClick={() => onNavigate('opportunities')}
          className="relative p-2.5 rounded-2xl bg-[#171339] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400 transition-all shadow-md"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80 animate-pulse" />
        </button>

        {/* Center App Logo & Subtitle */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-purple-900/50">
              <div className="w-full h-full bg-[#0d0a24] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 text-sm tracking-tighter">
                  M
                </span>
              </div>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
              مريم <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
            </h1>
          </div>
          <p className="text-[11px] text-purple-200/70 font-medium tracking-wide">
            مساحة العمل عن بُعد
          </p>
        </div>

        {/* Hamburger Menu Icon */}
        <button
          onClick={() => onNavigate('settings')}
          className="p-2.5 rounded-2xl bg-[#171339] border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400 transition-all shadow-md"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* User Greeting & AI Assistant Pill (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-[#17123d] via-[#1a1448] to-[#120d2f] p-4 rounded-3xl border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-[2px] shadow-md">
              <div className="w-full h-full bg-[#110d29] rounded-[14px] flex items-center justify-center text-white font-extrabold text-lg">
                أ
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#120d2f]" />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
              مرحباً بك، أنس <span className="text-lg">👋</span>
            </h2>
            <p className="text-xs text-purple-200/80">
              لنجد أفضل الفرص المناسبة لمهاراتك اليوم
            </p>
          </div>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAIAssistant}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-purple-900/50 flex items-center gap-2 border border-purple-400/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>مساعد AI الذكي</span>
        </button>
      </div>

      {/* Top 4 Metric Cards (Matching Screenshot) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: New Opportunities */}
        <div
          onClick={() => onNavigate('opportunities')}
          className="bg-[#151034] hover:bg-[#1a1443] border border-purple-500/20 rounded-3xl p-4 text-center space-y-1.5 transition-all shadow-md cursor-pointer group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{opportunities.length + 17}</div>
          <div className="text-xs font-bold text-slate-300">فرصة جديدة</div>
          <div className="text-[10px] font-extrabold text-purple-300">اليوم 5+</div>
        </div>

        {/* Card 2: Match Percentage */}
        <div
          onClick={() => onNavigate('opportunities')}
          className="bg-[#151034] hover:bg-[#1a1443] border border-purple-500/20 rounded-3xl p-4 text-center space-y-1.5 transition-all shadow-md cursor-pointer group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform">
            <PieChart className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">89%</div>
          <div className="text-xs font-bold text-slate-300">نسبة التطابق</div>
          <div className="text-[10px] font-extrabold text-blue-400">عالية جداً</div>
        </div>

        {/* Card 3: Monthly Earnings */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-[#151034] hover:bg-[#1a1443] border border-purple-500/20 rounded-3xl p-4 text-center space-y-1.5 transition-all shadow-md cursor-pointer group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">1,250 $</div>
          <div className="text-xs font-bold text-slate-300">إجمالي أرباح هذا الشهر</div>
          <div className="text-[10px] font-extrabold text-emerald-400">+18%</div>
        </div>

        {/* Card 4: Active Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[#151034] hover:bg-[#1a1443] border border-purple-500/20 rounded-3xl p-4 text-center space-y-1.5 transition-all shadow-md cursor-pointer group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-amber-900/50 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{projects.length + 2}</div>
          <div className="text-xs font-bold text-slate-300">مشاريعي النشطة</div>
          <div className="text-[10px] font-extrabold text-amber-400">مشروعان مستحقان</div>
        </div>
      </div>

      {/* Search & Filter Bar (Matching Screenshot) */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن عمل أو خدمة..."
            className="w-full bg-[#151034] border border-purple-500/30 rounded-2xl py-3 px-4 ps-11 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-400 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-purple-300 absolute start-3.5 top-3.5" />
        </div>

        <button
          onClick={() => onSelectCategoryFilter('all')}
          className="px-4 py-3 bg-[#17123d] hover:bg-[#1f1850] text-purple-200 border border-purple-500/30 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span>تصفية</span>
        </button>
      </div>

      {/* 10 Main Categories Grid (Exact matching layout: 2 rows of 5 cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span>التصنيفات الرئيسية</span>
          </h3>
          <span className="text-[11px] text-purple-300 font-semibold">10 مجالات متخصصة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategoryFilter(cat.key)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[#211854] border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.02]'
                    : 'bg-[#151034] hover:bg-[#1b1542] border-purple-500/20'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${cat.bgColor} border ${cat.borderAccent} flex items-center justify-center ${cat.iconColor} group-hover:scale-110 transition-transform`}
                >
                  {renderCategoryIcon(cat.iconName, 'w-5 h-5')}
                </div>
                <span className="text-[11px] font-bold text-slate-200 leading-tight">
                  {cat.nameAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* "أفضل الفرص الموصى بها لك" Section (Matching Screenshot) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span>أفضل الفرص الموصى بها لك</span>
          </h3>
          <button
            onClick={() => onNavigate('opportunities')}
            className="text-xs font-bold text-purple-300 hover:text-purple-100 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

        <div className="space-y-3">
          {filteredOpportunities.slice(0, 3).map((opp, idx) => {
            const isSaved = !!savedOpportunities[opp.id];
            const iconBg =
              idx === 0
                ? 'bg-purple-900/50 text-purple-300 border-purple-500/30'
                : idx === 1
                ? 'bg-amber-900/50 text-amber-300 border-amber-500/30'
                : 'bg-cyan-900/50 text-cyan-300 border-cyan-500/30';

            return (
              <div
                key={opp.id}
                onClick={() => onOpenProposal(opp)}
                className="bg-[#151034] hover:bg-[#1a1443] border border-purple-500/25 rounded-3xl p-4 sm:p-5 transition-all shadow-lg hover:border-purple-400 cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Circle icon */}
                    <div className={`w-11 h-11 rounded-2xl ${iconBg} border flex items-center justify-center shrink-0`}>
                      {idx === 0 ? (
                        <Pencil className="w-5 h-5" />
                      ) : idx === 1 ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Languages className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">{opp.title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold">
                          جديد
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold">
                          تطابق {opp.matchScore || opp.score || 94}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                        <span className="font-extrabold text-emerald-400">$ {opp.rawPayoutUSD}</span>
                        <span>•</span>
                        <span>{opp.executionDurationDays}-{opp.executionDurationDays + 1} أيام</span>
                        <span>•</span>
                        <span className="text-purple-300">عن بُعد</span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(opp.id, e)}
                    className="p-2 text-slate-400 hover:text-purple-300 transition-colors"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300/90 leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProposal(opp);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <span>تقديم الآن</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Bottom Widget Cards: "مشاريعي" & "نظرة عامة على الدخل" (Matching Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Left Widget: "مشاريعي" */}
        <div className="bg-[#151034] border border-purple-500/25 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">مشاريعي</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-purple-300 hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => {
              const completedCount = p.steps.filter((s) => s.completed).length;
              const pct = Math.round((completedCount / p.steps.length) * 100);

              return (
                <div
                  key={p.id}
                  onClick={() => onNavigate('projects')}
                  className="p-3 bg-[#1b1542] hover:bg-[#221b52] rounded-2xl border border-purple-500/20 flex items-center justify-between gap-3 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Circular progress gauge */}
                    <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-purple-950/60"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-cyan-400"
                          strokeDasharray={`${pct}, 100`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-[9px] font-black text-cyan-300">
                        {pct}%
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] text-slate-400">العميل: {p.client}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950/40 rounded-md">
                    ${p.payoutUSD}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ مشروع جديد</span>
          </button>
        </div>

        {/* Right Widget: "نظرة عامة على الدخل" */}
        <div className="bg-[#151034] border border-purple-500/25 rounded-3xl p-5 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
                <span>هذا الشهر</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-extrabold text-white">نظرة عامة على الدخل</h3>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-2xl font-black text-white">1,250 $</span>
                <span className="text-xs text-slate-400 block mt-0.5">إجمالي الأرباح</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold">
                +18%
              </span>
            </div>

            {/* Smooth SVG Earnings Chart (Matching Screenshot) */}
            <div className="mt-3 relative h-28 w-full">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#3730a3" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1="55" x2="300" y2="55" stroke="#3730a3" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#3730a3" strokeDasharray="3 3" strokeOpacity="0.3" />

                {/* Area Fill */}
                <path
                  d="M 0 85 Q 50 82, 100 65 T 200 50 T 260 30 L 290 15 L 290 95 L 0 95 Z"
                  fill="url(#purpleGradient)"
                />

                {/* Smooth Curve */}
                <path
                  d="M 0 85 Q 50 82, 100 65 T 200 50 T 260 30 L 290 15"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* End Point Glow */}
                <circle cx="290" cy="15" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
              </svg>

              {/* X-Axis labels */}
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-1 font-semibold">
                <span>1</span>
                <span>8</span>
                <span>15</span>
                <span>22</span>
                <span>30</span>
              </div>
            </div>
          </div>

          {/* Bottom received vs pending boxes */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-purple-500/20 text-center">
            <div className="bg-[#1b1542] p-2.5 rounded-2xl border border-purple-500/20">
              <span className="text-[11px] text-slate-300 font-bold block">تم استلامها</span>
              <span className="text-sm font-extrabold text-emerald-400">950 $</span>
            </div>

            <div className="bg-[#1b1542] p-2.5 rounded-2xl border border-purple-500/20">
              <span className="text-[11px] text-slate-300 font-bold block">قيد الانتظار</span>
              <span className="text-sm font-extrabold text-amber-400">300 $</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
