import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

export const SmartConciergeModal = ({ isOpen, onClose, setActivePage }) => {
  const { menuItems } = useRestaurant();
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const { lang, getLocalized } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('romantic');
  const [guestsCount, setGuestsCount] = useState('2');
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const moods = [
    {
      id: 'romantic',
      title: lang === 'ru' ? 'Романтический Ужин' : lang === 'en' ? 'Romantic Dinner' : 'Romantik Kechki Ovqat',
      desc: lang === 'ru' ? 'Уютная атмосфера, нежнейшие мясные блюда, десерт и чай' : lang === 'en' ? 'Cozy ambiance, tender meat cuts, dessert and signature tea' : "Nafis muhit, mayin go'shtli taomlar, desert va choy",
      icon: "🕯️",
      dishes: ['dish-1', 'dish-7', 'dish-9', 'dish-11']
    },
    {
      id: 'family',
      title: lang === 'ru' ? 'Большой Семейный Стол' : lang === 'en' ? 'Grand Family Feast' : 'Katta Oilaviy Dasturxon',
      desc: lang === 'ru' ? 'Богатый стол, Праздничный плов, манты и сочные самсы' : lang === 'en' ? 'Lavish banquet, Royal plov, manti, and crispy somsa' : "To'kin-sochin dasturxon, Shohona palov, manti va somsa",
      icon: "👨‍👩‍👧‍👦",
      dishes: ['dish-1', 'dish-2', 'dish-4', 'dish-7', 'dish-11']
    },
    {
      id: 'business',
      title: lang === 'ru' ? 'Деловой & Бизнес Обед' : lang === 'en' ? 'Business Lunch' : 'Biznes & Ishbilarmonlar Tushligi',
      desc: lang === 'ru' ? 'Премиальный стейк Рибай, свежий салат и бодрящие напитки' : lang === 'en' ? 'Premium Ribeye steak, fresh salad, and revitalizing drinks' : "Premial Ribeye steyk, yangi salat va tetiklantiruvchi ichimliklar",
      icon: "💼",
      dishes: ['dish-5', 'dish-7', 'dish-12']
    },
    {
      id: 'kebab',
      title: lang === 'ru' ? 'Дружеские Шашлыки' : lang === 'en' ? 'Kebab Party with Friends' : "Do'stona Kabobxo'rlik",
      desc: lang === 'ru' ? 'Ассорти шашлыков на мангале, ачик-чучук и горячая лепешка' : lang === 'en' ? 'Grilled kebab assortment, fresh achichuk, and hot tandoor bread' : "Qo'ra kaboblar assortisi, achchiq-chuchuk va tandir issiq non",
      icon: "🍢",
      dishes: ['dish-6', 'dish-2', 'dish-7', 'dish-11']
    },
    {
      id: 'healthy',
      title: lang === 'ru' ? 'Легкое & Здоровое Меню' : lang === 'en' ? 'Light & Healthy Diet' : "Yengil & Sog'lom Taomnoma",
      desc: lang === 'ru' ? 'Диетический салат, суп и горный зеленый чай' : lang === 'en' ? 'Fresh dietary salad, clear soup, and mountain green tea' : "Parhezbop salat, sho'rva va ko'k choy",
      icon: "🥗",
      dishes: ['dish-7', 'dish-8', 'dish-11']
    }
  ];

  const guestOptions = lang === 'ru'
    ? ['1-2 чел.', '3-4 чел.', '5-8 чел.', '10+ чел.']
    : lang === 'en'
    ? ['1-2 guests', '3-4 guests', '5-8 guests', '10+ guests']
    : ['1-2 kishi', '3-4 kishi', '5-8 kishi', '10+ kishi'];

  const tSomm = {
    badge: lang === 'ru' ? 'Zafaron Умный Консьерж & Меню-Гид' : lang === 'en' ? 'Zafaron Smart Concierge & Recommender' : 'Zafaron Aqlli Konsyerj & Menyu-Gid',
    title: lang === 'ru' ? 'Идеальное Меню Под Ваше Настроение' : lang === 'en' ? 'Curated Table for Your Mood' : 'Sizga Mos Shohona Dasturxon',
    step1Title: lang === 'ru' ? '1. Для какого события или настроения планируете?' : lang === 'en' ? '1. What occasion or dining mood are you planning?' : '1. Qanday tadbir yoki kayfiyat uchun rejalashtiryapsiz?',
    step2Title: lang === 'ru' ? '2. Количество гостей' : lang === 'en' ? '2. Number of guests' : '2. Mehmonlar soni',
    calculateBtn: lang === 'ru' ? 'Подобрать Фирменный Сет' : lang === 'en' ? 'Calculate Curated Set' : 'Maxsus Tavsiya To\'plamini Ko\'rish',
    chefCurated: lang === 'ru' ? 'Фирменный 3-этапный сет от шеф-повара' : lang === 'en' ? 'Chef-curated 3-course luxury tasting menu' : 'Bosh oshpaz tomonidan saralangan shohona 3-bosqichli to\'plam',
    discountBadge: lang === 'ru' ? 'Скидка 10%' : lang === 'en' ? '10% OFF' : '10% Chegirma',
    mainDish: lang === 'ru' ? 'Главное Блюдо' : lang === 'en' ? 'Main Course' : 'Asosiy Taom',
    saladAppetizer: lang === 'ru' ? 'Салат & Закуска' : lang === 'en' ? 'Salad & Starter' : 'Salat & Ishtaha',
    dessertDrink: lang === 'ru' ? 'Десерт & Напиток' : lang === 'en' ? 'Dessert & Beverage' : 'Desert & Ichimlik',
    originalPrice: lang === 'ru' ? 'Обычная цена:' : lang === 'en' ? 'Regular price:' : 'Asl narxi:',
    savings: lang === 'ru' ? 'Ваша выгода:' : lang === 'en' ? 'You save:' : 'Tejovingiz:',
    specialSetPrice: lang === 'ru' ? 'Цена Специального Сета' : lang === 'en' ? 'Special Set Price' : 'Maxsus To\'plam Narxi',
    addAllBtn: lang === 'ru' ? 'Добавить все в корзину' : lang === 'en' ? 'Add All to Cart' : 'Barchasini Savatga Qo\'shish',
    reserveBtn: lang === 'ru' ? 'Забронировать Стол' : lang === 'en' ? 'Book a Table' : 'Stol Band Qilish',
    backBtn: lang === 'ru' ? '← Выбрать другое настроение' : lang === 'en' ? '← Choose another mood' : '← Boshqa kayfiyatni tanlash',
    kcal: lang === 'ru' ? 'ккал' : lang === 'en' ? 'kcal' : 'kkal'
  };

  const handleCalculateRecommendation = () => {
    soundFx.playChime();
    const moodObj = moods.find(m => m.id === selectedMood) || moods[0];
    const items = moodObj.dishes
      .map(id => menuItems.find(item => item.id === id))
      .filter(Boolean);

    const total = items.reduce((sum, item) => sum + item.price, 0);
    const discountedTotal = Math.round(total * 0.9);

    setRecommendation({
      mood: moodObj,
      items,
      total,
      discountedTotal,
      savings: total - discountedTotal
    });
    setStep(2);
  };

  const handleAddAllToCart = () => {
    soundFx.playSuccessFanfare();
    recommendation?.items.forEach((dish) => {
      addToCart(dish, 1);
    });
    onClose();
    openCart();
  };

  const handleReserveWithMenu = () => {
    soundFx.playChime();
    onClose();
    if (setActivePage) {
      setActivePage('reservation');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-gold-400 p-0.5 shadow-glow">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-500 block">
              {tSomm.badge}
            </span>
            <h3 className="font-serif font-black text-2xl text-gray-900 dark:text-white">
              {tSomm.title}
            </h3>
          </div>
        </div>

        {step === 1 ? (
          /* STEP 1: Quiz Options */
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-3">
                {tSomm.step1Title}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {moods.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        soundFx.playPop();
                        setSelectedMood(m.id);
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-gold-500/10 border-gold-500 shadow-glow text-gray-900 dark:text-white scale-[1.02]'
                          : 'bg-gray-50 dark:bg-dark-800/80 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500/50'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{m.icon}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-sm block">{m.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5 leading-snug">
                          {m.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-3">
                {tSomm.step2Title}
              </label>
              <div className="flex flex-wrap gap-2">
                {guestOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      soundFx.playPop();
                      setGuestsCount(opt);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      guestsCount === opt
                        ? 'gold-gradient-bg text-dark-950 shadow-md'
                        : 'bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculateRecommendation}
              className="w-full py-4 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-5 h-5" />
              <span>{tSomm.calculateBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 2: Curated Result */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">
                  {recommendation?.mood.icon} {recommendation?.mood.title}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {tSomm.chefCurated}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white uppercase tracking-wider">
                {tSomm.discountBadge}
              </span>
            </div>

            {/* List of recommended dishes */}
            <div className="space-y-3">
              {recommendation?.items.map((dish, i) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10"
                >
                  <img
                    src={dish.image}
                    alt={getLocalized(dish.name)}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gold-500 block">
                      {i === 0 ? tSomm.mainDish : i === 1 ? tSomm.saladAppetizer : tSomm.dessertDrink}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-gray-900 dark:text-white truncate">
                      {getLocalized(dish.name)}
                    </h5>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                      {dish.portion} • {dish.calories} {tSomm.kcal}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {formatPrice(dish.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculation Row */}
            <div className="p-4 rounded-2xl bg-dark-950 text-white border border-gold-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block line-through">
                  {tSomm.originalPrice} {formatPrice(recommendation?.total)}
                </span>
                <span className="text-xs text-emerald-400 font-bold block">
                  {tSomm.savings} {formatPrice(recommendation?.savings)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gold-400 uppercase tracking-wider block">{tSomm.specialSetPrice}</span>
                <span className="text-xl sm:text-2xl font-black gold-gradient-text">
                  {formatPrice(recommendation?.discountedTotal)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full sm:flex-1 py-3.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{tSomm.addAllBtn}</span>
              </button>

              <button
                onClick={handleReserveWithMenu}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/10 hover:border-gold-500 text-sm font-semibold transition-colors"
              >
                {tSomm.reserveBtn}
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-500 hover:text-gold-500 transition-colors pt-1"
            >
              {tSomm.backBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
