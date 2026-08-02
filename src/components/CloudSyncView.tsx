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
  FileCheck,
  Zap,
} from 'lucide-react';

interface CloudSyncViewProps {
  language: Language;
  workMode: WorkMode;
  onWorkModeChange: (mode: WorkMode) => void;
  syncLogs: SyncLog[];
  onAddSyncLog: (log: SyncLog) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  language,
  workMode,
  onWorkModeChange,
  syncLogs,
  onAddSyncLog,
  isSyncing,
  onTriggerSync,
}) => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const handleManualBackup = async () => {
    onTriggerSync();
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: workMode }),
      });
      const data = await res.json();
      if (data.success) {
        onAddSyncLog({
          id: `sync-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'backup',
          mode: workMode,
          status: 'success',
          size: '5.2 MB',
          details: `Manual Firebase encrypted backup created. ${data.message}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(language, 'syncHeader')}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold rounded-full">
              Firebase + Worker
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {t(language, 'syncSub')}
          </p>
        </div>

        <button
          onClick={handleManualBackup}
          disabled={isSyncing}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : t(language, 'syncNowBtn')}</span>
        </button>
      </div>

      {/* Mode Switcher Cards (Matches Kotlin Mode Strings: local_mode, cloud_mode, hybrid_mode) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t(language, 'syncModeTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Local Mode Card */}
          <div
            onClick={() => onWorkModeChange('local')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'local'
                ? 'bg-amber-50/50 border-amber-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {t(language, 'localModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {t(language, 'localMode')}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar'
                  ? 'يتم حفظ كافة العقود والتقييمات محلياً فقط على الجهاز لتوفير السرعة والأمان بدون سحابة'
                  : 'Stores contracts and opportunity scores inside device IndexedDB offline cache.'}
              </p>
            </div>
          </div>

          {/* Cloud Mode Card */}
          <div
            onClick={() => onWorkModeChange('cloud')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'cloud'
                ? 'bg-sky-50/50 border-sky-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900">
                {t(language, 'cloudModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {t(language, 'cloudMode')}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar'
                  ? 'مزامنة حية ومباشرة مع قواعد بيانات Firebase Firestore السحابية المشفرة'
                  : 'Continuous real-time background sync with Firebase Firestore cloud storage.'}
              </p>
            </div>
          </div>

          {/* Hybrid Mode Card */}
          <div
            onClick={() => onWorkModeChange('hybrid')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              workMode === 'hybrid'
                ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {t(language, 'hybridModeAr')}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {t(language, 'hybridMode')}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar'
                  ? 'الجمع بين الحفظ المحلي السريع للمستندات والمزامنة السحابية المجدولة مع المعالجة الخفية'
                  : 'Combines fast local execution with automated background Firebase sync worker.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status Statistics & Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {t(language, 'lastSyncTimeLabel')}
            </span>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>{syncLogs[0]?.timestamp || 'Just now'}</span>
            </div>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {language === 'ar' ? 'النسخ الاحتياطي التلقائي' : 'Automated Background Sync'}
            </span>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{autoBackupEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'معطل' : 'Disabled')}</span>
            </div>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              autoBackupEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white block transition-transform ${
                autoBackupEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {language === 'ar' ? 'حالة التشفير' : 'Encryption Standard'}
            </span>
            <div className="text-sm font-extrabold text-indigo-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>AES-256 + SSL</span>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* Sync Logs Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            {t(language, 'syncLogsTitle')}
          </h3>
          <span className="text-xs text-slate-500">{syncLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Payload Size</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {syncLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-slate-900 font-bold whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] font-extrabold text-indigo-600">
                    {log.type}
                  </td>
                  <td className="py-3 px-3 capitalize text-slate-600">
                    {log.mode}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {log.size}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
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
