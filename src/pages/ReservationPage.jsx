import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Music,
  Car,
  Baby,
  Phone
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

const getTomorrowDate = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];
const getTodayDate = () => new Date().toISOString().split('T')[0];

export const ReservationPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { makeReservation } = useRestaurant();

  const [formData, setFormData] = useState(() => ({
    fullName: '',
    phone: '',
    date: getTomorrowDate(),
    time: '19:00',
    guests: '2',
    zone: 'Asosiy Hashamatli Zal',
    specialRequests: ''
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState(null);

  const zones = [
    {
      id: 'main',
      name: t('reservationPage.zoneMain') || "Asosiy Hashamatli Zal",
      desc: "Shohona sharqona bezaklar, musiqiy dastur va qulay divanlar",
      capacity: "1 - 10 kishi"
    },
    {
      id: 'vip',
      name: t('reservationPage.zoneVIP') || "VIP Alohida Xona (6-12 kishi)",
      desc: "To'liq shaxsiy muhit, alohida ofitsiant va premium akustika",
      capacity: "6 - 14 kishi"
    },
    {
      id: 'terrace',
      name: t('reservationPage.zoneTerrace') || "Ochiq Havo Terrasasi (Manzarali)",
      desc: "Toshkent kechki manzarasi, toza havo va shamlar yog'dusi",
      capacity: "2 - 8 kishi"
    },
    {
      id: 'family',
      name: t('reservationPage.zoneFamily') || "Shinam Oila Hududi",
      desc: "Bolalar o'yin burchagi yaqinida, osoyishta va keng stollar",
      capacity: "3 - 8 kishi"
    }
  ];

  const guestOptions = ['1', '2', '3', '4', '5', '6', '8', '10', '12+'];
  const timeSlots = [
    '11:30', '12:30', '13:30', '14:30',
    '17:30', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
  ];

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
      const res = await makeReservation(formData);
      setSubmittedReservation(res);
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '19:00',
        guests: '2',
        zone: 'Asosiy Hashamatli Zal',
        specialRequests: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t('reservationPage.badge')}</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight">
          {t('reservationPage.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {t('reservationPage.subtitle')}
        </p>
      </div>

      {/* Main Grid: Form + Experience Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
            {submittedReservation ? (
              <div className="py-12 text-center space-y-6 animate-scale-up">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-1">
                    Bron Raqami: #{submittedReservation.id}
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                    {t('reservationPage.successMsg')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-md mx-auto">
                    {t('reservationPage.instantTelegram')} Tez orada ma'murimiz telefon orqali siz bilan bog'lanadi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/5 max-w-md mx-auto text-left text-xs sm:text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mehmon:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{submittedReservation.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sana va vaqt:</span>
                    <span className="font-bold text-gold-500">{submittedReservation.date} • {submittedReservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mehmonlar soni:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{submittedReservation.guests} kishi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zal:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{submittedReservation.zone}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedReservation(null)}
                  className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors"
                >
                  Yana boshqa stol band qilish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-100 dark:border-white/5 pb-4">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gold-500" />
                    <span>{t('reservationPage.formTitle')}</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Barcha maydonlarni to'ldiring, buyurtma avtomatik Telegram guruhimizga yuboriladi.
                  </p>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('reservationPage.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Sardor Rahimov"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                      <span>{t('reservationPage.phone')} *</span>
                      <span className="text-[10px] text-gray-400 font-normal">Faqat raqamlar</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      required
                      placeholder="+998 (90) 123-45-67"
                      value={formData.phone}
                      onKeyDown={blockNonPhoneKeys}
                      onChange={(e) => {
                        const formatted = handlePhoneInputChange(e, formData.phone);
                        setFormData(prev => ({ ...prev, phone: formatted }));
                      }}
                      className="glass-input w-full font-mono tracking-wide"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('reservationPage.date')} *
                    </label>
                    <input
                      type="date"
                      required
                      min={getTodayDate()}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('reservationPage.time')} *
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="glass-input w-full font-medium"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                    <span>{t('reservationPage.guests')} *</span>
                    <span className="text-gold-500 font-bold">{formData.guests} kishi</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {guestOptions.map(g => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData({ ...formData, guests: g })}
                        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                          formData.guests === g
                            ? 'gold-gradient-bg text-dark-950 shadow-md scale-105'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:border-gold-500'
                        }`}
                      >
                        {g} {g === '12+' ? '' : 'kishi'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('reservationPage.zone')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {zones.map((zone) => {
                      const isSelected = formData.zone === zone.name;
                      return (
                        <div
                          key={zone.id}
                          onClick={() => setFormData({ ...formData, zone: zone.name })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/15 shadow-md'
                              : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-dark-800/60 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                              {zone.name}
                            </h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                            {zone.desc}
                          </p>
                          <span className="text-[10px] text-gold-500 font-semibold block mt-1">
                            Sig'imi: {zone.capacity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('reservationPage.specialRequests')}
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Masalan: Deraza yonidagi sokin stol bo'lsin, tug'ilgan kun shamlari va shirinlik bilan..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="glass-input w-full text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <CalendarDays className="w-5 h-5" />
                  <span>{isSubmitting ? t('common.loading') : t('reservationPage.submitBtn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Info: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Atmosphere Card */}
          <div className="glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="relative h-56">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="VIP Dining"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block mb-1">
                  Sharqona Mehmondo'stlik
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  Har bir mehmonimiz — aziz mehmon
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="font-serif font-bold text-base text-gray-900 dark:text-white">
                Stol band qilish qulayliklari:
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">Bepul bron qilish</span>
                    <span className="text-gray-500 text-xs">Oldindan hech qanday to'lov yoki depozit talab etilmaydi</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">Jonli ijro & Sokin musiqa</span>
                    <span className="text-gray-500 text-xs">Payshanba - Shanba kunlari 19:30 dan jonli sozanda va xonandalar</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">Valet Parking</span>
                    <span className="text-gray-500 text-xs">Restoran oldida qulay va bepul xavfsiz avtoturargoh</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">Bolalar uchun o'rindiqlar</span>
                    <span className="text-gray-500 text-xs">Kichik mehmonlarimiz uchun alohida e'tibor</span>
                  </div>
                </div>
              </div>

              {/* Direct Phone Call Prompt */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">Tezkor savol bormi?</span>
                    <a
                      href="tel:+998712008899"
                      className="font-bold text-sm text-gold-500 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +998 71 200 88 99
                    </a>
                  </div>

                  <button
                    onClick={() => { setActivePage('menu'); window.scrollTo(0, 0); }}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-gold-500"
                  >
                    Taomnomani ko'rish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
