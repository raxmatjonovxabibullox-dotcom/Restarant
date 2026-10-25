import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

export const FavoritesDrawer = () => {
  const { favorites, isFavoritesOpen, closeFavorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const { lang, getLocalized } = useLanguage();

  if (!isFavoritesOpen) return null;

  const tFav = {
    title: lang === 'ru' ? 'Избранное' : lang === 'en' ? 'Favorites' : 'Sevimlilar',
    subtitle: lang === 'ru' ? 'Список ваших любимых изысканных блюд' : lang === 'en' ? 'Your list of favorite gourmet dishes' : "Siz yoqtirgan shohona taomlar ro'yxati",
    emptyTitle: lang === 'ru' ? 'Список избранного пуст' : lang === 'en' ? 'Your wishlist is empty' : "Sevimlilar ro'yxati bo'sh",
    emptyDesc: lang === 'ru' ? 'Нажимайте на сердечко у блюд в меню, чтобы сохранять их сюда.' : lang === 'en' ? 'Click the heart icon on any dish in the menu to save it here.' : "Menyudagi yurakcha belgisini bosish orqali yoqtirgan taomlaringizni shu yerga saqlab qo'ying.",
    addToCartTitle: lang === 'ru' ? 'В корзину' : lang === 'en' ? 'Add to Cart' : "Savatga qo'shish",
    removeTitle: lang === 'ru' ? 'Удалить' : lang === 'en' ? 'Remove' : "O'chirish",
    addAllBtn: lang === 'ru' ? 'Добавить все в корзину' : lang === 'en' ? 'Add All to Cart' : "Barchasini Savatga Qo'shish",
    clearBtn: lang === 'ru' ? 'Очистить список' : lang === 'en' ? 'Clear wishlist' : "Ro'yxatni tozalash",
    kcal: lang === 'ru' ? 'ккал' : lang === 'en' ? 'kcal' : 'kkal'
  };

  const handleAddToCart = (dish) => {
    soundFx.playChime();
    addToCart(dish, 1);
  };

  const handleAddAllToCart = () => {
    soundFx.playSuccessFanfare();
    favorites.forEach((d) => addToCart(d, 1));
    closeFavorites();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={closeFavorites} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-white/10 shadow-2xl h-full flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {tFav.title} ({favorites.length})
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {tFav.subtitle}
              </span>
            </div>
          </div>
          <button
            onClick={closeFavorites}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center text-gray-400">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  {tFav.emptyTitle}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  {tFav.emptyDesc}
                </p>
              </div>
            </div>
          ) : (
            favorites.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10 group"
              >
                <img
                  src={dish.image}
                  alt={getLocalized(dish.name)}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {getLocalized(dish.name)}
                  </h4>
                  <span className="text-xs font-bold text-gold-500 block mt-0.5">
                    {formatPrice(dish.price)}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                    {dish.portion ? `${dish.portion} • ` : ''}{dish.calories || 500} {tFav.kcal}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAddToCart(dish)}
                    title={tFav.addToCartTitle}
                    className="p-2 rounded-xl gold-gradient-bg text-dark-950 hover:scale-105 transition-transform shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(dish)}
                    title={tFav.removeTitle}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {favorites.length > 0 && (
          <div className="p-5 border-t border-gray-200 dark:border-white/10 space-y-3 bg-gray-50/50 dark:bg-dark-950/50">
            <button
              onClick={handleAddAllToCart}
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{tFav.addAllBtn}</span>
            </button>

            <button
              onClick={clearFavorites}
              className="w-full py-2 text-center text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              {tFav.clearBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
