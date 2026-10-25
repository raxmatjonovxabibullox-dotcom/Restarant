import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { soundFx } from '../hooks/useSoundEffects';
import {
  Search,
  Star,
  Clock,
  Flame,
  ShoppingBag,
  Sparkles,
  Heart,
  UtensilsCrossed,
  ArrowUpDown
} from 'lucide-react';

export const MenuPage = ({ onOpenConcierge }) => {
  const { t, getLocalized, lang } = useLanguage();
  const {
    menuItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    setSelectedDishModal
  } = useRestaurant();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const categories = [
    { id: 'all', label: t('categories.all') || "Barchasi", icon: "✨" },
    { id: 'national', label: t('categories.national') || "Milliy Taomlar", icon: "🥘" },
    { id: 'european', label: t('categories.european') || "Yevropa & Steyk", icon: "🥩" },
    { id: 'kebabs', label: t('categories.kebabs') || "Kaboblar", icon: "🍢" },
    { id: 'salads', label: t('categories.salads') || "Salatlar", icon: "🥗" },
    { id: 'desserts', label: t('categories.desserts') || "Shirinliklar", icon: "🍰" },
    { id: 'drinks', label: t('categories.drinks') || "Ichimliklar", icon: "🫖" },
  ];

  const tagFilters = [
    { id: '', label: lang === 'ru' ? 'Все категории' : lang === 'en' ? 'All Types' : 'Barcha turlar' },
    { id: 'chef', label: lang === 'ru' ? '👨‍🍳 Выбор шефа' : lang === 'en' ? "👨‍🍳 Chef's Choice" : "👨‍🍳 Bosh oshpaz saralagan" },
    { id: 'popular', label: lang === 'ru' ? '🔥 Популярное' : lang === 'en' ? '🔥 Popular' : '🔥 Eng xaridorgir' },
    { id: 'halal', label: lang === 'ru' ? '✨ 100% Халяль' : lang === 'en' ? '✨ 100% Halal' : '✨ 100% Halol' },
    { id: 'spicy', label: lang === 'ru' ? '🌶️ Острое' : lang === 'en' ? '🌶️ Spicy' : '🌶️ Achchiq' }
  ];

  // Filter & Sort
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'european' || selectedCategory === 'mains') {
          if (dish.category !== 'european' && dish.category !== 'mains') return false;
        } else if (dish.category !== selectedCategory) {
          return false;
        }
      }
      // Tag match
      if (selectedTag && !dish.tags?.includes(selectedTag)) {
        return false;
      }
      // Search query match across languages
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameUz = dish.name?.uz?.toLowerCase() || '';
        const nameRu = dish.name?.ru?.toLowerCase() || '';
        const nameEn = dish.name?.en?.toLowerCase() || '';
        const descUz = dish.description?.uz?.toLowerCase() || '';
        if (!nameUz.includes(q) && !nameRu.includes(q) && !nameEn.includes(q) && !descUz.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'popular') return (b.ordersCount || 0) - (a.ordersCount || 0);
      return 0;
    });
  }, [menuItems, selectedCategory, selectedTag, searchQuery, sortBy]);

  const handleDishClick = (dish) => {
    soundFx.playPop();
    setSelectedDishModal(dish);
  };

  const handleAddToCart = (e, dish) => {
    e.stopPropagation();
    soundFx.playChime();
    addToCart(dish, 1);
  };

  const handleToggleFavorite = (e, dish) => {
    e.stopPropagation();
    toggleFavorite(dish);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zafaron Royal Menu</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-gray-900 dark:text-white">
            {t('menuPage.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light mt-2 max-w-2xl">
            {t('menuPage.subtitle')}
          </p>
        </div>

        {/* Sommelier Concierge Trigger Button */}
        <button
          onClick={() => {
            soundFx.playChime();
            if (onOpenConcierge) onOpenConcierge();
          }}
          className="self-start md:self-end px-5 py-3 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'ru' ? 'Рекомендации Сомелье' : lang === 'en' ? 'Smart Sommelier Pick' : 'Aqlli Sommelier Tavsiyasi'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ru' ? 'Поиск блюда или ингредиентов...' : lang === 'en' ? 'Search dishes or ingredients...' : 'Taom nomi yoki masalliqlarni izlang...'}
              style={{ paddingLeft: '2.75rem' }}
              className="w-full glass-input !pl-11 pr-4 py-3 text-sm rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => {
                  soundFx.playPop();
                  setSortBy(e.target.value);
                }}
                className="w-full glass-input py-3 px-4 text-xs font-semibold rounded-2xl appearance-none pr-8 cursor-pointer"
              >
                <option value="default">{lang === 'ru' ? 'Сортировка: По умолчанию' : lang === 'en' ? 'Sort: Default' : 'Saralash: Standart'}</option>
                <option value="priceAsc">{lang === 'ru' ? 'Цена: Сначала дешевле' : lang === 'en' ? 'Price: Low to High' : 'Narx: Arzonroq'}</option>
                <option value="priceDesc">{lang === 'ru' ? 'Цена: Сначала дороже' : lang === 'en' ? 'Price: High to Low' : 'Narx: Qimmatroq'}</option>
                <option value="rating">{lang === 'ru' ? 'По рейтингу' : lang === 'en' ? 'Highest Rating' : 'Eng yuqori reyting'}</option>
                <option value="popular">{lang === 'ru' ? 'По популярности' : lang === 'en' ? 'Most Popular' : "Eng ko'p buyurtma qilingan"}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 100% Halal Certified Assurance Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base">🌿</span>
            <span>
              {lang === 'ru'
                ? '100% Халяль Стандарт: Все мясные и европейские блюда строго сертифицированы'
                : lang === 'en'
                ? '100% Halal Certified: All meats, steaks, and dishes strictly comply with Islamic dietary standards'
                : "100% Halol Kafolat: Barcha go'sht, steyk va taomlarimiz halol sertifikatlangan va eng toza mahsulotlardan tayyorlanadi"}
            </span>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
            Halal Certified ✓
          </span>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'gold-gradient-bg text-dark-950 shadow-md scale-105'
                    : 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gold-500/50 hover:bg-gold-500/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {tagFilters.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                soundFx.playPop();
                setSelectedTag(tag.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTag === tag.id
                  ? 'bg-amber-500/20 text-gold-500 border border-gold-500 font-bold'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {lang === 'ru'
            ? <>Найдено блюд: <b className="text-gold-500">{filteredDishes.length}</b></>
            : lang === 'en'
            ? <>Dishes found: <b className="text-gold-500">{filteredDishes.length}</b></>
            : <>Topilgan taomlar soni: <b className="text-gold-500">{filteredDishes.length}</b> ta</>}
        </span>
        {(selectedCategory !== 'all' || selectedTag || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('');
              setSearchQuery('');
            }}
            className="text-gold-500 hover:underline font-medium"
          >
            {lang === 'ru' ? 'Очистить фильтры' : lang === 'en' ? 'Reset filters' : 'Filtrlarni tozalash'}
          </button>
        )}
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4">
          <UtensilsCrossed className="w-12 h-12 text-gold-500/50 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
            {lang === 'ru' ? 'Ничего не найдено' : lang === 'en' ? 'No dishes found' : 'Hech qanday taom topilmadi'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {lang === 'ru'
              ? 'Попробуйте изменить поисковый запрос или сбросить активные фильтры.'
              : lang === 'en'
              ? 'Try another search term or clear active filters.'
              : "Boshqa qidiruv so'zini sinab ko'ring yoki tanlangan toifa filtrlarni tozalang."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => {
            const isFav = isFavorite(dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => handleDishClick(dish)}
                className="glass-card rounded-3xl overflow-hidden glass-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                  <img
                    src={dish.image}
                    alt={getLocalized(dish.name)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-dark-950/20 to-transparent opacity-60 group-hover:opacity-35 transition-opacity duration-500" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, dish)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-dark-950/70 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-transform shadow-md z-10"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>

                  {/* Badges: Guaranteed Halal Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/95 text-white border border-emerald-400/40 backdrop-blur-md uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <span>✨</span>
                      <span>{lang === 'ru' ? '100% Халяль' : lang === 'en' ? '100% Halal' : '100% Halol'}</span>
                    </span>
                    {dish.tags?.filter(t => t !== 'halal').slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950/85 text-gold-400 border border-gold-500/30 backdrop-blur-md uppercase tracking-wider"
                      >
                        {t(`badges.${tag}`)}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-dark-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-amber-400 border border-white/10 z-10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dish.rating || '5.0'}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-1">
                      {getLocalized(dish.name)}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {getLocalized(dish.description)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-500" />
                      {dish.prepTime || 20} {lang === 'ru' ? 'мин.' : lang === 'en' ? 'min' : 'daq.'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {dish.calories || 450} {lang === 'ru' ? 'ккал' : lang === 'en' ? 'kcal' : 'kkal'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Цена' : lang === 'en' ? 'Price' : 'Narxi'}
                      </span>
                      <span className="text-base font-bold gold-gradient-text">
                        {formatPrice(dish.price)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, dish)}
                      className="p-2.5 rounded-xl gold-gradient-bg text-dark-950 hover:scale-105 active:scale-95 transition-all shadow-md"
                      title={lang === 'ru' ? 'Добавить в корзину' : lang === 'en' ? 'Add to cart' : "Savatga qo'shish"}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
