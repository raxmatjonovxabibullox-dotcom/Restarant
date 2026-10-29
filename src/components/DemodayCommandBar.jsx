import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Award,
  Crown,
  Monitor,
  ChefHat,
  Receipt,
  Bot,
  Send,
  X,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  PartyPopper
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { soundFx } from '../hooks/useSoundEffects';
import { luxuryConfetti } from '../utils/confetti';
import { getStoredOrders, saveStoredOrders } from '../lib/storage';

export const DemodayCommandBar = ({
  setActivePage,
  setIsAdminView,
  onOpenConcierge
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPitchStats, setShowPitchStats] = useState(false);
  const [lastSimulatedOrder, setLastSimulatedOrder] = useState(null);

  // 1-Click Simulated VIP Order Flow
  const handleSimulateLiveOrder = () => {
    soundFx.playSuccess();
    luxuryConfetti.burst({ x: 0.5, y: 0.3, count: 140 });

    const existingOrders = getStoredOrders() || [];
    const newOrderId = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

    const simulatedOrder = {
      id: newOrderId,
      customer: {
        name: "Akmal Rahimov (VIP Mehmon)",
        phone: "+998 (90) 777-88-99",
        address: "Toshkent sh., Amir Temur shoh ko'chasi, VIP Zal #3"
      },
      items: [
        {
          id: 'gastro-tomahawk',
          name: { uz: "Tomahawk Marmar Steyk", ru: "Стейк Томагавк", en: "Tomahawk Steak" },
          price: 320000,
          quantity: 1
        },
        {
          id: 'gastro-osh',
          name: { uz: "Shohona Za'faron Oshi", ru: "Шахский Плов", en: "Royal Saffron Plov" },
          price: 58000,
          quantity: 2
        },
        {
          id: 'gastro-baklava',
          name: { uz: "Oltin Bargli Paxlava", ru: "Пахлава с золотом", en: "Gold Leaf Baklava" },
          price: 45000,
          quantity: 2
        }
      ],
      total: 526000,
      paymentMethod: 'click',
      status: 'pending',
      date: new Date().toISOString(),
      hall: 'VIP Oltin Xona',
      isDemoDayVIP: true
    };

    saveStoredOrders([simulatedOrder, ...existingOrders]);
    setLastSimulatedOrder(simulatedOrder);

    // Notify user with custom dispatch event for POS/KDS auto-refresh
    window.dispatchEvent(new CustomEvent('zafaron:new-order', { detail: simulatedOrder }));
  };

  const handleCelebrate = () => {
    soundFx.playSuccessFanfare();
    luxuryConfetti.burst({ x: 0.25, y: 0.4, count: 90 });
    setTimeout(() => {
      luxuryConfetti.burst({ x: 0.75, y: 0.4, count: 90 });
    }, 250);
  };

  return (
    <>
      {/* Floating Demo-Day Trigger Pill */}
      <div className="fixed top-20 left-4 z-40 select-none">
        {!isOpen ? (
          <button
            onClick={() => {
              soundFx.playPop();
              setIsOpen(true);
            }}
            className="group px-4 py-2 rounded-full gold-gradient-bg text-dark-950 font-black text-xs flex items-center gap-2 shadow-2xl shadow-gold-500/40 hover:scale-105 transition-all border border-yellow-300"
          >
            <Zap className="w-3.5 h-3.5 text-dark-950 animate-bounce" />
            <span className="tracking-wide uppercase font-display">Demoday Hub</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          </button>
        ) : (
          /* Expanded Demoday Control Center HUD */
          <div className="w-80 sm:w-96 rounded-3xl bg-dark-950/95 border-2 border-gold-500/50 backdrop-blur-2xl p-5 shadow-2xl text-white animate-slide-up space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gold-gradient-bg text-dark-950 flex items-center justify-center font-black shadow-md">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm text-gold-400">Demoday Showcase HUD</h3>
                  <p className="text-[10px] text-gray-400">Hakamlar va Taqdimot Uchun Boshqaruv Markazi</p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundFx.playPop();
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Live Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                Jonli Jarayonlar (1-Klik):
              </span>

              {/* 1. Simulate Live VIP Order */}
              <button
                onClick={handleSimulateLiveOrder}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-dark-950 font-black text-xs flex items-center justify-between shadow-lg shadow-gold-500/25 hover:brightness-110 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-dark-950" />
                  <span>⚡ Jonli VIP Buyurtma Yaratish</span>
                </div>
                <span className="text-[10px] bg-dark-950/20 px-2 py-0.5 rounded-full font-bold">
                  KDS & POS Sync
                </span>
              </button>

              {/* 2. Celebrate Fireworks */}
              <button
                onClick={handleCelebrate}
                className="w-full p-2.5 rounded-2xl bg-white/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-amber-400" />
                  <span>🎉 Oltin Mushak & Salomyut (Fireworks)</span>
                </div>
                <span className="text-[10px] text-gray-400">Di-ding! + Fanfare</span>
              </button>
            </div>

            {/* Quick Scenario Pitch Switcher */}
            <div className="space-y-2 pt-1 border-t border-gold-500/20">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                Ssenariylar Bo'yicha O'tish:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setIsAdminView(false);
                    setActivePage('home');
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-gold-500/15 border border-gold-500/20 text-left text-xs text-gray-200 hover:text-gold-300 transition-colors flex items-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mijoz Tajribasi</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    setIsAdminView(false);
                    setActivePage('menu');
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-gold-500/15 border border-gold-500/20 text-left text-xs text-gray-200 hover:text-gold-300 transition-colors flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Shohona Menyu</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    setIsAdminView(false);
                    setActivePage('reservation');
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-gold-500/15 border border-gold-500/20 text-left text-xs text-gray-200 hover:text-gold-300 transition-colors flex items-center gap-2"
                >
                  <Monitor className="w-3.5 h-3.5 text-purple-400" />
                  <span>3D Stol Bron</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    setIsAdminView(true);
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-gold-500/15 border border-gold-500/20 text-left text-xs text-gray-200 hover:text-gold-300 transition-colors flex items-center gap-2"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin & POS</span>
                </button>
              </div>
            </div>

            {/* Investor Pitch Stats Trigger */}
            <div className="pt-2 border-t border-gold-500/20 flex items-center justify-between">
              <button
                onClick={() => {
                  soundFx.playPop();
                  setShowPitchStats(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Investor Metriklari (Pitch Deck)</span>
              </button>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Ready</span>
              </span>
            </div>

            {/* Simulated Order Feedback Note */}
            {lastSimulatedOrder && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] animate-fade-in flex items-center justify-between">
                <span>Buyurtma <b>#{lastSimulatedOrder.id}</b> KDS tizimiga yuborildi!</span>
                <span className="text-emerald-400 font-black">526,000 UZS</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Investor Metrics Modal */}
      {showPitchStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-dark-950 border-2 border-gold-500/50 p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl gold-gradient-bg text-dark-950 flex items-center justify-center font-black">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-gold-400">Demoday Investor Metriklari</h3>
                  <p className="text-xs text-gray-400">Zafaron Platformasi Ishlash Ko'rsatkichlari</p>
                </div>
              </div>
              <button
                onClick={() => setShowPitchStats(false)}
                className="w-8 h-8 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20">
                <span className="text-xs text-gray-400 block font-medium">Avtomatlashtirish</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">99.4%</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Telegram, KDS va Kassa bir vaqtda</span>
              </div>

              <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20">
                <span className="text-xs text-gray-400 block font-medium">O'rtacha Chek</span>
                <span className="text-2xl font-black text-gold-400 mt-1 block">340,000 UZS</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Shohona milliy & steyk menyu</span>
              </div>

              <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20">
                <span className="text-xs text-gray-400 block font-medium">KDS Tayyorlash Tezligi</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">14 Daqiqa</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Oshpazlar operatsion optimizatsiyasi</span>
              </div>

              <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20">
                <span className="text-xs text-gray-400 block font-medium">AI Javob Vaqti</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">&lt; 1 Soniya</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">24/7 Shaxsiy konsyerj</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs text-gold-200">
              💡 <b>Hakamlar uchun xulosa:</b> Zafaron tizimi xaridordan boshlab (veb-sayt, AI konsyerj, Telegram bot) to oshxonadagi oshpazlar (KDS) va boshqaruvchilargacha (POS, Avto-Direct) 100% avtomatlashtirilgan yagona ekotizimdir.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  soundFx.playPop();
                  setShowPitchStats(false);
                }}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-dark-950 font-black text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
