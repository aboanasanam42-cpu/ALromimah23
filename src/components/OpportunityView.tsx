import React, { useState } from 'react';
import { Opportunity, Language, ScoreInput, OpportunityStatus } from '../types';
import { t } from '../utils/localization';
import { calculate100PointScore } from '../utils/scoring';
import { analyzeAndScoreOpportunity } from '../utils/aiOpportunityAnalyzer';
import {
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Award,
  DollarSign,
  X,
  Bookmark,
  Check,
  EyeOff,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface OpportunityViewProps {
  language: Language;
  opportunities: Opportunity[];
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunityStatus?: (id: string, status: OpportunityStatus) => void;
}

export const OpportunityView: React.FC<OpportunityViewProps> = ({
  language,
  opportunities,
  onAddOpportunity,
  onUpdateOpportunityStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Scoring Calculator Sliders State (0 - 100)
  const [scoreInput, setScoreInput] = useState<ScoreInput>({
    sourceReliability: 85,
    payoutValue: 80,
    executionDuration: 75,
    descriptionClarity: 90,
    antiFraudFilter: 95,
  });

  const computedBreakdown = calculate100PointScore(scoreInput);

  // New Opportunity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newCategory, setNewCategory] = useState('Software Engineering');
  const [newReward, setNewReward] = useState<number>(150);
  const [newDescription, setNewDescription] = useState('');
  const [newSkills, setNewSkills] = useState('');

  const filteredOpportunities = opportunities.map(analyzeAndScoreOpportunity).filter((opp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      opp.title.toLowerCase().includes(query) ||
      (opp.source || opp.company || '').toLowerCase().includes(query) ||
      opp.category.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(query));

    const oppStatus = opp.status || 'new';
    const matchesStatus = statusFilter === 'all' || oppStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const rawOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newTitle,
      company: newSource || 'Direct Source',
      source: newSource || 'Direct Source',
      category: newCategory,
      payoutValue: 80,
      rawPayoutUSD: Number(newReward) || 100,
      reward: Number(newReward) || 100,
      sourceReliability: 80,
      executionDurationDays: 7,
      executionDurationScore: 85,
      descriptionClarity: 90,
      antiFraudScore: 90,
      totalScore: 75,
      riskLevel: 'Low Risk',
      description: newDescription || 'فرصة جديدة مقدمة للتحليل والتقييم الذكي',
      verified: true,
      date: new Date().toISOString().split('T')[0],
      location: 'Remote',
      requiredSkills: newSkills ? newSkills.split(',').map((s) => s.trim()) : ['Remote Work'],
      status: 'new',
      createdAt: Date.now()
    };

    // Run through Kotlin AIOpportunityAnalyzer fraud detection & score calculation
    const analyzed = analyzeAndScoreOpportunity(rawOpp);

    onAddOpportunity(analyzed);
    setShowAddModal(false);

    // Reset Form
    setNewTitle('');
    setNewSource('');
    setNewDescription('');
    setNewSkills('');
    setNewReward(150);
  };

  const handleStatusChange = (id: string, status: OpportunityStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onUpdateOpportunityStatus) {
      onUpdateOpportunityStatus(id, status);
    }
  };

  const getScoreColorClass = (score: number, riskScore: number = 0) => {
    if (riskScore >= 50) return 'bg-rose-700 text-white'; // Suspicious Red
    if (score >= 90) return 'bg-[rgb(46,125,50)] text-white'; // Dark Green
    if (score >= 75) return 'bg-[rgb(21,101,192)] text-white'; // Deep Blue
    if (score >= 60) return 'bg-[rgb(245,127,23)] text-white'; // Dark Yellow/Orange
    if (score >= 40) return 'bg-[rgb(230,81,0)] text-white'; // Orange
    return 'bg-[rgb(198,40,40)] text-white'; // Red
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(language, 'opportunitiesHeader')}
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold rounded-full">
              Kotlin Engine Port
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {t(language, 'opportunitiesSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{t(language, 'calculatorTitle')}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة فرصة عمل جديدة' : 'Add New Job'}</span>
          </button>
        </div>
      </div>

      {/* 100-Point Interactive Scoring Calculator Panel */}
      {showCalculator && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t(language, 'calculatorTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' 
                    ? 'اختبار وتحسين عوامل تقييم 100 نقطة (موثوقية 35%، قيمة الدفع 25%، مدة التنفيذ 15%، وضوح الوصف 10%، منع الاحتيال 15%)'
                    : 'Interactive 100-Point Scoring Engine (35% Source, 25% Payout, 15% Duration, 10% Clarity, 15% Anti-Fraud)'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 5 Factor Sliders */}
            <div className="md:col-span-8 space-y-4">
              {/* Slider 1: Source Reliability */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t(language, 'sourceReliabilityLabel')}</span>
                  <span className="text-emerald-700">{scoreInput.sourceReliability} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput.sourceReliability}
                  onChange={(e) => setScoreInput({ ...scoreInput, sourceReliability: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 2: Payout Value */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t(language, 'payoutValueLabel')}</span>
                  <span className="text-emerald-700">{scoreInput.payoutValue} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput.payoutValue}
                  onChange={(e) => setScoreInput({ ...scoreInput, payoutValue: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 3: Execution Duration */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t(language, 'executionDurationLabel')}</span>
                  <span className="text-emerald-700">{scoreInput.executionDuration} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput.executionDuration}
                  onChange={(e) => setScoreInput({ ...scoreInput, executionDuration: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 4: Description Clarity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t(language, 'descriptionClarityLabel')}</span>
                  <span className="text-emerald-700">{scoreInput.descriptionClarity} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput.descriptionClarity}
                  onChange={(e) => setScoreInput({ ...scoreInput, descriptionClarity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 5: Anti-Fraud Filter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{t(language, 'antiFraudFilterLabel')}</span>
                  <span className="text-emerald-700">{scoreInput.antiFraudFilter} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput.antiFraudFilter}
                  onChange={(e) => setScoreInput({ ...scoreInput, antiFraudFilter: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* Live Computed Output Card */}
            <div className="md:col-span-4 bg-slate-900 text-white p-5 rounded-2xl space-y-4 text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t(language, 'computedScore')}
                </span>
                <div className="text-4xl font-extrabold text-emerald-400 mt-1">
                  {computedBreakdown.totalScore}
                  <span className="text-sm font-semibold text-slate-400"> / 100</span>
                </div>
                <div className="text-xs font-extrabold text-sky-300 mt-0.5">
                  {language === 'ar' ? 'درجة التقييم' : 'Grade'}: {computedBreakdown.grade}
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1">
                <div className="text-slate-400 font-semibold">{t(language, 'riskLevelLabel')}</div>
                <div className={`font-extrabold text-sm ${
                  computedBreakdown.riskLevel === 'Verified' ? 'text-emerald-400'
                  : computedBreakdown.riskLevel === 'Low Risk' ? 'text-sky-300'
                  : computedBreakdown.riskLevel === 'Medium Risk' ? 'text-amber-300'
                  : 'text-rose-400'
                }`}>
                  {computedBreakdown.riskLevel}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(language, 'searchPlaceholder')}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'new', labelAr: 'جديدة', labelEn: 'New' },
              { id: 'accepted', labelAr: 'مقبولة', labelEn: 'Accepted' },
              { id: 'saved', labelAr: 'محفوظة', labelEn: 'Saved' },
              { id: 'ignored', labelAr: 'متجاهلة', labelEn: 'Ignored' },
              { id: 'suspicious', labelAr: 'مشبوهة', labelEn: 'Suspicious' },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as OpportunityStatus | 'all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    active
                      ? tab.id === 'suspicious'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {language === 'ar' ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              {language === 'ar' ? 'لا توجد فرص متطابقة' : 'No opportunities matched'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'جرّب تغيير كلمات البحث أو فلتر الحالة'
                : 'Try adjusting your search criteria or status filter'}
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const score = opp.score ?? opp.totalScore;
            const risk = opp.riskScore ?? 0;
            const scoreBadgeClass = getScoreColorClass(score, risk);

            return (
              <div
                key={opp.id}
                onClick={() => setSelectedOpp(opp)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-100">
                          {t(language, 'jobCategory')}: {opp.category}
                        </span>
                        {opp.status === 'suspicious' && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            {language === 'ar' ? 'تنبيه: عمل مشبوه' : 'Suspicious'}
                          </span>
                        )}
                        {opp.status === 'accepted' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {language === 'ar' ? 'تم القبول والبدء' : 'Accepted'}
                          </span>
                        )}
                        {opp.status === 'saved' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <Bookmark className="w-3 h-3 text-amber-600" />
                            {language === 'ar' ? 'عمل محفوظ' : 'Saved'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-1.5">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t(language, 'workSource')}: <span className="text-slate-700 font-bold">{opp.source || opp.company}</span>
                      </p>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <span className={`inline-block px-3 py-1 rounded-xl text-sm font-extrabold shadow-xs ${scoreBadgeClass}`}>
                        {score}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-extrabold text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{t(language, 'payoutAmount')}:</span>
                    </div>
                    <span className="text-emerald-700 text-sm font-extrabold">${(opp.reward ?? opp.rawPayoutUSD).toLocaleString()} USD</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* Actions Row (Matches Kotlin OpportunitiesScreen) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleStatusChange(opp.id, 'accepted', e)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                      opp.status === 'accepted'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t(language, 'acceptAndStart')}</span>
                  </button>

                  <button
                    onClick={(e) => handleStatusChange(opp.id, 'saved', e)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                      opp.status === 'saved'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t(language, 'saveJob')}</span>
                  </button>

                  <button
                    onClick={(e) => handleStatusChange(opp.id, 'ignored', e)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                      opp.status === 'ignored'
                        ? 'bg-rose-600 text-white'
                        : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{t(language, 'ignoreJob')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar' ? 'إضافة فرصة جديدة للتحليل السحابي' : 'Add New Opportunity'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{language === 'ar' ? 'عنوان الفرصة' : 'Opportunity Title'}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Remote Cloud Architect Task"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{language === 'ar' ? 'المصدر' : 'Source'}</label>
                  <input
                    type="text"
                    required
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g. Upwork / Freelancer"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{language === 'ar' ? 'الربح المتوقع (USD)' : 'Reward (USD)'}</label>
                  <input
                    type="number"
                    required
                    value={newReward}
                    onChange={(e) => setNewReward(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{language === 'ar' ? 'وصف الفرصة والتفاصيل' : 'Description & Details'}</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اكتب تفاصيل الفرصة هنا ليقوم محرك الذكاء بفحص الاحتيال وتقييم النسبة..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {language === 'ar' ? 'تحليل وحفظ' : 'Analyze & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 px-2.5 py-1 bg-emerald-100 rounded-lg">
                  {t(language, 'jobCategory')}: {selectedOpp.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                  {selectedOpp.title}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  {t(language, 'workSource')}: <span className="text-slate-800 font-extrabold">{selectedOpp.source || selectedOpp.company}</span>
                </p>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Job Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-center border border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{t(language, 'safetyCheck')}</div>
                <div className="text-base font-extrabold text-emerald-700">{selectedOpp.score ?? selectedOpp.totalScore}%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{t(language, 'scamLikelihood')}</div>
                <div className="text-xs font-extrabold text-rose-600">{selectedOpp.riskScore ?? 0}%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{t(language, 'payoutAmount')}</div>
                <div className="text-sm font-extrabold text-emerald-800">${(selectedOpp.reward ?? selectedOpp.rawPayoutUSD).toLocaleString()} USD</div>
              </div>
            </div>

            {/* Section 1: Work Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {t(language, 'jobCategory')} والتفاصيل
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {selectedOpp.description}
              </p>
            </div>

            {/* Section 2: How to Get & Apply for the Job */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                {t(language, 'howToGetJob')}
              </h4>
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100 text-xs text-slate-800 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="font-extrabold text-sky-700">1.</span>
                  <span>اضغط على زر <strong className="text-emerald-800 font-extrabold">"{t(language, 'acceptAndStart')}"</strong> في الأسفل لبدء العمل رسمياً.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-extrabold text-sky-700">2.</span>
                  <span>يتم إرسال الشروط والمخرجات المطلوبة فوراً إلى حسابك المباشر.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-extrabold text-sky-700">3.</span>
                  <span>قم بإنجاز المهام وتسليمها عبر التطبيق قبل انتهاء الوقت المحدد.</span>
                </div>
              </div>
            </div>

            {/* Section 3: How to Withdraw Earnings */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-600"></span>
                {t(language, 'howToWithdraw')}
              </h4>
              <div className="bg-violet-50/70 p-3.5 rounded-xl border border-violet-100 text-xs text-slate-800 space-y-1.5">
                <p className="font-medium">
                  بعد تسليم العمل والتحقق منه تلقائياً، يودع المبلغ المباشر <strong className="text-violet-900 font-extrabold">${(selectedOpp.reward ?? selectedOpp.rawPayoutUSD).toLocaleString()} USD</strong> في محفظتك.
                </p>
                <div className="text-[11px] text-slate-600 pt-1 font-semibold">
                  يمكنك سحب الأموال عبر: <strong>الحساب البنكي المباشر، PayPal، أو محفظة USDT الكريبتو</strong> من خلال قسم <strong className="text-violet-800">"استلام المبالغ والمحفظة"</strong>.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onUpdateOpportunityStatus) onUpdateOpportunityStatus(selectedOpp.id, 'accepted');
                    setSelectedOpp(null);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all"
                >
                  {t(language, 'acceptAndStart')}
                </button>
                <button
                  onClick={() => {
                    if (onUpdateOpportunityStatus) onUpdateOpportunityStatus(selectedOpp.id, 'saved');
                    setSelectedOpp(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  {t(language, 'saveJob')}
                </button>
              </div>

              <button
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
