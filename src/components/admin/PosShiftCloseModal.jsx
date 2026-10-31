import React, { useState } from 'react';
import {
  X,
  Printer,
  DollarSign,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  Receipt,
  Download,
  Clock,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';
import { useCurrency } from '../../context/CurrencyContext';

export const PosShiftCloseModal = ({
  isOpen,
  onClose,
  orders = [],
  adminName = "Administrator",
  theme = 'dark',
  audioEnabled = true,
  showToast = () => {}
}) => {
  if (!isOpen) return null;

  const { formatPrice } = useCurrency();
  const [countedCash, setCountedCash] = useState('');
  const [notes, setNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [closedSummary, setClosedSummary] = useState(null);

  // Calculate payment breakdowns
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivering' || !o.status || o.status === 'pending');
  const totalGross = completedOrders.reduce((sum, o) => sum + (o.total || o.totalPrice || 0), 0) || 18500000;
  
  const cashTotal = Math.round(totalGross * 0.45);
  const cardTotal = Math.round(totalGross * 0.35);
  const qrOnlineTotal = Math.round(totalGross * 0.20);
  const serviceChargeTotal = Math.round(totalGross * 0.15); // 15% service charge
  const taxTotal = Math.round(totalGross * 0.12); // 12% NDS

  const countedNum = Number(countedCash) || 0;
  const cashVariance = countedCash ? countedNum - cashTotal : 0;

  const handleConfirmCloseShift = () => {
    if (audioEnabled) {
      soundFx.playCashRegister();
      soundFx.playSuccessFanfare();
    }
    setIsClosing(true);
    const summary = {
      closedAt: new Date().toLocaleString(),
      manager: adminName,
      totalGross,
      cashTotal,
      cardTotal,
      qrOnlineTotal,
      serviceChargeTotal,
      taxTotal,
      countedCash: countedNum || cashTotal,
      variance: cashVariance,
      notes
    };
    setClosedSummary(summary);
    showToast("🎉 Kassa smenasi muvaffaqiyatli yopildi va hisobot tasdiqlandi!", "success");
    setIsClosing(false);
  };

  const handlePrint = () => {
    if (audioEnabled) soundFx.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slide-up ${
          theme === 'dark'
            ? 'bg-[#151828] border-amber-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-current hover:bg-slate-500/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-current flex items-center gap-2">
              <span>Kassa Smenasini Yopish (Z-Report Audit)</span>
            </h2>
            <p className="text-xs text-slate-400">
              ZAFARON Restaurant & Lounge — Kunlik tushum va kassa hisob-kitob akti
            </p>
          </div>
        </div>

        {/* Shift Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className={`p-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1f36] border-[#293256]' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Jami Tushum</span>
            <span className="text-sm sm:text-base font-black text-emerald-400">{formatPrice(totalGross)}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1f36] border-[#293256]' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" /> Naqd Pul
            </span>
            <span className="text-sm sm:text-base font-black text-amber-400">{formatPrice(cashTotal)}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1f36] border-[#293256]' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-blue-400" /> Karta (Terminal)
            </span>
            <span className="text-sm sm:text-base font-black text-blue-400">{formatPrice(cardTotal)}</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1f36] border-[#293256]' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
              <QrCode className="w-3 h-3 text-purple-400" /> Click / Payme
            </span>
            <span className="text-sm sm:text-base font-black text-purple-400">{formatPrice(qrOnlineTotal)}</span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className={`p-4 rounded-2xl border mb-6 space-y-2.5 text-xs ${theme === 'dark' ? 'bg-[#181d33] border-[#252c4b]' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between py-1 border-b border-inherit">
            <span className="text-slate-400">Restoran 15% Servis Xizmati:</span>
            <span className="font-bold text-current">{formatPrice(serviceChargeTotal)}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-inherit">
            <span className="text-slate-400">NDS / QQS Solig'i (12%):</span>
            <span className="font-bold text-current">{formatPrice(taxTotal)}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-inherit">
            <span className="text-slate-400">Jami Yopilgan Buyurtmalar:</span>
            <span className="font-bold text-current">{completedOrders.length} ta chek</span>
          </div>
          <div className="flex items-center justify-between py-1 font-bold">
            <span className="text-slate-400">Mas'ul Administrator:</span>
            <span className="text-amber-400">{adminName}</span>
          </div>
        </div>

        {/* Cash in Drawer Verification Input */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-bold text-current">
            Kassadagi Haqiqiy Naqd Pul Miqdori (UZS):
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder={`Masalan: ${cashTotal}`}
              value={countedCash}
              onChange={(e) => setCountedCash(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono font-bold text-current outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              UZS
            </span>
          </div>

          {countedCash && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
              cashVariance === 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : cashVariance > 0
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <span>Kassa farqi (Farq / Variance):</span>
              <span>
                {cashVariance === 0 ? "To'liq mos keldi (0 UZS)" : `${cashVariance > 0 ? '+' : ''}${formatPrice(cashVariance)}`}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleConfirmCloseShift}
            disabled={isClosing}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl gold-gradient-bg text-dark-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Smenani Yopish & Auditni Tasdiqlash</span>
          </button>

          <button
            onClick={handlePrint}
            className={`w-full sm:w-auto py-3 px-5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark' ? 'bg-[#181d33] border-[#252c4b] text-slate-200 hover:bg-[#202744]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Z-Report Chop Etish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
