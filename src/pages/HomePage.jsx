import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  ShieldCheck,
  Music,
  Star,
  Clock,
  Flame,
  Award,
  Users,
  Heart,
  ChevronRight,
  CalendarDays,
  ShoppingBag
} from 'lucide-react';

export const HomePage = ({ setActivePage }) => {
  const { t, getLocalized } = useLanguage();
  const { menuItems, setSelectedDishModal } = useRestaurant();
  const { addToCart, openCart } = useCart();

  // Specials: dishes with 'chef' or 'popular' tags
  const specials = menuItems.filter(item => item.tags?.includes('chef') || item.tags?.includes('popular')).slice(0, 4);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Luxury Background Glows & Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-gold-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md animate-fade-in shadow-glow">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-[1.15] tracking-tight">
            {t('hero.title')}{' '}
            <span className="gold-gradient-text block mt-2">
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
              onClick={() => { setActivePage('menu'); window.scrollTo(0, 0); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gold-gradient-bg text-base font-bold flex items-center justify-center gap-3 shadow-gold-500/25 shadow-xl transition-all transform hover:scale-105"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>{t('hero.viewMenu')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setActivePage('reservation'); window.scrollTo(0, 0); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:border-gold-500 text-base font-semibold flex items-center justify-center gap-2 backdrop-blur-md transition-all hover:bg-gold-500/10"
            >
              <CalendarDays className="w-5 h-5 text-gold-500" />
              <span>{t('hero.reserveBtn')}</span>
            </button>
          </div>

          {/* Features Highlights Pill Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>{t('hero.features2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-500" />
              <span>{t('hero.features1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-gold-500" />
              <span>{t('hero.features3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: "15+", label: t('stats.experience'), icon: Award },
            { value: "120+", label: t('stats.dishes'), icon: UtensilsCrossed },
            { value: "50K+", label: t('stats.customers'), icon: Users },
            { value: "18+", label: t('stats.chefs'), icon: Heart },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl text-center glass-card-hover"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-serif font-black text-3xl sm:text-4xl gold-gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SPECIALS HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-500 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gourmet Selection</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
              {t('home.specialsTitle')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('home.specialsSubtitle')}
            </p>
          </div>

          <button
            onClick={() => { setActivePage('menu'); window.scrollTo(0, 0); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-4 h-4 text-gold-500" />
          </button>
        </div>

        {/* Specials Dish Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specials.map((dish) => (
            <div
              key={dish.id}
              className="glass-card rounded-3xl overflow-hidden glass-card-hover flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedDishModal(dish)}>
                <img
                  src={dish.image}
                  alt={getLocalized(dish.name)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />
                
                {/* Badges */}
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

              {/* Card Body */}
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
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">{t('common.filter')}:</span>
                    <span className="font-bold text-base text-gray-900 dark:text-white">
                      {dish.price.toLocaleString()} {t('common.currency')}
                    </span>
                  </div>

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
          ))}
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="bg-gray-100/70 dark:bg-dark-900/60 py-20 border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
              {t('home.whyUsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              {t('home.whyUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t('home.reason1Title'), desc: t('home.reason1Desc'), icon: Sparkles },
              { title: t('home.reason2Title'), desc: t('home.reason2Desc'), icon: Award },
              { title: t('home.reason3Title'), desc: t('home.reason3Desc'), icon: UtensilsCrossed },
              { title: t('home.reason4Title'), desc: t('home.reason4Desc'), icon: Clock },
            ].map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div key={i} className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-gray-900 dark:text-white">
            {t('home.testimonialsTitle')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('home.testimonialsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: t('home.review1Text'), author: t('home.review1Author'), role: t('home.review1Role'), rating: 5 },
            { text: t('home.review2Text'), author: t('home.review2Author'), role: t('home.review2Role'), rating: 5 },
            { text: t('home.review3Text'), author: t('home.review3Author'), role: t('home.review3Role'), rating: 5 },
          ].map((rev, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, rIdx) => (
                  <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{rev.text}"
              </p>
              <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="font-bold text-sm text-gray-900 dark:text-white block">
                  {rev.author}
                </span>
                <span className="text-xs text-gold-500 font-medium">
                  {rev.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK RESERVATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-gold-500/30 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              {t('reservationPage.badge')}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight">
              {t('reservationPage.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              {t('reservationPage.subtitle')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setActivePage('reservation'); window.scrollTo(0, 0); }}
                className="px-8 py-4 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm sm:text-base shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                <CalendarDays className="w-5 h-5" />
                <span>{t('reservationPage.submitBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
