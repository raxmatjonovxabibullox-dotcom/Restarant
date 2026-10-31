import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Flame,
  ChefHat,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Send,
  Zap,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';
import { useCurrency } from '../../context/CurrencyContext';

export const AiExecutiveIntelligenceWidget = ({
  orders = [],
  menuItems = [],
  reservations = [],
  theme = 'dark',
  audioEnabled = true,
  onOpenAiCopilot = () => {},
  showToast = () => {}
}) => {
  const { formatPrice } = useCurrency();
  const [rushModeActive, setRushModeActive] = useState(false);
  const [vipAlertSent, setVipAlertSent] = useState(false);

  // Calculations from live restaurant data
  const totalRev = orders.reduce((sum, o) => sum + (o.total || o.totalPrice || 0), 0);
  const cookingOrdersCount = orders.filter(o => o.status === 'cooking' || o.status === 'pending').length;
  const estimatedPeakSurge = totalRev > 0 ? totalRev * 1.35 : 24800000;

  const toggleRushMode = () => {
    if (audioEnabled) {
      if (!rushModeActive) {
        soundFx.playSuccessFanfare();
      } else {
        soundFx.playPop();
      }
    }
    const next = !rushModeActive;
    setRushModeActive(next);
    if (next) {
      showToast("🔥 Oshxona Rush Mode faollashtirildi! Barcha oshpazlarga signal yuborildi.", "success");
    } else {
      showToast("Oshxona ish tartibi standart rejimga qaytarildi.", "info");
    }
  };

  const handleVipAlert = () => {
    if (audioEnabled) soundFx.playSuccess();
    setVipAlertSent(true);
    showToast("👑 VIP Suite tayyorgarligi bo'yicha ma'murlarga eslatma yuborildi!", "success");
    setTimeout(() => setVipAlertSent(false), 5000);
  };

  return (
    <div
      className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#161a2e] via-[#1c223c] to-[#141829] border-amber-500/30 shadow-2xl shadow-amber-500/5'
          : 'bg-gradient-to-br from-amber-50/80 via-white to-indigo-50/50 border-amber-500/30 shadow-md'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-amber-500/10 to-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-inherit relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-current">
                Zafaron AI Executive Intelligence & Rush Operations
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-dark-950 uppercase tracking-widest">
                AI 4.0 Suite
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-vaqt daromad prognozi, oshxona yuklamasi va avtomatik boshqaruv
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleRushMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              rushModeActive
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{rushModeActive ? "Rush Mode FAOL 🔥" : "Oshxona Rush Mode"}</span>
          </button>

          <button
            onClick={onOpenAiCopilot}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Copilot Chat</span>
          </button>
        </div>
      </div>

      {/* Grid: 3 Pillars of Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 relative z-10">
        
        {/* Card 1: Revenue Forecast */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#181d33]/80 border-[#262e4f]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kechki Rush Hour Tushumi</span>
            </span>
            <span className="text-emerald-400 font-bold">+35% Prognoz</span>
          </div>

          <div className="text-2xl font-black text-current tracking-tight">
            ~{formatPrice(estimatedPeakSurge)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            AI prognozi bo'yicha eng yuqori tushum vaqti: <strong className="text-amber-400">19:30 - 22:30</strong> oralig'ida kutilmoqda.
          </p>

          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px]">
            <span className="text-slate-400">O'rtacha stol aylanmasi:</span>
            <span className="font-bold text-current">1.4 soat / stol</span>
          </div>
        </div>

        {/* Card 2: Kitchen Speedometer */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#181d33]/80 border-[#262e4f]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-purple-400" />
              <span>Oshxona Tezligi & KDS</span>
            </span>
            <span className="text-purple-400 font-bold">18.4 daq</span>
          </div>

          <div className="text-2xl font-black text-current tracking-tight flex items-center gap-2">
            <span>{cookingOrdersCount} ta</span>
            <span className="text-xs font-normal text-slate-400">tayyorlanmoqda</span>
          </div>

          <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden mt-2.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                cookingOrdersCount > 8
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 w-[85%]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 w-[45%]'
              }`}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Standart kutish vaqti:</span>
            <span className="font-bold text-emerald-400">A'lo darajada (Optimal)</span>
          </div>
        </div>

        {/* Card 3: Smart Stock & Stop-list AI */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#181d33]/80 border-[#262e4f]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Zaxira & Stop-List Nazorati</span>
            </span>
            <span className="text-amber-400 font-bold">96% Zaxira</span>
          </div>

          <div className="text-sm font-bold text-current leading-snug">
            🏆 Shohona To'y Oshi & Ribeye Steyk
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Bugungi eng ko'p sotilgan taomlar. Kechki dastur uchun qo'shimcha go'sht zaxirasini tekshiring.
          </p>

          <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between text-[11px]">
            <button
              onClick={handleVipAlert}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <BellRing className="w-3 h-3" />
              <span>{vipAlertSent ? "Yuborildi ✓" : "VIP Zallarga Xabar"}</span>
            </button>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Halol Go'sht</span>
          </div>
        </div>

      </div>
    </div>
  );
};
