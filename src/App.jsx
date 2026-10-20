import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { DishDetailModal } from './components/DishDetailModal';
import { LoginModal } from './components/LoginModal';
import { ToastNotification } from './components/ToastNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

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
  const [isAdminView, setIsAdminView] = useState(() => parseCurrentRoute().isAdmin);
  const { isAdmin, openLoginModal } = useAuth();

  // Listen to browser Back / Forward buttons and hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentRoute();
      setActivePage(parsed.page);
      setIsAdminView(parsed.isAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync state and update browser address bar
  const navigateTo = (page, isAdm = false) => {
    setActivePage(page);
    setIsAdminView(isAdm);

    const targetUrl = isAdm ? '/admin' : page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page, isAdm }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page) => {
    navigateTo(page, false);
  };

  const handleAdminViewChange = (isAdm) => {
    if (isAdm && !isAdmin) {
      openLoginModal();
      return;
    }
    navigateTo(activePage, isAdm);
  };

  // If user logs out while in admin view, return to site
  useEffect(() => {
    if (isAdminView && !isAdmin) {
      navigateTo('home', false);
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
          />

          <main className="flex-1">
            {activePage === 'home' && <HomePage setActivePage={handlePageChange} />}
            {activePage === 'menu' && <MenuPage />}
            {activePage === 'about' && <AboutPage setActivePage={handlePageChange} />}
            {activePage === 'reservation' && <ReservationPage setActivePage={handlePageChange} />}
            {activePage === 'contact' && <ContactPage />}
          </main>

          <Footer
            setActivePage={handlePageChange}
            setIsAdminView={handleAdminViewChange}
          />
        </>
      )}

      {/* Global Interactive Drawers & Overlays */}
      <CartDrawer />
      <DishDetailModal />
      <LoginModal setIsAdminView={handleAdminViewChange} />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RestaurantProvider>
          <CartProvider>
            <AuthProvider>
              <MainApp />
            </AuthProvider>
          </CartProvider>
        </RestaurantProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
