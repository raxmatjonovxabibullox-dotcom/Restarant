import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFullscreen } from '../hooks/useFullscreen';
import {
  UtensilsCrossed,
  Sun,
  Moon,
  ShoppingBag,
  User,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  Globe,
  CalendarDays,
  Maximize,
  Minimize
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, setIsAdminView }) => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const { user, isAdmin, openLoginModal, logout } = useAuth();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'menu', label: t('nav.menu') },
    { id: 'about', label: t('nav.about') },
    { id: 'reservation', label: t('nav.reservation') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="relative z-40 w-full transition-all duration-300">
      {/* Top micro bar */}
      <div className="bg-gray-100 dark:bg-dark-900/90 border-b border-gray-200 dark:border-white/5 py-1.5 px-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-gold-500 transition-colors">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              {t('nav.openHours')}
            </span>
            <a href="tel:+998712008899" className="flex items-center gap-1.5 hover:text-gold-500 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              {t('nav.phone')}
            </a>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 ml-auto">
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="lang-select-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 hover:border-gold-500 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-gold-500" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 py-1 bg-white dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-gold-500/10 hover:text-gold-500 transition-colors ${lang === l.code ? 'font-bold text-gold-500 bg-gold-500/5' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span>{l.label}</span>
                      <span>{l.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:border-gold-500 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              id="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              title={isFullscreen ? "To'liq ekrandan chiqish (Esc)" : "To'liq ekran rejimi (Fullscreen)"}
              className={`p-1.5 rounded-lg border transition-all ${
                isFullscreen
                  ? 'bg-gold-500/15 border-gold-500/50 text-gold-500 shadow-sm'
                  : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:border-gold-500'
              }`}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-card bg-white/90 dark:bg-dark-900/95 border-b border-gray-200 dark:border-white/10 px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-400 p-0.5 shadow-gold-500/30 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-2xl tracking-wider gold-gradient-text block leading-none">
                ZAFARON
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase block mt-1">
                Restaurant & Lounge
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-gold-500 bg-gold-500/10 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Reservation CTA, Cart, Admin / Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Reservation Button */}
            <button
              onClick={() => setActivePage('reservation')}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t('nav.bookTable')}</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="cart-toggle-btn"
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gold-500 hover:text-gold-500 transition-all"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-500 text-dark-950 font-bold text-xs flex items-center justify-center shadow-lg animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin or Login Button */}
            {isAdmin ? (
              <button
                id="admin-dashboard-btn"
                onClick={() => setIsAdminView(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold gold-gradient-bg transition-all transform hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.admin')}</span>
              </button>
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-200 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gold-500 hover:text-gold-500 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-white/10 flex flex-col gap-1 animate-slide-up">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                  activePage === link.id
                    ? 'text-gold-500 bg-gold-500/10 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActivePage('reservation');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-center text-xs font-semibold bg-gold-500 text-dark-950 flex items-center justify-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                {t('nav.bookTable')}
              </button>

              {!isAdmin && (
                <button
                  onClick={() => {
                    openLoginModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-center text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {t('nav.login')} / Admin
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
