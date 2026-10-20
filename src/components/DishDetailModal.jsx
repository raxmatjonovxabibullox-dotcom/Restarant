import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Clock,
  Flame,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const DishDetailModal = () => {
  const { selectedDishModal, setSelectedDishModal } = useRestaurant();
  const { addToCart, openCart } = useCart();
  const { t, getLocalized } = useLanguage();

  const [quantity, setQuantity] = useState(1);

  if (!selectedDishModal) return null;

  const dish = selectedDishModal;

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    setSelectedDishModal(null);
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedDishModal(null)}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDishModal(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image */}
        <div className="md:w-1/2 relative h-56 md:h-auto min-h-[240px]">
          <img
            src={dish.image}
            alt={getLocalized(dish.name)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          
          {/* Tags on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {dish.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-dark-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md uppercase tracking-wider"
              >
                {t(`badges.${tag}`)}
              </span>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 md:hidden text-white">
            <span className="text-xl font-bold font-serif">{getLocalized(dish.name)}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="hidden md:flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold text-gold-500 tracking-wider">
                {t(`categories.${dish.category}`) || dish.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{dish.rating || '5.0'}</span>
              </div>
            </div>

            <h3 className="hidden md:block font-serif font-bold text-2xl text-gray-900 dark:text-white leading-tight mb-2">
              {getLocalized(dish.name)}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {getLocalized(dish.description)}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-gray-800 text-center mb-4">
              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 text-gold-500" />
                  <span>{t('menuPage.prepTime')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.prepTime || 20} daq.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{t('menuPage.calories')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {dish.calories || 450} kkal
                </span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>{t('menuPage.portion')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
                  {dish.portion || '1 porsiya'}
                </span>
              </div>
            </div>

            {/* Ingredients pills */}
            {dish.ingredients && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
                  {t('menuPage.ingredients')}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(getLocalized(dish.ingredients) || []).map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('menuPage.priceFilter')}:</span>
              <span className="font-bold text-xl gold-gradient-text">
                {(dish.price * quantity).toLocaleString()} {t('common.currency')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Qty Selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-gold-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-gold-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('home.addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
