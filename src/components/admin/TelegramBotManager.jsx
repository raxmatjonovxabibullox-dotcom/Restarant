import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Sliders,
  Play
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../hooks/useSoundEffects';

export const TelegramBotManager = ({ showToast = () => {} }) => {
  const { theme } = useTheme();

  const [botStatus, setBotStatus] = useState('online'); // 'online' | 'restarting'
  const [testQuery, setTestQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'bot',
      time: '10:00',
      text: "🤖 Assalomu alaykum! Zafaron AI Restoran yordamchisi xizmatingizda. Stol band qilish, taomnoma yoki manzilimiz bo'yicha yordam bera olaman."
    }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');

  const handleSimulateChat = (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    const userMsg = {
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: testQuery
    };
    setChatLog(prev => [...prev, userMsg]);
    const currentQ = testQuery.toLowerCase().trim();
    setTestQuery('');
    setIsSimulating(true);
    soundFx.playPop();

    setTimeout(() => {
      let replyText = "Zafaron restoranida barcha taomlar 100% Halol sertifikatiga ega va eng sifatli mahsulotlardan tayyorlanadi.";

      if (currentQ.includes('vip') || currentQ.includes('3')) {
        replyText = "👑 3. VIP Oltin Xona tanlandi!\n• 10-14 kishilik to'liq alohida qulay xona\n• Shaxsiy ofitsiant va kamin xizmati\n• 💰 VIP Bron Depoziti: 200,000 so'm (kechki ovqat hisobidan to'liq chegiriladi)\n📞 +998 (71) 200-88-99";
      } else if (currentQ.includes('osh') || currentQ.includes('plov')) {
        replyText = "✨ Zafaron Shohona Oshi — 58,000 so'm. Mayin lahm go'sht, qazi, bedana tuxum va tabiiy za'faron bilan damlanadi. Har kuni soat 11:30 da tayyor bo'ladi!";
      } else if (currentQ.includes('manzil') || currentQ.includes('qayerda')) {
        replyText = "📍 Manzilimiz: Toshkent sh., Amir Temur shox ko'chasi, 107-uy (Mo'ljal: Oloy bozori yaqinida). Har kuni 10:00 dan 23:00 gacha ishlaymiz!";
      } else if (currentQ.includes('bron') || currentQ.includes('stol')) {
        replyText = "🥂 Stol band qilish uchun zallarimiz: 1. Asosiy zal, 2. Terrasa, 3. VIP Oltin xona (Depozit 200,000 so'm). Zal raqamini yuboring!";
      } else if (currentQ.includes('salom') || currentQ.includes('assalom')) {
        replyText = "Vaalaykum assalom! Xush kelibsiz. Qanday ma'lumot kerak: Menyu, Stol bron qilish, VIP xonalar yoki Dostavka?";
      }

      setChatLog(prev => [
        ...prev,
        {
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: replyText
        }
      ]);
      setIsSimulating(false);
      soundFx.playCorrect();
    }, 600);
  };

  const handleRestartBot = () => {
    setBotStatus('restarting');
    soundFx.playPop();
    showToast("🔄 Telegram AI Bot qayta ishga tushirilmoqda...", "info");

    setTimeout(() => {
      setBotStatus('online');
      soundFx.playSuccess();
      showToast("✅ Telegram AI Bot muvaffaqiyatli ishga tushdi va faol holatda!", "success");
    }, 1200);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    soundFx.playSuccess();
    showToast(`📢 Xabarnoma yuborildi: "${broadcastText.slice(0, 30)}..."`, "success");
    setBroadcastText('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#161b2e] via-[#1c223c] to-[#121422] border-blue-500/30'
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-md'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
              <Bot className="w-4 h-4 text-blue-400 animate-bounce" />
              <span>Zafaron Telegram Neural AI Assistant Controller</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current flex items-center gap-2">
              🤖 Telegram AI Bot Jonli Boshqaruv Markazi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Telegram boti holatini nazorat qilish, mijozlarga avtomatik javoblar, VIP depozit ma'lumotlarini tekshirish va jonli test sinovi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{botStatus === 'online' ? 'STATUS: ONLINE 🟢' : 'RESTARTING... ⏳'}</span>
            </div>
            <button
              onClick={handleRestartBot}
              disabled={botStatus === 'restarting'}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${botStatus === 'restarting' ? 'animate-spin' : ''}`} />
              <span>Botni Qayta Yuklash</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRICS & CAPABILITIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>AI Neyrotarmog'i</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400 mt-2">Gemini Flash + NLP</div>
          <p className="text-[11px] text-slate-400 mt-1">Kontekstni to'liq tushunuvchi AI</p>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Ko'p Tillik Rejim</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400 mt-2">🇺🇿 UZ • 🇷🇺 RU • 🇬🇧 EN</div>
          <p className="text-[11px] text-slate-400 mt-1">Avtomatik til aniqlash</p>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>VIP Bron Integratsiyasi</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 mt-2">200K - 300K UZS</div>
          <p className="text-[11px] text-slate-400 mt-1">Depozit pullari to'liq hisoblangan</p>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Buyruqlar Menyusi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 mt-2">7 ta Asosiy Komanda</div>
          <p className="text-[11px] text-slate-400 mt-1">/start, /bron, /menu, /muloqot...</p>
        </div>
      </div>

      {/* LIVE SIMULATOR & BROADCAST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (7 cols): Interactive Bot Chat Simulator */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-inherit pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm text-current">Admin Bot Simulyatori (Jonli Sinov)</h3>
              </div>
              <span className="text-[11px] text-slate-400">Telegram Bot API test rejimi</span>
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-4 text-xs">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                        : theme === 'dark'
                        ? 'bg-[#1e2338] border border-[#2b314d] text-slate-200 rounded-bl-none'
                        : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isSimulating && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Bot javob yozmoqda...</span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt quick suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tezkor so'rovlar:</span>
              {[
                "VIP xona narxi qancha?",
                "Zafaron oshi bormi?",
                "Stol band qilish",
                "Manzil qayerda?"
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setTestQuery(q)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={handleSimulateChat} className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Botga savol yozing (masalan: VIP puli bo'lsin, taomlar, manzil)..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs border bg-slate-900/60 border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Yuborish</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT (5 cols): Telegram Broadcast & Command Hub */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Broadcast Notification */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="font-bold text-sm text-current flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-500" />
              <span>Ommaviy Xabarnoma Tarqatish (Broadcast)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Botga obuna bo'lgan mehmonlarga aksiya, maxsus bayram takliflari yoki chegirmalarni bir zumda yuborish.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Qabul qiluvchilar:</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-slate-200"
                >
                  <option value="all">Barcha obunachi mehmonlar (2,450+ ta)</option>
                  <option value="vip">Faqat VIP va Doimiy Mehmonlar</option>
                  <option value="today">Bugun stol bron qilganlar</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Xabar Matni:</label>
                <textarea
                  rows="3"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="Bugun Zafaron restoranida barcha steyklar uchun 15% bayramona chegirma!..."
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-dark-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Kanal & Obunachilarga Yuborish</span>
              </button>
            </form>
          </div>

          {/* Bot Command Shortcuts */}
          <div className={`p-6 rounded-3xl border space-y-3 ${
            theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              O'rnatilgan Bot Buyruqlari
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { cmd: '/start', desc: 'Boshlash' },
                { cmd: '/bron', desc: 'Stol va VIP bron' },
                { cmd: '/menu', desc: 'Taomnoma' },
                { cmd: '/muloqot', desc: 'AI bilan chat' },
                { cmd: '/manzil', desc: 'Lokatsiya & Vaqt' },
                { cmd: '/til', desc: 'Tilni tanlash' }
              ].map((c) => (
                <div
                  key={c.cmd}
                  className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between font-mono"
                >
                  <span className="text-blue-400 font-bold">{c.cmd}</span>
                  <span className="text-[10px] text-slate-400">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
