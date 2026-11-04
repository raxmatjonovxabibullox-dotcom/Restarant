import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  CalendarDays,
  Check,
  Flame,
  Award,
  ChevronRight,
  Coffee,
  Heart,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { soundFx } from '../hooks/useSoundEffects';
import { luxuryConfetti } from '../utils/confetti';

const PAIRING_SETS = [
  {
    id: 'pairing-sultan',
    badge: { uz: "Shohona Klassika", uz_new: "Şohona Klassika", ru: "Шахская Классика", en: "Royal Classic" },
    title: { uz: "Sultonlar Ziyofati", uz_new: "Sultonlar Ziyofati", ru: "Пир Султана", en: "Sultan's Imperial Banquet" },
    subtitle: {
      uz: "O'zbek mehmondo'stligining eng shohona durdonalari uyg'unligi",
      uz_new: "Özbek mehmondöstligining eng şohona durdonalari uyğunligi",
      ru: "Гармония великих традиций восточного гостеприимства",
      en: "The ultimate harmony of royal oriental gastronomy"
    },
    items: [
      { name: "Shohona Sapphire Palov", type: "Asosiy taom", icon: "👑" },
      { name: "Sarxil Anorli Achchiq-Chuchuk", type: "Salat", icon: "🥗" },
      { name: "Asl Tog' Zafaronli Choy", type: "Shohona Choy", icon: "🫖" },
      { name: "Qarsildoq Yong'oqli Pahlava", type: "Desert", icon: "🍯" }
    ],
    price: 115000,
    originalPrice: 135000,
    discount: "15% CHEGIRMA",
    image: "/images/sapphire_plov.jpg",
    flavorNotes: [
      { label: "Aromat boyligi", value: "98%" },
      { label: "Go'sht mayinligi", value: "100%" },
      { label: "Uyg'unlik", value: "99%" }
    ]
  },
  {
    id: 'pairing-steak',
    badge: { uz: "Premial Steyk", uz_new: "Premial Steyk", ru: "Премиальный Гриль", en: "Prime Grill" },
    title: { uz: "Buyuk Ipak Yo'li Steyk & Gril", uz_new: "Buyuk Ipak Yöli Steyk & Gril", ru: "Стейк Шелкового Пути", en: "Silk Road Prime Steak Flight" },
    subtitle: {
      uz: "Marmar mol go'shti, sariyog'li sabzavotlar va tabiiy tog' sharbati",
      uz_new: "Marmar mol göşti, sariyöğli sabzavotlar va tabiiy toğ şarbati",
      ru: "Мраморная говядина на гриле, свежая буррата и гранатовый сок",
      en: "Prime ribeye cut, burrata foccacia & fresh pomegranate press"
    },
    items: [
      { name: "Premial Ribeye Steyk (Medium)", type: "Asosiy steyk", icon: "🥩" },
      { name: "Qaymoqli Burrata & Pomidorlar", type: "Aperitiv", icon: "🧀" },
      { name: "Tuyatish Yangi Siqilgan Anor", type: "Vitamin Sharbat", icon: "🍷" },
      { name: "Tandirda yopilgan Issiq Fokacha", type: "Non", icon: "🥖" }
    ],
    price: 168000,
    originalPrice: 198000,
    discount: "15% CHEGIRMA",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    flavorNotes: [
      { label: "Shiradorlik", value: "99%" },
      { label: "Marmarlik darajasi", value: "A5" },
      { label: "Energiya", value: "940 kcal" }
    ]
  },
  {
    id: 'pairing-seafood',
    badge: { uz: "Dengiz Nafasi", uz_new: "Dengiz Nafasi", ru: "Морская Симфония", en: "Mediterranean" },
    title: { uz: "Kaspiy & O'rta Yer Dengizi", uz_new: "Kaspiy & Örta Yer Dengizi", ru: "Каспийский Лосось", en: "Caspian Salmon Symphony" },
    subtitle: {
      uz: "Oltinrang limon-qaymoqli sousdagi losos filesi va tetiklashtiruvchi kokteyl",
      uz_new: "Oltinrang limon-qaymoqli sousdagi losos filesi va tetiklaştiruvçi kokteyl",
      ru: "Филе лосося с диким рисом, спаржей и мятным лимонадом",
      en: "Grilled salmon fillet, crisp asparagus and citrus mojito"
    },
    items: [
      { name: "Grilda Qovurilgan Losos Filesi", type: "Asosiy baliq", icon: "🐟" },
      { name: "Gril Sabzavotlar & Spargel", type: "Garnir", icon: "🥦" },
      { name: "Muzli Marokash Yalpiz Limonadi", type: "Ichimlik", icon: "🍹" },
      { name: "Limonli Mayin Sufle", type: "Desert", icon: "🍋" }
    ],
    price: 142000,
    originalPrice: 165000,
    discount: "14% CHEGIRMA",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=85",
    flavorNotes: [
      { label: "Yengillik", value: "100%" },
      { label: "Omega-3", value: "Yuqori" },
      { label: "Yangilik", value: "99%" }
    ]
  },
  {
    id: 'pairing-dessert',
    badge: { uz: "Shirin Oqshom", uz_new: "Şirin Oqşom", ru: "Сладкий Вечер", en: "Sweet Nightcap" },
    title: { uz: "Sapphire Oqshom Shodligi", uz_new: "Sapphire Oqşom Şodligi", ru: "Вечерняя Сладкая Симфония", en: "Sapphire Patisserie & Coffee" },
    subtitle: {
      uz: "Eritilgan Belgiya shokoladli fondan, chizkeyk va kardamonli kofe",
      uz_new: "Eritilgan Belgiya şokoladli fondan, çizkeyk va kardamonli kofe",
      ru: "Шоколадный фондан, чизкейк Филадельфия и ароматный кофе",
      en: "Molten chocolate fondant, NY cheesecake & Turkish cardamom coffee"
    },
    items: [
      { name: "Nyu-York Pishloqli Chizkeyk", type: "Desert", icon: "🍰" },
      { name: "Issiq Belgiya Shokoladli Fondan", type: "Maxsus", icon: "🍫" },
      { name: "Kardamonli Shohona Turk Kofesi", type: "Qahva", icon: "☕" },
      { name: "Eron Zafaroni Muzqaymog'i", type: "Muzqaymoq", icon: "🍨" }
    ],
    price: 82000,
    originalPrice: 96000,
    discount: "15% CHEGIRMA",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85",
    flavorNotes: [
      { label: "Shirinlik uyg'unligi", value: "98%" },
      { label: "Hissiyot", value: "100%" },
      { label: "Qahva kuchi", value: "4/5" }
    ]
  }
];

export const SapphirePairingStudio = ({ onReserveClick }) => {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [addedIdx, setAddedIdx] = useState(null);

  const activeSet = PAIRING_SETS[selectedIdx];

  const handleAddSetToCart = (set, idx) => {
    soundFx.playChime();
    luxuryConfetti();
    addToCart({
      id: set.id,
      name: {
        uz: set.title.uz,
        uz_new: set.title.uz_new,
        ru: set.title.ru,
        en: set.title.en,
      },
      price: set.price,
      image: set.image,
      category: 'sets',
      prepTime: 25,
      calories: 950,
      portion: "To'liq Shohona Set"
    });
    setAddedIdx(idx);
    setTimeout(() => setAddedIdx(null), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sapphire Tasting Flights & Pairings</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
            {lang === 'ru' ? 'Гастрономические Сеты Шефа' : lang === 'en' ? "Chef's Tasting Sets & Flights" : 'Shohona Gastronomik To\'plamlar'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mt-1">
            {lang === 'ru'
              ? 'Идеально сбалансированные сочетания блюд, напитков и десертов со скидкой 15%'
              : lang === 'en'
              ? 'Masterfully paired multi-course sets and mocktails crafted with 15% pairing privilege'
              : "Bosh oshpazimiz tomonidan mukammal uyg'unlashtirilgan taom, ichimlik va desert to'plamlari (15% chegirma bilan)"}
          </p>
        </div>
      </div>

      {/* Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PAIRING_SETS.map((set, idx) => {
          const isSelected = selectedIdx === idx;
          const title = set.title[lang] || set.title.uz;
          const badge = set.badge[lang] || set.badge.uz;
          return (
            <button
              key={set.id}
              onClick={() => {
                soundFx.playPop();
                setSelectedIdx(idx);
              }}
              className={`p-4 rounded-3xl text-left transition-all border flex flex-col justify-between gap-2 relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-900/40 via-dark-900 to-amber-950/30 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                  : 'glass-card hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-amber-500 text-dark-950 font-extrabold' : 'bg-white/10 text-gray-400'
                }`}>
                  {badge}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {formatPrice(set.price)}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Set Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-amber-500/30 shadow-2xl p-6 sm:p-10 bg-gradient-to-br from-dark-950 via-dark-900 to-blue-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Image with floating badge */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <img
                src={activeSet.image}
                alt={activeSet.title[lang] || activeSet.title.uz}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-dark-950 text-xs font-black tracking-wider uppercase shadow-lg">
                {activeSet.discount}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-dark-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
                <span className="text-gray-400">Tejashingiz:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  +{formatPrice(activeSet.originalPrice - activeSet.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Set Details & Tasting Flight Composition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>Bosh Oshpaz Maxsus To'plami</span>
              </div>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                {activeSet.title[lang] || activeSet.title.uz}
              </h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                {activeSet.subtitle[lang] || activeSet.subtitle.uz}
              </p>
            </div>

            {/* Included Items Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeSet.items.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase text-amber-400 block font-semibold tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-white block truncate">
                      {item.name}
                    </span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>

            {/* Flavor Metrics */}
            <div className="flex items-center gap-4 pt-2">
              {activeSet.flavorNotes.map((metric, idx) => (
                <div key={idx} className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
                  <span className="text-xs font-bold text-amber-400 block font-mono">{metric.value}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{metric.label}</span>
                </div>
              ))}
            </div>

            {/* Pricing & Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">
                    {formatPrice(activeSet.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through font-mono">
                    {formatPrice(activeSet.originalPrice)}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 block">
                  {lang === 'ru' ? 'Цена за полный премиальный сет' : lang === 'en' ? 'Price for complete gourmet flight' : "To'liq shohona set narxi"}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleAddSetToCart(activeSet, selectedIdx)}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {addedIdx === selectedIdx ? <Check className="w-4 h-4 text-emerald-950" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{addedIdx === selectedIdx ? (lang === 'ru' ? 'Добавлено!' : "Qo'shildi!") : (lang === 'ru' ? 'Заказать этот сет' : "Setni Buyurtma Qilish")}</span>
                </button>

                {onReserveClick && (
                  <button
                    onClick={onReserveClick}
                    className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <CalendarDays className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ru' ? 'Бронь стола' : 'Stol Bron'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
