import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { DishDetailModal } from './components/DishDetailModal';
import { LoginModal } from './components/LoginModal';
import { ToastNotification } from './components/ToastNotification';
import { AudioPlayer } from './components/AudioPlayer';
import { SmartConciergeModal } from './components/SmartConciergeModal';
import { FloatingVipHub } from './components/FloatingVipHub';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { getStoredAuth } from './lib/storage';

// Parse current URL path and hash
const parseCurrentRoute = () => {
  if (typeof window === 'undefined') return { page: 'home', isAdmin: false };
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const route = path || hash;

  if (route === 'admin') {
    return { page: 'home', isAdmin: true };
  }
  if (['menu', 'about', 'reservation', 'contact'].includes(route)) {
    return { page: route, isAdmin: false };
  }
  return { page: 'home', isAdmin: false };
};

function MainApp() {
  const [activePage, setActivePage] = useState(() => parseCurrentRoute().page);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const { isAdmin, openLoginModal, isLoadingAuth } = useAuth();

  // Route & URL listener strictly guarded by Supabase Auth
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentRoute();
      setActivePage(parsed.page);

      if (parsed.isAdmin) {
        const stored = getStoredAuth();
        const hasAdminRights = isAdmin || stored?.role === 'admin';
        if (hasAdminRights) {
          setIsAdminView(true);
        } else {
          setIsAdminView(false);
          openLoginModal();
          // Reset URL to clean / if unauthorized
          if (window.location.pathname === '/admin') {
            window.history.replaceState({}, '', '/');
          }
        }
      } else {
        setIsAdminView(false);
      }
    };

    // Evaluate on initial load once auth loading completes
    if (!isLoadingAuth) {
      handleUrlChange();
    }

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isAdmin, isLoadingAuth, openLoginModal]);

  // Handle page change (Home, Menu, About, Reservation, Contact)
  const handlePageChange = (page) => {
    setActivePage(page);
    setIsAdminView(false);

    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page, isAdmin: false }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle admin console toggle
  const handleAdminViewChange = (isAdm) => {
    if (isAdm) {
      const stored = getStoredAuth();
      const hasAdminRights = isAdmin || stored?.role === 'admin';
      if (!hasAdminRights) {
        openLoginModal();
        return;
      }
      setIsAdminView(true);
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ page: activePage, isAdmin: true }, '', '/admin');
      }
    } else {
      setIsAdminView(false);
      const targetUrl = activePage === 'home' ? '/' : `/${activePage}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page: activePage, isAdmin: false }, '', targetUrl);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user logs out while in admin view, return to site
  useEffect(() => {
    if (isAdminView && !isAdmin && !getStoredAuth()?.role) {
      setIsAdminView(false);
      setActivePage('home');
      if (window.location.pathname === '/admin') {
        window.history.replaceState({}, '', '/');
      }
    }
  }, [isAdmin, isAdminView]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors selection:bg-gold-500 selection:text-dark-950">
      {isAdminView ? (
        <AdminDashboard setIsAdminView={handleAdminViewChange} />
      ) : (
        <>
          <Navbar
            activePage={activePage}
            setActivePage={handlePageChange}
            setIsAdminView={handleAdminViewChange}
            onOpenConcierge={() => setIsConciergeOpen(true)}
          />

          <main className="flex-1">
            {activePage === 'home' && (
              <HomePage
                setActivePage={handlePageChange}
                onOpenConcierge={() => setIsConciergeOpen(true)}
              />
            )}
            {activePage === 'menu' && (
              <MenuPage
                onOpenConcierge={() => setIsConciergeOpen(true)}
              />
            )}
            {activePage === 'about' && <AboutPage setActivePage={handlePageChange} />}
            {activePage === 'reservation' && <ReservationPage setActivePage={handlePageChange} />}
            {activePage === 'contact' && <ContactPage />}
          </main>

          <Footer
            setActivePage={handlePageChange}
            setIsAdminView={handleAdminViewChange}
          />

          {/* Floating Luxury Lounge Audio Player */}
          <AudioPlayer />

          {/* Floating VIP Hub & Golden Scroll Progress */}
          <FloatingVipHub
            setActivePage={handlePageChange}
            onOpenConcierge={() => setIsConciergeOpen(true)}
          />
        </>
      )}

      {/* Global Interactive Drawers & Overlays */}
      <CartDrawer />
      <FavoritesDrawer />
      <DishDetailModal />
      <LoginModal setIsAdminView={handleAdminViewChange} />
      <ToastNotification />
      <SmartConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        setActivePage={handlePageChange}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <FavoritesProvider>
            <RestaurantProvider>
              <CartProvider>
                <AuthProvider>
                  <MainApp />
                </AuthProvider>
              </CartProvider>
            </RestaurantProvider>
          </FavoritesProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
