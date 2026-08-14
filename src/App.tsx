import React, { useState, useEffect, useCallback } from 'react';
import { Language, WorkMode, NavigationTab, Opportunity, OpportunityStatus, PaymentMethod, SyncLog } from './types';
import { initialOpportunities, initialPaymentMethods, initialTransactions, initialSyncLogs, initialSecurityAudits } from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AIAnalyzerView } from './components/AIAnalyzerView';
import { OpportunityView } from './components/OpportunityView';
import { CloudSyncView } from './components/CloudSyncView';
import { SecurityView } from './components/SecurityView';
import { PaymentView } from './components/PaymentView';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [workMode, setWorkMode] = useState<WorkMode>('cloud');
  const [activeTab, setActiveTab] = useState<NavigationTab>('opportunities');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(initialSyncLogs);
  const [auditLogs] = useState(initialSecurityAudits);
  const [isSyncing, setIsSyncing] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [lastFetchedAt, setLastFetchedAt] = useState('');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const loadLiveJobs = useCallback(async (search = '') => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const response = await fetch(`/api/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.warnings?.join('، ') || 'تعذر جلب الوظائف');
      setOpportunities(data.jobs || []);
      setLastFetchedAt(data.fetchedAt || new Date().toISOString());
      if (Array.isArray(data.warnings) && data.warnings.length) setJobsError(`مصادر لم تستجب: ${data.warnings.join(' | ')}`);
    } catch (error: any) {
      setJobsError(error?.message || 'تعذر الاتصال بخادم الوظائف');
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => { void loadLiveJobs(); }, [loadLiveJobs]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    void loadLiveJobs().finally(() => setIsSyncing(false));
  };

  const handleAddOpportunity = (newOpp: Opportunity) => setOpportunities((prev) => [newOpp, ...prev]);
  const handleUpdateOpportunityStatus = (id: string, status: OpportunityStatus) => {
    setOpportunities((prev) => prev.map((opp) => (opp.id === id ? { ...opp, status } : opp)));
    void fetch(`/api/opportunities/${encodeURIComponent(id)}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }).catch(() => undefined);
  };
  const handleAddPaymentMethod = (newPm: PaymentMethod) => setPaymentMethods((prev) => [newPm, ...prev]);
  const handleAddSyncLog = (newLog: SyncLog) => setSyncLogs((prev) => [newLog, ...prev]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header language={language} onLanguageChange={setLanguage} workMode={workMode} onWorkModeChange={setWorkMode} isSyncing={isSyncing} onTriggerSync={handleTriggerSync} />
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} language={language} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {jobsError && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" dir="rtl">
            {jobsError} — سيبقى التطبيق قابلاً للاستخدام بالبيانات المتاحة.
          </div>
        )}
        {activeTab === 'opportunities' && (
          <>
            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-slate-500" dir="rtl">
              <span>{jobsLoading ? 'جاري جلب فرص العمل الحقيقية...' : `آخر تحديث: ${lastFetchedAt ? new Date(lastFetchedAt).toLocaleString('ar') : '—'}`}</span>
              <button onClick={() => void loadLiveJobs()} className="rounded-lg bg-emerald-600 px-3 py-2 font-bold text-white">تحديث الفرص الآن</button>
            </div>
            <OpportunityView language={language} opportunities={opportunities} onAddOpportunity={handleAddOpportunity} onUpdateOpportunityStatus={handleUpdateOpportunityStatus} />
          </>
        )}
        {activeTab === 'dashboard' && <DashboardView language={language} workMode={workMode} onNavigate={setActiveTab} opportunities={opportunities} />}
        {activeTab === 'ai-analyzer' && <AIAnalyzerView language={language} />}
        {activeTab === 'cloud-sync' && <CloudSyncView language={language} workMode={workMode} onWorkModeChange={setWorkMode} syncLogs={syncLogs} onAddSyncLog={handleAddSyncLog} isSyncing={isSyncing} onTriggerSync={handleTriggerSync} />}
        {activeTab === 'security' && <SecurityView language={language} auditLogs={auditLogs} />}
        {activeTab === 'payments' && <PaymentView language={language} paymentMethods={paymentMethods} transactions={transactions} onAddPaymentMethod={handleAddPaymentMethod} />}
        {activeTab === 'settings' && <SettingsView language={language} onLanguageChange={setLanguage} workMode={workMode} onWorkModeChange={setWorkMode} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium" dir="rtl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 <span className="font-bold text-slate-700">Marium AI Workspace</span> • منصة فرص العمل عن بعد</div>
          <div className="flex items-center gap-3"><span>جلب مباشر</span><span>•</span><span>AI</span><span>•</span><span>فلترة احتيال</span></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
