import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import { sendTelegramContactMessage } from '../services/telegramService';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

export const ContactPage = () => {
  const { t } = useLanguage();
  const { showToast } = useRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Iltimos, ismingiz va xabarni kiriting!");
      return;
    }

    if (!isValidUzPhone(formData.phone)) {
      alert("Iltimos, to'liq telefon raqamingizni kiriting:\nMasalan: +998 (90) 123-45-67");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendTelegramContactMessage(formData);
      setIsSent(true);
      showToast(t('contactPage.messageSent') || "Xabaringiz muvaffaqiyatli yuborildi!", "success");
      setFormData({
        name: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      showToast("Xabar yuborishda xatolik yuz berdi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Katta marosim va banketlar o'tkazish mumkinmi?",
      a: "Albatta! Zafaron restoranida 150 kishigacha bo'lgan to'y, yubiley, korporativ yoki boshqa tantanalarni o'tkazish uchun maxsus banket zali mavjud. Alohida mualliflik menyusi tuziladi."
    },
    {
      q: "Yetkazib berish xizmati (Dostavka) qanday ishlaydi?",
      a: "Toshkent shahri bo'ylab buyurtmalar 40-50 daqiqa ichida yetkaziladi. Issiq taomlar maxsus termo-sumkalarda saqlanadi va issiqligini yo'qotmaydi."
    },
    {
      q: "Bolalar uchun maxsus sharoit bormi?",
      a: "Ha, bizda bolalar uchun qulay bolalar o'rindiqlari (child chairs), xavfsiz o'yin hududi va maxsus foydali bolalar menyusi mavjud."
    },
    {
      q: "Qanday to'lov usullari qabul qilinadi?",
      a: "Naqd pul, barcha milliy plastik kartalar (Uzcard, Humo), shuningdek Payme, Click, Uzum orqali onlayn to'lovlarni qabul qilamiz."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t('contactPage.badge')}</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight">
          {t('contactPage.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {t('contactPage.subtitle')}
        </p>
      </div>

      {/* 4 Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Address */}
        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
            {t('contactPage.addressTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('contactPage.addressDesc')}
          </p>
          <span className="text-[11px] text-gold-500 font-semibold block pt-1">
            Mo'ljal: Amir Temur Hiyoboni metrosi
          </span>
        </div>

        {/* Phone */}
        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
            {t('contactPage.phoneTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('contactPage.phoneDesc')}
          </p>
          <a
            href="tel:+998712008899"
            className="text-[11px] text-gold-500 font-semibold block pt-1 hover:underline"
          >
            Qo'ng'iroq qilish: +998 71 200 88 99
          </a>
        </div>

        {/* Hours */}
        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
            {t('contactPage.hoursTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('contactPage.hoursDesc')}
          </p>
          <span className="text-[11px] text-emerald-500 font-semibold block pt-1">
            Har kuni dam olish kunlarisiz
          </span>
        </div>

        {/* Telegram Bot */}
        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
            Telegram Bot
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Barcha xabarlar va buyurtmalar to'g'ridan-to'g'ri telegramga tushadi
          </p>
          <span className="text-[11px] text-gold-500 font-semibold block pt-1">
            @zafaron_restaurant_bot
          </span>
        </div>
      </div>

      {/* Main Grid: Form + Location Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form: 7 cols */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
              <h2 className="font-serif font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-500" />
                <span>{t('contactPage.formTitle')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('contactPage.formSubtitle')}
              </p>
            </div>

            {isSent && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2 mb-6 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{t('contactPage.messageSent')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('common.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('contactPage.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>{t('common.phone')} *</span>
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('contactPage.subject')}
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Banket xizmati yoki fikr-mulohaza"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('contactPage.message')} *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder={t('contactPage.message')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-input w-full resize-none text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t('common.loading') : t('contactPage.sendMessage')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map & Location Card: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl">
            {/* Map Graphical Visualizer */}
            <div className="relative h-64 bg-dark-900 overflow-hidden flex items-center justify-center">
              {/* Stylized Map Vector Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d99708_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />

              {/* Pin Center */}
              <div className="relative z-10 text-center animate-bounce">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center shadow-gold-500/50 shadow-2xl">
                  <MapPin className="w-7 h-7 text-gold-400" />
                </div>
                <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-dark-950 text-gold-400 border border-gold-500/30">
                  ZAFARON Restaurant
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                Toshkentning eng qulay nuqtasida
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Toshkent sh., Amir Temur shoh ko'chasi 45-uy. Markaziy maydon ro'parasida, transport qulay va mashina qo'yish uchun keng bepul avtoturargoh mavjud.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.google.com/?q=Tashkent+Amir+Temur+Street"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl gold-gradient-bg text-dark-950 text-xs font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all text-center"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps'da ochish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://yandex.uz/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-dark-800 transition-all text-center"
                >
                  <span>Yandex Xarita</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
            Ko'p Beriladigan Savollar (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Mehmonlarimiz tomonidan tez-tez so'raladigan savollarga javoblar
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-gold-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
