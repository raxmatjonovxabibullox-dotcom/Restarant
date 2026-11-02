import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  QrCode,
  Copy,
  Check,
  X,
  ShieldCheck,
  Award,
  Zap,
  Gift,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';
import { luxuryConfetti } from '../utils/confetti';

export const SapphireVipPassportModal = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [guestName, setGuestName] = useState(() => localStorage.getItem('sapphire_vip_name') || 'Hurmatli Mehmon');
  const [isEditingName, setIsEditingName] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTier, setActiveTier] = useState('black'); // 'black', 'sapphire', 'gold'

  if (!isOpen) return null;

  const vipCode = activeTier === 'black' ? 'SAPPHIRE-ROYALE-20' : activeTier === 'sapphire' ? 'SAPPHIRE-ELITE-15' : 'SAPPHIRE-GOLD-10';
  const discountPercent = activeTier === 'black' ? '20%' : activeTier === 'sapphire' ? '15%' : '10%';

  const handleCopyCode = () => {
    soundFx.playChime();
    luxuryConfetti();
    navigator.clipboard.writeText(vipCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveName = (newName) => {
    const val = newName.trim() || 'Hurmatli Mehmon';
    setGuestName(val);
    localStorage.setItem('sapphire_vip_name', val);
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-dark-900 via-dark-950 to-black border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-up">
        {/* Glow orb */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Sapphire Privilege Club</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
            {lang === 'ru' ? 'Цифровой VIP Паспорт' : lang === 'en' ? 'Digital VIP Passport' : 'Raqamli VIP Pasport'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {lang === 'ru'
              ? 'Эксклюзивные привилегии, скидки и приоритетное обслуживание в Sapphire'
              : lang === 'en'
              ? 'Exclusive privileges, royal discounts and priority service at Sapphire'
              : "Sapphire restoranida shohona imtiyozlar, chegirmalar va ustuvor VIP xizmat"}
          </p>
        </div>

        {/* Tier Switcher */}
        <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-6 max-w-md mx-auto">
          {[
            { id: 'gold', name: 'Gold', badge: '10%' },
            { id: 'sapphire', name: 'Sapphire', badge: '15%' },
            { id: 'black', name: 'Black Royale', badge: '20%' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                soundFx.playPop();
                setActiveTier(t.id);
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTier === t.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-dark-950 shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{t.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTier === t.id ? 'bg-dark-950/20 text-dark-950' : 'bg-white/10 text-gray-300'}`}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Holographic Digital VIP Card */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 overflow-hidden border shadow-2xl transition-all duration-500 ${
            activeTier === 'black'
              ? 'bg-gradient-to-br from-zinc-900 via-neutral-950 to-blue-950/60 border-amber-500/40 shadow-blue-950/40'
              : activeTier === 'sapphire'
              ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-blue-400/50 shadow-blue-600/20'
              : 'bg-gradient-to-br from-amber-950/80 via-neutral-900 to-amber-900/60 border-amber-500/40 shadow-amber-500/20'
          }`}
        >
          {/* Card Hologram shimmer lines */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-70 pointer-events-none" />
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-wider text-white block">
                  SAPPHIRE
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 block font-semibold">
                  {activeTier === 'black' ? 'Black Royale Elite' : activeTier === 'sapphire' ? 'Sapphire Tier' : 'Royal Gold Club'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                {discountPercent} OFF
              </span>
              <span className="text-[9px] uppercase text-gray-400 tracking-wider">
                VIP Imtiyozi
              </span>
            </div>
          </div>

          {/* Card Chip & User Name */}
          <div className="relative z-10 flex items-center justify-between pt-2 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider block">
                {lang === 'ru' ? 'Держатель Карты' : lang === 'en' ? 'Cardholder' : 'Pasport Egasi'}
              </span>
              {isEditingName ? (
                <input
                  type="text"
                  defaultValue={guestName}
                  onBlur={(e) => handleSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName(e.target.value)}
                  autoFocus
                  className="bg-white/10 border border-amber-500/50 rounded-lg px-2 py-0.5 text-sm text-white font-bold outline-none"
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="group flex items-center gap-2 cursor-pointer"
                  title="Ismni o'zgartirish uchun bosing"
                >
                  <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                    {guestName}
                  </h4>
                  <span className="text-[10px] text-gray-400 underline opacity-0 group-hover:opacity-100 transition-opacity">
                    (tahrirlash)
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider block">ID Raqam</span>
              <span className="font-mono text-xs text-amber-300 font-bold tracking-widest">
                SPH-2026-8899
              </span>
            </div>
          </div>

          {/* Promo code bar */}
          <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Eksklyuziv Promo-kod</span>
              <span className="font-mono text-sm font-black text-amber-400 tracking-wider">
                {vipCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ru' ? 'Скопировано!' : 'Nusxalandi!') : (lang === 'ru' ? 'Копировать' : 'Nusxa Olish')}</span>
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Ustuvor Bron</span>
              <span className="text-[10px] text-gray-400 block">Kutishsiz VIP stol</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Shohona Kompliment</span>
              <span className="text-[10px] text-gray-400 block">Har tashrifda shirinlik</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
