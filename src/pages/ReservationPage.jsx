import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import { soundFx } from '../hooks/useSoundEffects';
import { TableFloorPlan } from '../components/TableFloorPlan';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  LayoutGrid,
  List,
  Crown,
  Users
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

const TODAY_DATE = new Date().toISOString().split('T')[0];
const getTomorrowDate = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const ReservationPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { makeReservation } = useRestaurant();

  const [viewMode, setViewMode] = useState('floorplan'); // 'floorplan' or 'form'
  const [selectedTable, setSelectedTable] = useState(null);

  const [formData, setFormData] = useState(() => ({
    fullName: '',
    phone: '',
    date: getTomorrowDate(),
    time: '19:00',
    guests: '2',
    zone: 'Asosiy Hashamatli Zal',
    tableNumber: '',
    specialRequests: ''
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState(null);

  const zones = [
    {
      id: 'main',
      name: "Asosiy Hashamatli Zal",
      desc: "Shohona sharqona bezaklar, jonli musiqiy dastur va qulay divanlar",
      capacity: "1 - 8 kishi"
    },
    {
      id: 'vip',
      name: "VIP Alohida Xona (6-12 kishi)",
      desc: "To'liq shaxsiy muhit, alohida ofitsiant va premium kamin",
      capacity: "6 - 14 kishi"
    },
    {
      id: 'terrace',
      name: "Ochiq Havo Terrasasi (Manzarali)",
      desc: "Toshkent kechki panoramasi, toza havo va shamlar yog'dusi",
      capacity: "2 - 8 kishi"
    },
    {
      id: 'family',
      name: "Shinam Oila Hududi",
      desc: "Bolalar o'yin maydonchasi yaqinida, keng va xotirjam stollar",
      capacity: "3 - 8 kishi"
    }
  ];

  const guestOptions = ['1', '2', '3', '4', '5', '6', '8', '10', '12+'];
  const timeSlots = [
    '12:00', '13:00', '14:00', '17:30',
    '18:30', '19:00', '19:30', '20:00',
    '20:30', '21:00', '21:30'
  ];

  const handleTableSelectFromMap = (table) => {
    setSelectedTable(table);
    setFormData((prev) => ({
      ...prev,
      tableNumber: table.number,
      zone: table.zone,
      guests: String(table.seats)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Iltimos, ismingizni kiriting!");
      return;
    }

    if (!isValidUzPhone(formData.phone)) {
      alert("Iltimos, to'liq telefon raqamingizni kiriting:\nMasalan: +998 (90) 123-45-67");
      return;
    }

    setIsSubmitting(true);
    try {
      soundFx.playSuccessFanfare();
      const res = await makeReservation(formData);
      setSubmittedReservation(res);
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        date: getTomorrowDate(),
        time: '19:00',
        guests: '2',
        zone: 'Asosiy Hashamatli Zal',
        tableNumber: '',
        specialRequests: ''
      });
      setSelectedTable(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIP Stol Band Qilish</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-gray-900 dark:text-white">
          {t('reservationPage.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light">
          {t('reservationPage.subtitle')}
        </p>
      </div>

      {submittedReservation ? (
        /* SUCCESS CONFIRMATION CARD */
        <div className="max-w-2xl mx-auto glass-card p-8 sm:p-10 rounded-3xl text-center space-y-6 border-2 border-gold-500/50 shadow-2xl animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500 block mb-1">
              BANDLIK TASDIQLANDI
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
              Buyurtmangiz Qabul Qilindi!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
              Bandlik raqami: <b className="text-gold-500 font-mono">#{submittedReservation.id}</b>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 text-left text-xs space-y-2 border border-gray-200 dark:border-white/10">
            <div className="flex justify-between">
              <span className="text-gray-500">Mehmon:</span>
              <span className="font-bold text-gray-900 dark:text-white">{submittedReservation.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Telefon:</span>
              <span className="font-bold text-gray-900 dark:text-white">{submittedReservation.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sana & Vaqt:</span>
              <span className="font-bold text-gold-500">{submittedReservation.date} | {submittedReservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hudud / Stol:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {submittedReservation.zone} {submittedReservation.tableNumber && `(Stol #${submittedReservation.tableNumber})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mehmonlar soni:</span>
              <span className="font-bold text-gray-900 dark:text-white">{submittedReservation.guests} kishi</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                soundFx.playChime();
                setSubmittedReservation(null);
              }}
              className="w-full sm:flex-1 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm"
            >
              Yana stol band qilish
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                if (setActivePage) setActivePage('menu');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/10 text-xs sm:text-sm font-semibold"
            >
              Taomnoma (Menyu) ga o'tish
            </button>
          </div>
        </div>
      ) : (
        /* RESERVATION FORM & FLOOR PLAN */
        <div className="space-y-8">
          {/* View Mode Toggle: Interactive Floor Plan vs Form */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10 flex items-center gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setViewMode('floorplan');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  viewMode === 'floorplan'
                    ? 'gold-gradient-bg text-dark-950 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Interaktiv Stol Xaritasi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setViewMode('form');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  viewMode === 'form'
                    ? 'gold-gradient-bg text-dark-950 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Oddiy Ro'yxat Rejimi</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Visual Table Selector or Zone Selector */}
            {viewMode === 'floorplan' ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-gold-500" />
                      Interaktiv Zal Rejasi va Stol Tanlash
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Zaldagi o'zingizga ma'qul stol ustiga bosing
                    </p>
                  </div>
                </div>

                <TableFloorPlan
                  selectedTable={selectedTable}
                  onSelectTable={handleTableSelectFromMap}
                />
              </div>
            ) : (
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
                <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                  Restoran Hududini Tanlang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {zones.map((zone) => {
                    const isSelected = formData.zone === zone.name;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => {
                          soundFx.playPop();
                          setFormData({ ...formData, zone: zone.name, tableNumber: '' });
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gold-500/10 border-gold-500 shadow-glow text-gray-900 dark:text-white'
                            : 'bg-white dark:bg-dark-800/80 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{zone.name}</span>
                          <span className="text-[10px] text-gold-500 font-bold px-2 py-0.5 rounded-full bg-gold-500/10">
                            {zone.capacity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {zone.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Guest Details, Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Date & Time */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-gold-500" />
                  Sana va Vaqtni Tanlang
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Tashrif Sanasi
                    </label>
                    <input
                      type="date"
                      required
                      min={TODAY_DATE}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Vaqtni Tanlang
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => {
                            soundFx.playPop();
                            setFormData({ ...formData, time: slot });
                          }}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            formData.time === slot
                              ? 'gold-gradient-bg text-dark-950 shadow-md'
                              : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Mehmonlar Soni
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {guestOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => {
                            soundFx.playPop();
                            setFormData({ ...formData, guests: opt });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                            formData.guests === opt
                              ? 'gold-gradient-bg text-dark-950 shadow-md'
                              : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Guest Info & Requests */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold-500" />
                    Mehmon Ma'lumotlari
                  </h3>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Ism va Familiyangiz *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Sardor Rahimov"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Telefon Raqamingiz *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 (90) 123-45-67"
                      value={formData.phone}
                      onKeyDown={blockNonPhoneKeys}
                      onChange={(e) => handlePhoneInputChange(e, (formatted) => {
                        setFormData(prev => ({ ...prev, phone: formatted }));
                      })}
                      className="w-full glass-input"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Faqat raqamlar qabul qilinadi
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Maxsus istaklar (Tug'ilgan kun, shamlar, bezak...)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Romantik bezak, shirinlikka sham qo'yish yoki bolalar o'rindig'i..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full glass-input resize-none text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{isSubmitting ? "Band qilinmoqda..." : "Stolni Band Qilish"}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
