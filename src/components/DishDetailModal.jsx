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
  CheckCircle2,
  Sparkles,
  Heart,
  MessageSquare,
  Send,
  UserCheck
} from 'lucide-react';

const PORTION_OPTIONS = [
  { id: 'standard', name: 'Standart (1x)', multiplier: 1.0, label: '1 porsiya' },
  { id: 'large', name: 'Katta porsiya (1.5x)', multiplier: 1.35, label: '+35%' },
  { id: 'royal', name: 'Shohona to\'plam (2x)', multiplier: 1.75, label: '+75%' }
];

const GOURMET_ADDONS = [
  { id: 'kazi', name: 'Maxsus Ot Go\'shti Kazi', price: 15000 },
  { id: 'quail_eggs', name: 'Bedana tuxumi (3 dona)', price: 6000 },
  { id: 'saffron_sauce', name: 'Zafaron sarimsoqli sousi', price: 8000 },
  { id: 'tandoor_bread', name: 'Yangi yopilgan Tandir non', price: 5000 }
];

export const DishDetailModal = () => {
  const { selectedDishModal, setSelectedDishModal } = useRestaurant();
  const { addToCart, openCart } = useCart();
  const { t, getLocalized } = useLanguage();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState(PORTION_OPTIONS[0]);
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
      setSelectedPortion(PORTION_OPTIONS[0]);
      setSelectedAddons([]);
      setShowReviewForm(false);
      
      // Load stored reviews for this dish
      try {
        const stored = localStorage.getItem(`zafaron_reviews_${selectedDishModal.id}`);
        if (stored) {
          setReviews(JSON.parse(stored));
        } else {
          // Default initial reviews for visual beauty
          const initial = [
            {
              id: 1,
              name: "Bobur Mirzayev",
              rating: 5,
              date: "2 kun oldin",
              comment: "Ajoyib ta'm va yuqori xizmat! Go'shti nihoyatda mayin pishgan, zafaron hidi o'zgacha shukuh bag'ishlaydi."
            },
            {
              id: 2,
              name: "Madina Alimova",
              rating: 5,
              date: "1 hafta oldin",
              comment: "Oila a'zolarimiz bilan kelib juda mamnun bo'ldik. Portsiya juda saxiy va shohona bezatilgan."
            }
          ];
          setReviews(initial);
        }
      } catch (e) {
        setReviews([]);
      }
    }
  }, [selectedDishModal]);

  if (!selectedDishModal) return null;

  const dish = selectedDishModal;
  const isFav = isFavorite(dish.id);

  // Calculate dynamic price with portions and addons
  const basePriceWithPortion = Math.round(dish.price * selectedPortion.multiplier);
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = GOURMET_ADDONS.find(a => a.id === addonId);
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
      selectedAddons: selectedAddons.map(id => GOURMET_ADDONS.find(a => a.id === id)?.name).filter(Boolean)
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
      date: "Hozirgina",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedDishModal(null)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-dark-900 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDishModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image & Badges */}
        <div className="md:w-5/12 relative h-56 md:h-auto min-h-[260px] flex-shrink-0">
          <img
            src={dish.image}
            alt={getLocalized(dish.name)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-dark-900/30" />

          {/* Tags on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
            {dish.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-dark-950/85 text-gold-400 border border-gold-500/30 backdrop-blur-md uppercase tracking-wider shadow-sm"
              >
                {t(`badges.${tag}`)}
              </span>
            ))}
          </div>

          {/* Favorite button over image */}
          <button
            onClick={() => toggleFavorite(dish)}
            className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-dark-950/80 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-transform shadow-lg"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Content Info & Options */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Header info */}
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
                  <span>Vaqt</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.prepTime || 20} daqiqa
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>Kaloriya</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.calories || 450} kkal
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Portsiya</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
                  {dish.portion || '1 porsiya'}
                </span>
              </div>
            </div>

            {/* PORTION SELECTOR */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Portsiya hajmini tanlang:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PORTION_OPTIONS.map((opt) => (
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
                Qo'shimcha sarxil lazzatlar:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOURMET_ADDONS.map((addon) => {
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
                  Mehmonlar Fikrlari ({reviews.length})
                </span>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-semibold text-gold-500 hover:underline"
                >
                  {showReviewForm ? "Bekor qilish" : "+ Fikr bildirish"}
                </button>
              </div>

              {/* Review Input Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/90 border border-gold-500/30 space-y-2.5 mb-3 animate-fade-in">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ismingiz"
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
                    placeholder="Taom va xizmat haqida fikringiz..."
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
                    <span>Fikrni Saqlash</span>
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
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Jami qiymat:</span>
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
              <span>Savatga Qo'shish • {formatPrice(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
