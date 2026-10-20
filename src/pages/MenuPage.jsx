import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  Flame,
  ShoppingBag,
  Sparkles,
  ArrowUpDown,
  X
} from 'lucide-react';

export const MenuPage = () => {
  const {
    menuItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    maxPriceFilter,
    setMaxPriceFilter,
    sortBy,
    setSortBy,
    setSelectedDishModal
  } = useRestaurant();

  const { t, getLocalized } = useLanguage();
  const { addToCart, openCart } = useCart();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Available categories
  const categories = [
    { id: 'all', label: t('categories.all') },
    { id: 'national', label: t('categories.national') },
    { id: 'salads', label: t('categories.salads') },
    { id: 'kebabs', label: t('categories.kebabs') },
    { id: 'mains', label: t('categories.mains') },
    { id: 'desserts', label: t('categories.desserts') },
    { id: 'drinks', label: t('categories.drinks') },
  ];

  const tags = [
    { id: '', label: t('common.all') },
    { id: 'chef', label: t('badges.chef') },
    { id: 'popular', label: t('badges.popular') },
    { id: 'halal', label: t('badges.halal') },
    { id: 'spicy', label: t('badges.spicy') },
    { id: 'vegetarian', label: t('badges.vegetarian') },
  ];

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return menuItems.filter((dish) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameUz = dish.name.uz?.toLowerCase() || '';
        const nameRu = dish.name.ru?.toLowerCase() || '';
        const nameEn = dish.name.en?.toLowerCase() || '';
        const descUz = dish.description.uz?.toLowerCase() || '';
        const descRu = dish.description.ru?.toLowerCase() || '';
        const descEn = dish.description.en?.toLowerCase() || '';

        const matches = nameUz.includes(q) || nameRu.includes(q) || nameEn.includes(q) ||
                        descUz.includes(q) || descRu.includes(q) || descEn.includes(q);
        if (!matches) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }

      // 3. Tag
      if (selectedTag && !dish.tags?.includes(selectedTag)) {
        return false;
      }

      // 4. Price
      if (dish.price > maxPriceFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // default
    });
  }, [menuItems, searchQuery, selectedCategory, selectedTag, maxPriceFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
          Haute Cuisine
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-gray-900 dark:text-white">
          {t('menuPage.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('menuPage.subtitle')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input
              id="menu-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menuPage.searchPlaceholder')}
              className="glass-input w-full pl-11 pr-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <select
                id="menu-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input text-xs sm:text-sm py-2.5 px-3 pr-8 appearance-none w-full cursor-pointer font-medium"
              >
                <option value="default">{t('menuPage.sortDefault')}</option>
                <option value="priceAsc">{t('menuPage.sortPriceAsc')}</option>
                <option value="priceDesc">{t('menuPage.sortPriceDesc')}</option>
                <option value="rating">{t('menuPage.sortRating')}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Toggle Filters Button for Mobile */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gold-500 text-gray-700 dark:text-gray-300 md:hidden flex items-center gap-1.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'gold-gradient-bg shadow-md'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dietary / Feature Tags & Price Slider */}
        <div className={`pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 ${showFilterDrawer ? 'block' : 'hidden md:flex'}`}>
          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs text-gray-400 font-semibold mr-1">{t('common.filter')}:</span>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedTag === tag.id
                    ? 'bg-gold-500 text-dark-950 font-bold'
                    : 'bg-gray-100 dark:bg-dark-800/80 text-gray-600 dark:text-gray-400 hover:text-gold-500'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 w-full md:w-64">
            <span className="text-xs text-gray-400 whitespace-nowrap">{t('menuPage.maxPrice')}:</span>
            <input
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-gold-500 whitespace-nowrap">
              {(maxPriceFilter / 1000).toFixed(0)}k {t('common.currency')}
            </span>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>
          Jami: <b>{filteredItems.length}</b> ta taom topildi
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedTag || maxPriceFilter < 200000) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTag('');
              setMaxPriceFilter(200000);
            }}
            className="text-gold-500 hover:underline font-semibold"
          >
            Filtrlarni tozalash
          </button>
        )}
      </div>

      {/* Grid of Dishes */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
            {t('common.noResults')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Boshqa so'z bilan qidirib ko'ring yoki filtrlarni tozalang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((dish) => (
            <div
              key={dish.id}
              className="glass-card rounded-3xl overflow-hidden glass-card-hover flex flex-col group"
            >
              {/* Image & Badges */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setSelectedDishModal(dish)}
              >
                <img
                  src={dish.image}
                  alt={getLocalized(dish.name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

                {/* Tags on Card */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {dish.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-dark-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-sm"
                    >
                      {t(`badges.${tag}`)}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-dark-950/80 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{dish.rating || 5.0}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gold-500 uppercase tracking-wider block mb-1">
                    {t(`categories.${dish.category}`) || dish.category}
                  </span>
                  <h3
                    onClick={() => setSelectedDishModal(dish)}
                    className="font-serif font-bold text-lg text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors cursor-pointer line-clamp-1"
                  >
                    {getLocalized(dish.name)}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {getLocalized(dish.description)}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-500" />
                      {dish.prepTime || 20} daq.
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {dish.calories || 500} kkal
                    </span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">{t('common.currency')}:</span>
                    <span className="font-bold text-base text-gray-900 dark:text-white">
                      {dish.price.toLocaleString()} {t('common.currency')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedDishModal(dish)}
                      className="px-2.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
                    >
                      {t('common.details')}
                    </button>
                    <button
                      onClick={() => {
                        addToCart(dish, 1);
                        openCart();
                      }}
                      className="p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500 text-gold-500 hover:text-dark-950 transition-all transform active:scale-95"
                      title={t('home.addToCart')}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
