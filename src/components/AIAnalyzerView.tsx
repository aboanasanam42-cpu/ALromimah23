import React, { useState } from 'react';
import { Language, AIAnalysisResult } from '../types';
import { t } from '../utils/localization';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  Wrench,
  Send,
  RefreshCw,
  FileText,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface AIAnalyzerViewProps {
  language: Language;
}

export const AIAnalyzerView: React.FC<AIAnalyzerViewProps> = ({ language }) => {
  const [inputText, setInputText] = useState('');
  const [analysisType, setAnalysisType] = useState<'comprehensive' | 'scam-check' | 'skills' | 'scoring'>('comprehensive');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleTexts = [
    {
      name: t(language, 'sample1Name'),
      text: 'Looking for a Senior Full-Stack React & Node developer to migrate an Android Jetpack Compose codebase into a clean modular React application with Tailwind CSS and Express server. Escrow deposit of $5,500 USD already funded on platform. Requirements: Clean TypeScript, unit tests, state management.',
    },
    {
      name: t(language, 'sample2Name'),
      text: 'Urgent task! Earn $1,500 daily by processing high yield crypto arbitrage transfers. You must first deposit 250 USDT to unlock your workspace wallet address on Telegram @crypto_admin_99. No experience required, 100% guaranteed return.',
    },
    {
      name: t(language, 'sample3Name'),
      text: 'Remote DevOps Engineer wanted for setting up CI/CD pipelines, Docker containerization, and Firebase database rules. Flexible 20 hours/week contract, rate $65/hr. Verified employer with 5-star rating.',
    },
  ];

  const handleRunAnalysis = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          analysisType,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || 'Failed to complete AI analysis');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during AI analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
            <BrainCircuit className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold">
                {t(language, 'aiAnalyzerHeader')}
              </h2>
              <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] font-bold rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {t(language, 'aiAnalyzerSub')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Samples */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                {language === 'ar' ? 'أدخل النص أو تفاصيل الوظيفة' : 'Input Text or Job Specification'}
              </label>
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['comprehensive', 'scam-check', 'skills'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAnalysisType(type)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold capitalize transition-all ${
                      analysisType === type
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t(language, 'enterTextPlaceholder')}
              className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                {inputText.length} {language === 'ar' ? 'حرف' : 'characters'}
              </span>

              <button
                onClick={() => handleRunAnalysis()}
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t(language, 'analyzingText')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>{t(language, 'analyzeBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Samples Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              {t(language, 'quickTemplates')}
            </h4>

            <div className="space-y-2">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    handleRunAnalysis(sample.text);
                  }}
                  className="w-full text-left rtl:text-right p-3 bg-white hover:bg-sky-50/50 rounded-xl border border-slate-200 hover:border-sky-300 transition-all text-xs space-y-1 group"
                >
                  <div className="font-bold text-slate-900 group-hover:text-sky-600 flex items-center justify-between">
                    <span>{sample.name}</span>
                    <span className="text-[10px] text-sky-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'ar' ? 'تحميل ونقل' : 'Load & Analyze'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {sample.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Results Card */}
        <div className="lg:col-span-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'ar' ? 'بانتظار التحليل' : 'Awaiting Text Analysis'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'أدخل أي نص أو اختر عينة من اليسار لبدء استخراج الرؤى وتقييم المخاطر عبر الذكاء الاصطناعي'
                    : 'Paste contract text or select a quick template on the left to generate deep AI analysis.'}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4 h-full flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 text-sky-600 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {t(language, 'analyzingText')}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'جاري توجيه طلب إلى Google AI Studio Gemini API...' : 'Querying Google AI Studio Gemini engine...'}
                </p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t(language, 'overallScoreLabel')}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {result.score}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {result.score >= 75 ? (
                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{result.riskAssessment}</span>
                    </div>
                  ) : (
                    <div className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>{result.riskAssessment}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Key Deliverables */}
              {result.keyDeliverables && result.keyDeliverables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-sky-600" />
                    {t(language, 'keyDeliverables')}
                  </h4>
                  <div className="space-y-1.5">
                    {result.keyDeliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Skills */}
              {result.suggestedSkills && result.suggestedSkills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    {t(language, 'suggestedSkills')}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggestedSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold text-[11px] rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation Box */}
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  {t(language, 'recommendationLabel')}
                </h4>
                <p className="text-xs text-sky-800 leading-relaxed font-medium">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
