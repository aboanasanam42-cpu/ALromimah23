import React, { useState } from 'react';
import { WorkMode, Language, SyncLog } from '../types';
import { t } from '../utils/localization';
import {
  UploadCloud,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Database,
  CheckCircle2,
  Lock,
  Clock,
  Zap,
  Server,
  Key,
  Globe
} from 'lucide-react';
import { User } from 'firebase/auth';
import { firebaseConfig } from '../lib/firebase';

interface CloudSyncViewProps {
  language: Language;
  workMode: WorkMode;
  onWorkModeChange: (mode: WorkMode) => void;
  syncLogs: SyncLog[];
  onAddSyncLog: (log: SyncLog) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
  currentUser?: User | null;
  onUploadAllToCloud?: () => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  language,
  workMode,
  onWorkModeChange,
  syncLogs,
  onAddSyncLog,
  isSyncing,
  onTriggerSync,
  currentUser,
  onUploadAllToCloud,
}) => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#151034] to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {language === 'ar' ? 'المزامنة السحابية وقواعد بيانات Firebase' : 'Cloud Synchronization & Firebase Firestore'}
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === 'ar' ? 'سحابي متصل' : 'Cloud Connected'}
            </span>
          </div>
          <p className="text-purple-200/70 text-xs sm:text-sm max-w-xl">
            {language === 'ar'
              ? 'مزامنة مباشرة وآمنة مع Firestore في منطقة آسيا (asia-south1) مع حفظ مشفر وتوقيع Android Keystore.'
              : 'Direct and secure synchronization with Firestore in asia-south1 region.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {onUploadAllToCloud && currentUser && (
            <button
              onClick={onUploadAllToCloud}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{language === 'ar' ? 'رفع وتثبيت السحابة' : 'Push to Cloud'}</span>
            </button>
          )}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-[#1f1847] hover:bg-purple-900/40 text-purple-200 text-xs font-bold rounded-xl border border-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
            <span>{isSyncing ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (language === 'ar' ? 'مزامنة فورية' : 'Sync Now')}</span>
          </button>
        </div>
      </div>

      {/* Live Firebase Cloud Node Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-[#120e2e] border border-purple-500/20 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Server className="w-4 h-4" />
            <span>Firebase Project ID</span>
          </div>
          <div className="text-xs font-mono font-bold text-white truncate" title={firebaseConfig.projectId}>
            {firebaseConfig.projectId}
          </div>
          <div className="text-[10px] text-purple-300/60 font-semibold">Google Cloud Enterprise</div>
        </div>

        <div className="bg-[#120e2e] border border-purple-500/20 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Database className="w-4 h-4" />
            <span>Firestore Database</span>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400 truncate" title={firebaseConfig.firestoreDatabaseId}>
            {firebaseConfig.firestoreDatabaseId}
          </div>
          <div className="text-[10px] text-purple-300/60 font-semibold">Multi-Collection ABAC</div>
        </div>

        <div className="bg-[#120e2e] border border-purple-500/20 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Globe className="w-4 h-4" />
            <span>Primary Region</span>
          </div>
          <div className="text-xs font-mono font-bold text-sky-400">
            asia-south1 (Mumbai)
          </div>
          <div className="text-[10px] text-purple-300/60 font-semibold">Low latency cluster</div>
        </div>

        <div className="bg-[#120e2e] border border-purple-500/20 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Key className="w-4 h-4" />
            <span>Auth & Identity</span>
          </div>
          <div className="text-xs font-mono font-bold text-amber-300 truncate">
            {currentUser ? currentUser.email : (language === 'ar' ? 'وضع الضيف / محلي' : 'Guest / Offline')}
          </div>
          <div className="text-[10px] text-purple-300/60 font-semibold">Google Auth & Keystore</div>
        </div>
      </div>

      {/* Mode Switcher Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
          {t(language, 'syncModeTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Local Mode Card */}
          <div
            onClick={() => onWorkModeChange('local')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'local'
                ? 'bg-amber-950/30 border-amber-500 shadow-md'
                : 'bg-[#120e2e] border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {t(language, 'localModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t(language, 'localMode')}
              </h4>
              <p className="text-xs text-purple-200/60 mt-1 leading-relaxed">
                {language === 'ar'
                  ? 'يتم حفظ كافة العقود والتقييمات محلياً فقط على الجهاز لتوفير السرعة والأمان بدون اتصال سحابي'
                  : 'Stores contracts and opportunity scores inside device local cache.'}
              </p>
            </div>
          </div>

          {/* Cloud Mode Card */}
          <div
            onClick={() => onWorkModeChange('cloud')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'cloud'
                ? 'bg-sky-950/30 border-sky-500 shadow-md'
                : 'bg-[#120e2e] border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {t(language, 'cloudModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t(language, 'cloudMode')}
              </h4>
              <p className="text-xs text-purple-200/60 mt-1 leading-relaxed">
                {language === 'ar'
                  ? 'مزامنة حية ومباشرة مع قواعد بيانات Firebase Firestore السحابية المشفرة مع توثيق المستخدم'
                  : 'Continuous real-time background sync with Firebase Firestore cloud storage.'}
              </p>
            </div>
          </div>

          {/* Hybrid Mode Card */}
          <div
            onClick={() => onWorkModeChange('hybrid')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'hybrid'
                ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                : 'bg-[#120e2e] border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t(language, 'hybridModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t(language, 'hybridMode')}
              </h4>
              <p className="text-xs text-purple-200/60 mt-1 leading-relaxed">
                {language === 'ar'
                  ? 'الجمع بين الحفظ المحلي السريع للمستندات والمزامنة السحابية المجدولة مع المعالجة التلقائية'
                  : 'Combines fast local execution with automated background Firebase sync.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status Statistics & Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#120e2e] rounded-2xl p-5 border border-purple-500/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-purple-300/60 uppercase">
              {t(language, 'lastSyncTimeLabel')}
            </span>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{syncLogs[0]?.timestamp || 'الآن'}</span>
            </div>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="bg-[#120e2e] rounded-2xl p-5 border border-purple-500/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-purple-300/60 uppercase">
              {language === 'ar' ? 'النسخ الاحتياطي التلقائي' : 'Automated Background Sync'}
            </span>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{autoBackupEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'معطل' : 'Disabled')}</span>
            </div>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              autoBackupEnabled ? 'bg-emerald-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                autoBackupEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="bg-[#120e2e] rounded-2xl p-5 border border-purple-500/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-purple-300/60 uppercase">
              {language === 'ar' ? 'حالة التشفير' : 'Encryption Standard'}
            </span>
            <div className="text-sm font-extrabold text-purple-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>AES-256 + SSL</span>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Sync Logs Table */}
      <div className="bg-[#120e2e] rounded-2xl p-6 border border-purple-500/20 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            {t(language, 'syncLogsTitle')}
          </h3>
          <span className="text-xs text-purple-300/60 font-semibold">{syncLogs.length} سجلات مسجلة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-500/20 text-purple-300/60 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Payload Size</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 font-medium">
              {syncLogs.map((log) => (
                <tr key={log.id} className="hover:bg-purple-950/30 transition-colors">
                  <td className="py-3 px-3 text-white font-bold whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] font-extrabold text-purple-400">
                    {log.type}
                  </td>
                  <td className="py-3 px-3 capitalize text-purple-200">
                    {log.mode}
                  </td>
                  <td className="py-3 px-3 text-purple-300/70">
                    {log.size}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-purple-200/80 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
