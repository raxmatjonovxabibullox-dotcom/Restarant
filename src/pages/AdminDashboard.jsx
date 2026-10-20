import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFullscreen } from '../hooks/useFullscreen';
import { testTelegramBot } from '../services/telegramService';
import { getStoredSettings, saveStoredSettings } from '../lib/storage';
import { syncMenuWithSupabase } from '../lib/supabase';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Download,
  RefreshCw,
  Send,
  Database,
  ArrowLeft,
  Sun,
  Moon,
  DollarSign,
  TrendingUp,
  X,
  ShieldCheck,
  ExternalLink,
  Maximize,
  Minimize
} from 'lucide-react';

export const AdminDashboard = ({ setIsAdminView }) => {
  const {
    menuItems,
    orders,
    reservations,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    resetToDefaultMenu,
    updateOrderStatus,
    updateReservationStatus,
    showToast
  } = useRestaurant();

  const { lang, setLang, t, getLocalized } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, menu, orders, reservations, settings

  // --- MENU CRUD MODAL STATE ---
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null);
  const [dishFormData, setDishFormData] = useState({
    nameUz: '',
    nameRu: '',
    nameEn: '',
    descUz: '',
    descRu: '',
    descEn: '',
    category: 'national',
    price: 50000,
    image: '',
    prepTime: 20,
    calories: 500,
    tags: ['chef'],
    isAvailable: true
  });

  // Preset image suggestions for dishes
  const presetImages = [
    { label: 'Palov', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kabob', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
    { label: 'Salat', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Steyk', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { label: 'Paxlava', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80' },
    { label: 'Choy/Sharbat', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  ];

  // --- FILTER STATES ---
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reservationStatusFilter, setReservationStatusFilter] = useState('all');

  // --- SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState(() => getStoredSettings());
  const [testingBot, setTestingBot] = useState(false);
  const [botTestResult, setBotTestResult] = useState(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  // --- STATS COMPUTATIONS ---
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.totalAmount || 0) : sum, 0);
  const activeReservationsCount = reservations.filter(r => r.status === 'new' || r.status === 'confirmed').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;

  // --- OPEN ADD DISH MODAL ---
  const handleOpenAddDish = () => {
    setEditingDishId(null);
    setDishFormData({
      nameUz: '',
      nameRu: '',
      nameEn: '',
      descUz: '',
      descRu: '',
      descEn: '',
      category: 'national',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
      prepTime: 20,
      calories: 500,
      tags: ['chef'],
      isAvailable: true
    });
    setIsDishModalOpen(true);
  };

  // --- OPEN EDIT DISH MODAL ---
  const handleOpenEditDish = (dish) => {
    setEditingDishId(dish.id);
    setDishFormData({
      nameUz: typeof dish.name === 'object' ? dish.name.uz : dish.name,
      nameRu: typeof dish.name === 'object' ? dish.name.ru : '',
      nameEn: typeof dish.name === 'object' ? dish.name.en : '',
      descUz: typeof dish.description === 'object' ? dish.description.uz : dish.description,
      descRu: typeof dish.description === 'object' ? dish.description.ru : '',
      descEn: typeof dish.description === 'object' ? dish.description.en : '',
      category: dish.category || 'national',
      price: dish.price || 0,
      image: dish.image || '',
      prepTime: dish.prepTime || 20,
      calories: dish.calories || 500,
      tags: dish.tags || [],
      isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true
    });
    setIsDishModalOpen(true);
  };

  // --- SAVE DISH (ADD OR EDIT) ---
  const handleSaveDish = async (e) => {
    e.preventDefault();
    if (!dishFormData.nameUz.trim() || !dishFormData.price) {
      alert("Iltimos, taom nomini va narxini kiriting!");
      return;
    }

    const payload = {
      name: {
        uz: dishFormData.nameUz.trim(),
        ru: dishFormData.nameRu.trim() || dishFormData.nameUz.trim(),
        en: dishFormData.nameEn.trim() || dishFormData.nameUz.trim(),
      },
      description: {
        uz: dishFormData.descUz.trim(),
        ru: dishFormData.descRu.trim() || dishFormData.descUz.trim(),
        en: dishFormData.descEn.trim() || dishFormData.descUz.trim(),
      },
      category: dishFormData.category,
      price: Number(dishFormData.price),
      image: dishFormData.image || presetImages[0].url,
      prepTime: Number(dishFormData.prepTime) || 20,
      calories: Number(dishFormData.calories) || 500,
      tags: dishFormData.tags,
      isAvailable: dishFormData.isAvailable
    };

    if (editingDishId) {
      await updateDish(editingDishId, payload);
    } else {
      await addDish(payload);
    }

    setIsDishModalOpen(false);
  };

  // --- TOGGLE TAG IN FORM ---
  const handleToggleTag = (tag) => {
    setDishFormData(prev => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  // --- TEST BOT ---
  const handleTestBot = async () => {
    setTestingBot(true);
    setBotTestResult(null);
    try {
      const res = await testTelegramBot(settingsForm.telegramBotToken, settingsForm.telegramChatId);
      setBotTestResult(res);
      if (res.success) {
        showToast("Telegram Bot bilan aloqa muvaffaqiyatli!", "success");
      } else {
        showToast(res.message || "Bot xatoligi", "error");
      }
    } catch (err) {
      setBotTestResult({ success: false, message: err.message });
      showToast("Bot test qilishda xatolik", "error");
    } finally {
      setTestingBot(false);
    }
  };

  // --- SAVE SETTINGS ---
  const handleSaveSettings = () => {
    saveStoredSettings(settingsForm);
    showToast("Sozlamalar muvaffaqiyatli saqlandi!", "success");
  };

  // --- SYNC SUPABASE ---
  const handleSyncSupabase = async () => {
    setSyncingSupabase(true);
    try {
      saveStoredSettings(settingsForm);
      const res = await syncMenuWithSupabase(menuItems);
      if (res.synced) {
        showToast("Taomnoma Supabase bazasiga yuklandi!", "success");
      } else {
        showToast(res.reason || "Supabase ulanishida xatolik", "error");
      }
    } catch (err) {
      showToast("Supabase xatosi", "error");
    } finally {
      setSyncingSupabase(false);
    }
  };

  // --- EXPORT JSON BACKUP ---
  const handleExportJSON = () => {
    const backupData = {
      menu: menuItems,
      orders,
      reservations,
      settings: settingsForm,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zafaron_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast("Zaxira nusxasi (JSON) yuklab olindi!");
  };

  // Categories list
  const categories = [
    { id: 'all', label: t('categories.all') },
    { id: 'national', label: t('categories.national') },
    { id: 'salads', label: t('categories.salads') },
    { id: 'kebabs', label: t('categories.kebabs') },
    { id: 'mains', label: t('categories.mains') },
    { id: 'desserts', label: t('categories.desserts') },
    { id: 'drinks', label: t('categories.drinks') },
  ];

  // Filtered menu
  const filteredDishes = menuItems.filter(dish => {
    if (menuCategoryFilter !== 'all' && dish.category !== menuCategoryFilter) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      const n = (typeof dish.name === 'object' ? (dish.name.uz + dish.name.ru + dish.name.en) : dish.name).toLowerCase();
      if (!n.includes(q)) return false;
    }
    return true;
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    return true;
  });

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    if (reservationStatusFilter !== 'all' && r.status !== reservationStatusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* ADMIN TOPBAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminView(false)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:text-gold-500 hover:bg-gold-500/10 transition-colors"
              title={t('admin.backToSite')}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-gold-400 p-0.5">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-sm sm:text-base gold-gradient-text block leading-none">
                  {t('admin.brand')}
                </span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">
                  Management Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
              { id: 'menu', label: t('admin.menuManagement'), icon: UtensilsCrossed },
              { id: 'orders', label: `${t('admin.orders')} (${pendingOrdersCount})`, icon: ShoppingBag },
              { id: 'reservations', label: `${t('admin.reservations')} (${activeReservationsCount})`, icon: CalendarDays },
              { id: 'settings', label: t('admin.settings'), icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'gold-gradient-bg text-dark-950 shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Lang, Theme, Exit */}
          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 text-xs">
              {['uz', 'ru', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-md font-bold uppercase transition-colors ${
                    lang === l ? 'bg-gold-500 text-dark-950' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gold-500"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              title={isFullscreen ? "To'liq ekrandan chiqish (Esc)" : "To'liq ekran rejimi (Fullscreen)"}
              className={`p-2 rounded-xl border transition-all ${
                isFullscreen
                  ? 'bg-gold-500/15 border-gold-500/50 text-gold-500'
                  : 'bg-gray-100 dark:bg-dark-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:border-gold-500'
              }`}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Back to Public Site CTA */}
            <button
              onClick={() => setIsAdminView(false)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gold-500 hover:text-gold-500"
            >
              <span>{t('admin.backToSite')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto pt-2 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Boshqaruv', icon: LayoutDashboard },
            { id: 'menu', label: 'Taomnoma', icon: UtensilsCrossed },
            { id: 'orders', label: `Buyurtmalar (${pendingOrdersCount})`, icon: ShoppingBag },
            { id: 'reservations', label: `Bandlik (${activeReservationsCount})`, icon: CalendarDays },
            { id: 'settings', label: 'Sozlamalar', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  isActive
                    ? 'gold-gradient-bg text-dark-950'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN ADMIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Revenue */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.todayRevenue')}</span>
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl gold-gradient-text">
                  {totalRevenue.toLocaleString()} {t('common.currency')}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t('admin.revenueGrowth')}</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.totalOrders')}</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {orders.length} ta
                </div>
                <div className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold">
                  <span>{pendingOrdersCount} ta faol jarayonda</span>
                </div>
              </div>

              {/* Reservations */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.activeReservations')}</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {reservations.length} ta
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                  <span>{activeReservationsCount} ta tasdiqlangan/yangi</span>
                </div>
              </div>

              {/* Menu Items Count */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.totalMenuItems')}</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {menuItems.length} ta
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                  <span>{menuItems.filter(i => i.isAvailable !== false).length} ta sotuvda mavjud</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Weekly Dynamic Chart + Top Dishes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Analytics Bar: 8 cols */}
              <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                    {t('admin.weeklyRevenue')}
                  </h3>
                  <span className="text-xs text-gold-500 font-semibold">Oxirgi 7 kunlik statistika</span>
                </div>

                {/* Simulated Visual Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-gray-100 dark:border-white/5">
                  {[
                    { day: 'Dush', h: '55%', amount: '1.8M' },
                    { day: 'Sesh', h: '70%', amount: '2.4M' },
                    { day: 'Chor', h: '60%', amount: '2.1M' },
                    { day: 'Pay', h: '85%', amount: '3.2M' },
                    { day: 'Juma', h: '95%', amount: '4.5M' },
                    { day: 'Shan', h: '100%', amount: '5.2M' },
                    { day: 'Yak', h: '90%', amount: '4.1M' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        {bar.amount}
                      </span>
                      <div className="w-full max-w-[36px] bg-gray-200 dark:bg-dark-800 rounded-t-xl overflow-hidden h-36 flex items-end">
                        <div
                          style={{ height: bar.h }}
                          className="w-full bg-gradient-to-t from-amber-600 to-gold-400 group-hover:from-amber-500 group-hover:to-gold-300 transition-all rounded-t-xl"
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 group-hover:text-gold-500">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Eng serdaromad kunlar: Juma va Shanba (Jonli musiqa)</span>
                  <span className="font-bold text-gold-500">O'rtacha chek: 245,000 so'm</span>
                </div>
              </div>

              {/* Popular Dishes: 4 cols */}
              <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {t('admin.popularDishes')}
                </h3>

                <div className="space-y-3">
                  {menuItems.slice(0, 4).map((dish, idx) => (
                    <div key={dish.id} className="flex items-center gap-3 p-2 rounded-2xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-white/5">
                      <img
                        src={dish.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {getLocalized(dish.name)}
                        </h4>
                        <span className="text-[11px] text-gold-500 font-semibold block">
                          {dish.price.toLocaleString()} so'm
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {t('admin.recentOrders')}
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-gold-500 font-bold hover:underline"
                >
                  {t('admin.allOrders')} →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 text-xs uppercase">
                      <th className="pb-3 font-semibold">{t('admin.orderId')}</th>
                      <th className="pb-3 font-semibold">{t('admin.customer')}</th>
                      <th className="pb-3 font-semibold">{t('admin.type')}</th>
                      <th className="pb-3 font-semibold">{t('admin.amount')}</th>
                      <th className="pb-3 font-semibold">{t('common.status')}</th>
                      <th className="pb-3 font-semibold text-right">{t('common.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/50">
                        <td className="py-3 font-bold text-gold-500">#{o.id}</td>
                        <td className="py-3">
                          <span className="font-semibold block">{o.customerName}</span>
                          <span className="text-xs text-gray-400">{o.customerPhone}</span>
                        </td>
                        <td className="py-3 text-xs">
                          {o.deliveryType === 'dineIn' ? `🍽 Stol: ${o.tableNumber}` : '🛵 Yetkazish'}
                        </td>
                        <td className="py-3 font-bold">
                          {Number(o.totalAmount).toLocaleString()} so'm
                        </td>
                        <td className="py-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            o.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : o.status === 'cooking'
                              ? 'bg-amber-500/10 text-amber-500'
                              : o.status === 'delivering'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-gray-200 dark:bg-dark-800 text-gray-500'
                          }`}>
                            {t(`admin.status${o.status.charAt(0).toUpperCase() + o.status.slice(1)}`) || o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-dark-800 hover:text-gold-500 font-semibold"
                          >
                            Batafsil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MENU MANAGEMENT ================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.menuManagement')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Taomlarni qo'shish, narxlarini o'zgartirish va sotuv holatini boshqarish
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleOpenAddDish}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.addNewDish')}</span>
                </button>
              </div>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3 border border-gray-200 dark:border-white/10">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Taom nomi bo'yicha qidirish..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="glass-input w-full pl-10 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setMenuCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      menuCategoryFilter === c.id
                        ? 'gold-gradient-bg text-dark-950 font-bold'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className={`glass-card rounded-3xl overflow-hidden border transition-all flex flex-col justify-between ${
                    dish.isAvailable !== false
                      ? 'border-gray-200 dark:border-white/10'
                      : 'border-red-500/30 opacity-75'
                  }`}
                >
                  {/* Top Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={getLocalized(dish.name)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-dark-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-sm">
                        {t(`categories.${dish.category}`) || dish.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleDishAvailability(dish.id)}
                        className={`p-1.5 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 ${
                          dish.isAvailable !== false
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                        title="Sotuv holatini o'zgartirish"
                      >
                        {dish.isAvailable !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white/90 bg-dark-950/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <span>{dish.prepTime || 20} daq.</span>
                      <span>{dish.calories || 500} kkal</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                        {getLocalized(dish.name)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {getLocalized(dish.description)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <span className="font-black text-base gold-gradient-text">
                        {dish.price.toLocaleString()} so'm
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditDish(dish)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:border-gold-500 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Haqiqatan ham bu taomni o'chirmoqchimisiz?")) {
                              deleteDish(dish.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.orders')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Barcha kelib tushgan buyurtmalar, ularning holatlari va Telegram integratsiyasi
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'pending', 'cooking', 'delivering', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      orderStatusFilter === st
                        ? 'gold-gradient-bg text-dark-950 font-black'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {st === 'all' ? 'Barchasi' : t(`admin.status${st.charAt(0).toUpperCase() + st.slice(1)}`) || st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-3xl text-gray-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-400" />
                <h4 className="font-serif font-bold text-lg text-gray-700 dark:text-gray-300">
                  Ushbu toifada buyurtmalar mavjud emas
                </h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="glass-card rounded-3xl p-5 border border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Order Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                        <div>
                          <span className="font-serif font-black text-base text-gold-500 block">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status Select */}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="glass-input text-xs py-1 px-2.5 rounded-lg font-bold cursor-pointer"
                        >
                          <option value="pending">Kutilmoqda</option>
                          <option value="cooking">Tayyorlanmoqda</option>
                          <option value="delivering">Yetkazilmoqda</option>
                          <option value="completed">Yakunlandi</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </div>

                      {/* Customer Info */}
                      <div className="py-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Mijoz:</span>
                          <span className="font-bold text-gray-900 dark:text-white">{order.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Telefon:</span>
                          <a href={`tel:${order.customerPhone}`} className="text-gold-500 font-semibold hover:underline">
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Xizmat:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {order.deliveryType === 'dineIn' ? `🍽 Stol: ${order.tableNumber}` : `🛵 ${order.deliveryAddress}`}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-white/5 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Buyurtma qilingan taomlar:
                        </span>
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>
                              {typeof it.name === 'object' ? (it.name.uz || it.name.en) : it.name} x {it.quantity}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {(it.price * it.quantity).toLocaleString()} so'm
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total & Payment */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Jami summa</span>
                        <span className="font-serif font-black text-lg text-gray-900 dark:text-white">
                          {Number(order.totalAmount).toLocaleString()} so'm
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 font-medium">
                        {order.paymentMethod === 'card' ? '💳 Karta' : '💵 Naqd'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: RESERVATIONS MANAGEMENT ================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.reservations')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Stol bandliklari, VIP xonalar va mehmonlarning maxsus istaklari
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5">
                {['all', 'new', 'confirmed', 'finished', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setReservationStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      reservationStatusFilter === st
                        ? 'gold-gradient-bg text-dark-950 font-black'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {st === 'all' ? 'Barchasi' : t(`admin.reservationStatus${st.charAt(0).toUpperCase() + st.slice(1)}`) || st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReservations.map(res => (
                <div
                  key={res.id}
                  className="glass-card rounded-3xl p-5 border border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                      <span className="font-serif font-black text-base text-gold-500">
                        #{res.id}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : res.status === 'new'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-gray-200 dark:bg-dark-800 text-gray-500'
                      }`}>
                        {res.status === 'confirmed' ? 'Tasdiqlangan' : res.status === 'new' ? 'Yangi' : res.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mehmon:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{res.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Telefon:</span>
                        <a href={`tel:${res.phone}`} className="text-gold-500 font-semibold hover:underline">
                          {res.phone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sana & Vaqt:</span>
                        <span className="font-bold text-gold-500">{res.date} • {res.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mehmonlar soni:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{res.guests} kishi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Zal:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{res.zone}</span>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-300 italic">
                        "{res.specialRequests}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                    {res.status !== 'confirmed' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-bold text-xs transition-colors"
                      >
                        {t('admin.confirmReservation')}
                      </button>
                    )}
                    {res.status !== 'finished' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'finished')}
                        className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors"
                      >
                        Keldilar
                      </button>
                    )}
                    {res.status !== 'cancelled' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'cancelled')}
                        className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold text-xs transition-colors"
                      >
                        Bekor
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                {t('admin.settingsTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Telegram Bot va Supabase ma'lumotlar bazasini ulash va sozlash
              </p>
            </div>

            {/* Telegram Bot Config Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                      {t('admin.telegramBotConfig')}
                    </h3>
                    <span className="text-xs text-gray-500">
                      Barcha yangi buyurtmalar va stol bandliklari ushbu bot orqali guruhga boradi
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('admin.botToken')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('admin.botTokenPlaceholder')}
                    value={settingsForm.telegramBotToken || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    @BotFather orqali yaratilgan bot tokeni
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('admin.chatId')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('admin.chatIdPlaceholder')}
                    value={settingsForm.telegramChatId || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Admin yoki ofitsiantlar guruhi ID raqami (masalan: 123456789 yoki -100...)
                  </span>
                </div>

                {botTestResult && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    botTestResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {botTestResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <span>{botTestResult.message || (botTestResult.success ? t('admin.botTestSuccess') : "Xatolik")}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleTestBot}
                    disabled={testingBot || !settingsForm.telegramBotToken || !settingsForm.telegramChatId}
                    className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4 text-gold-500" />
                    <span>{testingBot ? 'Yuborilmoqda...' : t('admin.testBotBtn')}</span>
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{t('common.save')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Supabase Database Config Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                    {t('admin.supabaseConfig')}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Bulutli ma'lumotlar bazasi orqali real vaqt sinxronlash
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('admin.supabaseUrl')}
                  </label>
                  <input
                    type="text"
                    placeholder="https://xyzcompany.supabase.co"
                    value={settingsForm.supabaseUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supabaseUrl: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('admin.supabaseKey')}
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={settingsForm.supabaseAnonKey || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleSyncSupabase}
                    disabled={syncingSupabase}
                    className="px-6 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{syncingSupabase ? 'Sinxronlanmoqda...' : t('admin.supabaseSyncBtn')}</span>
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-bold text-gray-800 dark:text-gray-200"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </div>

            {/* Backup & System Reset */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {t('admin.dataManagement')}
              </h3>
              <p className="text-xs text-gray-500">
                Barcha taomnoma va buyurtmalar tarixini zaxiralash yoki dastlabki holatga qaytarish
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleExportJSON}
                  className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-dark-800 hover:border-gold-500 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-gold-500" />
                  <span>{t('admin.exportData')}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(t('admin.resetConfirm'))) {
                      resetToDefaultMenu();
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-xs font-bold text-red-500 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('admin.resetDefaultMenu')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD / EDIT DISH MODAL ================= */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsDishModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <button
              onClick={() => setIsDishModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-black text-2xl text-gray-900 dark:text-white mb-6">
              {editingDishId ? t('admin.editDish') : t('admin.addNewDish')}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-5">
              {/* Names in 3 languages */}
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">
                  Taom nomi (3 tilda)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">O'zbekcha *</label>
                    <input
                      type="text"
                      required
                      placeholder="Shohona Palov"
                      value={dishFormData.nameUz}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameUz: e.target.value })}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Русский</label>
                    <input
                      type="text"
                      placeholder="Шахский Плов"
                      value={dishFormData.nameRu}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameRu: e.target.value })}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">English</label>
                    <input
                      type="text"
                      placeholder="Royal Saffron Plov"
                      value={dishFormData.nameEn}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameEn: e.target.value })}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions in 3 languages */}
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">
                  Taom tavsifi (3 tilda)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">O'zbekcha</label>
                    <textarea
                      rows="2"
                      placeholder="Qo'y go'shti, sariq sabzi..."
                      value={dishFormData.descUz}
                      onChange={(e) => setDishFormData({ ...dishFormData, descUz: e.target.value })}
                      className="glass-input w-full text-xs resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Русский</label>
                    <textarea
                      rows="2"
                      placeholder="Нежная баранина, шафран..."
                      value={dishFormData.descRu}
                      onChange={(e) => setDishFormData({ ...dishFormData, descRu: e.target.value })}
                      className="glass-input w-full text-xs resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">English</label>
                    <textarea
                      rows="2"
                      placeholder="Tender lamb, saffron..."
                      value={dishFormData.descEn}
                      onChange={(e) => setDishFormData({ ...dishFormData, descEn: e.target.value })}
                      className="glass-input w-full text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category, Price, Prep time, Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {t('admin.category')}
                  </label>
                  <select
                    value={dishFormData.category}
                    onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                    className="glass-input w-full text-xs"
                  >
                    <option value="national">Milliy taomlar</option>
                    <option value="salads">Salatlar</option>
                    <option value="kebabs">Kabob & Gril</option>
                    <option value="mains">Issiq taomlar</option>
                    <option value="desserts">Desertlar</option>
                    <option value="drinks">Ichimliklar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {t('admin.price')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    className="glass-input w-full text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {t('admin.prepTimeMin')}
                  </label>
                  <input
                    type="number"
                    value={dishFormData.prepTime}
                    onChange={(e) => setDishFormData({ ...dishFormData, prepTime: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {t('admin.caloriesKcal')}
                  </label>
                  <input
                    type="number"
                    value={dishFormData.calories}
                    onChange={(e) => setDishFormData({ ...dishFormData, calories: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Image URL & Preset Picks */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {t('admin.imageUrl')}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={dishFormData.image}
                  onChange={(e) => setDishFormData({ ...dishFormData, image: e.target.value })}
                  className="glass-input w-full text-xs font-mono"
                />

                <div className="flex items-center gap-2 mt-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">Tayyor rasmlar:</span>
                  {presetImages.map(img => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setDishFormData({ ...dishFormData, image: img.url })}
                      className="px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-dark-800 hover:text-gold-500 whitespace-nowrap"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags & Availability */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    {t('admin.tagsSelect')}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['chef', 'popular', 'halal', 'spicy', 'vegetarian'].map(tag => {
                      const isSelected = dishFormData.tags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-gold-500 text-dark-950 font-black'
                              : 'bg-gray-100 dark:bg-dark-800 text-gray-500'
                          }`}
                        >
                          {t(`badges.${tag}`) || tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-3 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={dishFormData.isAvailable}
                    onChange={(e) => setDishFormData({ ...dishFormData, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-gold-500 rounded"
                  />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {t('admin.isAvailable')}
                  </span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all"
                >
                  {t('admin.saveDish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
