import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  ShoppingBag,
  Star,
  Info,
  Clock,
  Utensils,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { soundFx } from '../hooks/useSoundEffects';
import { luxuryConfetti } from '../utils/confetti';

const SIGNATURE_DISHES = [
  {
    id: 'gastro-osh',
    title: {
      uz: "Shohona Za'faron Oshi",
      ru: "Шахский Шафрановый Плов",
      en: "Royal Saffron Plov"
    },
    subtitle: {
      uz: "Eron tog' za'faroni, lahm qo'y go'shti, qazi va bedana tuxumlari",
      ru: "Горный шафран, отборная баранина, казы и перепелиные яйца",
      en: "Mountain saffron, tender lamb, kazi & quail eggs"
    },
    price: 58000,
    prepTime: "25 daqiqa",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    chefNote: {
      uz: "Bosh oshpazimiz 12 xil noyob ziravor va tabiiy tog' za'faroni bilan 4 soat mobaynida past olovda damlaydi.",
      ru: "Шеф томит плов 4 часа на медленном огне с 12 видами специй и горным шафраном.",
      en: "Slow-simmered for 4 hours with 12 rare spices and pure Persian saffron."
    },
    pairing: {
      uz: "Shohona Za'faronli Issiq Choy & Achchiq-Chuchuk",
      ru: "Фирменный Шафрановый Чай и Ачик-Чучук",
      en: "Signature Saffron Tea & Tomato Salad"
    },
    metrics: [
      { label: "Shohona Aromat", value: "99%", color: "from-amber-500 to-yellow-400" },
      { label: "Mayinlik & Shiradorlik", value: "100%", color: "from-orange-500 to-amber-500" },
      { label: "Halol Sertifikati", value: "100%", color: "from-emerald-500 to-teal-400" },
      { label: "VIP Reyting", value: "5.0 ★", color: "from-gold-400 to-yellow-500" }
    ],
    hotspots: [
      { x: "32%", y: "42%", label: "Sara Lahm Go'sht" },
      { x: "55%", y: "30%", label: "Tabiiy Za'faron" },
      { x: "68%", y: "55%", label: "Shohona Qazi" }
    ]
  },
  {
    id: 'gastro-tomahawk',
    title: {
      uz: "Tomahawk Marmar Steyk",
      ru: "Стейк Томагавк на Углях",
      en: "Dry-Aged Tomahawk Steak"
    },
    subtitle: {
      uz: "1.2 kg sara marmar go'sht, qaynoq cho'g'da rozmarin va sariyog' bilan",
      ru: "1.2 кг мраморного мяса на углях с розмарином и чесночным маслом",
      en: "1.2 kg prime dry-aged beef over oak charcoal with rosemary butter"
    },
    price: 320000,
    prepTime: "30 daqiqa",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
    chefNote: {
      uz: "45 kun quruq usulda yetiltirilgan marmar mol go'shti, 450°C olovda pishirilib, shirasi ichida muhrlanadi.",
      ru: "Выдержка 45 дней. Готовится при температуре 450°C с сохранением максимальной сочности.",
      en: "Dry-aged for 45 days, seared at 450°C to lock in every drop of rich natural juice."
    },
    pairing: {
      uz: "Grilda qovurilgan sabzavotlar & Zafaron maxsus sousi",
      ru: "Овощи гриль и фирменный соус шефа",
      en: "Charred grill veggies & house chimichurri"
    },
    metrics: [
      { label: "Shiradorlik", value: "100%", color: "from-red-500 to-rose-400" },
      { label: "Cho'g' Tutuni Aromatici", value: "98%", color: "from-amber-600 to-orange-500" },
      { label: "Halol Standarti", value: "100%", color: "from-emerald-500 to-teal-400" },
      { label: "Eksklyuzivlik", value: "Ultra VIP", color: "from-gold-400 to-yellow-500" }
    ],
    hotspots: [
      { x: "40%", y: "38%", label: "Marmar Qovurg'a" },
      { x: "65%", y: "50%", label: "Yog'och Cho'g'i Qobiq" }
    ]
  },
  {
    id: 'gastro-burrata',
    title: {
      uz: "Zafaron Artisanal Burrata",
      ru: "Буррата с Заатаром",
      en: "Zafaron Artisanal Burrata"
    },
    subtitle: {
      uz: "Mayin qaymoqli pishloq, pishgan cheri pomidorlari va xushbo'y rayhon",
      ru: "Нежнейший сливочный сыр, томаты черри и пряный заатар",
      en: "Creamy artisanal burrata, sweet cherry tomatoes & zaatar pesto"
    },
    price: 65000,
    prepTime: "15 daqiqa",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1200&q=80",
    chefNote: {
      uz: "Har kuni tongda tayyorlanadigan yangi qaymoqli Burrata pishlog'i va Eron za'faron moyi qo'shimchasi.",
      ru: "Свежая сливочная буррата ежедневного приготовления с маслом дикого шафрана.",
      en: "Crafted fresh every morning with saffron-infused extra virgin olive oil."
    },
    pairing: {
      uz: "Tandirda yopilgan yangi fokaсha noni",
      ru: "Свежая тандырная фокачча",
      en: "Warm clay-oven focaccia"
    },
    metrics: [
      { label: "Yengillik & Mayinlik", value: "100%", color: "from-emerald-400 to-teal-300" },
      { label: "Qaymoq Shirasi", value: "97%", color: "from-amber-400 to-yellow-300" },
      { label: "Yangi Tayyorlangan", value: "Bugun", color: "from-blue-400 to-cyan-300" },
      { label: "Gurmanlar Tanlovi", value: "5.0 ★", color: "from-gold-400 to-yellow-500" }
    ],
    hotspots: [
      { x: "50%", y: "45%", label: "Qaymoqli Markaz" },
      { x: "35%", y: "60%", label: "Zaatar Moyi" }
    ]
  },
  {
    id: 'gastro-baklava',
    title: {
      uz: "Oltin Bargli Turkcha Paxlava",
      ru: "Пахлава с Золотым Листом",
      en: "24K Gold Leaf Turkish Baklava"
    },
    subtitle: {
      uz: "Mayin qatlama xamir, sara pista mag'zi, tog' asali va za'faron sharbati",
      ru: "40 слоев тончайшего теста, фисташки, горный мед и шафран",
      en: "40 whisper-thin layers, Gaziantep pistachios, mountain honey & saffron"
    },
    price: 45000,
    prepTime: "10 daqiqa",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80",
    chefNote: {
      uz: "Qo'lda yoyilgan 40 qavat mayin xamir va Turkiyaning Gaziantep shahridan keltirilgan zumrad pista.",
      ru: "Тончайшее тесто ручной раскатки и отборные изумрудные фисташки из Газиантепа.",
      en: "Hand-rolled 40-layer pastry with emerald pistachios from Gaziantep."
    },
    pairing: {
      uz: "Qaynoq Turk Qahvasi yoki Zafaron Choyi",
      ru: "Кофе по-восточному или шафрановый чай",
      en: "Traditional Turkish coffee or saffron infusion"
    },
    metrics: [
      { label: "Shirinlik Balansi", value: "Mukammal", color: "from-amber-500 to-yellow-400" },
      { label: "Qatlama Qisirlashi", value: "100%", color: "from-orange-500 to-amber-400" },
      { label: "Gaziantep Pistasi", value: "100%", color: "from-emerald-500 to-teal-400" },
      { label: "Oltin Hashamat", value: "24K", color: "from-gold-400 to-yellow-300" }
    ],
    hotspots: [
      { x: "48%", y: "40%", label: "40 Qavat Xamir" },
      { x: "62%", y: "58%", label: "Zumrad Pista" }
    ]
  }
];

export const GastroShowcase3D = ({ onAddToCartSuccess }) => {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const dish = SIGNATURE_DISHES[selectedIdx];
  const curTitle = dish.title[lang] || dish.title.uz;
  const curSub = dish.subtitle[lang] || dish.subtitle.uz;
  const curNote = dish.chefNote[lang] || dish.chefNote.uz;
  const curPairing = dish.pairing[lang] || dish.pairing.uz;

  const handleOrderDish = () => {
    soundFx.playSuccess();
    luxuryConfetti.burst({ x: 0.5, y: 0.5, count: 120 });
    addToCart(
      {
        id: dish.id,
        name: dish.title,
        price: dish.price,
        image: dish.image,
        category: 'specials'
      },
      1
    );
    if (onAddToCartSuccess) onAddToCartSuccess(dish);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-l from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-black tracking-widest uppercase backdrop-blur-md shadow-glow">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Zafaron 3D Chef's Table Experience</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            Shohona Gastronomiya <span className="gold-gradient-text">Durdonasi</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed">
            Har bir taom — san'at asari. Bosh oshpazimizning mualliflik durdonalari bilan 3D interaktiv shaklda tanishing,
            tarkibiy qismlarni kashf eting va didingizga mos shohona lazzatni tanlang.
          </p>
        </div>

        {/* Dish Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {SIGNATURE_DISHES.map((item, idx) => {
            const isSel = idx === selectedIdx;
            const tText = item.title[lang] || item.title.uz;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playPop();
                  setSelectedIdx(idx);
                  setActiveHotspot(null);
                }}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                  isSel
                    ? 'gold-gradient-bg text-dark-950 shadow-lg shadow-gold-500/30 scale-105'
                    : 'bg-white/80 dark:bg-dark-900/80 hover:bg-gold-500/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gold-500/20 hover:border-gold-500/50'
                }`}
              >
                <Flame className={`w-4 h-4 ${isSel ? 'text-dark-950' : 'text-amber-500'}`} />
                <span>{tText}</span>
              </button>
            );
          })}
        </div>

        {/* Main 3D Stage Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-white/90 via-white/70 to-gold-50/40 dark:from-[#131728]/90 dark:via-[#161a2e]/80 dark:to-[#0f1220]/90 border border-gold-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Left: Interactive 3D Dish Stage */}
          <div
            className="lg:col-span-7 relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setActiveHotspot(null);
            }}
          >
            {/* Ambient Dish Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-gold-500/20 to-transparent rounded-3xl blur-2xl transition-all duration-500 group-hover:blur-3xl" />

            <div className="relative rounded-3xl overflow-hidden border border-gold-500/40 shadow-2xl aspect-[4/3] bg-dark-950">
              <img
                src={dish.image}
                alt={curTitle}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isHovered ? 'scale-105 brightness-105' : 'scale-100'
                }`}
              />

              {/* Steam / Warmth Overlay Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-dark-950/80 border border-gold-500/50 text-gold-400 text-xs font-black backdrop-blur-md flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{dish.prepTime}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-black backdrop-blur-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Halol</span>
                </span>
              </div>

              {/* Interactive Hotspots */}
              {dish.hotspots.map((hs, hIdx) => {
                const isActive = activeHotspot === hIdx;
                return (
                  <div
                    key={hIdx}
                    style={{ left: hs.x, top: hs.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        setActiveHotspot(isActive ? null : hIdx);
                      }}
                      className="relative w-8 h-8 rounded-full bg-gold-500 text-dark-950 flex items-center justify-center font-black shadow-lg shadow-gold-500/60 hover:scale-125 transition-transform"
                    >
                      <span className="animate-ping absolute inset-0 rounded-full bg-gold-400 opacity-60" />
                      <Sparkles className="w-4 h-4 relative z-10" />
                    </button>

                    {/* Hotspot Floating Tooltip */}
                    {isActive && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-dark-950/95 border border-gold-500 text-gold-300 font-bold text-xs whitespace-nowrap shadow-2xl animate-fade-in">
                        {hs.label}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Quick Caption on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-serif font-black text-xl text-gold-300">{curTitle}</h3>
                  <p className="text-xs text-gray-300 max-w-xs truncate">{curSub}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gold-400 block font-semibold">Maxsus Narx</span>
                  <span className="font-black text-xl text-white">{formatPrice(dish.price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Taste Profile & Chef Story */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Bosh Oshpazning Faxriy Tavsiyasi</span>
              </div>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight">
                {curTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {curSub}
              </p>
            </div>

            {/* Chef's Culinary Note */}
            <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="italic leading-relaxed">{curNote}</p>
            </div>

            {/* Halal Culinary Pairing */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-dark-900/60 border border-gray-200 dark:border-gold-500/20 text-xs text-gray-800 dark:text-gray-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Tavsiya Etiladigan Lazzat Uyg'unligi:</span>
                <span className="font-semibold text-gold-400">{curPairing}</span>
              </div>
            </div>

            {/* Taste Profile Metric Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 tracking-wider uppercase block">
                Gastronomik Indeks & Lazzat Metrikasi:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {dish.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-xl bg-white dark:bg-dark-900/80 border border-gray-200 dark:border-gold-500/20 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{m.label}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${m.color}`} />
                      <span>{m.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button: Add to Cart with Diding Sound & Confetti */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={handleOrderDish}
                className="flex-1 py-4 px-6 rounded-2xl gold-gradient-bg text-dark-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-gold-500/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-dark-950" />
                <span>Savatga Qo'shish ({formatPrice(dish.price)})</span>
                <ChevronRight className="w-4 h-4 text-dark-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
