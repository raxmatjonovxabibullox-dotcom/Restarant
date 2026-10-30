import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  DollarSign,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Flame,
  Music,
  Printer,
  Plus,
  Trash2,
  Edit,
  Save,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../hooks/useSoundEffects';

const VIP_STORAGE_KEY = 'zafaron_vip_settings_v1';

export const VipSuiteManager = ({ reservations = [], showToast = () => {} }) => {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const { theme } = useTheme();

  // VIP Room Configuration (Customizable deposits)
  const [vipSettings, setVipSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(VIP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      vip1Deposit: 200000,
      vip2Deposit: 300000,
      vip1Name: "VIP-1 Hashamatli Oltin Xona (Kamin bilan)",
      vip2Name: "VIP-2 Prezident Suit (Panoramali)",
      vip1Capacity: "6-10 kishi",
      vip2Capacity: "10-14 kishi",
      includedServices: [
        "Shaxsiy Oltin Ofitsiant xizmati",
        "Jonli kamin va xushbo'y ud tutatqisi",
        "Eksklyuziv Zafaron Shohona Choy to'plami",
        "Shaxsiy akustika va audio-tizim",
        "Depozit summasi hisobdan to'liq chegiriladi"
      ]
    };
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editForm, setEditForm] = useState(vipSettings);

  // VIP Bookings list with sample initial VIP guests
  const [vipBookings, setVipBookings] = useState(() => [
    {
      id: 'VIP-BK-101',
      room: 'VIP 1',
      guestName: 'Akmal Karimov (Oliy Majlis delegatsiyasi)',
      guestPhone: '+998 (90) 911-22-33',
      date: 'Bugun, 19:30',
      guestsCount: 8,
      depositAmount: 200000,
      depositStatus: 'paid', // 'paid' | 'pending' | 'refunded'
      specialRequests: ['🔥 Kamin yoqilgan bo\'lsin', '🥩 Tomahawk steyk oldindan buyurtma', '🎻 Skripkachi 20:00 da'],
      status: 'confirmed'
    },
    {
      id: 'VIP-BK-102',
      room: 'VIP 2',
      guestName: 'Davron Bekmurodov (Biznes hamkorlar)',
      guestPhone: '+998 (97) 777-00-11',
      date: 'Ertaga, 20:00',
      guestsCount: 12,
      depositAmount: 300000,
      depositStatus: 'paid',
      specialRequests: ['🍾 Muzlatilgan shohona desertlar', '👔 Shaxsiy ofitsiant Shaxzod'],
      status: 'confirmed'
    },
    {
      id: 'VIP-BK-103',
      room: 'VIP 1',
      guestName: 'Nodira Alimova (Tug\'ilgan kun oqshomi)',
      guestPhone: '+998 (93) 555-44-33',
      date: '31-Oktabr, 18:00',
      guestsCount: 10,
      depositAmount: 200000,
      depositStatus: 'pending',
      specialRequests: ['💐 Gul bezaklari', '🎂 Sham va tabrik musiqasi'],
      status: 'pending'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [newBookingModal, setNewBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    room: 'VIP 1',
    guestName: '',
    guestPhone: '',
    date: 'Bugun, 20:00',
    guestsCount: 8,
    specialRequests: ''
  });

  const totalVipDepositsCollected = vipBookings
    .filter(b => b.depositStatus === 'paid')
    .reduce((sum, b) => sum + b.depositAmount, 0);

  const pendingDeposits = vipBookings
    .filter(b => b.depositStatus === 'pending')
    .reduce((sum, b) => sum + b.depositAmount, 0);

  const handleSaveSettings = () => {
    setVipSettings(editForm);
    localStorage.setItem(VIP_STORAGE_KEY, JSON.stringify(editForm));
    setIsEditingSettings(false);
    soundFx.playSuccess();
    showToast("✅ VIP depozit narxlari va qoidalari muvaffaqiyatli saqlandi!", "success");
  };

  const handleCreateVipBooking = (e) => {
    e.preventDefault();
    if (!newBooking.guestName || !newBooking.guestPhone) {
      showToast("⚠️ Iltimos, mijoz ismi va telefonini kiriting", "error");
      return;
    }
    const depositAmount = newBooking.room === 'VIP 2' ? vipSettings.vip2Deposit : vipSettings.vip1Deposit;
    const requests = newBooking.specialRequests
      ? newBooking.specialRequests.split(',').map(s => s.trim()).filter(Boolean)
      : ['Shaxsiy VIP qabul'];

    const newObj = {
      id: `VIP-BK-${Math.floor(100 + Math.random() * 900)}`,
      room: newBooking.room,
      guestName: newBooking.guestName,
      guestPhone: newBooking.guestPhone,
      date: newBooking.date,
      guestsCount: Number(newBooking.guestsCount) || 8,
      depositAmount,
      depositStatus: 'paid',
      specialRequests: requests,
      status: 'confirmed'
    };

    setVipBookings(prev => [newObj, ...prev]);
    setNewBookingModal(false);
    setNewBooking({
      room: 'VIP 1',
      guestName: '',
      guestPhone: '',
      date: 'Bugun, 20:00',
      guestsCount: 8,
      specialRequests: ''
    });
    soundFx.playSuccess();
    showToast("👑 Yangi VIP bron va depozit ro'yxatga olindi!", "success");
  };

  const toggleDepositStatus = (id) => {
    setVipBookings(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.depositStatus === 'paid' ? 'pending' : 'paid';
        return { ...item, depositStatus: nextStatus };
      }
      return item;
    }));
    soundFx.playPop();
    showToast("Depozit to'lov holati yangilandi", "info");
  };

  const handleDeleteBooking = (id) => {
    if (confirm("Ushbu VIP bronni bekor qilmoqchimisiz?")) {
      setVipBookings(prev => prev.filter(b => b.id !== id));
      soundFx.playTrash();
      showToast("VIP bron bekor qilindi", "info");
    }
  };

  const filteredBookings = vipBookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.depositStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER BANNER WITH GOLD VIP SHIMMER */}
      <div className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden border ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#1b1c2b] via-[#231d14] to-[#171a29] border-amber-500/30'
          : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-200 shadow-md'
      }`}>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black tracking-widest uppercase">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Zafaron Presidential VIP Suite Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current flex items-center gap-2">
              👑 VIP Xonalar va Bron Depozitlari Boshqaruvi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Hashamatli VIP xonalarining real vaqtdagi bandligi, mehmonlarning maxsus talablari va to'langan depozit pullari hisob-kitobi.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Depozit Narxlarini Sozlash</span>
            </button>
            <button
              onClick={() => setNewBookingModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 text-dark-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi VIP Mehmon Qo'shish</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK DEPOSIT SETTINGS MODAL / PANEL */}
      {isEditingSettings && (
        <div className={`p-6 rounded-2xl border space-y-4 animate-in fade-in duration-200 ${
          theme === 'dark' ? 'bg-[#181a28] border-amber-500/40' : 'bg-white border-amber-300 shadow-lg'
        }`}>
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <Crown className="w-4 h-4" /> VIP Xona Narxlarini O'zgartirish (Admin Sozlamasi)
            </h3>
            <button
              onClick={() => setIsEditingSettings(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Yopish ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                VIP-1 (10 kishilik) Depozit Summasi (UZS):
              </label>
              <input
                type="number"
                value={editForm.vip1Deposit}
                onChange={(e) => setEditForm({ ...editForm, vip1Deposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs border bg-slate-900/50 border-slate-700 text-amber-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                VIP-2 Prezident Suit (14 kishilik) Depozit Summasi (UZS):
              </label>
              <input
                type="number"
                value={editForm.vip2Deposit}
                onChange={(e) => setEditForm({ ...editForm, vip2Deposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs border bg-slate-900/50 border-slate-700 text-amber-400 font-mono font-bold"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Saqlash va Saytda Yangilash</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total VIP Deposits */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Yig'ilgan VIP Depozitlar</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-amber-400 tracking-tight font-mono">
              {formatPrice(totalVipDepositsCollected)}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Kechki ovqat hisobidan chegiriladi</span>
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Kutilayotgan to'lovlar: {formatPrice(pendingDeposits)}
          </div>
        </div>

        {/* Card 2: VIP 1 Status */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">VIP 1 Xona (10 kishi)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              BAND (19:30)
            </span>
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-current">Akmal Karimov</div>
            <p className="text-xs text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Kamin va Oltin Servis
            </p>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Depozit: {formatPrice(vipSettings.vip1Deposit)}</span>
            <span className="text-emerald-400 font-bold">To'langan ✓</span>
          </div>
        </div>

        {/* Card 3: VIP 2 Status */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">VIP 2 Prezident Suit (14 kishi)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ERTANGA BAND
            </span>
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-current">Davron Bekmurodov</div>
            <p className="text-xs text-purple-400 font-semibold mt-0.5 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> 12 kishilik delegatsiya
            </p>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Depozit: {formatPrice(vipSettings.vip2Deposit)}</span>
            <span className="text-emerald-400 font-bold">To'langan ✓</span>
          </div>
        </div>

        {/* Card 4: VIP Services Standard */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">VIP Xizmat Sifati</span>
            <span className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-emerald-400">100% EXCLUSIVE</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Shaxsiy ofitsiant, maxfiy muhit va akustik qulaylik
            </p>
          </div>
          <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Shohona qabul kafolati</span>
          </div>
        </div>
      </div>

      {/* VIP BOOKINGS TABLE & MANAGEMENT */}
      <div className={`p-6 rounded-3xl border space-y-5 ${
        theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-lg text-current flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>VIP Bronlar va Depozitlar Jurnali</span>
            </h2>
            <p className="text-xs text-slate-400">
              VIP mehmonlarning buyurtmalari, qoldirilgan depozit pullari va xizmat so'rovlari
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-amber-500 text-dark-950 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              Hammasi ({vipBookings.length})
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'paid'
                  ? 'bg-emerald-500 text-white font-black'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              To'langan
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-dark-950 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              Kutilmoqda
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-inherit text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Xona</th>
                <th className="py-3 px-4">Mehmon & Telefon</th>
                <th className="py-3 px-4">Sana va Vaqt</th>
                <th className="py-3 px-4">Sig'im</th>
                <th className="py-3 px-4">VIP Depozit</th>
                <th className="py-3 px-4">To'lov Holati</th>
                <th className="py-3 px-4">Maxsus So'rovlar</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs ${
                      b.room === 'VIP 2'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      <Crown className="w-3 h-3" />
                      <span>{b.room}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="text-current font-bold">{b.guestName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{b.guestPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="flex items-center gap-1 font-bold">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>{b.guestsCount} kishi</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                    {formatPrice(b.depositAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleDepositStatus(b.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                        b.depositStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30'
                      }`}
                      title="To'lov statusini o'zgartirish uchun bosing"
                    >
                      {b.depositStatus === 'paid' ? 'TO\'LANGAN ✓' : 'KUTILMOQDA ⏳'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {b.specialRequests?.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          window.print();
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
                        title="VIP Chekni chop etish"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Bronni bekor qilish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW VIP BOOKING MODAL */}
      {newBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 ${
            theme === 'dark' ? 'bg-[#181a28] border-amber-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <h3 className="font-black text-base flex items-center gap-2 text-amber-400">
                <Crown className="w-5 h-5" /> Yangi VIP Xona Bron Qilish
              </h3>
              <button
                onClick={() => setNewBookingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVipBooking} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">VIP Xonani Tanlang:</label>
                <select
                  value={newBooking.room}
                  onChange={(e) => setNewBooking({ ...newBooking, room: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-amber-400 font-bold"
                >
                  <option value="VIP 1">VIP-1 Hashamatli Oltin Xona (200,000 UZS Depozit)</option>
                  <option value="VIP 2">VIP-2 Prezident Suit (300,000 UZS Depozit)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Mijoz Ism-sharifi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rahimov"
                  value={newBooking.guestName}
                  onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Telefon raqam:</label>
                  <input
                    type="text"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={newBooking.guestPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, guestPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Mehmonlar soni:</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={newBooking.guestsCount}
                    onChange={(e) => setNewBooking({ ...newBooking, guestsCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Tashrif Sana va Vaqti:</label>
                <input
                  type="text"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Maxsus istaklar (vergul bilan):</label>
                <input
                  type="text"
                  placeholder="Kamin yoqilsin, Jonli musiqa, Maxsus choy"
                  value={newBooking.specialRequests}
                  onChange={(e) => setNewBooking({ ...newBooking, specialRequests: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-900/60 border-slate-700 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-400 font-bold">
                <span>VIP Depozit:</span>
                <span className="font-mono text-sm">
                  {formatPrice(newBooking.room === 'VIP 2' ? vipSettings.vip2Deposit : vipSettings.vip1Deposit)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewBookingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tasdiqlash va Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
