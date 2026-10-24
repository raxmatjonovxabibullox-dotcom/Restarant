import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { soundFx } from '../hooks/useSoundEffects';
import {
  X,
  Clock,
  Flame,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Heart,
  MessageSquare,
  Send
} from 'lucide-react';

export const DishDetailModal = () => {
  const { selectedDishModal, setSelectedDishModal } = useRestaurant();
  const { addToCart, openCart } = useCart();
  const { t, lang, getLocalized } = useLanguage();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const portions = [
    {
      id: 'standard',
      name: lang === 'ru' ? 'Стандарт (1x)' : lang === 'en' ? 'Standard (1x)' : 'Standart (1x)',
      multiplier: 1.0,
      label: lang === 'ru' ? '1 порция' : lang === 'en' ? '1 portion' : '1 porsiya'
    },
    {
      id: 'large',
      name: lang === 'ru' ? 'Большая порция (1.5x)' : lang === 'en' ? 'Large portion (1.5x)' : 'Katta porsiya (1.5x)',
      multiplier: 1.35,
      label: '+35%'
    },
    {
      id: 'royal',
      name: lang === 'ru' ? 'Царский сет (2x)' : lang === 'en' ? 'Royal set (2x)' : "Shohona to'plam (2x)",
      multiplier: 1.75,
      label: '+75%'
    }
  ];

  const addonsList = [
    {
      id: 'kazi',
      name: lang === 'ru' ? 'Особый конский казы' : lang === 'en' ? 'Special Horsemeat Kazi' : "Maxsus Ot Go'shti Kazi",
      price: 15000
    },
    {
      id: 'quail_eggs',
      name: lang === 'ru' ? 'Перепелиные яйца (3 шт.)' : lang === 'en' ? 'Quail eggs (3 pcs)' : 'Bedana tuxumi (3 dona)',
      price: 6000
    },
    {
      id: 'saffron_sauce',
      name: lang === 'ru' ? 'Шафраново-чесночный соус' : lang === 'en' ? 'Saffron garlic sauce' : 'Zafaron sarimsoqli sousi',
      price: 8000
    },
    {
      id: 'tandoor_bread',
      name: lang === 'ru' ? 'Горячая тандырная лепешка' : lang === 'en' ? 'Fresh hot tandoor bread' : 'Yangi yopilgan Tandir non',
      price: 5000
    }
  ];

  const tDish = {
    time: lang === 'ru' ? 'Время' : lang === 'en' ? 'Time' : 'Vaqt',
    min: lang === 'ru' ? 'мин.' : lang === 'en' ? 'min.' : 'daqiqa',
    calories: lang === 'ru' ? 'Калории' : lang === 'en' ? 'Calories' : 'Kaloriya',
    kcal: lang === 'ru' ? 'ккал' : lang === 'en' ? 'kcal' : 'kkal',
    portion: lang === 'ru' ? 'Порция' : lang === 'en' ? 'Portion' : 'Portsiya',
    portionTitle: lang === 'ru' ? 'Выберите размер порции:' : lang === 'en' ? 'Select portion size:' : 'Portsiya hajmini tanlang:',
    addonsTitle: lang === 'ru' ? 'Фирменные добавки:' : lang === 'en' ? 'Gourmet Add-ons:' : "Qo'shimcha sarxil lazzatlar:",
    reviewsTitle: lang === 'ru' ? 'Отзывы гостей' : lang === 'en' ? 'Guest Reviews' : 'Mehmonlar Fikrlari',
    cancelReview: lang === 'ru' ? 'Отмена' : lang === 'en' ? 'Cancel' : 'Bekor qilish',
    addReview: lang === 'ru' ? '+ Оставить отзыв' : lang === 'en' ? '+ Write a review' : '+ Fikr bildirish',
    namePlaceholder: lang === 'ru' ? 'Ваше имя' : lang === 'en' ? 'Your Name' : 'Ismingiz',
    commentPlaceholder: lang === 'ru' ? 'Ваш отзыв о блюде и сервисе...' : lang === 'en' ? 'Your review of the dish & service...' : "Taom va xizmat haqida fikringiz...",
    saveReviewBtn: lang === 'ru' ? 'Опубликовать отзыв' : lang === 'en' ? 'Post Review' : 'Fikrni Saqlash',
    totalPriceLabel: lang === 'ru' ? 'Итоговая стоимость:' : lang === 'en' ? 'Total price:' : 'Jami qiymat:',
    addToCartBtn: lang === 'ru' ? 'В корзину' : lang === 'en' ? 'Add to Cart' : "Savatga Qo'shish",
    justNow: lang === 'ru' ? 'Только что' : lang === 'en' ? 'Just now' : 'Hozirgina'
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState(portions[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (selectedDishModal) {
      setQuantity(1);
      setSelectedPortion(portions[0]);
      setSelectedAddons([]);
      setShowReviewForm(false);
      
      try {
        const stored = localStorage.getItem(`zafaron_reviews_${selectedDishModal.id}`);
        if (stored) {
          setReviews(JSON.parse(stored));
        } else {
          const initial = [
            {
              id: 1,
              name: lang === 'ru' ? "Бобур Мирзаев" : lang === 'en' ? "Bobur Mirzayev" : "Bobur Mirzayev",
              rating: 5,
              date: lang === 'ru' ? "2 дня назад" : lang === 'en' ? "2 days ago" : "2 kun oldin",
              comment: lang === 'ru' ? "Изумительный вкус и высокий сервис! Нежнейшее мясо и аромат шафрана." : lang === 'en' ? "Incredible taste and high service! Very tender meat with subtle saffron aroma." : "Ajoyib ta'm va yuqori xizmat! Go'shti nihoyatda mayin pishgan, zafaron hidi o'zgacha shukuh bag'ishlaydi."
            },
            {
              id: 2,
              name: lang === 'ru' ? "Мадина Алимова" : lang === 'en' ? "Madina Alimova" : "Madina Alimova",
              rating: 5,
              date: lang === 'ru' ? "1 неделю назад" : lang === 'en' ? "1 week ago" : "1 hafta oldin",
              comment: lang === 'ru' ? "Были с семьей, все остались в восторге. Порции очень щедрые и празднично украшены." : lang === 'en' ? "Visited with family, thoroughly enjoyed. Generous portions and royal presentation." : "Oila a'zolarimiz bilan kelib juda mamnun bo'ldik. Portsiya juda saxiy va shohona bezatilgan."
            }
          ];
          setReviews(initial);
        }
      } catch {
        setReviews([]);
      }
    }
  }, [selectedDishModal, lang]);

  if (!selectedDishModal) return null;

  const dish = selectedDishModal;
  const isFav = isFavorite(dish.id);

  // Calculate dynamic price with portions and addons
  const basePriceWithPortion = Math.round(dish.price * selectedPortion.multiplier);
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = addonsList.find(a => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const unitPrice = basePriceWithPortion + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addonId) => {
    soundFx.playPop();
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    soundFx.playChime();
    const itemToAdd = {
      ...dish,
      price: unitPrice,
      selectedPortion: selectedPortion.name,
      selectedAddons: selectedAddons.map(id => addonsList.find(a => a.id === id)?.name).filter(Boolean)
    };
    addToCart(itemToAdd, quantity);
    setSelectedDishModal(null);
    openCart();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    soundFx.playChime();
    const newRev = {
      id: Date.now(),
      name: newReviewerName.trim(),
      rating: newReviewRating,
      date: tDish.justNow,
      comment: newReviewComment.trim()
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`zafaron_reviews_${dish.id}`, JSON.stringify(updated));
    } catch {}

    setNewReviewerName('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedDishModal(null)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Top Image Banner */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden flex-shrink-0 bg-dark-950">
          <img
            src={dish.image}
            alt={getLocalized(dish.name)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedDishModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => {
              soundFx.playPop();
              toggleFavorite(dish);
            }}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 text-white hover:scale-110 transition-transform backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {dish.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-dark-950 shadow-md"
              >
                {t(`badges.${tag}`) || tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Title & Description */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs uppercase font-bold text-gold-500 tracking-wider">
                  {t(`categories.${dish.category}`) || dish.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{dish.rating || '5.0'}</span>
                  <span className="text-gray-400 font-normal">({reviews.length})</span>
                </div>
              </div>

              <h3 className="font-serif font-black text-2xl text-gray-900 dark:text-white leading-tight">
                {getLocalized(dish.name)}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                {getLocalized(dish.description)}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-gray-800 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 text-gold-500" />
                  <span>{tDish.time}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.prepTime || 20} {tDish.min}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{tDish.calories}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.calories || 450} {tDish.kcal}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>{tDish.portion}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
                  {dish.portion || '1 porsiya'}
                </span>
              </div>
            </div>

            {/* PORTION SELECTOR */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                {tDish.portionTitle}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {portions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundFx.playPop();
                      setSelectedPortion(opt);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-center border transition-all text-xs font-medium ${
                      selectedPortion.id === opt.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-bold shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="block leading-tight">{opt.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GOURMET ADDONS */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                {tDish.addonsTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-2 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                        isChecked
                          ? 'border-gold-500 bg-gold-500/10 text-gray-900 dark:text-white'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="truncate pr-1">{addon.name}</span>
                      <span className="font-bold text-gold-500 whitespace-nowrap">
                        +{formatPrice(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOMER REVIEWS SECTION */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                  {tDish.reviewsTitle} ({reviews.length})
                </span>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-semibold text-gold-500 hover:underline"
                >
                  {showReviewForm ? tDish.cancelReview : tDish.addReview}
                </button>
              </div>

              {/* Review Input Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/90 border border-gold-500/30 space-y-2.5 mb-3 animate-fade-in">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={tDish.namePlaceholder}
                      required
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      className="w-1/2 glass-input text-xs py-1.5"
                    />
                    <div className="w-1/2 flex items-center justify-end gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder={tDish.commentPlaceholder}
                    required
                    rows="2"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full glass-input text-xs py-1.5 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{tDish.saveReviewBtn}</span>
                  </button>
                </form>
              )}

              {/* Reviews List preview */}
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {reviews.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-800/50 border border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">{rev.name}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-[11px] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION ROW */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">{tDish.totalPriceLabel}</span>
                <span className="font-bold text-2xl gold-gradient-text">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-gold-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setQuantity(quantity + 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-gold-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-4 rounded-2xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-xl transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{tDish.addToCartBtn} • {formatPrice(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
