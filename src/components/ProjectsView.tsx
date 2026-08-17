import React, { useState } from 'react';
import { ActiveProject, Language } from '../types';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Plus,
  Send,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';

interface ProjectsViewProps {
  language: Language;
  projects: ActiveProject[];
  onUpdateProjectProgress: (projectId: string, stepId: string) => void;
  onDeliverProject: (projectId: string) => void;
  onAddNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  language,
  projects,
  onUpdateProjectProgress,
  onDeliverProject,
  onAddNewProjectModal,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);
  const [qualityResult, setQualityResult] = useState<any>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleRunQualityCheck = async (proj: ActiveProject) => {
    setIsCheckingQuality(true);
    try {
      const completedCount = proj.steps.filter((s) => s.completed).length;
      const res = await fetch('/api/project/quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: proj.id,
          completedStepsCount: completedCount,
          totalSteps: proj.steps.length,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQualityResult(data);
      }
    } catch (e) {
      console.warn('Quality check fallback used');
    } finally {
      setIsCheckingQuality(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18133d] via-[#1f1752] to-[#120d2d] rounded-3xl p-6 sm:p-7 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'ar' ? 'مشاريعي وخطوات الإنجاز' : 'My Active Projects & Delivery'}
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold">
              {projects.length} مشاريع نشطة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
            {language === 'ar'
              ? 'متابعة تنفيذ مهام المشاريع المقبولة، فحص الجودة بالذكاء الاصطناعي، وتسليم العمل لتحصيل الأرباح مباشرة'
              : 'Track task execution, run AI quality verification, and deliver projects to collect immediate payouts.'}
          </p>
        </div>

        <button
          onClick={onAddNewProjectModal}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all w-fit shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? '+ مشروع جديد' : '+ New Project'}</span>
        </button>
      </div>

      {/* Main Grid: Projects List on Left, Selected Project Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Cards List */}
        <div className="space-y-3.5">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>{language === 'ar' ? 'قائمة المشاريع الحالية' : 'Active Projects'}</span>
          </h3>

          <div className="space-y-3">
            {projects.map((proj) => {
              const isSelected = proj.id === selectedProject?.id;
              const completedSteps = proj.steps.filter((s) => s.completed).length;
              const calcProgress = Math.round((completedSteps / proj.steps.length) * 100);

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setQualityResult(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e174b] border-purple-400/80 shadow-lg shadow-purple-950/60'
                      : 'bg-[#151034] hover:bg-[#1b1542] border-purple-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-900/50 text-purple-300 border border-purple-500/20">
                        {proj.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white mt-1.5">{proj.title}</h4>
                      <p className="text-[11px] text-slate-400">العميل: {proj.client}</p>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <div className="text-sm font-extrabold text-emerald-400">${proj.payoutUSD}</div>
                      <div className="text-[10px] text-purple-300 font-bold">{calcProgress}% منجز</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-[#0d0a24] rounded-full h-2 overflow-hidden border border-purple-500/20">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${calcProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project Details & AI Assistant Workspace */}
        {selectedProject && (
          <div className="lg:col-span-2 bg-[#151034] border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-5 text-white">
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                    {selectedProject.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    المبلغ: ${selectedProject.payoutUSD} USD
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-2">{selectedProject.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  الجهة المتعاقدة: <strong className="text-slate-200">{selectedProject.client}</strong> • الموعد النهائي: {selectedProject.deadline}
                </p>
              </div>

              {/* Progress Pill */}
              <div className="flex items-center gap-2 bg-[#1e174b] px-4 py-2 rounded-2xl border border-purple-500/30 w-fit">
                <div className="text-right rtl:text-left">
                  <div className="text-[10px] text-purple-300 font-bold uppercase">نسبة الإنجاز</div>
                  <div className="text-base font-extrabold text-emerald-400">
                    {Math.round(
                      (selectedProject.steps.filter((s) => s.completed).length / selectedProject.steps.length) * 100
                    )}%
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#120d2c] p-3.5 rounded-2xl border border-purple-500/20 text-xs text-slate-200 leading-relaxed">
              <span className="font-extrabold text-purple-300 block mb-1">تفاصيل العمل والمخرجات:</span>
              {selectedProject.description}
            </div>

            {/* Checklist of Tasks */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>خطوات التنفيذ المرحلية (Checklist):</span>
                </h4>
                <span className="text-[11px] text-slate-400">اضغط على الخطوة لتحديث حالة الإنجاز</span>
              </div>

              <div className="space-y-2">
                {selectedProject.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => onUpdateProjectProgress(selectedProject.id, step.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      step.completed
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#1b1542] hover:bg-[#221b52] border-purple-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-purple-400/50 bg-[#120d2c]'
                        }`}
                      >
                        {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs font-semibold ${step.completed ? 'line-through text-slate-400' : ''}`}>
                        {idx + 1}. {step.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/30">
                      {step.completed ? 'مكتمل' : 'قيد التنفيذ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables List */}
            {selectedProject.deliverables && (
              <div className="bg-[#120d2c] p-3.5 rounded-2xl border border-purple-500/20 space-y-1.5">
                <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-400" />
                  <span>الملفات والمخرجات المطلوبة للتسليم:</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedProject.deliverables.map((del, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 text-[11px] font-bold"
                    >
                      ✓ {del}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Gate Check Result Box */}
            {qualityResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                qualityResult.readyToDeliver
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>مؤشر جودة العمل: {qualityResult.qualityScore}%</span>
                  </div>
                  <span className="font-bold px-2 py-0.5 bg-black/40 rounded-md">
                    {qualityResult.readyToDeliver ? 'جاهز للتسليم 100%' : 'تنبيه: غير مكتمل'}
                  </span>
                </div>
                <p className="leading-relaxed">{qualityResult.recommendation}</p>
              </div>
            )}

            {/* Action Bar: Quality Check & Deliver */}
            <div className="pt-3 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleRunQualityCheck(selectedProject)}
                disabled={isCheckingQuality}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#1f194e] hover:bg-[#282163] text-purple-200 text-xs font-extrabold rounded-2xl border border-purple-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{isCheckingQuality ? 'جاري فحص الجودة...' : 'فحص الجودة بالذكاء الاصطناعي'}</span>
              </button>

              <button
                onClick={() => onDeliverProject(selectedProject.id)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>تسليم المشروع وإيداع ${selectedProject.payoutUSD} في المحفظة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
