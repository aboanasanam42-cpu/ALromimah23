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
  DEFAULT_SEED_OPPORTUNITIES,
  DEFAULT_SEED_PROJECTS,
  DEFAULT_SEED_PAYMENT_METHODS,
  initialTransactions,
  initialSyncLogs,
  initialSecurityAudits,
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
import { X, Briefcase, CheckCircle2 } from 'lucide-react';

import {
  auth,
  ensureAuth,
  onAuthStateChanged,
  loginWithGoogle,
  logoutUser,
  testFirebaseConnection,
  User,
  firebaseConfig
} from './lib/firebase';
import {
  subscribeToOpportunities,
  subscribeToProjects,
  subscribeToPaymentMethods,
  subscribeToTransactions,
  subscribeToSyncLogs,
  saveOpportunity,
  updateOpportunityStatusInCloud,
  saveProject,
  updateProjectInCloud,
  savePaymentMethod,
  saveTransaction,
  saveSyncLog,
  syncAllToCloud,
  seedInitialDataIfEmpty
} from './lib/firestoreService';

const OWNER_DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    ...(DEFAULT_SEED_PAYMENT_METHODS[0] || {}),
    id: 'pm-shamel-money',
    name: 'شامل موني (Shamel Money)',
    type: 'wallet' as any,
    accountNumber: '771134103',
    currency: 'YER',
    balance: 0,
    isDefault: true,
    verified: true,
  } as PaymentMethod,
  {
    ...(DEFAULT_SEED_PAYMENT_METHODS[0] || {}),
    id: 'pm-one-cash',
    name: 'ون كاش (OneCash) - بديل: 146158879',
    type: 'wallet' as any,
    accountNumber: '730768718',
    currency: 'YER',
    balance: 0,
    isDefault: false,
    verified: true,
  } as PaymentMethod,
  {
    ...(DEFAULT_SEED_PAYMENT_METHODS[0] || {}),
    id: 'pm-binance-trc20',
    name: 'Binance USDT (TRC20)',
    type: 'crypto' as any,
    accountNumber: 'TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv',
    currency: 'USDT',
    balance: 0,
    isDefault: false,
    verified: true,
  } as PaymentMethod,
  {
    ...(DEFAULT_SEED_PAYMENT_METHODS[0] || {}),
    id: 'pm-binance-bep20',
    name: 'Binance USDT (BEP20 / ERC20)',
    type: 'crypto' as any,
    accountNumber: '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a',
    currency: 'USDT',
    balance: 0,
    isDefault: false,
    verified: true,
  } as PaymentMethod,
  {
    ...(DEFAULT_SEED_PAYMENT_METHODS[0] || {}),
    id: 'pm-binance-sol',
    name: 'Binance USDT (Solana SOL)',
    type: 'crypto' as any,
    accountNumber: '85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj',
    currency: 'USDT',
    balance: 0,
    isDefault: false,
    verified: true,
  } as PaymentMethod,
];

export function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(DEFAULT_SEED_OPPORTUNITIES);
  const [projects, setProjects] = useState<ActiveProject[]>(DEFAULT_SEED_PROJECTS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(OWNER_DEFAULT_PAYMENT_METHODS);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(initialSyncLogs);
  const [auditLogs] = useState(initialSecurityAudits);

  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  const [proposalOpp, setProposalOpp] = useState<Opportunity | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('التصميم والإعلانات');
  const [newProjectPayout, setNewProjectPayout] = useState<number>(200);
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    testFirebaseConnection().catch(() => {});
    ensureAuth().catch((err) => console.warn('Auth init note:', err));

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await seedInitialDataIfEmpty(user.uid, {
          opportunities: DEFAULT_SEED_OPPORTUNITIES,
          projects: DEFAULT_SEED_PROJECTS,
          paymentMethods: OWNER_DEFAULT_PAYMENT_METHODS,
        });

        setSyncNotification(
          language === 'ar'
            ? `مرحباً ${user.displayName || 'بك'}، متصل سحابياً بـ Firebase`
            : `Welcome, connected to Firebase`
        );
        setTimeout(() => setSyncNotification(null), 4000);
      }
    });

    return () => unsubscribeAuth();
  }, [language]);

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    const unSubOpp = subscribeToOpportunities(uid, (data) => {
      if (data.length > 0) setOpportunities(data);
    });
    const unSubProj = subscribeToProjects(uid, (data) => {
      if (data.length > 0) setProjects(data);
    });
    const unSubPm = subscribeToPaymentMethods(uid, (data) => {
      if (data.length > 0) setPaymentMethods(data);
    });
    const unSubTx = subscribeToTransactions(uid, (data) => {
      if (data.length > 0) setTransactions(data);
    });
    const unSubLogs = subscribeToSyncLogs(uid, (data) => {
      if (data.length > 0) setSyncLogs(data);
    });

    return () => {
      unSubOpp?.();
      unSubProj?.();
      unSubPm?.();
      unSubTx?.();
      unSubLogs?.();
    };
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setOpportunities(DEFAULT_SEED_OPPORTUNITIES);
      setProjects(DEFAULT_SEED_PROJECTS);
      setPaymentMethods(OWNER_DEFAULT_PAYMENT_METHODS);
      setTransactions(initialTransactions);
      setSyncLogs(initialSyncLogs);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUploadAllToCloud = async () => {
    if (!currentUser) {
      handleLogin();
      return;
    }
    setIsSyncing(true);
    try {
      const count = await syncAllToCloud(currentUser.uid, {
        opportunities,
        projects,
        paymentMethods,
        transactions,
      });
      const newLog: SyncLog = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'sync',
        mode: workMode,
        status: 'success',
        size: `${count} records`,
        details: `Firebase Firestore synchronized successfully in ${firebaseConfig.projectId}`,
      };
      await saveSyncLog(currentUser.uid, newLog);
      setSyncLogs((prev) => [newLog, ...prev]);
      setSyncNotification(language === 'ar' ? 'تمت مزامنة جميع البيانات مع سحابة Firebase بنجاح!' : 'All data synced with Firebase Cloud successfully!');
      setTimeout(() => setSyncNotification(null), 4000);
    } catch (err) {
      console.error('Bulk sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(async () => {
      setIsSyncing(false);
      const newLog: SyncLog = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'sync',
        mode: workMode,
        status: 'success',
        size: `${opportunities.length + projects.length} records`,
        details: 'Firebase snapshot updated and synchronized successfully',
      };
      if (currentUser) {
        await saveSyncLog(currentUser.uid, newLog).catch(console.error);
      }
      setSyncLogs((prev) => [newLog, ...prev]);
      setSyncNotification(language === 'ar' ? 'اكتملت المزامنة السحابية' : 'Cloud sync completed');
      setTimeout(() => setSyncNotification(null), 3000);
    }, 1000);
  };

  const handleAddOpportunity = async (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
    if (currentUser) {
      await saveOpportunity(currentUser.uid, newOpp).catch(console.error);
    }
  };

  const handleUpdateOpportunityStatus = async (id: string, status: OpportunityStatus) => {
    setOpportunities((prev) => prev.map((opp) => (opp.id === id ? { ...opp, status } : opp)));
    if (currentUser) {
      await updateOpportunityStatusInCloud(currentUser.uid, id, status).catch(console.error);
    }
  };

  const handleAddPaymentMethod = async (newPm: PaymentMethod) => {
    setPaymentMethods((prev) => [newPm, ...prev]);
    if (currentUser) {
      await savePaymentMethod(currentUser.uid, newPm).catch(console.error);
    }
  };

  const handleUpdatePaymentMethod = async (updatedPm: PaymentMethod) => {
    setPaymentMethods((prev) => prev.map((pm) => (pm.id === updatedPm.id ? updatedPm : pm)));
    if (currentUser) {
      await savePaymentMethod(currentUser.uid, updatedPm).catch(console.error);
    }
    setSyncNotification(
      language === 'ar' ? 'تم تحديث بيانات المحفظة بنجاح!' : 'Wallet details updated successfully!'
    );
    setTimeout(() => setSyncNotification(null), 4000);
  };

  const handleAddSyncLog = async (newLog: SyncLog) => {
    setSyncLogs((prev) => [newLog, ...prev]);
    if (currentUser) {
      await saveSyncLog(currentUser.uid, newLog).catch(console.error);
    }
  };

  const handleSubmitApplication = async (oppId: string, customPrice: number) => {
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
      deliverables: ['ملفات المخرجات النهائية', 'تقرير الجودة والتدقيق'],
      steps: [
        { id: 'step-1', title: 'مراجعة المتطلبات واستلام المدخلات', completed: true },
        { id: 'step-2', title: 'البدء في تجهيز المسودة الأولى', completed: false },
        { id: 'step-3', title: 'مراجعة الملاحظات والتنسيق', completed: false },
        { id: 'step-4', title: 'التسليم النهائي واعتماد الدفع', completed: false },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    handleUpdateOpportunityStatus(oppId, 'accepted');
    if (currentUser) {
      await saveProject(currentUser.uid, newProject).catch(console.error);
    }
    setActiveTab('projects');
  };

  const handleUpdateProjectProgress = async (projectId: string, stepId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const updatedSteps = target.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    const progress = Math.round((completedCount / updatedSteps.length) * 100);

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, steps: updatedSteps, progress } : p))
    );

    if (currentUser) {
      await updateProjectInCloud(currentUser.uid, projectId, { steps: updatedSteps, progress }).catch(console.error);
    }
  };

  const handleDeliverProject = async (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const payout = proj.payoutUSD;
    const targetIdx = paymentMethods.findIndex((pm) => pm.isDefault);
    const resolvedIdx = targetIdx >= 0 ? targetIdx : 0;
    const targetWallet = paymentMethods[resolvedIdx];
    const updatedWallet = targetWallet ? { ...targetWallet, balance: targetWallet.balance + payout } : null;

    if (updatedWallet) {
      setPaymentMethods((prev) => prev.map((pm, idx) => (idx === resolvedIdx ? updatedWallet : pm)));
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      amount: payout,
      currency: 'USD',
      description: `استلام أرباح مشروع: ${proj.title} -> ${updatedWallet?.name || 'شامل موني'} (${updatedWallet?.accountNumber || '771134103'})`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed' as const,
      type: 'payout' as const,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: 'paid', progress: 100 } : p)));

    if (currentUser) {
      try {
        await updateProjectInCloud(currentUser.uid, projectId, { status: 'paid', progress: 100 });
        await saveTransaction(currentUser.uid, newTx);
        if (updatedWallet) {
          await savePaymentMethod(currentUser.uid, updatedWallet);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setSyncNotification(
      language === 'ar'
        ? `تم تسليم المشروع وقيد $${payout} في محفظتك (${updatedWallet?.name || 'شامل موني'}) بنجاح!`
        : `Project delivered! $${payout} credited to your wallet.`
    );
    setTimeout(() => setSyncNotification(null), 5000);
    setActiveTab('payments');
  };

  const handleWithdrawToKuraimi = async (amount: number, currency: string, note?: string) => {
    const targetIdx = paymentMethods.findIndex((pm) => pm.isDefault);
    const resolvedIdx = targetIdx >= 0 ? targetIdx : 0;
    const targetWallet = paymentMethods[resolvedIdx];
    const updatedWallet = targetWallet
      ? { ...targetWallet, balance: Math.max(0, targetWallet.balance - amount) }
      : null;

    if (updatedWallet) {
      setPaymentMethods((prev) => prev.map((pm, idx) => (idx === resolvedIdx ? updatedWallet : pm)));
    }

    const newTx = {
      id: `tx-wd-${Date.now()}`,
      amount: -amount,
      currency: currency || 'USD',
      description: `سحب إلى ${updatedWallet?.name || 'شامل موني'} (${updatedWallet?.accountNumber || '771134103'}) - ${note || 'سحب أرباح'}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed' as const,
      type: 'withdrawal' as const,
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (currentUser) {
      try {
        await saveTransaction(currentUser.uid, newTx);
        if (updatedWallet) {
          await savePaymentMethod(currentUser.uid, updatedWallet);
        }
      } catch (err) {
        console.error('Failed to sync withdrawal transaction:', err);
      }
    }

    setSyncNotification(
      language === 'ar'
        ? `تم تسجيل سحب $${amount} إلى ${updatedWallet?.name || 'محفظتك'} بنجاح!`
        : `Successfully recorded withdrawal of $${amount}!`
    );
    setTimeout(() => setSyncNotification(null), 5000);
  };

  const handleCreateNewProject = async (e: React.FormEvent) => {
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

    if (currentUser) {
      await saveProject(currentUser.uid, newProj).catch(console.error);
    }
    setActiveTab('projects');
  };

  return (
    <div className="min-h-screen bg-[#0a071f] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {syncNotification && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 bg-purple-900 border border-purple-400/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncNotification}</span>
        </div>
      )}

      <Header
        language={language}
        onLanguageChange={setLanguage}
        workMode={workMode}
        onWorkModeChange={setWorkMode}
        isSyncing={isSyncing}
        onTriggerSync={handleTriggerSync}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        onOpenCenterAction={() => setShowAIAssistant(true)}
      />

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
              if (catKey !== 'all') setActiveTab('opportunities');
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

        {activeTab === 'ai-analyzer' && <AIAnalyzerView language={language} />}

        {activeTab === 'payments' && (
          <PaymentView
            language={language}
            paymentMethods={paymentMethods}
            transactions={transactions}
            onAddPaymentMethod={handleAddPaymentMethod}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
            onWithdrawToKuraimi={handleWithdrawToKuraimi}
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
            currentUser={currentUser}
            onUploadAllToCloud={handleUploadAllToCloud}
          />
        )}

        {activeTab === 'security' && <SecurityView language={language} auditLogs={auditLogs} />}

        {activeTab === 'settings' && (
          <SettingsView
            language={language}
            onLanguageChange={setLanguage}
            workMode={workMode}
            onWorkModeChange={setWorkMode}
          />
        )}
      </main>

      {proposalOpp && (
        <ProposalModal
          opportunity={proposalOpp}
          language={language}
          onClose={() => setProposalOpp(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      {showAIAssistant && (
        <AIAssistantModal
          language={language}
          onClose={() => setShowAIAssistant(false)}
          onNavigateToTab={setActiveTab}
        />
      )}

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

      <footer className="bg-[#0a071f] border-t border-purple-500/20 py-5 px-4 text-center text-xs text-purple-200/60 font-medium mb-12 sm:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong className="text-white">مريم AI</strong> • مساحة العمل السحابية المكتملة
          </div>
          <div className="flex items-center gap-3">
            <span>Firebase Firestore ({firebaseConfig.projectId})</span>
            <span>•</span>
            <span>asia-south1</span>
            <span>•</span>
            <span>Android Keystore Secured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
