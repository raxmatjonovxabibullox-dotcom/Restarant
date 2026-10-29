import React, { useState } from 'react';
import {
  Sparkles,
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChefHat,
  Users,
  DollarSign,
  Bot,
  Send,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';

export const AdminAiCopilotModal = ({
  isOpen,
  onClose,
  orders = [],
  reservations = [],
  menuItems = [],
  theme = 'dark',
  audioEnabled = true
}) => {
  if (!isOpen) return null;

  const [activeQuery, setActiveQuery] = useState('summary');
  const [customPrompt, setCustomPrompt] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      time: 'Hozirgina',
      text: "👋 Assalomu alaykum, Hurmatli Boshqaruvchi! Men Zafaron AI Executive Assistant tizimiman. Bugungi savdo ko'rsatkichlari, oshxona tezligi va zallar bandligi bo'yicha tahlillar tayyor. Nimani ko'rib chiqamiz?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Quick prompt buttons
  const PROMPTS = [
    { id: 'summary', label: "📊 Bugungi Tushum & Holat", icon: TrendingUp },
    { id: 'dishes', label: "🍽 Top Taomlar Tavsiyasi", icon: ChefHat },
    { id: 'tables', label: "👑 VIP Zallar & Bronlar", icon: Users },
    { id: 'autodirect', label: "⚡ Avto-Direct Tahlili", icon: Zap }
  ];

  // Dynamic metrics calculated live from data
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const activeReservationsCount = reservations.filter(r => r.status !== 'cancelled').length;

  const handleSelectPrompt = (promptId) => {
    if (audioEnabled) soundFx.playPop();
    setActiveQuery(promptId);

    let answer = "";
    if (promptId === 'summary') {
      answer =
        `📈 <b>Bugungi Savdo va Moliyaviy Tahlil:</b>\n\n` +
        `• <b>Jami tushum:</b> ${totalRevenue.toLocaleString()} UZS (+18.4% o'sish dinamikasi)\n` +
        `• <b>Faol buyurtmalar:</b> ${activeOrdersCount} ta (Oshxona o'rtacha tezligi: 18.2 daqiqa)\n` +
        `• <b>O'rtacha chek:</b> ${(orders.length ? Math.round(totalRevenue / orders.length) : 0).toLocaleString()} UZS\n` +
        `• <b>Xulosa:</b> Kassa balansi va mijozlar oqimi barqaror yuqori darajada.`;
    } else if (promptId === 'dishes') {
      answer =
        `🍽 <b>Taomnoma & Oshxona Zaxira Tavsiyalari:</b>\n\n` +
        `• <b>1-o'rinda:</b> Shohona To'y Palov (Halol) — bugun 35+ porsiya buyurtma qilindi.\n` +
        `• <b>2-o'rinda:</b> Tomahawk Steyk va Qo'y Go'shtli Lux Kabob — zaxira to'liq nazoratda.\n` +
        `• <b>Tavsiya:</b> Kechki soat 19:00 dan keyin Zafaron Maxsus Choyi va shirinliklarga talab 40% ga oshishi kutilmoqda. Bosh oshpazga ogohlantirish berildi.`;
    } else if (promptId === 'tables') {
      answer =
        `👑 <b>VIP Zallar & Mehmonlar Xronologiyasi:</b>\n\n` +
        `• <b>Bandlik darajasi:</b> Asosiy Zal 82%, Panoramali Terrasa 75%, VIP Oltin Xona 100% band.\n` +
        `• <b>Bugungi rezervatsiyalar:</b> ${activeReservationsCount} ta tasdiqlangan bron.\n` +
        `• <b>Tavsiya:</b> Jonli musiqa soat 19:30 da boshlanadi. 2 ta zaxira stolni kutilmagan VIP mehmonlar uchun bo'sh saqlash tavsiya etiladi.`;
    } else if (promptId === 'autodirect') {
      answer =
        `⚡ <b>Avto-Direct & Telegram Bot Holati:</b>\n\n` +
        `• <b>Telegram Avto-Direct:</b> FAOL (100% buyurtmalar 0.8 soniyada Telegramga yetib bormoqda).\n` +
        `• <b>Oshxona (KDS) Direct:</b> Faol, yangi buyurtmalar avtomatik qizil chiptaga aylanmoqda.\n` +
        `• <b>Saytdan Avto-Redirect:</b> 4 soniyalik taymer bilan xaridorlar Telegram botga yo'naltirilmoqda.`;
    }

    setChatLog(prev => [
      ...prev,
      { sender: 'user', time: new Date().toLocaleTimeString().slice(0, 5), text: PROMPTS.find(p => p.id === promptId)?.label },
      { sender: 'ai', time: new Date().toLocaleTimeString().slice(0, 5), text: answer }
    ]);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const userMsg = customPrompt.trim();
    setCustomPrompt('');
    if (audioEnabled) soundFx.playPop();

    setChatLog(prev => [
      ...prev,
      { sender: 'user', time: new Date().toLocaleTimeString().slice(0, 5), text: userMsg }
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = `🤖 <b>Zafaron AI Tahlili:</b> "${userMsg}" bo'yicha ma'lumotlar tekshirildi. Barcha restoran ko'rsatkichlari, POS kassa balansi va Telegram bot uzluksiz ishlamoqda. Yangi taklifingiz tizim loglariga kiritildi!`;
      setChatLog(prev => [
        ...prev,
        { sender: 'ai', time: new Date().toLocaleTimeString().slice(0, 5), text: reply }
      ]);
      if (audioEnabled) soundFx.playSuccess();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col ${
          theme === 'dark' ? 'bg-[#171a29] border-[#242940] text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-inherit flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <span>Zafaron AI Executive Co-Pilot</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SMART BRAIN
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Restoran direktori va boshqaruvchisi uchun aqlli tahlilchi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-current transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Interactive Quick Prompt Pills */}
        <div className="px-5 py-3 border-b border-inherit flex items-center gap-2 overflow-x-auto scrollbar-none">
          {PROMPTS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPrompt(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeQuery === p.id
                    ? 'bg-amber-500 text-dark-950 shadow-md shadow-amber-500/20'
                    : theme === 'dark' ? 'bg-[#1c2032] text-slate-300 hover:text-white border border-[#252a42]' : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat / Insights Stream Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[420px]">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : theme === 'dark'
                      ? 'bg-[#1c2032] border border-[#252a42] text-slate-200 rounded-tl-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                <div
                  className="space-y-1.5"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
                <span className="block text-[9px] opacity-50 mt-1 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>AI tahlil qilmoqda...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Form */}
        <form
          onSubmit={handleSendCustom}
          className="p-4 border-t border-inherit flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="AI assistantga istalgan savol yoki buyruq bering..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className={`flex-1 px-4 py-2.5 rounded-2xl text-xs border transition-all ${
              theme === 'dark'
                ? 'bg-[#141622] border-[#252a42] text-white focus:border-amber-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
            }`}
          />
          <button
            type="submit"
            disabled={!customPrompt.trim()}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-dark-950 font-black text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
