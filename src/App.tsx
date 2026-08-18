import React, { useState, useEffect } from 'react';
import {
  Language,
  WorkMode,
  NavigationTab,
  Opportunity,
  OpportunityStatus,
  PaymentMethod,
  SyncLog,
  ActiveProject,
  OpportunityCategory
} from './types';
import {
  initialOpportunities,
  initialPaymentMethods,
  initialTransactions,
  initialSyncLogs,
  initialSecurityAudits,
  initialActiveProjects
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { AIAnalyzerView } from './components/AIAnalyzerView';
import { OpportunityView } from './components/OpportunityView';
import { CloudSyncView } from './components/CloudSyncView';
import { SecurityView } from './components/SecurityView';
import { PaymentView } from './components/PaymentView';
import { SettingsView } from './components/SettingsView';
import { ProposalModal } from './components/ProposalModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Plus, X, Briefcase, DollarSign } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [projects, setProjects] = useState<ActiveProject[]>(initialActiveProjects);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(initialSyncLogs);
  const [auditLogs, setAuditLogs] = useState(initialSecurityAudits);

  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [proposalOpp, setProposalOpp] = useState<Opportunity | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Project Form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('التصميم والإعلانات');
  const [newProjectPayout, setNewProjectPayout] = useState<number>(200);
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Synchronize document direction for Arabic RTL support
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newLog: SyncLog = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'sync',
        mode: workMode,
        status: 'success',
        size: `${opportunities.length + projects.length} records`,
        details: 'Firebase snapshot uploaded and synchronized successfully',
      };
      setSyncLogs((prev) => [newLog, ...prev]);
    }, 1200);
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities([newOpp, ...opportunities]);
  };

  const handleUpdateOpportunityStatus = (id: string, status: OpportunityStatus) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, status } : opp))
    );
  };

  const handleAddPaymentMethod = (newPm: PaymentMethod) => {
    setPaymentMethods([newPm, ...paymentMethods]);
  };

  const handleAddSyncLog = (newLog: SyncLog) => {
    setSyncLogs([newLog, ...syncLogs]);
  };

  // Convert an accepted opportunity directly to an active project
  const handleSubmitApplication = (oppId: string, customPrice: number) => {
    const targetOpp = opportunities.find((o) => o.id === oppId);
    if (!targetOpp) return;

    const newProject: ActiveProject = {
      id: `proj-${Date.now()}`,
      title: targetOpp.title,
      client: targetOpp.company,
      category: targetOpp.category,
      payoutUSD: customPrice,
      status: 'working',
      progress: 25,
      deadline: 'خلال 3 أيام',
      description: targetOpp.description,
      deliverables: ['ملفات المخرجات بصيغة PDF / Figma / DOCX', 'تقرير الجودة والتدقيق النهائي'],
      steps: [
        { id: 'step-1', title: 'مراجعة المتطلبات واستلام المدخلات', completed: true },
        { id: 'step-2', title: 'البدء في تجهيز المسودة الأولى', completed: false },
        { id: 'step-3', title: 'مراجعة الملاحظات وتنسيق التصميم', completed: false },
        { id: 'step-4', title: 'التسليم النهائي واعتماد الدفع', completed: false },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    handleUpdateOpportunityStatus(oppId, 'accepted');
    setActiveTab('projects');
  };

  const handleUpdateProjectProgress = (projectId: string, stepId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedSteps = p.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);
        return { ...p, steps: updatedSteps, progress };
      })
    );
  };

  const handleDeliverProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    // Credit payment into default wallet
    const payout = proj.payoutUSD;
    setPaymentMethods((prev) =>
      prev.map((pm, idx) => (idx === 0 ? { ...pm, balance: pm.balance + payout } : pm))
    );

    // Add transaction record
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        amount: payout,
        currency: 'USD',
        description: `استلام أرباح إنجاز مشروع: ${proj.title}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        type: 'payout',
      },
      ...prev,
    ]);

    // Mark project complete or remove
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'paid', progress: 100 } : p))
    );

    setActiveTab('payments');
  };

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;

    const newProj: ActiveProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      client: newProjectClient || 'عميل مباشر',
      category: newProjectCategory,
      payoutUSD: Number(newProjectPayout) || 150,
      status: 'working',
      progress: 0,
      deadline: 'خلال 4 أيام',
      description: newProjectDescription || 'مشروع عمل مباشر جديد تم إضافته للمتابعة والتسليم',
      deliverables: ['الملف النهائي المكتمل'],
      steps: [
        { id: 's1', title: 'جمع المتطلبات والتحضير', completed: false },
        { id: 's2', title: 'تنفيذ العمل الأساسي', completed: false },
        { id: 's3', title: 'المراجعة النهائية والتسليم', completed: false },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    setShowNewProjectModal(false);
    setNewProjectTitle('');
    setNewProjectClient('');
    setNewProjectDescription('');
    setActiveTab('projects');
  };

  return (
    <div className="min-h-screen bg-[#0a071f] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Header Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        workMode={workMode}
        onWorkModeChange={setWorkMode}
        isSyncing={isSyncing}
        onTriggerSync={handleTriggerSync}
      />

      {/* Top Desktop & Bottom Mobile Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        onOpenCenterAction={() => setShowAIAssistant(true)}
      />

      {/* Main App Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            language={language}
            workMode={workMode}
            onNavigate={setActiveTab}
            opportunities={opportunities}
            projects={projects}
            onOpenProposal={(opp) => setProposalOpp(opp)}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
            onOpenNewProjectModal={() => setShowNewProjectModal(true)}
            onSelectCategoryFilter={(catKey) => {
              setSelectedCategory(catKey);
              if (catKey !== 'all') {
                setActiveTab('opportunities');
              }
            }}
            selectedCategory={selectedCategory}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            language={language}
            projects={projects}
            onUpdateProjectProgress={handleUpdateProjectProgress}
            onDeliverProject={handleDeliverProject}
            onAddNewProjectModal={() => setShowNewProjectModal(true)}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityView
            language={language}
            opportunities={opportunities}
            onAddOpportunity={handleAddOpportunity}
            onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
          />
        )}

        {activeTab === 'ai-analyzer' && (
          <AIAnalyzerView language={language} />
        )}

        {activeTab === 'payments' && (
          <PaymentView
            language={language}
            paymentMethods={paymentMethods}
            transactions={transactions}
            onAddPaymentMethod={handleAddPaymentMethod}
          />
        )}

        {activeTab === 'cloud-sync' && (
          <CloudSyncView
            language={language}
            workMode={workMode}
            onWorkModeChange={setWorkMode}
            syncLogs={syncLogs}
            onAddSyncLog={handleAddSyncLog}
            isSyncing={isSyncing}
            onTriggerSync={handleTriggerSync}
          />
        )}

        {activeTab === 'security' && (
          <SecurityView
            language={language}
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            language={language}
            onLanguageChange={setLanguage}
            workMode={workMode}
            onWorkModeChange={setWorkMode}
          />
        )}
      </main>

      {/* Proposal & Application Generation Modal */}
      {proposalOpp && (
        <ProposalModal
          opportunity={proposalOpp}
          language={language}
          onClose={() => setProposalOpp(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      {/* Floating AI Assistant Chat Modal */}
      {showAIAssistant && (
        <AIAssistantModal
          language={language}
          onClose={() => setShowAIAssistant(false)}
          onNavigateToTab={setActiveTab}
        />
      )}

      {/* Add New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#151034] border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>إضافة مشروع عمل جديد للمتابعة والتسليم</span>
              </h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-purple-950/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">اسم أو عنوان المشروع</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="مثال: تصميم هوية بصرية كاملة"
                  className="w-full bg-[#100b29] border border-purple-500/30 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">اسم العميل أو الجهة</label>
                  <input
                    type="text"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                    placeholder="مثال: شركة الرؤية المستقبلية"
                    className="w-full bg-[#100b29] border border-purple-500/30 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">المبلغ المستحق (USD)</label>
                  <input
                    type="number"
                    required
                    value={newProjectPayout}
                    onChange={(e) => setNewProjectPayout(Number(e.target.value))}
                    className="w-full bg-[#100b29] border border-purple-500/30 rounded-xl p-2.5 text-emerald-400 font-extrabold focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">تصنيف العمل</label>
                <select
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
                  className="w-full bg-[#100b29] border border-purple-500/30 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="الحسابات والتقارير">الحسابات والتقارير</option>
                  <option value="إدارة المشاريع">إدارة المشاريع</option>
                  <option value="Office والإنترنت والذكاء الاصطناعي">Office والإنترنت والذكاء الاصطناعي</option>
                  <option value="البحوث والدراسات">البحوث والدراسات</option>
                  <option value="التصميم والإعلانات">التصميم والإعلانات</option>
                  <option value="الترجمة واللغات">الترجمة واللغات</option>
                  <option value="التعليم والتدريس">التعليم والتدريس</option>
                  <option value="التنمية البشرية وعلم النفس">التنمية البشرية وعلم النفس</option>
                  <option value="الاستشارات الطبية">الاستشارات الطبية</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">تفاصيل ومخرجات العمل</label>
                <textarea
                  rows={3}
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="اكتب المهام والمخرجات المطلوبة لتسليم المشروع للعميل..."
                  className="w-full bg-[#100b29] border border-purple-500/30 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg"
                >
                  حفظ وبدء المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0a071f] border-t border-purple-500/20 py-5 px-4 text-center text-xs text-purple-200/60 font-medium mb-12 sm:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong className="text-white">مريم AI</strong> • مساحة العمل عن بُعد المكتملة
          </div>
          <div className="flex items-center gap-3">
            <span>Gemini 3.6 Flash</span>
            <span>•</span>
            <span>Firebase CloudSync</span>
            <span>•</span>
            <span>Android Keystore Integrity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
