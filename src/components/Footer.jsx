import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UtensilsCrossed, Phone, MapPin, Clock, Send, Heart } from 'lucide-react';

export const Footer = ({ setActivePage, setIsAdminView }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-white/10 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-400 p-0.5 shadow-gold-500/20 shadow-md">
                <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-xl gold-gradient-text tracking-wider block">
                  ZAFARON
                </span>
                <span className="text-[10px] tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase block">
                  Restaurant & Lounge
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-500 border border-gold-500/20">
                100% Halal Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Fresh & Organic
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              {t('common.details')}
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => { setActivePage('home'); setIsAdminView(false); window.scrollTo(0,0); }}
                  className="hover:text-gold-500 transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('menu'); setIsAdminView(false); window.scrollTo(0,0); }}
                  className="hover:text-gold-500 transition-colors"
                >
                  {t('nav.menu')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); setIsAdminView(false); window.scrollTo(0,0); }}
                  className="hover:text-gold-500 transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('reservation'); setIsAdminView(false); window.scrollTo(0,0); }}
                  className="hover:text-gold-500 transition-colors"
                >
                  {t('nav.reservation')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('contact'); setIsAdminView(false); window.scrollTo(0,0); }}
                  className="hover:text-gold-500 transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-500" />
              {t('contactPage.hoursTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('contactPage.hoursDesc')}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-gray-100 dark:bg-dark-800/80 border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gold-500 block mb-0.5">Live Music:</span>
              Har payshanba, juma va shanba 19:30 dan
            </div>
          </div>

          {/* Direct Contact */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-500" />
              {t('contactPage.addressTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {t('contactPage.addressDesc')}
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+998712008899"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gold-500 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 text-gold-500" />
                +998 71 200 88 99
              </a>
              <div className="flex items-center gap-2 text-xs text-emerald-500">
                <Send className="w-3.5 h-3.5" />
                Telegram Bot bilan to'liq integratsiya
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} ZAFARON Restaurant & Lounge. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setIsAdminView(true); window.scrollTo(0, 0); }}
              className="text-gray-500 hover:text-gold-500 underline text-xs"
            >
              {t('nav.admin')}
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for gastronomy lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
