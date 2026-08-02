import React, { useState, useEffect } from 'react';
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
  const [language, setLanguage] = useState<Language>('en');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(initialSyncLogs);
  const [auditLogs, setAuditLogs] = useState(initialSecurityAudits);

  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize document direction for Arabic RTL support
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        workMode={workMode}
        onWorkModeChange={setWorkMode}
        isSyncing={isSyncing}
        onTriggerSync={handleTriggerSync}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
      />

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            language={language}
            workMode={workMode}
            onNavigate={setActiveTab}
            opportunities={opportunities}
          />
        )}

        {activeTab === 'ai-analyzer' && (
          <AIAnalyzerView language={language} />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityView
            language={language}
            opportunities={opportunities}
            onAddOpportunity={handleAddOpportunity}
            onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
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

        {activeTab === 'payments' && (
          <PaymentView
            language={language}
            paymentMethods={paymentMethods}
            transactions={transactions}
            onAddPaymentMethod={handleAddPaymentMethod}
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <span className="font-bold text-slate-700">CloudWorker AI</span> • Ported from Android Kotlin to React & Express
          </div>
          <div className="flex items-center gap-3">
            <span>Gemini 3.6 Flash</span>
            <span>•</span>
            <span>Firebase CloudSync</span>
            <span>•</span>
            <span>AES-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
