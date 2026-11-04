import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';
import {
  Sparkles,
  ShieldCheck,
  CalendarDays,
  UtensilsCrossed,
  Crown,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AboutPage = ({ setActivePage }) => {
  const { t, lang } = useLanguage();
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  const galleryImages = [
    {
      url: "/images/sapphire_plov.jpg",
      title: lang === 'ru' ? 'Свадебный Плов Sapphire' : lang === 'en' ? 'Sapphire Royal Wedding Plov' : "Sapphire To'y Palovi",
      caption: lang === 'ru' ? 'Рис лазер, горный шафран, томленая баранина и отборный казы' : lang === 'en' ? 'Lazer rice, mountain saffron, braised lamb and choice kazy' : "Lazer guruch, tog' zafaroni, sarxil qo'zichoq va kazy",
      category: "dishes"
    },
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Главный Роскошный Зал' : lang === 'en' ? 'Main Luxury Hall' : "Asosiy Hashamatli Zal",
      caption: lang === 'ru' ? 'Роскошный восточный дизайн, бархат и золотые люстры' : lang === 'en' ? 'Royal oriental design, velvet booths and crystal chandeliers' : "Shohona sharqona dizayn, baxmal mebel va billur qandillar",
      category: "halls"
    },
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Открытая Кухня & Мангал' : lang === 'en' ? 'Open Kitchen & Charcoal Grill' : "Ochiq Oshxona & Cho'g' Mangal",
      caption: lang === 'ru' ? 'Блюда на углях готовятся на глазах у гостей' : lang === 'en' ? 'Live charcoal grilling crafted right before the guests' : "Mehmonlar ko'z o'ngida cho'g'da pishadigan taomlar",
      category: "kitchen"
    },
    {
      url: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Золотые VIP Кабинеты' : lang === 'en' ? 'VIP Gold Suites' : "VIP Oltin Xonalar",
      caption: lang === 'ru' ? 'Для особых торжеств, деловых ужинов и закрытых встреч' : lang === 'en' ? 'For celebrations, business banquets and private gatherings' : "Maxsus tantanalar, biznes kechki ovqatlar va shaxsiy uchrashuvlar",
      category: "halls"
    },
    {
      url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Панорамная Терраса' : lang === 'en' ? 'Panoramic Terrace' : "Panoramik Terrasa",
      caption: lang === 'ru' ? 'Свежий воздух, мерцание свечей и вечерний Ташкент' : lang === 'en' ? 'Fresh breeze, candlelight and evening Tashkent skyline' : "Toza havo, shamlar yog'dusi va Toshkent kechki panoramasi",
      category: "halls"
    },
    {
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Искусство Стейков & Мяса' : lang === 'en' ? 'Art of Prime Steaks' : "Shohona Steyk & Go'sht San'ati",
      caption: lang === 'ru' ? 'Мраморная говядина Black Angus и сочные бараньи ребрышки' : lang === 'en' ? 'Prime Black Angus cuts and tender lamb rack chops' : "Marmar mol go'shti va yosh qo'zichoq qovurg'asi",
      category: "dishes"
    },
    {
      url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Норвежский Лосось на Гриле' : lang === 'en' ? 'Grilled Norwegian Salmon' : "Grilda Norvegiya Lososi",
      caption: lang === 'ru' ? 'Лимонно-сливочный соус, дикий рис и спаржа' : lang === 'en' ? 'Citrus cream sauce, wild rice and crisp asparagus' : "Limonli-qaymoqli sous, yovvoyi guruch va yangi spargel",
      category: "dishes"
    },
    {
      url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Бельгийский Шоколадный Фондан' : lang === 'en' ? 'Belgian Chocolate Lava' : "Belgiya Shokoladli Fondan",
      caption: lang === 'ru' ? 'Горячий текучий шоколад, ванильное мороженое и ягоды' : lang === 'en' ? 'Warm molten ganache, vanilla bean ice cream and berries' : "Issiq oqib turuvchi shokolad, vanil muzqaymoq va rezavorlar",
      category: "dishes"
    },
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=85",
      title: lang === 'ru' ? 'Мастерство Шеф-Повара' : lang === 'en' ? 'Artisanal Culinary Craft' : "Oshpazlik Mahorati",
      caption: lang === 'ru' ? 'Каждое блюдо собирается с филигранной точностью' : lang === 'en' ? 'Every plate crafted with Michelin-star precision' : "Har bir taom yuksak e'tibor va san'at bilan tayyorlanadi",
      category: "kitchen"
    }
  ];

  const timelineMilestones = [
    {
      year: "2010",
      title: lang === 'ru' ? 'Первый Шаг' : lang === 'en' ? 'First Step' : "Ilk Qadam",
      desc: lang === 'ru' ? 'В центре Ташкента открылась первая кухня, сочетающая национальные рецепты с современным шармом.' : lang === 'en' ? 'First kitchen in Tashkent center opened, blending national heritage with modern culinary elegance.' : "Toshkent markazida milliy taomlarni zamonaviy shukuh bilan tayyorlovchi ilk oshxona yaratildi."
    },
    {
      year: "2016",
      title: lang === 'ru' ? 'Международное Признание' : lang === 'en' ? 'International Acclaim' : "Xalqaro E'tirof",
      desc: lang === 'ru' ? 'Наш шеф-повар Мансур Шокиров завоевал Золотую Медаль на международном конкурсе поваров.' : lang === 'en' ? 'Head chef Mansur Shokirov was awarded a Gold Medal at the international culinary competition.' : "Bosh oshpazimiz Mansur Shokirov xalqaro oshpazlar tanlovida Oltin Medal sohibi bo'ldi."
    },
    {
      year: "2022",
      title: lang === 'ru' ? 'Ресторан Года' : lang === 'en' ? 'Restaurant of the Year' : "Yil Restorani",
      desc: lang === 'ru' ? 'Удостоены звания самого роскошного и комфортного лаундж-ресторана столицы.' : lang === 'en' ? 'Awarded the title of the most luxurious and welcoming lounge restaurant in Tashkent.' : "Toshkentning eng hashamatli va qulay Lounge restorani unvoniga sazovor bo'ldik."
    },
    {
      year: "2026",
      title: "Sapphire Royal & Lounge",
      desc: lang === 'ru' ? 'Открыт новый флагман: терраса, VIP-сьюты, интерактивный сервис и умный консьерж.' : lang === 'en' ? 'New venue with panoramic terrace, VIP suites, and smart concierge service opened.' : "Yangi bino, panoramik terrasa, VIP suite xonalar va aqlli raqamli servis ochildi."
    }
  ];

  const filteredGallery = activeGalleryTab === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeGalleryTab);

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        soundFx.playPop();
        setActiveLightboxIndex((prev) => (prev + 1) % filteredGallery.length);
      } else if (e.key === 'ArrowLeft') {
        soundFx.playPop();
        setActiveLightboxIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredGallery.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero / Heritage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('aboutPage.badge')}</span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight">
            {t('aboutPage.title')}
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            {t('aboutPage.desc1')}
          </p>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            {t('aboutPage.desc2')}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10">
              <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  {lang === 'ru' ? '100% Халяль' : lang === 'en' ? '100% Halal' : '100% Halol'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'ru' ? 'Сертифицированное свежее мясо' : lang === 'en' ? 'Certified fresh meat' : "Sertifikatlangan sarxil go'sht"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10">
              <Crown className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  {lang === 'ru' ? 'Горный Шафран' : lang === 'en' ? 'Mountain Saffron' : "Asl Tog' Sapphirei"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'ru' ? 'Благороднейшая натуральная специя' : lang === 'en' ? 'The most prized natural spice' : 'Eng qimmatbaho tabiiy ziravor'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Showcase */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
              alt="Sapphire Atmosphere"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white max-w-sm">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                {lang === 'ru' ? 'В центре Ташкента' : lang === 'en' ? 'In the heart of Tashkent' : 'Toshkent markazida'}
              </span>
              <h3 className="font-serif font-bold text-2xl">
                {lang === 'ru' ? 'Восточное Гостеприимство и Изысканный Вкус' : lang === 'en' ? 'Oriental Hospitality & Exquisite Taste' : "Sharq Mehmondo'stligi va Nafis Lazzat"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-500 block mb-1">
            {lang === 'ru' ? 'Наша История' : lang === 'en' ? 'Our History' : 'Bizning Tarix'}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
            {lang === 'ru' ? '15 Лет Королевских Традиций' : lang === 'en' ? '15 Years of Royal Traditions' : "15 Yillik Shohona An'ana"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineMilestones.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-3xl space-y-3 relative group hover:border-gold-500/50 transition-all hover:scale-105"
            >
              <span className="font-serif font-black text-3xl gold-gradient-text block">
                {item.year}
              </span>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Master Chef Section */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-500/20 shadow-2xl">
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
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {t('aboutPage.chefBio')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {lang === 'ru'
                ? '«Кулинария — это не просто еда. Это душевное искусство, дарящее тепло семейных воспоминаний и покой сердцу.»'
                : lang === 'en'
                ? '"Gastronomy is not merely food. It is a heartfelt art that touches human spirit, family memories, and soulful tranquility."'
                : "\"Pazandachilik — bu shunchaki qorin to'ydirish emas. Bu inson ruhiga, oilaviy xotiralarga va qalb huzuriga ta'sir qiluvchi samimiy san'atdir.\""}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  soundFx.playChime();
                  setActivePage('menu');
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-3.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center gap-2 shadow-lg"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>{t('hero.viewMenu')}</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playChime();
                  setActivePage('reservation');
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4 text-gold-500" />
                <span>{t('hero.reserveBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Showcase with Category Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
              {t('aboutPage.galleryTitle')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('aboutPage.gallerySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10 self-start sm:self-auto">
            {[
              { id: 'all', label: lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : "Barchasi" },
              { id: 'halls', label: lang === 'ru' ? 'Роскошные Залы' : lang === 'en' ? 'Luxury Halls' : "Hashamatli Zallar" },
              { id: 'kitchen', label: lang === 'ru' ? 'Открытая Кухня' : lang === 'en' ? 'Open Kitchen' : "Ochiq Oshxona" },
              { id: 'dishes', label: lang === 'ru' ? 'Королевские Блюда' : lang === 'en' ? 'Royal Dishes' : "Shohona Taomlar" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playPop();
                  setActiveGalleryTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeGalleryTab === tab.id
                    ? 'gold-gradient-bg text-dark-950 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((img, i) => (
            <div
              key={i}
              onClick={() => {
                soundFx.playPop();
                setActiveLightboxIndex(i);
              }}
              className="group relative rounded-3xl overflow-hidden shadow-lg h-72 cursor-pointer border border-transparent hover:border-gold-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,179,8,0.25)]"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/95 via-dark-950/30 to-transparent flex flex-col justify-between p-5 text-white">
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-2.5 rounded-full bg-dark-950/80 backdrop-blur-md border border-gold-500/50 text-gold-400 shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                    <ZoomIn className="w-4 h-4 text-gold-400" />
                    <span>{lang === 'ru' ? 'Смотреть' : lang === 'en' ? 'Expand' : 'Kattalashtirish'}</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Luxury Lightbox Modal */}
      {activeLightboxIndex !== null && filteredGallery[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
          {/* Dark Glass Backdrop */}
          <div
            onClick={() => {
              soundFx.playPop();
              setActiveLightboxIndex(null);
            }}
            className="absolute inset-0 bg-dark-950/90 backdrop-blur-xl transition-opacity"
          />

          {/* Lightbox Container */}
          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">
            {/* Top Bar: Counter & Close */}
            <div className="w-full flex items-center justify-between pb-3 text-white text-xs font-semibold">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-gold-400 font-serif uppercase tracking-wider">Sapphire Galereya</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-200">
                  {activeLightboxIndex + 1} / {filteredGallery.length}
                </span>
              </div>

              <button
                onClick={() => {
                  soundFx.playPop();
                  setActiveLightboxIndex(null);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-gold-500 hover:text-dark-950 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg"
                title="Yopish (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage with Navigation Arrows */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-dark-900 border border-gold-500/30 shadow-2xl flex items-center justify-center max-h-[75vh]">
              <img
                src={filteredGallery[activeLightboxIndex].url}
                alt={filteredGallery[activeLightboxIndex].title}
                className="w-full h-full max-h-[75vh] object-contain transition-all duration-300"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playPop();
                  setActiveLightboxIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
                }}
                className="absolute left-3 p-3 rounded-full bg-dark-950/70 hover:bg-gold-500 hover:text-dark-950 text-white border border-white/20 transition-all backdrop-blur-md shadow-xl"
                title="Oldingisi (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playPop();
                  setActiveLightboxIndex((prev) => (prev + 1) % filteredGallery.length);
                }}
                className="absolute right-3 p-3 rounded-full bg-dark-950/70 hover:bg-gold-500 hover:text-dark-950 text-white border border-white/20 transition-all backdrop-blur-md shadow-xl"
                title="Keyingisi (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Details Bar */}
            <div className="w-full mt-3 p-4 rounded-2xl bg-dark-900/90 border border-white/10 backdrop-blur-md text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div>
                <h3 className="font-serif font-bold text-lg text-gold-400">
                  {filteredGallery[activeLightboxIndex].title}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  {filteredGallery[activeLightboxIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setActiveLightboxIndex(null);
                    setActivePage('reservation');
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs shadow-md hover:scale-105 transition-transform"
                >
                  {lang === 'ru' ? 'Забронировать стол' : lang === 'en' ? 'Book a Table' : 'Stol Band Qilish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
