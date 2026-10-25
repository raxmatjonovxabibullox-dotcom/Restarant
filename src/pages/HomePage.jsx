import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { soundFx } from '../hooks/useSoundEffects';
import { GoldParticles } from '../components/GoldParticles';
import {
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  ShieldCheck,
  Music,
  Star,
  Award,
  Heart,
  ChevronRight,
  CalendarDays,
  ShoppingBag
} from 'lucide-react';

export const HomePage = ({ setActivePage, onOpenConcierge }) => {
  const { t, getLocalized, lang } = useLanguage();
  const { menuItems, setSelectedDishModal } = useRestaurant();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Specials: dishes with 'chef' or 'popular' tags
  const specials = menuItems.filter(item => item.tags?.includes('chef') || item.tags?.includes('popular')).slice(0, 4);

  const handleDishModalOpen = (dish) => {
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
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Floating Golden Stardust Particles Canvas */}
        <GoldParticles count={40} className="absolute inset-0 pointer-events-none z-10" />

        {/* Luxury Background Glows & Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/20 via-gold-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-500 text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md animate-fade-in shadow-glow">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-[1.12] tracking-tight">
            {t('hero.title')}{' '}
            <span className="gold-gradient-text block mt-2 font-display">
              ZAFARON
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                soundFx.playChime();
                setActivePage('menu');
                window.scrollTo(0, 0);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gold-gradient-bg text-base font-bold flex items-center justify-center gap-3 shadow-gold-500/30 shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>{t('hero.viewMenu')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFx.playChime();
                setActivePage('reservation');
                window.scrollTo(0, 0);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:border-gold-500 text-base font-semibold flex items-center justify-center gap-2 backdrop-blur-md transition-all hover:bg-gold-500/10 shadow-lg active:scale-95"
            >
              <CalendarDays className="w-5 h-5 text-gold-500" />
              <span>{t('hero.reserveBtn')}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playChime();
                if (onOpenConcierge) onOpenConcierge();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-500/15 border border-gold-500/40 text-gold-500 hover:bg-gold-500 hover:text-dark-950 text-base font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>{lang === 'ru' ? 'Халяль AI Помощник' : lang === 'en' ? 'Halal Culinary AI' : 'Halol AI Maslahatchi'}</span>
            </button>
          </div>

          {/* Features Highlights Pill Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>{lang === 'ru' ? '100% Халяль и Свежие Ингредиенты' : lang === 'en' ? '100% Halal & Fresh Ingredients' : '100% Halol va Sarxil Masalliqlar'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-500" />
              <span>{lang === 'ru' ? 'Международный Шеф-повар' : lang === 'en' ? 'Award-winning Head Chef' : 'Xalqaro Mukofotli Bosh Oshpaz'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-gold-500" />
              <span>{lang === 'ru' ? 'Каждый вечер живая музыка' : lang === 'en' ? 'Live Oriental Music Every Evening' : 'Har Oqshom Jonli Sharqona Musiqa'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              value: "15+",
              label: lang === 'ru' ? 'Лет Королевского Опыта' : lang === 'en' ? 'Years of Royal Experience' : 'Yillik Royal Tajriba',
              sub: lang === 'ru' ? 'с 2010 года' : lang === 'en' ? 'since 2010' : '2010-yildan buyon'
            },
            {
              value: "85+",
              label: lang === 'ru' ? 'Эксклюзивных Блюд' : lang === 'en' ? 'Exclusive Dishes' : 'Eksklyuziv Taomlar',
              sub: lang === 'ru' ? 'Национальные и европейские' : lang === 'en' ? 'National & European' : 'Milliy va Yevropa'
            },
            {
              value: "12K+",
              label: lang === 'ru' ? 'Довольных Гостей' : lang === 'en' ? 'Delighted Guests' : 'Mamnun Mehmonlar',
              sub: lang === 'ru' ? 'Ташкент и зарубежные гости' : lang === 'en' ? 'Tashkent & International' : 'Toshkent & Xorijiy'
            },
            {
              value: "4.9 ★",
              label: lang === 'ru' ? 'Кулинарный Рейтинг' : lang === 'en' ? 'Culinary Rating' : 'Oshpazlik Bahosi',
              sub: lang === 'ru' ? '5-звездочный сервис' : lang === 'en' ? '5-star premium service' : '5 yulduzli servis'
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-3xl text-center space-y-1 hover:border-gold-500/40 transition-all hover:scale-105 group"
            >
              <span className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl gold-gradient-text block">
                {stat.value}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                {stat.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALS (CHEF'S SIGNATURE DISHES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Королевские Рекомендации' : lang === 'en' ? 'Royal Recommendations' : 'Shohona Tavsiyalar'}</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
              {lang === 'ru' ? 'Шедевры Главного Шефа' : lang === 'en' ? "Chef's Masterpieces" : 'Bosh Oshpaz Shoh Asarlari'}
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playChime();
              setActivePage('menu');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-gold-500 hover:text-gold-400 transition-colors group"
          >
            <span>{lang === 'ru' ? 'Смотреть все меню' : lang === 'en' ? 'View all menu dishes' : "Barcha taomlarni ko'rish"}</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Specials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specials.map((dish) => {
            const isFav = isFavorite(dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => handleDishModalOpen(dish)}
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
      </section>

      {/* SOMMELIER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-dark-950 via-dark-900 to-amber-950/40 border border-gold-500/30 shadow-2xl">
          <GoldParticles count={25} className="absolute inset-0 pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart VIP Assistant</span>
            </div>
            <h3 className="font-serif font-black text-3xl sm:text-4xl text-white leading-tight">
              {lang === 'ru' ? 'Не знаете, какое блюдо выбрать?' : lang === 'en' ? 'Hesitating which dish to choose?' : 'Qaysi taomni tanlashda ikkilanyapsizmi?'}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              {lang === 'ru'
                ? 'Умный сомелье Zafaron подберет идеальный сет из 3 блюд с 10% скидкой в зависимости от настроения, компании и повода.'
                : lang === 'en'
                ? 'Zafaron Smart Sommelier will craft an ideal 3-course royal set with a 10% discount tailored to your mood, party size, and occasion.'
                : "Zafaron Aqlli Sommelier tizimi sizning kayfiyatingiz, mehmonlar soni va tadbir turiga qarab ideal 3-bosqichli shohona to'plamni 10% chegirma bilan taqdim etadi."}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playChime();
                  if (onOpenConcierge) onOpenConcierge();
                }}
                className="px-6 py-3.5 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm inline-flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Запустить Умного Сомелье' : lang === 'en' ? 'Launch Smart Sommelier' : 'Aqlli Sommelierni Ishga Tushirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
