import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  UtensilsCrossed
} from 'lucide-react';

export const AboutPage = ({ setActivePage }) => {
  const { t } = useLanguage();

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      title: "Asosiy Hashamatli Zal",
      caption: "Shohona sharqona dizayn va yumshoq mebellar"
    },
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      title: "Ochiq Oshxona",
      caption: "Mehmonlar ko'z o'ngida cho'g'da pishadigan taomlar"
    },
    {
      url: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80",
      title: "VIP Xonalar",
      caption: "Maxsus tantanalar va shaxsiy suhbatlar uchun"
    },
    {
      url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
      title: "Panoramik Terrasa",
      caption: "Toza havo va shahar manzarasi"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero / Heritage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('aboutPage.badge')}</span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight">
            {t('aboutPage.title')}
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('aboutPage.desc1')}
          </p>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('aboutPage.desc2')}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Halol</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sertifikatlangan go'sht mahsulotlari</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Eron Zafaroni</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Eng qimmatbaho tog' ziravorlari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Showcase */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
              alt="Zafaron Atmosphere"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white max-w-sm">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                Toshkent markazida
              </span>
              <h3 className="font-serif font-bold text-2xl">
                Sharq Mehmondo'stligi va Nafis Lazzat
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Master Chef Section */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-xs mx-auto md:mx-0 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80"
              alt="Chef Mansur Shokirov"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
              {t('aboutPage.masterChef')}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
              {t('aboutPage.chefName')}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('aboutPage.chefBio')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              "Pazandachilik — bu shunchaki qorin to'ydirish emas. Bu inson ruhiga, oilaviy xotiralarga va qalb huzuriga ta'sir qiluvchi samimiy san'atdir."
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => { setActivePage('menu'); window.scrollTo(0, 0); }}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>{t('hero.viewMenu')}</span>
              </button>
              <button
                onClick={() => { setActivePage('reservation'); window.scrollTo(0, 0); }}
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4 text-gold-500" />
                <span>{t('hero.reserveBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
            {t('aboutPage.galleryTitle')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('aboutPage.gallerySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden shadow-lg h-72">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <h4 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                  {img.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
