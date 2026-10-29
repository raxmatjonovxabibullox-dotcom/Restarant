import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CalendarDays,
  Utensils,
  Send,
  MapPin,
  ChevronUp,
  X,
  Bot,
  Crown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

export const FloatingVipHub = ({
  setActivePage,
  onOpenConcierge
}) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track page scroll percentage for top gold indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tHub = {
    uz: {
      vipHub: "Zafaron VIP Hub",
      bookTable: "Stol Band Qilish",
      bookSub: "Hashamatli zallar va xonalar",
      menu: "Taomnoma",
      menuSub: "Shohona milliy & Yevropa",
      aiConcierge: "AI Konsyerj",
      aiSub: "Taom tanlashda yordamchi",
      telegram: "Telegram Bot",
      telegramSub: "Buyurtma & savollar",
      location: "Bizning Manzil",
      locationSub: "Amir Temur shoh ko'chasi"
    },
    ru: {
      vipHub: "Zafaron VIP Hub",
      bookTable: "Бронь Стола",
      bookSub: "Роскошные залы и VIP",
      menu: "Меню Ресторана",
      menuSub: "Восточные и европейские блюда",
      aiConcierge: "AI Консьерж",
      aiSub: "Умный помощник по меню",
      telegram: "Telegram Бот",
      telegramSub: "Заказы и вопросы",
      location: "Наш Адрес",
      locationSub: "Проспект Амира Темура"
    },
    en: {
      vipHub: "Zafaron VIP Hub",
      bookTable: "Book a Table",
      bookSub: "Luxury halls & VIP rooms",
      menu: "Gourmet Menu",
      menuSub: "National & European delights",
      aiConcierge: "AI Concierge",
      aiSub: "Smart dining assistant",
      telegram: "Telegram Bot",
      telegramSub: "Instant chat & updates",
      location: "Our Location",
      locationSub: "Amir Temur Avenue"
    }
  };

  const t = tHub[lang] || tHub.uz;

  const handleAction = (callback) => {
    soundFx.playPop();
    setIsOpen(false);
    callback();
  };

  return (
    <>
      {/* 1. Global Golden Scroll Progress Bar (Top of Screen) */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-gold-500 to-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.7)] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 2. Floating VIP Hub (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        {/* Expanded Quick Action Menu */}
        {isOpen && (
          <div className="mb-3 w-72 rounded-3xl bg-dark-950/95 border border-gold-500/40 backdrop-blur-2xl p-4 shadow-2xl text-white animate-slide-up space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-gold-400">{t.vipHub}</h4>
                  <p className="text-[10px] text-gray-400">Tezkor xizmatlar markazi</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 text-xs">
              {/* 1. Book a table */}
              <button
                onClick={() => handleAction(() => setActivePage('reservation'))}
                className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-gold-500/20 border border-white/5 hover:border-gold-500/30 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-100 group-hover:text-gold-300 transition-colors">{t.bookTable}</p>
                  <p className="text-[10px] text-gray-400">{t.bookSub}</p>
                </div>
              </button>

              {/* 2. AI Concierge */}
              <button
                onClick={() => handleAction(() => onOpenConcierge?.())}
                className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-100 group-hover:text-indigo-300 transition-colors">{t.aiConcierge}</p>
                  <p className="text-[10px] text-gray-400">{t.aiSub}</p>
                </div>
              </button>

              {/* 3. Menu */}
              <button
                onClick={() => handleAction(() => setActivePage('menu'))}
                className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-gold-500/20 border border-white/5 hover:border-gold-500/30 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-100 group-hover:text-gold-300 transition-colors">{t.menu}</p>
                  <p className="text-[10px] text-gray-400">{t.menuSub}</p>
                </div>
              </button>

              {/* 4. Telegram Bot */}
              <a
                href="https://t.me/zafaron_restarant_bot"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playPop()}
                className="w-full p-2.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-100 group-hover:text-blue-300 transition-colors">{t.telegram}</p>
                  <p className="text-[10px] text-gray-400">{t.telegramSub}</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => {
            soundFx.playPop();
            setIsOpen(!isOpen);
          }}
          className="relative group p-3.5 rounded-full bg-gradient-to-tr from-dark-950 via-dark-900 to-dark-800 border-2 border-gold-500/70 text-gold-400 shadow-[0_0_25px_rgba(234,179,8,0.35)] hover:shadow-[0_0_35px_rgba(234,179,8,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
          title="Zafaron VIP Hub"
        >
          {/* Subtle pulse ring */}
          <span className="w-full h-full rounded-full bg-gold-400/20 absolute inset-0 animate-ping pointer-events-none" />

          {isOpen ? (
            <X className="w-5 h-5 text-gold-400 transition-transform" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Crown className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black text-gold-400 hidden sm:inline pr-1">VIP</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
};
