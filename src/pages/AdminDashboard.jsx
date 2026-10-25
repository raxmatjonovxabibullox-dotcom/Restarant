import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useFullscreen } from '../hooks/useFullscreen';
import { soundFx } from '../hooks/useSoundEffects';
import { testTelegramBot, sendPhotoToTelegramApi } from '../services/telegramService';
import { getStoredSettings, saveStoredSettings } from '../lib/storage';
import { syncMenuWithSupabase, testSupabaseConnection } from '../lib/supabase';
import { KitchenDisplay } from '../components/admin/KitchenDisplay';
import { TableOccupancyManager } from '../components/admin/TableOccupancyManager';
import { PrintDailyReportModal } from '../components/admin/PrintDailyReportModal';
import { PrintReceiptModal } from '../components/PrintReceiptModal';
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
  FileSpreadsheet,
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
  Minimize,
  ChefHat,
  Printer,
  Phone,
  Coins,
  Globe,
  ChevronDown,
  LogOut,
  Lock
} from 'lucide-react';

export const AdminDashboard = ({ setIsAdminView }) => {
  const { user, isAdmin, logout, openLoginModal } = useAuth();
  const { lang, setLang, t, getLocalized } = useLanguage();

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

  const { theme, toggleTheme } = useTheme();
  const { formatPrice } = useCurrency();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];
  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, kds, menu, orders, reservations, settings

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

  // Preset image suggestions
  const presetImages = [
    { label: 'Palov', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kabob', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
    { label: 'Salat', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Steyk', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { label: 'Paxlava', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80' },
    { label: 'Choy/Sharbat', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  ];

  // --- FILTER STATES ---
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState('all');
  const [reservationSubTab, setReservationSubTab] = useState('list'); // 'list' or 'floorplan'

  // --- MODALS FOR PRINTING ---
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

  // --- SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState(() => getStoredSettings());
  const [testingBot, setTestingBot] = useState(false);
  const [botTestResult, setBotTestResult] = useState(null);
  const [customBroadcastMsg, setCustomBroadcastMsg] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);

  // Hard Security Guard: Strictly deny non-authenticated users AFTER all hooks run
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center space-y-4 border border-red-500/20 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-black text-2xl text-white">
            {lang === 'ru' ? 'Доступ Запрещен (403)' : lang === 'en' ? 'Access Denied (403)' : 'Ruxsat Etilmagan Kirish (403)'}
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {lang === 'ru'
              ? 'Только авторизованные администраторы могут войти в панель управления Zafaron Executive Suite.'
              : lang === 'en'
              ? 'Only authenticated administrators are allowed to enter the Zafaron Executive Suite.'
              : "Admin panelga faqat tizimga kirgan tasdiqlangan administratorlar kira oladi."}
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                soundFx.playPop();
                if (openLoginModal) openLoginModal();
              }}
              className="w-full py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-transform"
            >
              {lang === 'ru' ? 'Войти как Администратор' : lang === 'en' ? 'Login as Administrator' : 'Administrator Sifatida Kirish'}
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsAdminView(false);
              }}
              className="w-full py-2.5 rounded-xl bg-dark-800 text-gray-300 hover:text-white font-semibold text-xs"
            >
              {lang === 'ru' ? 'Вернуться на Главную' : lang === 'en' ? 'Return to Home' : 'Bosh sahifaga qaytish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STATS COMPUTATIONS (Fixed totalPrice & totalAmount support) ---
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'cancelled' ? sum + Number(o.totalPrice || o.totalAmount || 0) : sum),
    0
  );
  const activeReservationsCount = reservations.filter(r => r.status === 'new' || r.status === 'confirmed').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;
  const averageCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // --- OPEN ADD DISH MODAL ---
  const handleOpenAddDish = () => {
    soundFx.playPop();
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
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      prepTime: 20,
      calories: 500,
      tags: ['chef'],
      isAvailable: true
    });
    setIsDishModalOpen(true);
  };

  // --- OPEN EDIT DISH MODAL ---
  const handleOpenEditDish = (dish) => {
    soundFx.playPop();
    setEditingDishId(dish.id);
    setDishFormData({
      nameUz: dish.name?.uz || dish.name || '',
      nameRu: dish.name?.ru || '',
      nameEn: dish.name?.en || '',
      descUz: dish.description?.uz || dish.description || '',
      descRu: dish.description?.ru || '',
      descEn: dish.description?.en || '',
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

  // --- SAVE DISH ---
  const handleSaveDish = async (e) => {
    e.preventDefault();
    soundFx.playSuccessFanfare();

    const dishPayload = {
      name: {
        uz: dishFormData.nameUz,
        ru: dishFormData.nameRu || dishFormData.nameUz,
        en: dishFormData.nameEn || dishFormData.nameUz,
      },
      description: {
        uz: dishFormData.descUz,
        ru: dishFormData.descRu || dishFormData.descUz,
        en: dishFormData.descEn || dishFormData.descUz,
      },
      category: dishFormData.category,
      price: Number(dishFormData.price),
      image: dishFormData.image || presetImages[0].url,
      prepTime: Number(dishFormData.prepTime),
      calories: Number(dishFormData.calories),
      tags: dishFormData.tags,
      isAvailable: dishFormData.isAvailable
    };

    if (editingDishId) {
      await updateDish(editingDishId, dishPayload);
    } else {
      await addDish(dishPayload);
    }

    setIsDishModalOpen(false);
  };

  // --- TOGGLE TAG IN FORM ---
  const handleToggleTag = (tag) => {
    soundFx.playPop();
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
    soundFx.playPop();
    setTestingBot(true);
    setBotTestResult(null);
    try {
      const res = await testTelegramBot(settingsForm.telegramBotToken, settingsForm.telegramChatId);
      setBotTestResult(res);
      if (res.success) {
        soundFx.playSuccessFanfare();
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

  // --- SEND CUSTOM BROADCAST MESSAGE ---
  const handleSendCustomBroadcast = async () => {
    if (!customBroadcastMsg.trim()) return;
    soundFx.playPop();
    setSendingBroadcast(true);
    try {
      const caption =
        `👑 <b>ZAFARON RESTAURANT & LOUNGE</b>\n` +
        `📢 <b>BOSH ADMINISTRATOR E'LONI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `<blockquote>\n${customBroadcastMsg.trim()}\n</blockquote>\n\n` +
        `🕒 <b>Vaqt:</b> <code>${new Date().toLocaleString('uz-UZ')}</code>`;
      const bannerUrl = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80';
      const res = await sendPhotoToTelegramApi(settingsForm.telegramBotToken, settingsForm.telegramChatId, bannerUrl, caption);
      if (res.success) {
        soundFx.playSuccessFanfare();
        showToast("Xabar va rasm Telegramga muvaffaqiyatli yuborildi!", "success");
        setCustomBroadcastMsg('');
      } else {
        showToast(res.message || "Xabar yuborishda xatolik", "error");
      }
    } catch (e) {
      showToast(e.message || "Xatolik yuz berdi", "error");
    } finally {
      setSendingBroadcast(false);
    }
  };

  // --- SAVE SETTINGS ---
  const handleSaveSettings = () => {
    soundFx.playSuccessFanfare();
    saveStoredSettings(settingsForm);
    showToast("Sozlamalar muvaffaqiyatli saqlandi!", "success");
  };

  // --- TEST SUPABASE CONNECTION ---
  const handleTestSupabase = async () => {
    soundFx.playPop();
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      const res = await testSupabaseConnection(settingsForm.supabaseUrl, settingsForm.supabaseAnonKey);
      setSupabaseTestResult(res);
      if (res.success) {
        soundFx.playSuccessFanfare();
        showToast(res.message || "Supabase ulanishi muvaffaqiyatli!", "success");
      } else {
        showToast(res.message || "Supabase ulanishida xatolik", "error");
      }
    } catch (err) {
      setSupabaseTestResult({ success: false, message: err.message });
      showToast(err.message || "Supabase ulanishida xatolik", "error");
    } finally {
      setTestingSupabase(false);
    }
  };

  // --- SYNC SUPABASE ---
  const handleSyncSupabase = async () => {
    soundFx.playPop();
    setSyncingSupabase(true);
    try {
      saveStoredSettings(settingsForm);
      const res = await syncMenuWithSupabase(menuItems);
      if (res.synced) {
        soundFx.playSuccessFanfare();
        showToast("Taomnoma Supabase bazasiga yuklandi!", "success");
      } else {
        showToast(res.reason || "Supabase ulanishida xatolik", "error");
      }
    } catch (err) {
      showToast(err.message || "Supabase xatosi", "error");
    } finally {
      setSyncingSupabase(false);
    }
  };

  // --- EXPORT JSON BACKUP ---
  const handleExportJSON = () => {
    soundFx.playChime();
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

  // --- EXPORT ORDERS AS EXCEL/CSV ---
  const handleExportOrdersCSV = () => {
    soundFx.playChime();
    const headers = ['Order ID', 'Customer Name', 'Customer Phone', 'Service Type', 'Table / Address', 'Total Price', 'Status', 'Payment Method', 'Date'];
    const rows = orders.map(o => [
      `"${o.id || ''}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.deliveryType === 'dineIn' ? 'Dine-in' : 'Delivery'}"`,
      `"${(o.deliveryType === 'dineIn' ? `Table ${o.tableNumber || '-'}` : (o.deliveryAddress || '')).replace(/"/g, '""')}"`,
      o.totalPrice || o.totalAmount || 0,
      `"${o.status || ''}"`,
      `"${o.paymentMethod || 'card'}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zafaron_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'ru' ? 'Заказы успешно экспортированы в Excel (CSV)!' : lang === 'en' ? 'Orders exported to Excel (CSV) successfully!' : "Buyurtmalar Excel (CSV) formatida yuklab olindi!", 'success');
  };

  // Categories list
  const categories = [
    { id: 'all', label: t('categories.all') || (lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi') },
    { id: 'national', label: t('categories.national') || (lang === 'ru' ? 'Национальные блюда' : lang === 'en' ? 'National Cuisine' : 'Milliy taomlar') },
    { id: 'european', label: t('categories.european') || (lang === 'ru' ? 'Европейская кухня & Стейки' : lang === 'en' ? 'European & Steaks' : 'Yevropa & Steyk') },
    { id: 'salads', label: t('categories.salads') || (lang === 'ru' ? 'Салаты' : lang === 'en' ? 'Salads' : 'Salatlar') },
    { id: 'kebabs', label: t('categories.kebabs') || (lang === 'ru' ? 'Шашлык и Гриль' : lang === 'en' ? 'Kebabs & Grill' : 'Kabob & Gril') },
    { id: 'mains', label: t('categories.mains') || (lang === 'ru' ? 'Горячие блюда' : lang === 'en' ? 'Main Courses' : 'Issiq taomlar') },
    { id: 'desserts', label: t('categories.desserts') || (lang === 'ru' ? 'Десерты' : lang === 'en' ? 'Desserts' : 'Shirinliklar') },
    { id: 'drinks', label: t('categories.drinks') || (lang === 'ru' ? 'Напитки' : lang === 'en' ? 'Beverages' : 'Ichimliklar') },
  ];

  // Filtered menu
  const filteredDishes = menuItems.filter(dish => {
    if (menuCategoryFilter !== 'all') {
      if (menuCategoryFilter === 'mains' || menuCategoryFilter === 'european') {
        if (dish.category !== 'mains' && dish.category !== 'european') return false;
      } else if (dish.category !== menuCategoryFilter) {
        return false;
      }
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      const n = (typeof dish.name === 'object' ? (dish.name.uz + dish.name.ru + dish.name.en) : dish.name).toLowerCase();
      if (!n.includes(q)) return false;
    }
    return true;
  });

  // Filtered orders with search
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchesId = o.id?.toLowerCase().includes(q);
      const matchesCustomer = o.customerName?.toLowerCase().includes(q);
      const matchesPhone = o.customerPhone?.toLowerCase().includes(q);
      if (!matchesId && !matchesCustomer && !matchesPhone) return false;
    }
    return true;
  });

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    if (reservationStatusFilter !== 'all' && r.status !== reservationStatusFilter) return false;
    if (reservationSearch.trim()) {
      const q = reservationSearch.toLowerCase();
      const matchesId = r.id?.toLowerCase().includes(q);
      const matchesName = r.fullName?.toLowerCase().includes(q);
      const matchesPhone = r.phone?.toLowerCase().includes(q);
      const matchesTable = String(r.tableNumber || '').toLowerCase().includes(q);
      const zoneStr = typeof r.zone === 'object' ? (r.zone.uz + r.zone.ru + r.zone.en) : String(r.zone || '');
      const matchesZone = zoneStr.toLowerCase().includes(q);
      if (!matchesId && !matchesName && !matchesPhone && !matchesTable && !matchesZone) return false;
    }
    return true;
  });

  const handleTabChange = (tabId) => {
    soundFx.playPop();
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* ADMIN TOPBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playPop();
                setIsAdminView(false);
              }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:text-gold-500 hover:bg-gold-500/10 transition-colors"
              title="Saytga qaytish"
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
                  ZAFARON PRO
                </span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">
                  Executive Suite
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'dashboard', label: t('admin.dashboard') || (lang === 'ru' ? 'Дашборд' : lang === 'en' ? 'Dashboard' : 'Boshqaruv'), icon: LayoutDashboard },
              { id: 'kds', label: `${lang === 'ru' ? 'Кухня' : lang === 'en' ? 'Kitchen' : 'Oshxona'} (${pendingOrdersCount})`, icon: ChefHat, badge: pendingOrdersCount > 0 },
              { id: 'menu', label: t('admin.menuManagement') || (lang === 'ru' ? 'Меню' : lang === 'en' ? 'Menu' : 'Taomnoma'), icon: UtensilsCrossed },
              { id: 'orders', label: `${t('admin.orders') || (lang === 'ru' ? 'Заказы' : lang === 'en' ? 'Orders' : 'Buyurtmalar')} (${orders.length})`, icon: ShoppingBag },
              { id: 'reservations', label: `${t('admin.reservations') || (lang === 'ru' ? 'Брони' : lang === 'en' ? 'Reservations' : 'Bandlik')} (${activeReservationsCount})`, icon: CalendarDays },
              { id: 'settings', label: t('admin.settings') || (lang === 'ru' ? 'Настройки' : lang === 'en' ? 'Settings' : 'Sozlamalar'), icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'gold-gradient-bg text-dark-950 shadow-md font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1.5 right-1.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Print Report, Language, Theme, Fullscreen, Back to Public */}
          <div className="flex items-center gap-2">
            {/* Quick Shift Report Print */}
            <button
              onClick={() => {
                soundFx.playChime();
                setIsDailyReportOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-dark-950 text-xs font-bold transition-all shadow-sm"
              title={lang === 'ru' ? 'Ежедневный отчет смены' : lang === 'en' ? 'Daily Shift Report' : 'Kunlik Kassa Hisoboti'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Отчет' : lang === 'en' ? 'Report' : 'Hisobot'}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  soundFx.playPop();
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 hover:border-gold-500 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors shadow-sm"
                title="Tilni tanlash / Выбор языка / Language"
              >
                <Globe className="w-3.5 h-3.5 text-gold-500" />
                <span className="font-bold">{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 animate-fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        soundFx.playPop();
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-gold-500/10 hover:text-gold-500 transition-colors ${
                        lang === l.code ? 'font-bold text-gold-500 bg-gold-500/5' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span>{l.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                soundFx.playPop();
                toggleTheme();
              }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors shadow-sm"
              title={lang === 'ru' ? 'Сменить тему (Светлая / Темная)' : lang === 'en' ? 'Toggle theme (Light / Dark)' : 'Mavzuni almashtirish'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => {
                soundFx.playPop();
                toggleFullscreen();
              }}
              aria-label="Toggle fullscreen"
              title={isFullscreen ? (lang === 'ru' ? 'Выйти из полноэкранного режима' : lang === 'en' ? 'Exit fullscreen' : "To'liq ekrandan chiqish (Esc)") : (lang === 'ru' ? 'Полноэкранный режим' : lang === 'en' ? 'Fullscreen mode' : "To'liq ekran rejimi")}
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
              onClick={() => {
                soundFx.playPop();
                setIsAdminView(false);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gold-500 hover:text-gold-500 shadow-sm transition-colors"
            >
              <span>{t('admin.backToSite') || (lang === 'ru' ? 'Сайт' : lang === 'en' ? 'Site' : 'Sayt')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Authenticated Supabase User Badge */}
            {user?.email && (
              <span className="hidden md:inline-flex items-center px-2.5 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-[11px] font-semibold text-gold-400 truncate max-w-[170px]" title={user.email}>
                👤 {user.email}
              </span>
            )}

            {/* Supabase Admin Logout Button */}
            <button
              onClick={() => {
                soundFx.playPop();
                logout();
                setIsAdminView(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs font-bold text-red-400 hover:text-red-300 transition-colors shadow-sm"
              title="Admin paneldan to'liq chiqish (Supabase SignOut)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-none">
          {[
            { id: 'dashboard', label: t('admin.dashboard') || (lang === 'ru' ? 'Дашборд' : lang === 'en' ? 'Dashboard' : 'Boshqaruv'), icon: LayoutDashboard },
            { id: 'kds', label: `${lang === 'ru' ? 'Кухня' : lang === 'en' ? 'Kitchen' : 'Oshxona'} (${pendingOrdersCount})`, icon: ChefHat },
            { id: 'menu', label: t('admin.menuManagement') || (lang === 'ru' ? 'Меню' : lang === 'en' ? 'Menu' : 'Taomnoma'), icon: UtensilsCrossed },
            { id: 'orders', label: `${t('admin.orders') || (lang === 'ru' ? 'Заказы' : lang === 'en' ? 'Orders' : 'Buyurtmalar')} (${orders.length})`, icon: ShoppingBag },
            { id: 'reservations', label: `${t('admin.reservations') || (lang === 'ru' ? 'Брони' : lang === 'en' ? 'Reservations' : 'Bandlik')} (${activeReservationsCount})`, icon: CalendarDays },
            { id: 'settings', label: t('admin.settings') || (lang === 'ru' ? 'Настройки' : lang === 'en' ? 'Settings' : 'Sozlamalar'), icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  isActive
                    ? 'gold-gradient-bg text-dark-950 shadow-sm'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN ADMIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Revenue */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.todayRevenue') || (lang === 'ru' ? 'Выручка' : lang === 'en' ? 'Revenue' : 'Jami Tushum')}</span>
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl gold-gradient-text truncate">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? '+18.4% рост за неделю' : lang === 'en' ? '+18.4% growth trend' : "+18.4% o'sish tendentsiyasi"}</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.orders') || (lang === 'ru' ? 'Заказы' : lang === 'en' ? 'Orders' : 'Buyurtmalar')}</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {orders.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold">
                  <span>{pendingOrdersCount} {lang === 'ru' ? 'в процессе на кухне' : lang === 'en' ? 'active in kitchen' : 'ta oshxonada faol'}</span>
                </div>
              </div>

              {/* Reservations */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t('admin.reservations') || (lang === 'ru' ? 'Брони Столов' : lang === 'en' ? 'Reservations' : 'Stol Bandliklari')}</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {reservations.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                  <span>{activeReservationsCount} {lang === 'ru' ? 'подтверждено/новых' : lang === 'en' ? 'confirmed/new' : 'ta tasdiqlangan/yangi'}</span>
                </div>
              </div>

              {/* Average Ticket Size */}
              <div className="glass-card p-5 rounded-3xl space-y-2 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{lang === 'ru' ? 'Средний Чек' : lang === 'en' ? 'Average Check' : "O'rtacha Chek"}</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white truncate">
                  {formatPrice(averageCheck)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                  <span>{menuItems.length} {lang === 'ru' ? 'позиций в меню' : lang === 'en' ? 'items in menu' : 'ta taom menyuda'}</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Weekly Dynamic Chart + Top Dishes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Analytics Bar: 8 cols */}
              <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                    {t('admin.weeklyRevenue') || (lang === 'ru' ? 'Динамика Выручки' : lang === 'en' ? 'Weekly Revenue Dynamics' : 'Haftalik Tushum Dinamikasi')}
                  </h3>
                  <button
                    onClick={() => setIsDailyReportOpen(true)}
                    className="text-xs text-gold-500 font-bold hover:underline flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === 'ru' ? 'Распечатать отчет смены' : lang === 'en' ? 'Print shift report' : 'Kunlik hisobotni chiqarish'}</span>
                  </button>
                </div>

                {/* Simulated Visual Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-gray-100 dark:border-white/5">
                  {(() => {
                    const daysMap = {
                      uz: ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'],
                      ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    };
                    const dayLabels = daysMap[lang] || daysMap.uz;
                    const chartData = [
                      { h: '55%', amount: '1.8M' },
                      { h: '70%', amount: '2.4M' },
                      { h: '60%', amount: '2.1M' },
                      { h: '85%', amount: '3.2M' },
                      { h: '95%', amount: '4.5M' },
                      { h: '100%', amount: '5.2M' },
                      { h: '90%', amount: '4.1M' },
                    ];
                    return chartData.map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
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
                          {dayLabels[i]}
                        </span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>
                    {lang === 'ru'
                      ? 'Самые активные дни: Пятница и Суббота (Живая музыка)'
                      : lang === 'en'
                      ? 'Busiest days: Friday & Saturday (Live music)'
                      : 'Eng gavjum kunlar: Juma va Shanba (Jonli musiqa)'}
                  </span>
                  <span className="font-bold text-gold-500">
                    {lang === 'ru' ? 'Средний чек' : lang === 'en' ? 'Average check' : "O'rtacha chek"}: {formatPrice(averageCheck)}
                  </span>
                </div>
              </div>

              {/* Popular Dishes: 4 cols */}
              <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {lang === 'ru' ? 'Популярные Блюда' : lang === 'en' ? 'Top Selling Dishes' : 'Eng Xaridorgir Taomlar'}
                </h3>

                <div className="space-y-3">
                  {menuItems.slice(0, 4).map((dish, idx) => (
                    <div key={dish.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-white/5">
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
                          {formatPrice(dish.price)}
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
                  {lang === 'ru' ? 'Последние Заказы' : lang === 'en' ? 'Recent Orders' : 'Oxirgi Buyurtmalar'}
                </h3>
                <button
                  onClick={() => handleTabChange('orders')}
                  className="text-xs text-gold-500 font-bold hover:underline"
                >
                  {lang === 'ru' ? 'Посмотреть все заказы →' : lang === 'en' ? 'View all orders →' : "Barcha buyurtmalarni ko'rish →"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 text-xs uppercase">
                      <th className="pb-3 font-semibold">{lang === 'ru' ? 'Заказ' : lang === 'en' ? 'Order' : 'Buyurtma'}</th>
                      <th className="pb-3 font-semibold">{lang === 'ru' ? 'Клиент' : lang === 'en' ? 'Customer' : 'Mijoz'}</th>
                      <th className="pb-3 font-semibold">{lang === 'ru' ? 'Тип' : lang === 'en' ? 'Type' : 'Turi'}</th>
                      <th className="pb-3 font-semibold">{lang === 'ru' ? 'Сумма' : lang === 'en' ? 'Total' : 'Summa'}</th>
                      <th className="pb-3 font-semibold">{lang === 'ru' ? 'Статус' : lang === 'en' ? 'Status' : 'Holati'}</th>
                      <th className="pb-3 font-semibold text-right">{lang === 'ru' ? 'Действие' : lang === 'en' ? 'Action' : 'Amal'}</th>
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
                          {o.deliveryType === 'dineIn'
                            ? (lang === 'ru' ? `🍽 Стол: ${o.tableNumber || '-'}` : lang === 'en' ? `🍽 Table: ${o.tableNumber || '-'}` : `🍽 Stol: ${o.tableNumber || '-'}`)
                            : (lang === 'ru' ? '🛵 Доставка' : lang === 'en' ? '🛵 Delivery' : '🛵 Yetkazish')}
                        </td>
                        <td className="py-3 font-bold">
                          {formatPrice(o.totalPrice || o.totalAmount || 0)}
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
                            {o.status === 'pending'
                              ? (lang === 'ru' ? 'Ожидание' : lang === 'en' ? 'Pending' : 'Kutilmoqda')
                              : o.status === 'cooking'
                              ? (lang === 'ru' ? 'Готовится' : lang === 'en' ? 'Cooking' : 'Tayyorlanmoqda')
                              : o.status === 'delivering'
                              ? (lang === 'ru' ? 'Доставка' : lang === 'en' ? 'Delivering' : 'Yetkazilmoqda')
                              : o.status === 'completed'
                              ? (lang === 'ru' ? 'Доставлен' : lang === 'en' ? 'Completed' : 'Yetkazildi')
                              : o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrderForReceipt(o);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-dark-800 hover:text-gold-500 font-semibold mr-1"
                            title={lang === 'ru' ? 'Печать товарного чека' : lang === 'en' ? 'Print receipt' : "Chekni chop etish"}
                          >
                            <Printer className="w-3.5 h-3.5 inline mr-1" />
                            {lang === 'ru' ? 'Чек' : lang === 'en' ? 'Receipt' : 'Chek'}
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

        {/* ================= TAB 2: KITCHEN DISPLAY (KDS) ================= */}
        {activeTab === 'kds' && (
          <KitchenDisplay
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            formatPrice={formatPrice}
            getLocalized={getLocalized}
          />
        )}

        {/* ================= TAB 3: MENU MANAGEMENT ================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.menuManagement') || (lang === 'ru' ? 'Управление Меню' : lang === 'en' ? 'Menu Management' : 'Taomnoma Boshqaruvi')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {lang === 'ru' ? 'Добавление, редактирование блюд, изменение цен и управление наличием' : lang === 'en' ? 'Add, edit dishes, adjust pricing and manage availability' : "Taomlarni qo'shish, tahrirlash, narxlarini o'zgartirish va sotuv holatini boshqarish"}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleOpenAddDish}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.addNewDish') || (lang === 'ru' ? '+ Добавить блюдо' : lang === 'en' ? '+ Add Dish' : "Yangi Taom Qo'shish")}</span>
                </button>
              </div>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3 border border-gray-200 dark:border-white/10">
              <div className="relative flex-1 w-full">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder={lang === 'ru' ? 'Поиск блюда по названию...' : lang === 'en' ? 'Search dishes by name...' : "Taom nomi bo'yicha qidirish..."}
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                  className="glass-input w-full !pl-11 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      soundFx.playPop();
                      setMenuCategoryFilter(c.id);
                    }}
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
                        {dish.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          toggleDishAvailability(dish.id);
                        }}
                        className={`p-1.5 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 ${
                          dish.isAvailable !== false
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                        title={lang === 'ru' ? 'Изменить наличие блюда' : lang === 'en' ? 'Toggle availability' : "Sotuv holatini o'zgartirish"}
                      >
                        {dish.isAvailable !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white/90 bg-dark-950/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <span>{dish.prepTime || 20} {lang === 'ru' ? 'мин.' : lang === 'en' ? 'min' : 'daq.'}</span>
                      <span>{dish.calories || 500} {lang === 'ru' ? 'ккал' : lang === 'en' ? 'kcal' : 'kkal'}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                        {getLocalized(dish.name)}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {getLocalized(dish.description)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <span className="font-serif font-black text-lg gold-gradient-text">
                        {formatPrice(dish.price)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditDish(dish)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:text-gold-500 hover:bg-gold-500/10 transition-colors"
                          title={lang === 'ru' ? 'Редактировать' : lang === 'en' ? 'Edit' : 'Tahrirlash'}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            soundFx.playPop();
                            if (window.confirm(lang === 'ru' ? 'Удалить это блюдо из меню?' : lang === 'en' ? 'Delete this dish from menu?' : "Taomni menyudan o'chirmoqchimisiz?")) {
                              deleteDish(dish.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title={lang === 'ru' ? 'Удалить' : lang === 'en' ? 'Delete' : "O'chirish"}
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

        {/* ================= TAB 4: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.orders') || (lang === 'ru' ? 'Управление Заказами' : lang === 'en' ? 'Orders Management' : 'Buyurtmalar Boshqaruvi')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {lang === 'ru' ? 'Все поступившие заказы, их статусы и отправка в Telegram' : lang === 'en' ? 'Incoming customer orders, preparation statuses and Telegram integration' : 'Barcha kelib tushgan buyurtmalar, ularning holatlari va Telegram integratsiyasi'}
                </p>
              </div>

              {/* Action buttons & Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Excel (CSV) formatida barcha buyurtmalarni yuklab olish"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Экспорт в Excel (CSV)' : lang === 'en' ? 'Export Excel (CSV)' : 'Excel (CSV) Eksport'}</span>
                </button>

                {['all', 'pending', 'cooking', 'delivering', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      soundFx.playPop();
                      setOrderStatusFilter(st);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      orderStatusFilter === st
                        ? 'gold-gradient-bg text-dark-950 font-black'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {st === 'all'
                      ? (lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi')
                      : st === 'pending'
                      ? (lang === 'ru' ? 'Ожидание' : lang === 'en' ? 'Pending' : 'Kutilmoqda')
                      : st === 'cooking'
                      ? (lang === 'ru' ? 'Готовится' : lang === 'en' ? 'Cooking' : 'Tayyorlanmoqda')
                      : st === 'delivering'
                      ? (lang === 'ru' ? 'Доставка' : lang === 'en' ? 'Delivering' : 'Yetkazilmoqda')
                      : st === 'completed'
                      ? (lang === 'ru' ? 'Завершен' : lang === 'en' ? 'Completed' : 'Yakunlandi')
                      : (lang === 'ru' ? 'Отменен' : lang === 'en' ? 'Cancelled' : 'Bekor')}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input for Orders */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={lang === 'ru' ? 'Поиск по номеру заказа, имени клиента или телефону...' : lang === 'en' ? 'Search by order ID, customer name or phone...' : "Buyurtma ID raqami, mijoz ismi yoki telefon raqami bo'yicha qidirish..."}
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                className="glass-input w-full !pl-11 text-xs sm:text-sm"
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-3xl text-gray-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-400" />
                <h4 className="font-serif font-bold text-lg text-gray-700 dark:text-gray-300">
                  {lang === 'ru' ? 'В этой категории нет заказов' : lang === 'en' ? 'No orders in this category' : 'Ushbu toifada buyurtmalar mavjud emas'}
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
                          onChange={(e) => {
                            soundFx.playChime();
                            updateOrderStatus(order.id, e.target.value);
                          }}
                          className="glass-input text-xs py-1 px-2.5 rounded-lg font-bold cursor-pointer"
                        >
                          <option value="pending">{lang === 'ru' ? 'Ожидание' : lang === 'en' ? 'Pending' : 'Kutilmoqda'}</option>
                          <option value="cooking">{lang === 'ru' ? 'Готовится' : lang === 'en' ? 'Cooking' : 'Tayyorlanmoqda'}</option>
                          <option value="delivering">{lang === 'ru' ? 'Доставка' : lang === 'en' ? 'Delivering' : 'Yetkazilmoqda'}</option>
                          <option value="completed">{lang === 'ru' ? 'Завершен' : lang === 'en' ? 'Completed' : 'Yakunlandi'}</option>
                          <option value="cancelled">{lang === 'ru' ? 'Отменен' : lang === 'en' ? 'Cancelled' : 'Bekor qilindi'}</option>
                        </select>
                      </div>

                      {/* Customer Info */}
                      <div className="py-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{lang === 'ru' ? 'Клиент:' : lang === 'en' ? 'Customer:' : 'Mijoz:'}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{order.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{lang === 'ru' ? 'Телефон:' : lang === 'en' ? 'Phone:' : 'Telefon:'}</span>
                          <a href={`tel:${order.customerPhone}`} className="text-gold-500 font-semibold hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{lang === 'ru' ? 'Тип:' : lang === 'en' ? 'Service:' : 'Xizmat:'}</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {order.deliveryType === 'dineIn'
                              ? (lang === 'ru' ? `🍽 Стол: ${order.tableNumber || '-'}` : lang === 'en' ? `🍽 Table: ${order.tableNumber || '-'}` : `🍽 Stol: ${order.tableNumber || '-'}`)
                              : (lang === 'ru' ? `🛵 ${order.deliveryAddress || 'Доставка'}` : lang === 'en' ? `🛵 ${order.deliveryAddress || 'Delivery'}` : `🛵 ${order.deliveryAddress || 'Dostavka'}`)}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-100 dark:border-white/5 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          {lang === 'ru' ? 'Заказанные блюда:' : lang === 'en' ? 'Ordered items:' : 'Buyurtma qilingan taomlar:'}
                        </span>
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>
                              {getLocalized(it.name)} x {it.quantity}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(it.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total, Payment & Receipt Print */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">{lang === 'ru' ? 'Итоговая сумма' : lang === 'en' ? 'Total amount' : 'Jami summa'}</span>
                        <span className="font-serif font-black text-lg text-gray-900 dark:text-white">
                          {formatPrice(order.totalPrice || order.totalAmount || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderForReceipt(order);
                          }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:text-gold-500 hover:bg-gold-500/10 transition-colors"
                          title={lang === 'ru' ? 'Печать товарного чека' : lang === 'en' ? 'Print receipt' : "Chekni ko'rish va chop etish"}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 font-medium">
                          {order.paymentMethod === 'card'
                            ? (lang === 'ru' ? '💳 Карта' : lang === 'en' ? '💳 Card' : '💳 Karta')
                            : (lang === 'ru' ? '💵 Наличные' : lang === 'en' ? '💵 Cash' : '💵 Naqd')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: RESERVATIONS & FLOOR PLAN ================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  {t('admin.reservations') || (lang === 'ru' ? 'Брони Столов & Залы' : lang === 'en' ? 'Reservations & Floor Plan' : 'Stol Bandliklari & Zallar Nazorati')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {lang === 'ru' ? 'Брони столиков, VIP залы и интерактивная карта занятости столов' : lang === 'en' ? 'Table bookings, VIP chambers and real-time floor occupancy map' : "Stol bandliklari, VIP xonalar va stollarning real vaqtdagi bandlik xaritasi"}
                </p>
              </div>

              {/* Sub-tab: List vs Floor Plan */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setReservationSubTab('list');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reservationSubTab === 'list'
                      ? 'gold-gradient-bg text-dark-950 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {lang === 'ru' ? 'Список броней' : lang === 'en' ? 'Reservations List' : "Bandliklar Ro'yxati"}
                </button>
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setReservationSubTab('floorplan');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reservationSubTab === 'floorplan'
                      ? 'gold-gradient-bg text-dark-950 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  🗺️ {lang === 'ru' ? 'Карта столов (Залы)' : lang === 'en' ? 'Floor Plan (Chambers)' : 'Jonli Stollar Xaritasi'}
                </button>
              </div>
            </div>

            {reservationSubTab === 'floorplan' ? (
              <TableOccupancyManager reservations={reservations} />
            ) : (
              <>
                {/* Search Input for Reservations */}
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={lang === 'ru' ? 'Поиск по номеру брони, имени гостя, телефону или номеру стола...' : lang === 'en' ? 'Search by booking ID, guest name, phone or table #...' : "Bron ID, mehmon ismi, telefon yoki stol raqami bo'yicha qidirish..."}
                    value={reservationSearch}
                    onChange={(e) => setReservationSearch(e.target.value)}
                    style={{ paddingLeft: '2.75rem' }}
                    className="glass-input w-full !pl-11 text-xs sm:text-sm"
                  />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['all', 'new', 'confirmed', 'finished', 'cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        soundFx.playPop();
                        setReservationStatusFilter(st);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                        reservationStatusFilter === st
                          ? 'gold-gradient-bg text-dark-950 font-black'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {st === 'all'
                        ? (lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi')
                        : st === 'new'
                        ? (lang === 'ru' ? 'Новые' : lang === 'en' ? 'New' : 'Yangi')
                        : st === 'confirmed'
                        ? (lang === 'ru' ? 'Подтвержденные' : lang === 'en' ? 'Confirmed' : 'Tasdiqlangan')
                        : st === 'finished'
                        ? (lang === 'ru' ? 'Прибыли' : lang === 'en' ? 'Arrived' : 'Keldilar')
                        : (lang === 'ru' ? 'Отмененные' : lang === 'en' ? 'Cancelled' : 'Bekor')}
                    </button>
                  ))}
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
                            {res.status === 'confirmed'
                              ? (lang === 'ru' ? 'Подтвержден' : lang === 'en' ? 'Confirmed' : 'Tasdiqlangan')
                              : res.status === 'new'
                              ? (lang === 'ru' ? 'Новый' : lang === 'en' ? 'New' : 'Yangi')
                              : res.status === 'finished'
                              ? (lang === 'ru' ? 'Прибыли' : lang === 'en' ? 'Arrived' : 'Keldilar')
                              : (lang === 'ru' ? 'Отменен' : lang === 'en' ? 'Cancelled' : 'Bekor')}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">{lang === 'ru' ? 'Гость:' : lang === 'en' ? 'Guest:' : 'Mehmon:'}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{res.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{lang === 'ru' ? 'Телефон:' : lang === 'en' ? 'Phone:' : 'Telefon:'}</span>
                            <a href={`tel:${res.phone}`} className="text-gold-500 font-semibold hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {res.phone}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{lang === 'ru' ? 'Дата и Время:' : lang === 'en' ? 'Date & Time:' : 'Sana & Vaqt:'}</span>
                            <span className="font-bold text-gold-500">{res.date} • {res.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{lang === 'ru' ? 'Количество гостей:' : lang === 'en' ? 'Number of guests:' : 'Mehmonlar soni:'}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {res.guests} {lang === 'ru' ? 'чел.' : lang === 'en' ? 'guests' : 'kishi'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{lang === 'ru' ? 'Зал / Стол:' : lang === 'en' ? 'Hall / Table:' : 'Zal / Stol:'}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {res.zone} {res.tableNumber && `(${lang === 'ru' ? 'Стол' : lang === 'en' ? 'Table' : 'Stol'} #${res.tableNumber})`}
                            </span>
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
                            onClick={() => {
                              soundFx.playChime();
                              updateReservationStatus(res.id, 'confirmed');
                            }}
                            className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-bold text-xs transition-colors"
                          >
                            {lang === 'ru' ? 'Подтвердить' : lang === 'en' ? 'Confirm' : 'Tasdiqlash'}
                          </button>
                        )}
                        {res.status !== 'finished' && (
                          <button
                            onClick={() => {
                              soundFx.playSuccessFanfare();
                              updateReservationStatus(res.id, 'finished');
                            }}
                            className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors"
                          >
                            {lang === 'ru' ? 'Прибыли' : lang === 'en' ? 'Arrived' : 'Keldilar'}
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              soundFx.playPop();
                              updateReservationStatus(res.id, 'cancelled');
                            }}
                            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold text-xs transition-colors"
                          >
                            {lang === 'ru' ? 'Отмена' : lang === 'en' ? 'Cancel' : 'Bekor'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 6: SETTINGS & TELEGRAM BROADCAST ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white">
                {t('admin.settings') || (lang === 'ru' ? 'Настройки Системы & Интеграции' : lang === 'en' ? 'System Settings & Integrations' : 'Tizim Sozlamalari & Integratsiyalar')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {lang === 'ru' ? 'Telegram бот (Chat ID 8170197389), база данных Supabase и резервные копии данных' : lang === 'en' ? 'Telegram Bot (Chat ID 8170197389), Supabase cloud database and local backups' : "Telegram Bot (Chat ID 8170197389), Supabase ma'lumotlar bazasi va zaxira nusxalar"}
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
                      {t('admin.telegramBotConfig') || (lang === 'ru' ? 'Интеграция Telegram Бота' : lang === 'en' ? 'Telegram Bot Integration' : 'Telegram Xabarnoma Tizimi')}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {lang === 'ru' ? 'Все новые заказы и брони столиков мгновенно отправляются в Telegram' : lang === 'en' ? 'All incoming orders and reservations will be dispatched to Telegram' : "Barcha yangi buyurtmalar va stol bandliklari ushbu bot orqali guruhga boradi"}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  ID: 8170197389 (Faol)
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Telegram Bot Token
                  </label>
                  <input
                    type="password"
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                    value={settingsForm.telegramBotToken || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {lang === 'ru' ? 'Токен бота, созданный через @BotFather' : lang === 'en' ? 'Bot token created via @BotFather' : '@BotFather orqali yaratilgan bot tokeni'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Telegram Chat ID
                  </label>
                  <input
                    type="text"
                    placeholder="8170197389"
                    value={settingsForm.telegramChatId ?? ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {lang === 'ru' ? 'Ваш Telegram ID: ' : lang === 'en' ? 'Your Telegram ID: ' : 'Sizning Telegram ID raqamingiz: '}<b>8170197389</b>
                  </span>
                </div>

                {/* Direct Custom Broadcast Message to Telegram */}
                <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 space-y-2.5">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">
                    {lang === 'ru' ? 'Прямая отправка сообщения в Telegram (Live Test)' : lang === 'en' ? 'Direct message to Telegram (Live Test)' : "Telegramga to'g'ridan-to'g'ri xabar yuborish (Live Test)"}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'ru' ? 'Введите сообщение для Telegram...' : lang === 'en' ? 'Type a test message for Telegram...' : "Telegramga yubormoqchi bo'lgan xabaringizni yozing..."}
                      value={customBroadcastMsg}
                      onChange={(e) => setCustomBroadcastMsg(e.target.value)}
                      className="glass-input flex-1 text-xs"
                    />
                    <button
                      onClick={handleSendCustomBroadcast}
                      disabled={sendingBroadcast || !customBroadcastMsg.trim() || !settingsForm.telegramBotToken}
                      className="px-4 py-2 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingBroadcast ? (lang === 'ru' ? 'Отправка...' : lang === 'en' ? 'Sending...' : 'Yuborilmoqda...') : (lang === 'ru' ? 'Отправить' : lang === 'en' ? 'Send' : 'Yuborish')}</span>
                    </button>
                  </div>
                </div>

                {botTestResult && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    botTestResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {botTestResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <span>{botTestResult.message || (botTestResult.success ? (lang === 'ru' ? 'Связь с Telegram ботом успешно установлена!' : lang === 'en' ? 'Connection to Telegram Bot established successfully!' : "Telegram Bot bilan aloqa muvaffaqiyatli o'rnatildi!") : (lang === 'ru' ? 'Ошибка' : lang === 'en' ? 'Error' : 'Xatolik'))}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleTestBot}
                    disabled={testingBot || !settingsForm.telegramBotToken || !settingsForm.telegramChatId}
                    className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4 text-gold-500" />
                    <span>{testingBot ? (lang === 'ru' ? 'Отправка...' : lang === 'en' ? 'Sending...' : 'Yuborilmoqda...') : (lang === 'ru' ? 'Тестировать Бота' : lang === 'en' ? 'Test Bot' : 'Botni Test Qilish')}</span>
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{lang === 'ru' ? 'Сохранить Настройки' : lang === 'en' ? 'Save Settings' : 'Sozlamalarni Saqlash'}</span>
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
                    {lang === 'ru' ? 'База Данных Supabase' : lang === 'en' ? 'Supabase Database' : "Supabase Ma'lumotlar Bazasi"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {lang === 'ru' ? 'Синхронизация в реальном времени через облачную БД' : lang === 'en' ? 'Real-time synchronization via cloud database' : "Bulutli ma'lumotlar bazasi orqali real vaqtda sinxronlash"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Supabase URL
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
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={settingsForm.supabaseAnonKey || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                    className="glass-input w-full font-mono text-xs sm:text-sm"
                  />
                </div>

                {supabaseTestResult && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    supabaseTestResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {supabaseTestResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <span>{supabaseTestResult.message}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleTestSupabase}
                    disabled={testingSupabase || !settingsForm.supabaseUrl || !settingsForm.supabaseAnonKey}
                    className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Database className="w-4 h-4 text-emerald-500" />
                    <span>{testingSupabase ? (lang === 'ru' ? 'Проверка...' : lang === 'en' ? 'Checking...' : 'Tekshirilmoqda...') : (lang === 'ru' ? 'Проверить Подключение' : lang === 'en' ? 'Check Connection' : 'Ulanishni Tekshirish')}</span>
                  </button>

                  <button
                    onClick={handleSyncSupabase}
                    disabled={syncingSupabase}
                    className="px-6 py-3 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{syncingSupabase ? (lang === 'ru' ? 'Синхронизация...' : lang === 'en' ? 'Syncing...' : 'Sinxronlanmoqda...') : (lang === 'ru' ? 'Синхронизировать с Supabase' : lang === 'en' ? 'Sync to Supabase' : 'Supabase Bazasiga Yuklash')}</span>
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gold-500 text-xs font-bold text-gray-800 dark:text-gray-200"
                  >
                    {lang === 'ru' ? 'Сохранить' : lang === 'en' ? 'Save' : 'Saqlash'}
                  </button>
                </div>
              </div>
            </div>

            {/* Backup & System Reset */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {lang === 'ru' ? 'Резервное Копирование и Управление' : lang === 'en' ? 'Backup & Data Management' : "Zaxira va Ma'lumotlarni Boshqarish"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'ru' ? 'Резервное копирование меню и заказов или сброс до заводских' : lang === 'en' ? 'Backup menu and order history or reset to factory defaults' : 'Barcha taomnoma va buyurtmalar tarixini zaxiralash yoki dastlabki holatga qaytarish'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleExportJSON}
                  className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-dark-800 hover:border-gold-500 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-gold-500" />
                  <span>{lang === 'ru' ? 'Скачать Резервную Копию (JSON)' : lang === 'en' ? 'Download Backup (JSON)' : 'Zaxira Nusxasi (JSON) Yuklab Olish'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    const confirmMsg = lang === 'ru' ? 'Сбросить все меню до заводских настроек по умолчанию?' : lang === 'en' ? 'Reset all menu dishes to default state?' : "Barcha taomnoma standart holatga qaytarilsinmi?";
                    if (window.confirm(confirmMsg)) {
                      resetToDefaultMenu();
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-xs font-bold text-red-500 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{lang === 'ru' ? 'Сбросить Меню по Умолчанию' : lang === 'en' ? 'Reset to Default Menu' : 'Dastlabki Menyu Holatiga Qaytish'}</span>
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

          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-900 border border-gold-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <button
              onClick={() => setIsDishModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-black text-2xl text-gray-900 dark:text-white mb-6">
              {editingDishId
                ? (lang === 'ru' ? 'Редактировать Блюдо' : lang === 'en' ? 'Edit Dish' : "Taomni Tahrirlash")
                : (lang === 'ru' ? 'Добавить Новое Блюдо' : lang === 'en' ? 'Add New Dish' : "Yangi Taom Qo'shish")}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-5">
              {/* Names in 3 languages */}
              <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-dark-800/60 border border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">
                  {lang === 'ru' ? 'Название блюда (на 3 языках)' : lang === 'en' ? 'Dish name (in 3 languages)' : 'Taom nomi (3 tilda)'}
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
                  {lang === 'ru' ? 'Описание блюда (на 3 языках)' : lang === 'en' ? 'Dish description (in 3 languages)' : 'Taom tavsifi (3 tilda)'}
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
                    {lang === 'ru' ? 'Категория' : lang === 'en' ? 'Category' : 'Kategoriya'}
                  </label>
                  <select
                    value={dishFormData.category}
                    onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                    className="glass-input w-full text-xs"
                  >
                    <option value="national">{lang === 'ru' ? 'Национальные блюда' : lang === 'en' ? 'National Dishes' : 'Milliy taomlar'}</option>
                    <option value="european">{lang === 'ru' ? 'Европейская кухня & Стейки' : lang === 'en' ? 'European & Steaks' : 'Yevropa & Steyk'}</option>
                    <option value="salads">{lang === 'ru' ? 'Салаты' : lang === 'en' ? 'Salads' : 'Salatlar'}</option>
                    <option value="kebabs">{lang === 'ru' ? 'Шашлык и Гриль' : lang === 'en' ? 'Kebabs & Grill' : 'Kabob & Gril'}</option>
                    <option value="mains">{lang === 'ru' ? 'Горячие блюда' : lang === 'en' ? 'Main Courses' : 'Issiq taomlar'}</option>
                    <option value="desserts">{lang === 'ru' ? 'Десерты' : lang === 'en' ? 'Desserts' : 'Desertlar'}</option>
                    <option value="drinks">{lang === 'ru' ? 'Напитки' : lang === 'en' ? 'Drinks' : 'Ichimliklar'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {lang === 'ru' ? 'Цена (в сумах) *' : lang === 'en' ? 'Price (UZS) *' : "Narxi (so'mda) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {lang === 'ru' ? 'Приготовление (мин.)' : lang === 'en' ? 'Prep time (min.)' : 'Tayyorlanish (daq.)'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={dishFormData.prepTime}
                    onChange={(e) => setDishFormData({ ...dishFormData, prepTime: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {lang === 'ru' ? 'Калории (ккал)' : lang === 'en' ? 'Calories (kcal)' : 'Kaloriya (kkal)'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={dishFormData.calories}
                    onChange={(e) => setDishFormData({ ...dishFormData, calories: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Image URL & Preset Pickers */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {lang === 'ru' ? 'URL изображения блюда' : lang === 'en' ? 'Dish Image URL' : 'Taom Rasmi URL manzili'}
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={dishFormData.image}
                  onChange={(e) => setDishFormData({ ...dishFormData, image: e.target.value })}
                  className="glass-input w-full text-xs"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-gray-400">
                    {lang === 'ru' ? 'Готовые фото:' : lang === 'en' ? 'Preset photos:' : 'Tayyor rasmlar:'}
                  </span>
                  {presetImages.map((pr, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setDishFormData({ ...dishFormData, image: pr.url })}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-gray-100 dark:bg-dark-800 hover:bg-gold-500 hover:text-dark-950 font-semibold"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  {lang === 'ru' ? 'Специальные метки (Теги)' : lang === 'en' ? 'Special Badges (Tags)' : 'Maxsus belgilar (Tags)'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'chef', label: lang === 'ru' ? '👨‍🍳 Выбор шефа' : lang === 'en' ? "👨‍🍳 Chef's Choice" : "👨‍🍳 Bosh oshpaz saralagan" },
                    { id: 'popular', label: lang === 'ru' ? '🔥 Популярное' : lang === 'en' ? '🔥 Popular' : '🔥 Eng xaridorgir' },
                    { id: 'halal', label: lang === 'ru' ? '✨ 100% Халяль' : lang === 'en' ? '✨ 100% Halal' : '✨ 100% Halol' },
                    { id: 'spicy', label: lang === 'ru' ? '🌶️ Острое' : lang === 'en' ? '🌶️ Spicy' : '🌶️ Achchiq' }
                  ].map(tag => (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        dishFormData.tags.includes(tag.id)
                          ? 'gold-gradient-bg text-dark-950 font-bold'
                          : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishFormData.isAvailable}
                    onChange={(e) => setDishFormData({ ...dishFormData, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-gold-500 rounded"
                  />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {lang === 'ru' ? 'В наличии (отображается в меню гостей)' : lang === 'en' ? 'Available (visible in guest menu)' : "Sotuvda mavjud (Mijozlar menyusida ko'rinadi)"}
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 font-semibold text-xs"
                >
                  {lang === 'ru' ? 'Отмена' : lang === 'en' ? 'Cancel' : 'Bekor qilish'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs shadow-lg hover:scale-105 transition-transform"
                >
                  {editingDishId
                    ? (lang === 'ru' ? 'Сохранить Изменения' : lang === 'en' ? 'Save Changes' : "O'zgarishlarni Saqlash")
                    : (lang === 'ru' ? 'Добавить Блюдо' : lang === 'en' ? 'Add Dish' : "Taomni Qo'shish")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedOrderForReceipt && (
        <PrintReceiptModal
          order={selectedOrderForReceipt}
          isOpen={Boolean(selectedOrderForReceipt)}
          onClose={() => setSelectedOrderForReceipt(null)}
        />
      )}

      {/* Printable Daily Shift Sales Report Modal */}
      <PrintDailyReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        orders={orders}
        reservations={reservations}
        menuItems={menuItems}
        formatPrice={formatPrice}
      />
    </div>
  );
};
