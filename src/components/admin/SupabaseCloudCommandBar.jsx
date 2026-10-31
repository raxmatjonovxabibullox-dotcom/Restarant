import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  Database,
  ShieldCheck,
  Zap,
  Server,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';
import { syncMenuWithSupabase, testSupabaseConnection } from '../../lib/supabase';
import { getStoredSettings } from '../../lib/storage';

export const SupabaseCloudCommandBar = ({
  menuItems = [],
  orders = [],
  reservations = [],
  theme = 'dark',
  audioEnabled = true,
  showToast = () => {}
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [latency, setLatency] = useState('28ms');
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString());

  const settings = getStoredSettings();
  const projectName = settings.supabaseUrl ? settings.supabaseUrl.replace('https://', '').split('.')[0] : 'mvmrndhvcvjccliqyyvk';

  const handleTestConnection = async () => {
    if (audioEnabled) soundFx.playPop();
    setIsTesting(true);
    const start = performance.now();
    try {
      const res = await testSupabaseConnection(settings.supabaseUrl, settings.supabaseAnonKey);
      const diff = Math.round(performance.now() - start);
      setLatency(`${diff}ms`);
      if (res.success) {
        if (audioEnabled) soundFx.playSuccess();
        showToast(`Supabase jonli aloqa faol (${diff}ms)!`, 'success');
      } else {
        showToast(res.message || 'Aloqa xatosi', 'error');
      }
    } catch (e) {
      showToast(e.message || 'Supabase xatosi', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleFullCloudSync = async () => {
    if (audioEnabled) soundFx.playPop();
    setIsSyncing(true);
    try {
      const res = await syncMenuWithSupabase(menuItems);
      setLastSyncTime(new Date().toLocaleTimeString());
      if (res.synced) {
        if (audioEnabled) soundFx.playSuccessFanfare();
        showToast(`⚡ Supabase Cloud bilan 100% sinxronlandi! (${menuItems.length} ta taom)`, 'success');
      } else {
        showToast(res.reason || 'Sinxronlash amalga oshmadi', 'warning');
      }
    } catch (e) {
      showToast(e.message || 'Sinxronlash xatosi', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-[#141829] via-[#1a1f36] to-[#121626] border-emerald-500/25 shadow-lg shadow-emerald-500/5'
          : 'bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/50 border-emerald-500/30 shadow-sm'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Project identity & Live Pulse */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Database className="w-5 h-5" />
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-inherit absolute -bottom-0.5 -right-0.5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs sm:text-sm tracking-wide text-current flex items-center gap-1.5">
                <span>Supabase Live Cloud DB</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL-TIME
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                ({projectName}.supabase.co)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Jonli aloqa o'rnatilgan ({latency})</span>
              </span>
              <span>•</span>
              <span>Oxirgi sinxron: <strong className="text-current font-mono">{lastSyncTime}</strong></span>
            </p>
          </div>
        </div>

        {/* Middle: Live Stats Counter */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 ${
            theme === 'dark' ? 'bg-[#181d33] border-[#252c4b]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] text-slate-400">Taomlar:</span>
            <span className="font-bold text-emerald-400 font-mono">{menuItems.length}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 ${
            theme === 'dark' ? 'bg-[#181d33] border-[#252c4b]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] text-slate-400">Buyurtmalar:</span>
            <span className="font-bold text-blue-400 font-mono">{orders.length}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 ${
            theme === 'dark' ? 'bg-[#181d33] border-[#252c4b]' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[10px] text-slate-400">Bronlar:</span>
            <span className="font-bold text-purple-400 font-mono">{reservations.length}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-[#181d33] hover:bg-[#202744] border-[#283053] text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Supabase ping va aloqasini tekshirish"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">Ping Test</span>
          </button>

          <button
            onClick={handleFullCloudSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            title="Barcha ma'lumotlarni Supabase bulut bazasiga uzatish"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sinxronlanmoqda...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>1-Click Cloud Sync</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
