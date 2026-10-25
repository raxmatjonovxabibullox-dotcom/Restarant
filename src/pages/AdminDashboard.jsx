import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
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
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileSpreadsheet,
  Send,
  ArrowLeft,
  Sun,
  Moon,
  DollarSign,
  X,
  ChefHat,
  Printer,
  ChevronDown,
  ChevronRight,
  LogOut,
  Volume2,
  VolumeX,
  Menu as MenuIcon,
  MoreVertical,
  Inbox,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Edit
} from 'lucide-react';

// Tri-lingual dictionary specifically tailored for Maxton Executive Suite
const MAXTON_I18N = {
  uz: {
    brand: "Maxton",
    brandSubtitle: "Zafaron Lounge",
    dashboard: "Dashboard",
    analysis: "Tahlillar",
    ecommerce: "eCommerce",
    widgets: "Vidjetlar",
    apps: "Ilovalar",
    uiElements: "UI ELEMENTLARI",
    cards: "Kartalar",
    components: "Komponentlar",
    icons: "Ikonkalar",
    formsAndTables: "SHAKLLAR VA JADVALLAR",
    forms: "Shakllar (Taomnoma)",
    tables: "Jadvallar (Buyurtmalar)",
    pages: "SAHIFALAR",
    authentication: "Autentifikatsiya",
    userProfile: "Profil",
    timeline: "Xronologiya",
    settings: "Sozlamalar",
    kds: "Oshxona (KDS)",
    reservations: "Stol Bandliklari",
    backToSite: "Restoranga Qaytish",
    searchPlaceholder: "Qidirish (Buyurtma, taom, mijoz)...",
    congratulations: "Tabriklaymiz Jhon 🎉",
    bestSellerSubtitle: "Siz bu oyning eng yaxshi sotuvchisisiz",
    salesTarget: "savdo rejasining bajarilishi",
    viewDetails: "Batafsil Ko'rish",
    totalOrders: "Jami Buyurtmalar",
    totalSales: "Jami Tushum",
    totalVisits: "Tashriflar Soni",
    bounceRate: "Yetkazib Berish",
    orderStatus: "Buyurtmalar Holati",
    salesAndViews: "Savdo va Ko'rishlar",
    salesLegend: "Savdo",
    viewsLegend: "Ko'rishlar",
    productLegend: "Taomlar",
    incomeLegend: "Sof Daromad",
    monthly: "Oylik",
    yearly: "Yillik",
    addNewDish: "Yangi Taom Qo'shish",
    printReport: "Kassa Hisoboti",
    exportCsv: "Excelga Yuklash",
    liveClock: "Toshkent Vaqti",
    quickStatusStep: "Keyingi Holat",
    stopList: "Stop-list",
    available: "Sotuvda",
    all: "Barchasi"
  },
  ru: {
    brand: "Maxton",
    brandSubtitle: "Zafaron Lounge",
    dashboard: "Dashboard",
    analysis: "Аналитика",
    ecommerce: "eCommerce",
    widgets: "Виджеты",
    apps: "Приложения",
    uiElements: "UI ЭЛЕМЕНТЫ",
    cards: "Карточки",
    components: "Компоненты",
    icons: "Иконки",
    formsAndTables: "ФОРМЫ И ТАБЛИЦЫ",
    forms: "Формы (Меню)",
    tables: "Таблицы (Заказы)",
    pages: "СТРАНИЦЫ",
    authentication: "Аутентификация",
    userProfile: "Профиль",
    timeline: "Хронология",
    settings: "Настройки",
    kds: "Кухня (KDS)",
    reservations: "Брони Столов",
    backToSite: "Вернуться на сайт",
    searchPlaceholder: "Поиск (Заказ, блюдо, клиент)...",
    congratulations: "Congratulations Jhon 🎉",
    bestSellerSubtitle: "You are the best seller of this month",
    salesTarget: "от плана продаж",
    viewDetails: "View Details",
    totalOrders: "Total Orders",
    totalSales: "Total Sales",
    totalVisits: "Total Visits",
    bounceRate: "Bounce Rate",
    orderStatus: "Order Status",
    salesAndViews: "Sales & Views",
    salesLegend: "Продажи",
    viewsLegend: "Просмотры",
    productLegend: "Блюда",
    incomeLegend: "Чистый Доход",
    monthly: "Monthly",
    yearly: "Yearly",
    addNewDish: "Добавить Блюдо",
    printReport: "Отчет Смены",
    exportCsv: "Экспорт в Excel",
    liveClock: "Время Ташкент",
    quickStatusStep: "След. статус",
    stopList: "Стоп-лист",
    available: "В наличии",
    all: "Все"
  },
  en: {
    brand: "Maxton",
    brandSubtitle: "Zafaron Lounge",
    dashboard: "Dashboard",
    analysis: "Analysis",
    ecommerce: "eCommerce",
    widgets: "Widgets",
    apps: "Apps",
    uiElements: "UI ELEMENTS",
    cards: "Cards",
    components: "Components",
    icons: "Icons",
    formsAndTables: "FORMS & TABLES",
    forms: "Forms",
    tables: "Tables",
    pages: "PAGES",
    authentication: "Authentication",
    userProfile: "User Profile",
    timeline: "Timeline",
    settings: "Settings",
    kds: "Kitchen (KDS)",
    reservations: "Reservations",
    backToSite: "Back to Restaurant",
    searchPlaceholder: "Search (Orders, dishes, guests)...",
    congratulations: "Congratulations Jhon 🎉",
    bestSellerSubtitle: "You are the best seller of this month",
    salesTarget: "of sales target",
    viewDetails: "View Details",
    totalOrders: "Total Orders",
    totalSales: "Total Sales",
    totalVisits: "Total Visits",
    bounceRate: "Bounce Rate",
    orderStatus: "Order Status",
    salesAndViews: "Sales & Views",
    salesLegend: "Sales",
    viewsLegend: "Views",
    productLegend: "Product",
    incomeLegend: "Income",
    monthly: "Monthly",
    yearly: "Yearly",
    addNewDish: "Add New Dish",
    printReport: "Shift Report",
    exportCsv: "Export CSV",
    liveClock: "Tashkent Time",
    quickStatusStep: "Next Step",
    stopList: "Stop-list",
    available: "Available",
    all: "All"
  }
};

export const AdminDashboard = ({ setIsAdminView }) => {
  const { logout } = useAuth();
  const { lang, setLang, getLocalized } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { formatPrice } = useCurrency();

  const {
    menuItems,
    orders,
    reservations,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    updateOrderStatus,
    updateReservationStatus,
    showToast
  } = useRestaurant();

  // Translations shortcut for Maxton
  const m = MAXTON_I18N[lang] || MAXTON_I18N.uz;

  // Active navigation tab
  // 'ecommerce' (exact Maxton view from photo), 'analysis', 'orders', 'reservations', 'menu', 'kds', 'settings'
  const [activeTab, setActiveTab] = useState('ecommerce');

  // Sidebar collapse toggle (for responsive and desktop toggle)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardSubmenuOpen, setDashboardSubmenuOpen] = useState(true);

  // Top header dropdowns
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Global search input in topbar
  const [globalSearch, setGlobalSearch] = useState('');

  // Audio effects state
  const [audioEnabled, setAudioEnabled] = useState(() => {
    try {
      return localStorage.getItem('zafaron_sound_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    localStorage.setItem('zafaron_sound_enabled', String(next));
    if (next) soundFx.playPop();
  };

  // Live Digital Clock
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Languages array with flags
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];
  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

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
    tags: ['chef', 'halal'],
    isAvailable: true
  });

  const presetImages = [
    { label: 'Shohona Palov (Halol)', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Qo\'y Kabobi (Halol)', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Achichuk Salati', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Halol Ribay Steyk', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Buxoro Manti (Halol)', url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Turkcha Paxlava', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Zafaronli Choy', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Anor Sharbat Fresh', url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1200&q=85' },
  ];

  // --- FILTER STATES ---
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [menuAvailabilityFilter, setMenuAvailabilityFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState('all');
  const [reservationSubTab, setReservationSubTab] = useState('list'); // 'list' | 'floorplan'

  // Modals
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(() => getStoredSettings());
  const [testingBot, setTestingBot] = useState(false);
  const [botTestResult, setBotTestResult] = useState(null);
  const [customBroadcastMsg, setCustomBroadcastMsg] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  // --- STATS CALCULATIONS ---
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'cancelled') {
      return sum + Number(order.totalPrice || order.totalAmount || 0);
    }
    return sum;
  }, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;
  const activeReservationsCount = reservations.filter(r => r.status === 'confirmed' || r.status === 'new').length;

  // Handler for tab selection
  const handleSelectTab = (tabId) => {
    if (audioEnabled) soundFx.playPop();
    setActiveTab(tabId);
  };

  // --- MENU CRUD HANDLERS ---
  const handleOpenAddDish = () => {
    if (audioEnabled) soundFx.playPop();
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
      image: presetImages[0].url,
      prepTime: 20,
      calories: 500,
      tags: ['chef'],
      isAvailable: true
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (dish) => {
    if (audioEnabled) soundFx.playPop();
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

  const handleSaveDish = async (e) => {
    e.preventDefault();
    if (audioEnabled) soundFx.playSuccessFanfare();

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

  const handleToggleTag = (tag) => {
    if (audioEnabled) soundFx.playPop();
    setDishFormData(prev => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  // Quick 1-click order step
  const handleQuickOrderStatusStep = (order) => {
    const nextMap = {
      pending: 'cooking',
      cooking: 'delivering',
      delivering: 'completed'
    };
    const nextStatus = nextMap[order.status];
    if (!nextStatus) return;
    if (audioEnabled) soundFx.playChime();
    updateOrderStatus(order.id, nextStatus);
    showToast(
      lang === 'ru' ? `Статус заказа #${order.id} изменен: ${nextStatus}` :
      lang === 'en' ? `Order #${order.id} status updated: ${nextStatus}` :
      `#${order.id} buyurtma holati yangilandi: ${nextStatus}`,
      'success'
    );
  };

  // Quick Price adjust +/- 5,000 UZS
  const handleQuickPriceAdjust = async (dishId, currentPrice, delta) => {
    if (audioEnabled) soundFx.playPop();
    const newPrice = Math.max(1000, Number(currentPrice) + delta);
    await updateDish(dishId, { price: newPrice });
    showToast(
      lang === 'ru' ? `Цена обновлена: ${formatPrice(newPrice)}` :
      lang === 'en' ? `Price updated: ${formatPrice(newPrice)}` :
      `Narx yangilandi: ${formatPrice(newPrice)}`,
      'success'
    );
  };

  // Export CSV
  const handleExportOrdersCSV = () => {
    if (audioEnabled) soundFx.playChime();
    const headers = ['Order ID', 'Customer', 'Phone', 'Type', 'Table #', 'Address', 'Status', 'Total', 'Payment', 'Date'];
    const rows = orders.map(o => [
      `"${o.id || ''}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.deliveryType || ''}"`,
      `"${o.tableNumber || '-'}"`,
      `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
      `"${o.status || 'pending'}"`,
      Number(o.totalPrice || o.totalAmount || 0),
      `"${o.paymentMethod || 'cash'}"`,
      `"${o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}"`
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
    showToast(m.exportCsv + " ✓", "success");
  };

  // Bot Test
  const handleTestBot = async () => {
    if (audioEnabled) soundFx.playPop();
    setTestingBot(true);
    setBotTestResult(null);
    try {
      const res = await testTelegramBot(settingsForm.telegramBotToken, settingsForm.telegramChatId);
      setBotTestResult(res);
      if (res.success) {
        if (audioEnabled) soundFx.playSuccessFanfare();
        showToast("Telegram Bot bilan aloqa a'lo darajada!", "success");
      } else {
        showToast(res.message || "Bot xatoligi", "error");
      }
    } catch (err) {
      setBotTestResult({ success: false, message: err.message });
      showToast("Bot test xatosi", "error");
    } finally {
      setTestingBot(false);
    }
  };

  const handleSaveSettings = () => {
    if (audioEnabled) soundFx.playSuccessFanfare();
    saveStoredSettings(settingsForm);
    showToast("Sozlamalar saqlandi!", "success");
  };

  const handleSendCustomBroadcast = async () => {
    if (!customBroadcastMsg.trim()) return;
    if (audioEnabled) soundFx.playPop();
    setSendingBroadcast(true);
    try {
      const caption = `📢 <b>ZAFARON ADMIN:</b>\n\n${customBroadcastMsg.trim()}`;
      const bannerUrl = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80';
      const res = await sendPhotoToTelegramApi(settingsForm.telegramBotToken, settingsForm.telegramChatId, bannerUrl, caption);
      if (res.success) {
        if (audioEnabled) soundFx.playSuccessFanfare();
        showToast("Xabar Telegramga yuborildi!", "success");
        setCustomBroadcastMsg('');
      } else {
        showToast(res.message || "Xatolik", "error");
      }
    } catch (e) {
      showToast(e.message || "Xatolik yuz berdi", "error");
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleTestSupabase = async () => {
    if (audioEnabled) soundFx.playPop();
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      const res = await testSupabaseConnection(settingsForm.supabaseUrl, settingsForm.supabaseAnonKey);
      setSupabaseTestResult(res);
      if (res.success) {
        if (audioEnabled) soundFx.playSuccessFanfare();
        showToast("Supabase aloqasi muvaffaqiyatli!", "success");
      } else {
        showToast(res.message || "Supabase xatosi", "error");
      }
    } catch (err) {
      setSupabaseTestResult({ success: false, message: err.message });
      showToast(err.message || "Supabase xatosi", "error");
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSyncSupabase = async () => {
    if (audioEnabled) soundFx.playPop();
    setSyncingSupabase(true);
    try {
      const res = await syncMenuWithSupabase(menuItems);
      if (res.synced) {
        if (audioEnabled) soundFx.playSuccessFanfare();
        showToast("Menyu Supabase bilan sinxronlandi!", "success");
      } else {
        showToast(res.reason || "Supabase xatosi", "error");
      }
    } catch (e) {
      showToast(e.message || "Sinxronlashda xatolik", "error");
    } finally {
      setSyncingSupabase(false);
    }
  };

  // Filtered Dishes
  const filteredDishes = menuItems.filter(dish => {
    if (menuAvailabilityFilter === 'available' && dish.isAvailable === false) return false;
    if (menuAvailabilityFilter === 'out_of_stock' && dish.isAvailable !== false) return false;
    if (menuCategoryFilter !== 'all' && dish.category !== menuCategoryFilter) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      const n = (typeof dish.name === 'object' ? (dish.name.uz + dish.name.ru + dish.name.en) : dish.name).toLowerCase();
      if (!n.includes(q)) return false;
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const match = (o.id + o.customerName + o.customerPhone).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filtered Reservations
  const filteredReservations = reservations.filter(r => {
    if (reservationStatusFilter !== 'all' && r.status !== reservationStatusFilter) return false;
    if (reservationSearch.trim()) {
      const q = reservationSearch.toLowerCase();
      const match = (r.id + r.fullName + r.phone).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Dynamic values or picture match
  const displayRevenueFormatted = totalRevenue > 0 ? formatPrice(totalRevenue) : "$168.5K";
  const displayOrdersCount = orders.length > 0 ? `${orders.length}` : "248k";

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#11131c] text-[#f1f3f9]' : 'bg-[#f4f7fb] text-[#1c2130]'}`}>
      
      {/* ================= LEFT SIDEBAR (MAXTON EXACT STYLE) ================= */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } shrink-0 transition-all duration-300 ease-in-out border-r flex flex-col z-30 select-none ${
          theme === 'dark'
            ? 'bg-[#151824] border-[#1e2235]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Brand Header with Maxton Icon */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-inherit">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Colorful Maxton Drop Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
              <div className="w-full h-full bg-inherit rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs">M</span>
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight leading-none text-current">
                  {m.brand}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                  {m.brandSubtitle}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {/* Main Dashboard Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (audioEnabled) soundFx.playPop();
                setDashboardSubmenuOpen(!dashboardSubmenuOpen);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ecommerce' || activeTab === 'analysis'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                {sidebarOpen && <span>{m.dashboard}</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    dashboardSubmenuOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              )}
            </button>

            {sidebarOpen && dashboardSubmenuOpen && (
              <div className="pl-9 pr-1 py-1 space-y-1 text-xs">
                <button
                  onClick={() => handleSelectTab('analysis')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'analysis'
                      ? 'text-blue-500 font-bold bg-blue-500/10'
                      : 'text-slate-400 hover:text-current'
                  }`}
                >
                  • {m.analysis}
                </button>
                <button
                  onClick={() => handleSelectTab('ecommerce')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'ecommerce'
                      ? 'text-blue-500 font-bold bg-blue-500/10'
                      : 'text-slate-400 hover:text-current'
                  }`}
                >
                  • {m.ecommerce}
                </button>
              </div>
            )}

            <button
              onClick={() => handleSelectTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                {sidebarOpen && <span>{m.tables}</span>}
              </div>
              {sidebarOpen && orders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('kds')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'kds'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <ChefHat className="w-4 h-4 text-amber-500" />
                {sidebarOpen && <span>{m.kds}</span>}
              </div>
              {sidebarOpen && pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-dark-950 animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* Section: UI Elements */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {m.uiElements}
              </div>
            )}
            <button
              onClick={() => handleSelectTab('menu')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'menu'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-fuchsia-500" />
                {sidebarOpen && <span>{m.forms}</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            <button
              onClick={() => handleSelectTab('reservations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'reservations'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-purple-500" />
                {sidebarOpen && <span>{m.reservations}</span>}
              </div>
              {sidebarOpen && activeReservationsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400">
                  {activeReservationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Section: Pages */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {m.pages}
              </div>
            )}
            <button
              onClick={() => handleSelectTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-cyan-500" />
                {sidebarOpen && <span>{m.settings}</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Back to Public Site */}
        <div className="p-3 border-t border-inherit">
          <button
            onClick={() => {
              if (audioEnabled) soundFx.playPop();
              setIsAdminView(false);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-[#1a1e2f] hover:bg-gold-500/20 text-slate-300 hover:text-gold-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={m.backToSite}
          >
            <ArrowLeft className="w-4 h-4" />
            {sidebarOpen && <span>{m.backToSite}</span>}
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOPBAR (MAXTON EXACT HEADER) */}
        <header
          className={`h-16 px-6 sticky top-0 z-20 flex items-center justify-between border-b backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-[#151824]/90 border-[#1e2235]'
              : 'bg-white/90 border-slate-200 shadow-sm'
          }`}
        >
          {/* Left: Hamburger & Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button
              onClick={() => {
                if (audioEnabled) soundFx.playPop();
                setSidebarOpen(!sidebarOpen);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-current hover:bg-slate-500/10 transition-colors"
              title="Toggle Sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Pill Search Input */}
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={m.searchPlaceholder}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  theme === 'dark'
                    ? 'bg-[#1c2032] border border-transparent text-white placeholder-slate-500'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Right Header Tools: Flag, Dark/Light, Notifications, Cart, Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Live Clock */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
              theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{liveTime}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full transition-colors ${
                audioEnabled
                  ? 'text-amber-500 hover:bg-amber-500/10'
                  : 'text-slate-400 hover:bg-slate-500/10'
              }`}
              title={audioEnabled ? "Ovozli effektlar yoqilgan" : "Ovoz o'chirilgan"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Selector with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#1c2032] border-[#252a42] text-slate-300 hover:border-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-bold">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-36 py-1 rounded-2xl shadow-2xl border z-50 ${
                  theme === 'dark'
                    ? 'bg-[#1c2032] border-[#2c324e] text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        if (audioEnabled) soundFx.playPop();
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        lang === l.code
                          ? 'font-bold text-blue-500 bg-blue-500/10'
                          : 'hover:bg-slate-500/10'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span>{l.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle (Dark Mode / Light Mode) */}
            <button
              onClick={() => {
                if (audioEnabled) soundFx.playPop();
                toggleTheme();
              }}
              className={`p-2 rounded-full border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1c2032] border-[#252a42] text-amber-400 hover:bg-[#242940]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={theme === 'dark' ? "Light Mode'ga o'tish" : "Dark Mode'ga o'tish"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Bell with Badge 5 */}
            <div className="relative">
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="p-2 rounded-full text-slate-400 hover:text-current hover:bg-slate-500/10 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5">
                  5
                </span>
              </button>

              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 p-4 rounded-2xl shadow-2xl border z-50 ${
                  theme === 'dark'
                    ? 'bg-[#1c2032] border-[#2c324e] text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-inherit mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider">Bildirishnomalar</span>
                    <span className="text-[10px] text-blue-500 font-bold">5 ta yangi</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="font-semibold text-blue-400">Yangi VIP Buyurtma qabul qilindi</p>
                      <span className="text-[10px] text-slate-400">2 daqiqa oldin</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="font-semibold text-emerald-400">Telegram Bot mijozga javob berdi</p>
                      <span className="text-[10px] text-slate-400">5 daqiqa oldin</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="font-semibold text-amber-400">Stol #3 bron qilindi (VIP Zalda)</p>
                      <span className="text-[10px] text-slate-400">12 daqiqa oldin</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => handleSelectTab('orders')}
              className="p-2 rounded-full text-slate-400 hover:text-current hover:bg-slate-500/10 relative transition-colors"
              title="Orders Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5">
                {orders.length}
              </span>
            </button>

            {/* User Profile Avatar (Jhon / Admin) with status dot */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Jhon"
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-inherit absolute bottom-0 right-0" />
                </div>
              </button>

              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 py-2 rounded-2xl shadow-2xl border z-50 text-xs ${
                  theme === 'dark'
                    ? 'bg-[#1c2032] border-[#2c324e] text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="px-4 py-2 border-b border-inherit">
                    <p className="font-bold text-sm">Jhon (Admin)</p>
                    <p className="text-[10px] text-slate-400">admin@zafaron.uz</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSelectTab('settings');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-500/10 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{m.settings}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsAdminView(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Chiqish (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BREADCRUMB & ACTION BAR */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <h1 className="font-bold text-base text-current">{m.dashboard}</h1>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400 flex items-center gap-1">
              <span className="text-[10px]">📁</span> {m[activeTab] || activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectTab('settings')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{m.settings}</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT BODY ================= */}
        <main className="flex-1 px-6 pb-8 space-y-6">

          {/* ================= VIEW 1: ECOMMERCE DASHBOARD (EXACT MAXTON MATCH) ================= */}
          {activeTab === 'ecommerce' && (
            <div className="space-y-6">
              
              {/* TOP ROW: HERO CARD (35%) + 4 MINI KPI CARDS (65%) */}
              <div className="grid grid-cols-12 gap-5">
                
                {/* 1. HERO CARD: Congratulations Jhon 🎉 */}
                <div
                  className={`col-span-12 xl:col-span-4 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border ${
                    theme === 'dark'
                      ? 'bg-[#171a29] border-[#22263d]'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-1 relative z-10">
                    <h2 className="font-black text-lg text-current flex items-center gap-2">
                      {m.congratulations}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {m.bestSellerSubtitle}
                    </p>
                  </div>

                  <div className="my-5 relative z-10">
                    <div className="font-extrabold text-3xl sm:text-4xl text-current tracking-tight">
                      {displayRevenueFormatted}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      <span className="text-emerald-400 font-bold">58%</span> {m.salesTarget}
                    </p>
                  </div>

                  <div className="relative z-10">
                    <button
                      onClick={() => handleSelectTab('analysis')}
                      className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all"
                    >
                      {m.viewDetails}
                    </button>
                  </div>

                  {/* 3D Gift Box illustration on the right */}
                  <div className="absolute right-3 bottom-3 w-28 h-28 pointer-events-none select-none flex items-center justify-center">
                    <div className="relative text-5xl animate-bounce">
                      🎁
                      <span className="absolute -top-2 -left-2 text-base">✨</span>
                      <span className="absolute -top-1 -right-2 text-base">🎉</span>
                    </div>
                  </div>
                </div>

                {/* 2. FOUR KPI METRIC CARDS */}
                <div className="col-span-12 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* KPI 1: Total Orders (Blue Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#171a29] border-[#22263d]'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +24%
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="font-extrabold text-2xl text-current">
                        {displayOrdersCount}
                      </div>
                      <span className="text-xs text-slate-400">{m.totalOrders}</span>
                    </div>
                    {/* Blue SVG Sparkline Wave */}
                    <div className="h-9 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <path
                          d="M0,22 Q15,8 30,20 T60,12 T90,6 L100,4"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 2: Total Sales (Green Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#171a29] border-[#22263d]'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +14%
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="font-extrabold text-2xl text-current">
                        $47.6k
                      </div>
                      <span className="text-xs text-slate-400">{m.totalSales}</span>
                    </div>
                    {/* Green SVG Sparkline Wave */}
                    <div className="h-9 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <path
                          d="M0,20 Q20,24 40,12 T70,16 T100,5"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 3: Total Visits (Cyan Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#171a29] border-[#22263d]'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" /> -35%
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="font-extrabold text-2xl text-current">
                        189K
                      </div>
                      <span className="text-xs text-slate-400">{m.totalVisits}</span>
                    </div>
                    {/* Cyan SVG Sparkline Wave */}
                    <div className="h-9 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <path
                          d="M0,18 Q25,8 45,22 T80,14 T100,8"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 4: Bounce Rate (Golden Mini Bar Chart) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-[#171a29] border-[#22263d]'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <Inbox className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +18%
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="font-extrabold text-2xl text-current">
                        24.6%
                      </div>
                      <span className="text-xs text-slate-400">{m.bounceRate}</span>
                    </div>
                    {/* Golden Mini Bar Chart */}
                    <div className="h-9 w-full flex items-end justify-between gap-1 pt-1">
                      {[30, 45, 60, 40, 80, 50, 95, 70, 85, 90, 65, 100].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-amber-500 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* MIDDLE ROW: ORDER STATUS (DONUT) + SALES & VIEWS (GROUPED BARS) */}
              <div className="grid grid-cols-12 gap-5">
                
                {/* 1. ORDER STATUS (DONUT CHART) */}
                <div
                  className={`col-span-12 lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#171a29] border-[#22263d]'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-current">{m.orderStatus}</h3>
                    <button className="text-slate-400 hover:text-current">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Circular Donut Diagram */}
                  <div className="flex items-center justify-center py-4 relative">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={theme === 'dark' ? '#22263d' : '#e2e8f0'}
                        strokeWidth="16"
                      />
                      {/* Arc 1: Blue (Sales 68%) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="16"
                        strokeDasharray="299 440"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                      {/* Arc 2: Pink (Product 25%) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="16"
                        strokeDasharray="110 440"
                        strokeDashoffset="-299"
                        strokeLinecap="round"
                      />
                      {/* Arc 3: Green (Income 14%) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="16"
                        strokeDasharray="61 440"
                        strokeDashoffset="-409"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-black text-2xl text-current">68%</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{m.totalSales}</span>
                    </div>
                  </div>

                  {/* Bottom Legend */}
                  <div className="pt-4 border-t border-inherit space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-slate-400">{m.salesLegend}</span>
                      </div>
                      <span className="font-bold text-current">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                        <span className="text-slate-400">{m.productLegend}</span>
                      </div>
                      <span className="font-bold text-current">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-400">{m.incomeLegend}</span>
                      </div>
                      <span className="font-bold text-current">14%</span>
                    </div>
                  </div>
                </div>

                {/* 2. SALES & VIEWS (GROUPED BAR CHART + DIALS) */}
                <div
                  className={`col-span-12 lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#171a29] border-[#22263d]'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-current">{m.salesAndViews}</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                        <span className="text-slate-400">{m.salesLegend}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                        <span className="text-slate-400">{m.viewsLegend}</span>
                      </div>
                      <button className="text-slate-400 hover:text-current ml-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dual Bar Chart for Months Jan - Sep */}
                  <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-inherit">
                    {[
                      { month: 'Jan', sales: 20, views: 25 },
                      { month: 'Feb', sales: 15, views: 20 },
                      { month: 'Mar', sales: 90, views: 65 },
                      { month: 'Apr', sales: 30, views: 40 },
                      { month: 'May', sales: 55, views: 50 },
                      { month: 'Jun', sales: 45, views: 40 },
                      { month: 'Jul', sales: 60, views: 80 },
                      { month: 'Aug', sales: 40, views: 45 },
                      { month: 'Sep', sales: 70, views: 55 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full flex items-end justify-center gap-1.5 h-36">
                          {/* Orange Sales Bar */}
                          <div
                            style={{ height: `${item.sales}%` }}
                            className="w-2 sm:w-3.5 bg-amber-500 rounded-t-sm group-hover:bg-amber-400 transition-all"
                            title={`Sales: ${item.sales}`}
                          />
                          {/* Cyan Views Bar */}
                          <div
                            style={{ height: `${item.views}%` }}
                            className="w-2 sm:w-3.5 bg-cyan-400 rounded-t-sm group-hover:bg-cyan-300 transition-all"
                            title={`Views: ${item.views}`}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-current">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Dials: Monthly & Yearly Progress */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Dial 1: Monthly */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke={theme === 'dark' ? '#22263d' : '#e2e8f0'} strokeWidth="4" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="65 100" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">{m.monthly}</span>
                        <div className="font-bold text-base text-current">65,127</div>
                        <span className="text-[10px] text-emerald-400 font-bold">▲ 16.5% 55.21 USD</span>
                      </div>
                    </div>

                    {/* Dial 2: Yearly */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke={theme === 'dark' ? '#22263d' : '#e2e8f0'} strokeWidth="4" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="80 100" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">{m.yearly}</span>
                        <div className="font-bold text-base text-current">984,246</div>
                        <span className="text-[10px] text-emerald-400 font-bold">▲ 24.9% 267.35 USD</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* QUICK SHORTCUTS & ACTION BAR */}
              <div
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                  theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                    ⚡ Quick Operations
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Tezkor boshqaruv vositalari
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleOpenAddDish}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{m.addNewDish}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (audioEnabled) soundFx.playChime();
                      setIsDailyReportOpen(true);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      theme === 'dark' ? 'bg-[#1e2235] border-[#252a42] text-slate-200 hover:bg-[#252a42]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-500" />
                    <span>{m.printReport}</span>
                  </button>

                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{m.exportCsv}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= VIEW 2: ORDERS MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div
              className={`p-6 rounded-2xl border space-y-5 ${
                theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-xl text-current">{m.tables}</h2>
                  <p className="text-xs text-slate-400">Jami buyurtmalar monitoringi va nazorati</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{m.exportCsv}</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buyurtma ID, mijoz ismi yoki telefon..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border ${
                    theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="all">Barcha holatlar</option>
                  <option value="pending">Kutilmoqda (Pending)</option>
                  <option value="cooking">Tayyorlanmoqda (Cooking)</option>
                  <option value="delivering">Yetkazilmoqda (Delivering)</option>
                  <option value="completed">Yakunlandi (Completed)</option>
                  <option value="cancelled">Bekor qilindi (Cancelled)</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-xl border border-inherit">
                <table className="w-full text-left text-xs">
                  <thead className={theme === 'dark' ? 'bg-[#141622] text-slate-400' : 'bg-slate-50 text-slate-600'}>
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Mijoz</th>
                      <th className="p-3">Telefon</th>
                      <th className="p-3">Turi / Manzil</th>
                      <th className="p-3">Summa</th>
                      <th className="p-3">Holati</th>
                      <th className="p-3 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400">
                          Hech qanday buyurtma topilmadi
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-blue-500">#{order.id}</td>
                          <td className="p-3 font-bold text-current">{order.customerName}</td>
                          <td className="p-3 text-slate-400">{order.customerPhone}</td>
                          <td className="p-3">
                            {order.deliveryType === 'dineIn' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400">
                                Restoran (Stol #{order.tableNumber || '-'})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400">
                                Yetkazish ({order.deliveryAddress || 'Manzil'})
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-current">
                            {formatPrice(order.totalPrice || order.totalAmount || 0)}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.status === 'cooking' ? 'bg-amber-500/20 text-amber-400' :
                              order.status === 'delivering' ? 'bg-blue-500/20 text-blue-400' :
                              order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleQuickOrderStatusStep(order)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all"
                                  title="Keyingi holatga o'tkazish"
                                >
                                  {m.quickStatusStep} →
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrderForReceipt(order)}
                                className="p-1.5 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-current transition-colors"
                                title="Chek chiqarish"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: MENU CRUD MANAGEMENT ================= */}
          {activeTab === 'menu' && (
            <div
              className={`p-6 rounded-2xl border space-y-5 ${
                theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-xl text-current">{m.forms}</h2>
                  <p className="text-xs text-slate-400">Taomlarni qo'shish, tahrirlash, narxlarni o'zgartirish va stop-list</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddDish}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{m.addNewDish}</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Taom nomini qidirish..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border ${
                    theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="all">Barcha toifalar</option>
                  <option value="national">Milliy taomlar</option>
                  <option value="european">Yevropa & Steyk</option>
                  <option value="salads">Salatlar</option>
                  <option value="kebabs">Kabob & Gril</option>
                  <option value="mains">Issiq taomlar</option>
                  <option value="desserts">Desertlar</option>
                  <option value="drinks">Ichimliklar</option>
                </select>

                <select
                  value={menuAvailabilityFilter}
                  onChange={(e) => setMenuAvailabilityFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border ${
                    theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="all">Barcha taomlar ({menuItems.length})</option>
                  <option value="available">Mavjud (Sotuvda)</option>
                  <option value="out_of_stock">Stop-list (Tugagan)</option>
                </select>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-xl border flex gap-3 transition-all ${
                      dish.isAvailable === false ? 'opacity-60 border-red-500/30' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm group/img">
                      <img
                        src={dish.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 will-change-transform"
                      />
                      <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-[8px] font-black bg-emerald-600 text-white shadow-sm flex items-center gap-0.5">
                        <span>✨</span> HALOL
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs truncate text-current">
                            {getLocalized(dish.name)}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            dish.isAvailable !== false
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {dish.isAvailable !== false ? m.available : m.stopList}
                          </span>
                        </div>
                        <div className="font-extrabold text-sm text-amber-500 mt-1">
                          {formatPrice(dish.price)}
                        </div>
                      </div>

                      {/* +/- 5,000 UZS Price Quick Adjust + Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-inherit">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickPriceAdjust(dish.id, dish.price, -5000)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 hover:bg-slate-500/30"
                            title="-5,000 so'm"
                          >
                            -5k
                          </button>
                          <button
                            onClick={() => handleQuickPriceAdjust(dish.id, dish.price, 5000)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 hover:bg-slate-500/30"
                            title="+5,000 so'm"
                          >
                            +5k
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleDishAvailability(dish.id)}
                            className={`p-1 rounded-lg ${
                              dish.isAvailable !== false ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-500/10'
                            }`}
                            title="Mavjudlikni o'zgartirish"
                          >
                            {dish.isAvailable !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditDish(dish)}
                            className="p-1 rounded-lg text-blue-400 hover:bg-blue-500/10"
                            title="Tahrirlash"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Ushbu taomni o'chirmoqchimisiz?")) {
                                deleteDish(dish.id);
                              }
                            }}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/10"
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

          {/* ================= VIEW 4: RESERVATIONS ================= */}
          {activeTab === 'reservations' && (
            <div
              className={`p-6 rounded-2xl border space-y-5 ${
                theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-xl text-current">{m.reservations}</h2>
                  <p className="text-xs text-slate-400">Mehmonlar stollarini band qilish va zallar monitoringi</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl p-1 bg-slate-500/10">
                    <button
                      onClick={() => setReservationSubTab('list')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        reservationSubTab === 'list' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Ro'yxat
                    </button>
                    <button
                      onClick={() => setReservationSubTab('floorplan')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        reservationSubTab === 'floorplan' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      Stol Xaritasi
                    </button>
                  </div>
                </div>
              </div>

              {reservationSubTab === 'floorplan' ? (
                <TableOccupancyManager reservations={reservations} />
              ) : (
                <>
                  {/* Reservation Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Bron ID, mehmon ismi yoki telefon..."
                        value={reservationSearch}
                        onChange={(e) => setReservationSearch(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                          theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>

                    <select
                      value={reservationStatusFilter}
                      onChange={(e) => setReservationStatusFilter(e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs border ${
                        theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="all">Barcha bandliklar</option>
                      <option value="new">Yangi (New)</option>
                      <option value="confirmed">Tasdiqlangan (Confirmed)</option>
                      <option value="cancelled">Bekor qilingan (Cancelled)</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-inherit">
                  <table className="w-full text-left text-xs">
                    <thead className={theme === 'dark' ? 'bg-[#141622] text-slate-400' : 'bg-slate-50 text-slate-600'}>
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Mehmon</th>
                        <th className="p-3">Telefon</th>
                        <th className="p-3">Sana / Vaqt</th>
                        <th className="p-3">Kishi soni</th>
                        <th className="p-3">Zal / Stol</th>
                        <th className="p-3">Holati</th>
                        <th className="p-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {filteredReservations.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-slate-400">
                            Hech qanday stol bandligi topilmadi
                          </td>
                        </tr>
                      ) : (
                        filteredReservations.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="p-3 font-mono font-bold text-blue-500">#{res.id}</td>
                            <td className="p-3 font-bold text-current">{res.fullName}</td>
                            <td className="p-3 text-slate-400">{res.phone}</td>
                            <td className="p-3 font-mono">{res.date} • {res.time}</td>
                            <td className="p-3 font-bold">{res.guests} kishi</td>
                            <td className="p-3">
                              {typeof res.zone === 'object' ? (res.zone[lang] || res.zone.uz) : (res.zone || 'Asosiy')}
                              {res.tableNumber ? ` (Stol #${res.tableNumber})` : ''}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {res.status !== 'confirmed' && (
                                  <button
                                    onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                  >
                                    Tasdiqlash
                                  </button>
                                )}
                                {res.status !== 'cancelled' && (
                                  <button
                                    onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                    className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold text-[10px]"
                                  >
                                    Bekor
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            </div>
          )}

          {/* ================= VIEW 5: KITCHEN KDS DISPLAY ================= */}
          {activeTab === 'kds' && (
            <KitchenDisplay orders={orders} onUpdateStatus={updateOrderStatus} />
          )}

          {/* ================= VIEW 6: ANALYSIS ================= */}
          {activeTab === 'analysis' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${
                theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <h2 className="font-black text-xl text-current">{m.analysis}</h2>
                <p className="text-xs text-slate-400">Chuqur biznes metrikalari va daromadlar o'sishi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-400">Kunlik o'rtacha chek</span>
                  <div className="font-black text-2xl mt-1 text-emerald-400">
                    {formatPrice(orders.length > 0 ? totalRevenue / orders.length : 185000)}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-400">Mijozlar qoniqishi</span>
                  <div className="font-black text-2xl mt-1 text-blue-400">
                    98.4%
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-400">Dostavka o'rtacha vaqti</span>
                  <div className="font-black text-2xl mt-1 text-amber-400">
                    32 daqiqa
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 7: SETTINGS & TELEGRAM ================= */}
          {activeTab === 'settings' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${
                theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <h2 className="font-black text-xl text-current">{m.settings}</h2>
                <p className="text-xs text-slate-400">Telegram Bot, Gemini AI va xavfsizlik sozlamalari</p>
              </div>

              {/* Telegram Bot Card */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-sm">Telegram Bot & Bildirishnomalar</span>
                  </div>
                  <button
                    onClick={handleTestBot}
                    disabled={testingBot}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    {testingBot ? "Tekshirilmoqda..." : "Botni Test Qilish"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram Bot Token</label>
                    <input
                      type="text"
                      value={settingsForm.telegramBotToken || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Chat ID</label>
                    <input
                      type="text"
                      value={settingsForm.telegramChatId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${
                        theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {botTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    botTestResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {botTestResult.success ? "✅ Bot aloqasi muvaffaqiyatli o'rnatildi!" : `❌ ${botTestResult.message}`}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Saqlash
                  </button>
                </div>
              </div>

              {/* Telegram Broadcast Card */}
              <div className={`p-5 rounded-xl border space-y-3 ${
                theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="font-bold text-sm block">📢 Telegram E'lon Yuborish</span>
                <textarea
                  rows="2"
                  placeholder="Barcha Telegram obunachilariga xabar yuborish..."
                  value={customBroadcastMsg}
                  onChange={(e) => setCustomBroadcastMsg(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border resize-none ${
                    theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                  }`}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendCustomBroadcast}
                    disabled={sendingBroadcast || !customBroadcastMsg.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingBroadcast ? "Yuborilmoqda..." : "E'lonni Yuborish"}</span>
                  </button>
                </div>
              </div>

              {/* Supabase Cloud Sync Card */}
              <div className={`p-5 rounded-xl border space-y-3 ${
                theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">☁️ Supabase Cloud Baza Sinxronlashuvi</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestSupabase}
                      disabled={testingSupabase}
                      className="px-3 py-1.5 rounded-xl bg-slate-500/15 hover:bg-slate-500/25 text-xs font-bold"
                    >
                      {testingSupabase ? "Ulanmoqda..." : "Aloqani Tekshirish"}
                    </button>
                    <button
                      onClick={handleSyncSupabase}
                      disabled={syncingSupabase}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      {syncingSupabase ? "Sinxronlanmoqda..." : "Menyuni Yuklash"}
                    </button>
                  </div>
                </div>

                {supabaseTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    supabaseTestResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {supabaseTestResult.success ? "✅ Supabase aloqasi muvaffaqiyatli!" : `❌ ${supabaseTestResult.message}`}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT DISH ================= */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl ${
              theme === 'dark' ? 'bg-[#171a29] border-[#242940] text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <h3 className="font-extrabold text-lg">
                {editingDishId ? "Taomni Tahrirlash" : "Yangi Taom Qo'shish"}
              </h3>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-current"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="py-4 space-y-4 text-xs">
              {/* Names in 3 languages */}
              <div className="space-y-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider block">
                  Taom nomi (3 tilda) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">O'zbekcha *</label>
                    <input
                      type="text"
                      required
                      value={dishFormData.nameUz}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameUz: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Русский</label>
                    <input
                      type="text"
                      value={dishFormData.nameRu}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameRu: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">English</label>
                    <input
                      type="text"
                      value={dishFormData.nameEn}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameEn: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${
                        theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Narxi (so'mda) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Kategoriya</label>
                  <select
                    value={dishFormData.category}
                    onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="national">Milliy taomlar</option>
                    <option value="european">Yevropa & Steyk</option>
                    <option value="salads">Salatlar</option>
                    <option value="kebabs">Kabob & Gril</option>
                    <option value="mains">Issiq taomlar</option>
                    <option value="desserts">Desertlar</option>
                    <option value="drinks">Ichimliklar</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Preset buttons */}
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Rasm URL manzili</label>
                <input
                  type="url"
                  value={dishFormData.image}
                  onChange={(e) => setDishFormData({ ...dishFormData, image: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {presetImages.map((pr, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setDishFormData({ ...dishFormData, image: pr.url })}
                      className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-500/15 hover:bg-blue-600 hover:text-white"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Maxsus belgilar (Tags)</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'chef', label: "👨‍🍳 Bosh oshpaz" },
                    { id: 'popular', label: "🔥 Mashhur" },
                    { id: 'halal', label: "✨ 100% Halol" },
                    { id: 'spicy', label: "🌶️ Achchiq" }
                  ].map(tag => (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        dishFormData.tags.includes(tag.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishFormData.isAvailable}
                    onChange={(e) => setDishFormData({ ...dishFormData, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="font-semibold text-current">
                    Sotuvda mavjud (Mijozlar menyusida ko'rinadi)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-500/15 text-slate-300 font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30"
                >
                  {editingDishId ? "O'zgarishlarni Saqlash" : "Taomni Qo'shish"}
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
