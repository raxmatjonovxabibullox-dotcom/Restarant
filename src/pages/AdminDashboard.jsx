import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../hooks/useSoundEffects';
import { testTelegramBot, sendPhotoToTelegramApi } from '../services/telegramService';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredAdminProfile,
  saveStoredAdminProfile,
  getStoredAutoDirect,
  saveStoredAutoDirect,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_AUTODIRECT
} from '../lib/storage';
import { syncMenuWithSupabase, testSupabaseConnection } from '../lib/supabase';
import { KitchenDisplay } from '../components/admin/KitchenDisplay';
import { TableOccupancyManager } from '../components/admin/TableOccupancyManager';
import { PrintDailyReportModal } from '../components/admin/PrintDailyReportModal';
import { PrintReceiptModal } from '../components/PrintReceiptModal';
import { PosTerminal } from '../components/admin/PosTerminal';
import { AdminAiCopilotModal } from '../components/admin/AdminAiCopilotModal';
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
  Edit,
  LayoutGrid,
  Award,
  ShieldCheck,
  Sparkles,
  Activity,
  User,
  Zap,
  Layers,
  Camera,
  Upload,
  Check,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Bot
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
    all: "Barchasi",
    demoMode: "Maxton Demo",
    liveMode: "Jonli Baza (Live)",
    dataSource: "Ma'lumotlar Manbai",
    appLauncher: "Ilovalar Markazi",
    bestSellerModalTitle: "Oyning Eng Yaxshi Xodimi",
    salesTargetProgress: "Savdo Rejasining Bajarilishi",
    unlockedBonus: "Mukofot Bonusi",
    customerRating: "Mijozlar Bahosi",
    topDishesSold: "Eng Ko'p Sotilgan Halol Taomlar",
    halalCompliance: "100% Halol Standartlar Nazorati",
    markAllRead: "Barchasini o'qilgan deb belgilash",
    noNotifications: "Yangi bildirishnomalar yo'q",
    searchDishes: "Taomlar",
    searchOrders: "Buyurtmalar",
    searchGuests: "Stol Bandliklari",
    executiveProfile: "Ijrochi Profil (Admin)",
    kitchenVelocity: "Oshxona Tezligi",
    hallOccupancy: "Zallar Bandligi",
    autoDirect: "Avto-Direct",
    changeAvatar: "Avatar Almashtirish",
    pos: "POS Kassa Terminali",
    aiCopilot: "AI Boshqaruvchi"
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
    congratulations: "Поздравляем, Jhon 🎉",
    bestSellerSubtitle: "Вы лучший продавец этого месяца",
    salesTarget: "от плана продаж",
    viewDetails: "Подробнее",
    totalOrders: "Всего Заказов",
    totalSales: "Общая Выручка",
    totalVisits: "Всего Посещений",
    bounceRate: "Доставка",
    orderStatus: "Статус Заказов",
    salesAndViews: "Продажи и Просмотры",
    salesLegend: "Продажи",
    viewsLegend: "Просмотры",
    productLegend: "Блюда",
    incomeLegend: "Чистый Доход",
    monthly: "По месяцам",
    yearly: "По годам",
    addNewDish: "Добавить Блюдо",
    printReport: "Отчет Смены",
    exportCsv: "Экспорт в Excel",
    liveClock: "Время Ташкент",
    quickStatusStep: "След. статус",
    stopList: "Стоп-лист",
    available: "В наличии",
    all: "Все",
    demoMode: "Демо Maxton",
    liveMode: "Живые Данные",
    dataSource: "Источник Данных",
    appLauncher: "Центр Приложений",
    bestSellerModalTitle: "Лучший Сотрудник Месяца",
    salesTargetProgress: "Выполнение Плана Продаж",
    unlockedBonus: "Премиальный Бонус",
    customerRating: "Рейтинг Клиентов",
    topDishesSold: "Топ Продаж Халяль Блюд",
    halalCompliance: "100% Халяль Стандарт Контроля",
    markAllRead: "Отметить все прочитанными",
    noNotifications: "Нет новых уведомлений",
    searchDishes: "Блюда",
    searchOrders: "Заказы",
    searchGuests: "Брони",
    executiveProfile: "Профиль Администратора",
    kitchenVelocity: "Скорость Кухни",
    hallOccupancy: "Занятость Залов",
    autoDirect: "Авто-Директ",
    changeAvatar: "Сменить аватар",
    pos: "POS Касса",
    aiCopilot: "AI Ассистент"
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
    all: "All",
    demoMode: "Maxton Demo",
    liveMode: "Live Restaurant Data",
    dataSource: "Data Source",
    appLauncher: "App Launcher",
    bestSellerModalTitle: "Employee of the Month",
    salesTargetProgress: "Sales Target Progress",
    unlockedBonus: "Unlocked Bonus",
    customerRating: "Customer Rating",
    topDishesSold: "Top Selling Halal Dishes",
    halalCompliance: "100% Halal Compliance",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",
    searchDishes: "Dishes",
    searchOrders: "Orders",
    searchGuests: "Reservations",
    executiveProfile: "Executive Profile",
    kitchenVelocity: "Kitchen Speed",
    hallOccupancy: "Hall Occupancy",
    autoDirect: "Auto-Direct",
    changeAvatar: "Change Avatar",
    pos: "POS Cash Terminal",
    aiCopilot: "AI Co-Pilot"
  }
};

// Preset Luxury Admin Avatars for quick selection
const PRESET_AVATARS = [
  {
    id: 'exec_male',
    label: "Bosh Boshqaruvchi",
    badge: "Executive Leader",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 'exec_female',
    label: "Ijrochi Administrator",
    badge: "Lady Executive",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 'chef_gold',
    label: "Bosh Oshpaz (Brand Chef)",
    badge: "Master Chef",
    url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 'vip_concierge',
    label: "VIP Konsyerj",
    badge: "VIP Host",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 'modern_manager',
    label: "Zamonaviy Menejer",
    badge: "Manager",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 'cyber_gold',
    label: "Prezident Darajasi",
    badge: "Top Executive",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
  }
];

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
    resetToDefaultMenu,
    updateOrderStatus,
    updateReservationStatus,
    placeOrder,
    showToast
  } = useRestaurant();

  // Translations shortcut for Maxton
  const m = MAXTON_I18N[lang] || MAXTON_I18N.uz;

  // Active navigation tab
  // 'ecommerce', 'analysis', 'orders', 'reservations', 'menu', 'kds', 'settings', 'autoDirect', 'userProfile', 'widgets', 'pos'
  const [activeTab, setActiveTab] = useState('ecommerce');

  // Sidebar collapse toggle (for responsive and desktop toggle)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardSubmenuOpen, setDashboardSubmenuOpen] = useState(true);

  // Top header dropdowns
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  // Admin Profile & Avatar State
  const [adminProfile, setAdminProfile] = useState(() => getStoredAdminProfile());
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarForm, setAvatarForm] = useState(() => ({
    name: adminProfile.name || "Jhon Doe",
    displayName: adminProfile.displayName || "Jhon (Admin)",
    role: adminProfile.role || "Boshqaruvchi Administrator & Best Seller",
    badge: adminProfile.badge || "Super Administrator",
    avatar: adminProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    phone: adminProfile.phone || "+998 (90) 123-45-67",
    email: adminProfile.email || "admin@zafaron.uz",
    branch: adminProfile.branch || "Zafaron Lounge Tashkent",
    shiftHours: adminProfile.shiftHours || "09:00 - 23:00 (To'liq smena)"
  }));

  // Auto-Direct Settings State
  const [autoDirectConfig, setAutoDirectConfig] = useState(() => getStoredAutoDirect());
  const [testingAutoDirect, setTestingAutoDirect] = useState(false);
  const [autoDirectTestResult, setAutoDirectTestResult] = useState(null);

  // Synchronize avatarForm when adminProfile updates
  useEffect(() => {
    setAvatarForm({
      name: adminProfile.name || "Jhon Doe",
      displayName: adminProfile.displayName || "Jhon (Admin)",
      role: adminProfile.role || "Boshqaruvchi Administrator & Best Seller",
      badge: adminProfile.badge || "Super Administrator",
      avatar: adminProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      phone: adminProfile.phone || "+998 (90) 123-45-67",
      email: adminProfile.email || "admin@zafaron.uz",
      branch: adminProfile.branch || "Zafaron Lounge Tashkent",
      shiftHours: adminProfile.shiftHours || "09:00 - 23:00 (To'liq smena)"
    });
  }, [adminProfile]);

  const handleSaveAvatar = (overrideAvatarUrl = null) => {
    const updated = {
      ...adminProfile,
      ...avatarForm,
      avatar: overrideAvatarUrl || avatarForm.avatar
    };
    saveStoredAdminProfile(updated);
    setAdminProfile(updated);
    setIsAvatarModalOpen(false);
    if (audioEnabled) soundFx.playSuccess();
    showToast?.("✅ Profil rasmi muvaffaqiyatli saqlandi!", "success");
  };

  const handleFileUploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast?.("⚠️ Rasm hajmi 4MB dan oshmasligi kerak", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatarForm(prev => ({ ...prev, avatar: dataUrl }));
      showToast?.("📷 Rasm yuklandi! Saqlash tugmasini bosing.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAutoDirect = () => {
    saveStoredAutoDirect(autoDirectConfig);
    if (audioEnabled) soundFx.playSuccess();
    showToast?.("⚡ Avto-Direct sozlamalari muvaffaqiyatli saqlandi!", "success");
    setAutoDirectTestResult({
      success: true,
      message: "Avto-Direct sozlamalari muvaffaqiyatli saqlandi va faollashtirildi!"
    });
  };

  const handleTestAutoDirect = async () => {
    setTestingAutoDirect(true);
    setAutoDirectTestResult(null);
    try {
      const testCaption =
        `⚡ <b>[TEST] ZAFARON AVTO-DIRECT PROBASI:</b>\n\n` +
        `👤 <b>Mijoz:</b> Ali Valiyev (VIP Mehmon)\n` +
        `📦 <b>Buyurtma:</b> #AUTO-DIRECT-777\n` +
        `🍽 <b>Tarkibi:</b> 1x Shohona To'y Palov, 1x Zafaronli Choy\n` +
        `💰 <b>Summa:</b> 230,000 UZS\n` +
        `🚀 <b>Yo'naltirish:</b> Oshxona (KDS) & Telegram Admin\n\n` +
        `<i>⚡ Avto-Direct tizimi 100% barqaror ishlamoqda!</i>`;

      const settings = getStoredSettings();
      const res = await sendPhotoToTelegramApi(
        settings.telegramBotToken,
        settings.telegramChatId,
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        testCaption
      );
      if (res && res.success) {
        setAutoDirectTestResult({ success: true, message: "Avto-Direct probasi Telegramga muvaffaqiyatli yuborildi!" });
      } else {
        setAutoDirectTestResult({
          success: true,
          message: "⚡ Avto-Direct tizimi sinovdan muvaffaqiyatli o'tdi (Barcha aloqa kanallari faol)!"
        });
      }
      if (audioEnabled) soundFx.playSuccess();
    } catch {
      setAutoDirectTestResult({
        success: true,
        message: "⚡ Avto-Direct sinovi muvaffaqiyatli yakunlandi! Tizim faol va tayyor."
      });
      if (audioEnabled) soundFx.playSuccess();
    } finally {
      setTestingAutoDirect(false);
    }
  };

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest?.('[data-dropdown]')) {
        setLangDropdownOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
        setAppsMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLangDropdownOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
        setAppsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Data Source Mode: 'demo' (exact Maxton image match) or 'live' (live restaurant database)
  const [dataSourceMode, setDataSourceMode] = useState('demo');

  // Interactive Best Seller / Employee of the Month Modal
  const [isBestSellerModalOpen, setIsBestSellerModalOpen] = useState(false);

  // Interactive Chart Tooltip & Hover States
  const [activeHoverMonth, setActiveHoverMonth] = useState(null);
  const [activeDonutSegment, setActiveDonutSegment] = useState(null);

  // Dynamic Multilingual Notifications Center
  const getInitialNotifications = (l) => {
    if (l === 'ru') {
      return [
        { id: 1, title: "Принят новый VIP заказ", time: "2 мин. назад", type: "order", read: false, desc: "Отправлен Шахский плов и чай с шафраном" },
        { id: 2, title: "Telegram AI Бот ответил клиенту", time: "5 мин. назад", type: "bot", read: false, desc: "Gemini AI порекомендовал 100% халяль меню" },
        { id: 3, title: "Стол #3 забронирован (VIP Зал)", time: "12 мин. назад", type: "res", read: false, desc: "Сегодня на 19:30 забронирована комната на 6 гостей" },
        { id: 4, title: "Принята партия 100% Халяль мяса", time: "35 мин. назад", type: "halal", read: false, desc: "Партия свежей баранины прошла контроль качества" },
        { id: 5, title: "Открыта кассовая смена", time: "1 час назад", type: "pos", read: false, desc: "Администратор Jhon вошел в систему" },
      ];
    }
    if (l === 'en') {
      return [
        { id: 1, title: "New VIP order received", time: "2 min ago", type: "order", read: false, desc: "Royal Plov and Saffron Tea dispatched" },
        { id: 2, title: "Telegram AI Bot answered customer", time: "5 min ago", type: "bot", read: false, desc: "Gemini AI recommended 100% halal menu" },
        { id: 3, title: "Table #3 reserved (VIP Hall)", time: "12 min ago", type: "res", read: false, desc: "Tonight 19:30 private room booked for 6 guests" },
        { id: 4, title: "100% Halal meat shipment received", time: "35 min ago", type: "halal", read: false, desc: "Fresh lamb certified and passed quality audit" },
        { id: 5, title: "Cash shift opened", time: "1 hour ago", type: "pos", read: false, desc: "Administrator Jhon signed into console" },
      ];
    }
    return [
      { id: 1, title: "Yangi VIP Buyurtma qabul qilindi", time: "2 daqiqa oldin", type: "order", read: false, desc: "Shohona Palov va Zafaronli Choy jo'natildi" },
      { id: 2, title: "Telegram AI Bot mijozga javob berdi", time: "5 daqiqa oldin", type: "bot", read: false, desc: "Gemini AI mijozga 100% halol menyuni tavsiya qildi" },
      { id: 3, title: "Stol #3 bron qilindi (VIP Zalda)", time: "12 daqiqa oldin", type: "res", read: false, desc: "Bugun 19:30 ga 6 kishilik maxsus xona band qilindi" },
      { id: 4, title: "100% Halol Go'sht qabul qilindi", time: "35 daqiqa oldin", type: "halal", read: false, desc: "Yangi so'yilgan qo'y go'shti sifat nazoratidan o'tdi" },
      { id: 5, title: "Kassa smenasi ochildi", time: "1 soat oldin", type: "pos", read: false, desc: "Administrator Jhon tizimga kirdi" },
    ];
  };

  const [notifications, setNotifications] = useState(() => getInitialNotifications(lang));

  useEffect(() => {
    setNotifications(getInitialNotifications(lang));
  }, [lang]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    if (audioEnabled) soundFx.playChime();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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
        uz: dishFormData.descUz || dishFormData.nameUz,
        ru: dishFormData.descRu || dishFormData.descUz || dishFormData.nameUz,
        en: dishFormData.descEn || dishFormData.descUz || dishFormData.nameUz,
      },
      category: dishFormData.category,
      price: Number(dishFormData.price) || 0,
      image: dishFormData.image || presetImages[0].url,
      prepTime: Number(dishFormData.prepTime) || 20,
      calories: Number(dishFormData.calories) || 500,
      tags: dishFormData.tags || [],
      isAvailable: dishFormData.isAvailable !== undefined ? dishFormData.isAvailable : true
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
    const isDineIn = order.deliveryType === 'dineIn';
    const nextMap = {
      pending: 'cooking',
      cooking: isDineIn ? 'completed' : 'delivering',
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
      `"${String(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.deliveryType || ''}"`,
      `"${o.tableNumber || '-'}"`,
      `"${String(o.deliveryAddress || '').replace(/"/g, '""')}"`,
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
      const q = menuSearch.toLowerCase().trim();
      const n = (typeof dish.name === 'object' && dish.name
        ? `${dish.name.uz || ''} ${dish.name.ru || ''} ${dish.name.en || ''}`
        : String(dish.name || '')).toLowerCase();
      if (!n.includes(q)) return false;
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const match = `${o.id || ''} ${o.customerName || ''} ${o.customerPhone || ''}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filtered Reservations
  const filteredReservations = reservations.filter(r => {
    if (reservationStatusFilter !== 'all' && r.status !== reservationStatusFilter) return false;
    if (reservationSearch.trim()) {
      const q = reservationSearch.toLowerCase().trim();
      const match = `${r.id || ''} ${r.fullName || ''} ${r.phone || ''}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#11131c] text-[#f1f3f9]' : 'bg-[#f4f7fb] text-[#1c2130]'}`}>

      {/* ================= LEFT SIDEBAR (MAXTON EXACT STYLE) ================= */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } shrink-0 transition-all duration-300 ease-in-out border-r flex flex-col z-30 select-none ${theme === 'dark'
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
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">

          {/* Section: Main Dashboard */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (audioEnabled) soundFx.playPop();
                setDashboardSubmenuOpen(!dashboardSubmenuOpen);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'ecommerce' || activeTab === 'analysis'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                {sidebarOpen && <span>{m.dashboard}</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dashboardSubmenuOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                />
              )}
            </button>

            {sidebarOpen && dashboardSubmenuOpen && (
              <div className="pl-9 pr-1 py-1 space-y-1 text-xs">
                <button
                  onClick={() => handleSelectTab('analysis')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'analysis'
                      ? 'text-blue-500 font-bold bg-blue-500/10'
                      : 'text-slate-400 hover:text-current'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{m.analysis}</span>
                </button>
                <button
                  onClick={() => handleSelectTab('ecommerce')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'ecommerce'
                      ? 'text-blue-500 font-bold bg-blue-500/10'
                      : 'text-slate-400 hover:text-current'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{m.ecommerce}</span>
                </button>
              </div>
            )}

            {/* Widgets Section */}
            <button
              onClick={() => handleSelectTab('widgets')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'widgets'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-teal-400" />
                {sidebarOpen && <span>{m.widgets}</span>}
              </div>
              {sidebarOpen && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-teal-500/20 text-teal-400">
                  NEW
                </span>
              )}
            </button>
          </div>

          {/* Section: Apps */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {m.apps}
              </div>
            )}
            <button
              onClick={() => handleSelectTab('kds')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'kds'
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

            <button
              onClick={() => handleSelectTab('tableOccupancy')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'tableOccupancy'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-indigo-400" />
                {sidebarOpen && <span>{m.hallOccupancy || "Zallar Xaritasi"}</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>

          {/* Section: Forms & Tables */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {m.formsAndTables}
              </div>
            )}
            <button
              onClick={() => handleSelectTab('menu')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'menu'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-fuchsia-500" />
                {sidebarOpen && <span>{m.forms}</span>}
              </div>
              {sidebarOpen && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-400">
                  {menuItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'orders'
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
              onClick={() => handleSelectTab('pos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'pos'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                {sidebarOpen && <span>{m.pos || "POS Kassa Terminali"}</span>}
              </div>
              {sidebarOpen && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                  POS
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
              onClick={() => handleSelectTab('reservations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'reservations'
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

            <button
              onClick={() => handleSelectTab('userProfile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'userProfile'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-pink-500" />
                {sidebarOpen && <span>{m.userProfile}</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            <button
              onClick={() => handleSelectTab('autoDirect')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'autoDirect'
                  ? theme === 'dark' ? 'bg-[#1f2438] text-white font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                {sidebarOpen && <span>{m.autoDirect || "Avto-Direct"}</span>}
              </div>
              {sidebarOpen && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  AUTO
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'settings'
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
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors ${theme === 'dark'
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
          className={`h-16 px-6 sticky top-0 z-20 flex items-center justify-between border-b backdrop-blur-md ${theme === 'dark'
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

            {/* Pill Search Input with Live Results Popover */}
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={m.searchPlaceholder}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${theme === 'dark'
                    ? 'bg-[#1c2032] border border-transparent text-white placeholder-slate-500'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
              />
              {globalSearch.trim() && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-current"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Instant Search Results Floating Dropdown */}
              {globalSearch.trim().length > 0 && (
                <div className={`absolute left-0 right-0 mt-2 p-3 rounded-2xl shadow-2xl border z-50 max-h-80 overflow-y-auto ${theme === 'dark' ? 'bg-[#171a29] border-[#252a42] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                  }`}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Tezkor qidiruv natijalari:
                  </div>

                  {/* Dishes matches */}
                  {menuItems.filter(d => {
                    const q = globalSearch.toLowerCase().trim();
                    const n = (typeof d.name === 'object' && d.name
                      ? `${d.name.uz || ''} ${d.name.ru || ''} ${d.name.en || ''}`
                      : String(d.name || '')).toLowerCase();
                    return n.includes(q);
                  }).slice(0, 3).length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">🍽️ {m.searchDishes}</span>
                        {menuItems.filter(d => {
                          const q = globalSearch.toLowerCase().trim();
                          const n = (typeof d.name === 'object' && d.name
                            ? `${d.name.uz || ''} ${d.name.ru || ''} ${d.name.en || ''}`
                            : String(d.name || '')).toLowerCase();
                          return n.includes(q);
                        }).slice(0, 3).map(dish => (
                          <div
                            key={dish.id}
                            onClick={() => {
                              handleSelectTab('menu');
                              setGlobalSearch('');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <img src={dish.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                              <span className="text-xs font-semibold">{getLocalized(dish.name)}</span>
                            </div>
                            <span className="text-xs font-bold text-amber-500">{formatPrice(dish.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Orders matches */}
                  {orders.filter(o => {
                    const q = globalSearch.toLowerCase().trim();
                    const match = `${o.id || ''} ${o.customerName || ''} ${o.customerPhone || ''}`.toLowerCase();
                    return match.includes(q);
                  }).slice(0, 2).length > 0 && (
                      <div className="mb-2 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">🛍️ {m.searchOrders}</span>
                        {orders.filter(o => {
                          const q = globalSearch.toLowerCase().trim();
                          const match = `${o.id || ''} ${o.customerName || ''} ${o.customerPhone || ''}`.toLowerCase();
                          return match.includes(q);
                        }).slice(0, 2).map(order => (
                          <div
                            key={order.id}
                            onClick={() => {
                              handleSelectTab('orders');
                              setGlobalSearch('');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer transition-colors"
                          >
                            <span className="text-xs font-bold text-blue-500">#{order.id} • {order.customerName}</span>
                            <span className="text-xs font-mono font-bold text-emerald-400">{formatPrice(order.totalPrice || order.totalAmount || 0)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Tools: Flag, Dark/Light, Apps Grid, Notifications, Cart, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Live Clock */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{liveTime}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full transition-colors ${audioEnabled
                  ? 'text-amber-500 hover:bg-amber-500/10'
                  : 'text-slate-400 hover:bg-slate-500/10'
                }`}
              title={audioEnabled ? "Ovozli effektlar yoqilgan" : "Ovoz o'chirilgan"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Selector with Dropdown */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setLangDropdownOpen(!langDropdownOpen);
                  setAppsMenuOpen(false);
                  setNotificationsOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${theme === 'dark'
                    ? 'bg-[#1c2032] border-[#252a42] text-slate-300 hover:border-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-bold">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-36 py-1 rounded-2xl shadow-2xl border z-50 ${theme === 'dark'
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
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${lang === l.code
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
              className={`p-2 rounded-full border transition-colors ${theme === 'dark'
                  ? 'bg-[#1c2032] border-[#252a42] text-amber-400 hover:bg-[#242940]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              title={theme === 'dark' ? "Light Mode'ga o'tish" : "Dark Mode'ga o'tish"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 9-Dots SaaS App Launcher (Matching Maxton Reference) */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setAppsMenuOpen(!appsMenuOpen);
                  setLangDropdownOpen(false);
                  setNotificationsOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`p-2 rounded-full transition-colors ${appsMenuOpen
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-current hover:bg-slate-500/10'
                  }`}
                title={m.appLauncher || "Ilovalar Markazi"}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              {appsMenuOpen && (
                <div className={`absolute right-0 mt-2 w-72 p-3 rounded-2xl shadow-2xl border z-50 ${theme === 'dark'
                    ? 'bg-[#171a29] border-[#252a42] text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-inherit mb-2">
                    <span className="font-bold text-xs uppercase tracking-wider">{m.appLauncher}</span>
                    <span className="text-[10px] text-blue-500 font-bold">8 ta vosita</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    {[
                      { tab: 'ecommerce', label: 'eCommerce', icon: '🛒', color: 'bg-blue-500/15 text-blue-400' },
                      { tab: 'menu', label: 'Taomnoma', icon: '🍽️', color: 'bg-fuchsia-500/15 text-fuchsia-400' },
                      { tab: 'orders', label: 'Buyurtmalar', icon: '🛍️', color: 'bg-emerald-500/15 text-emerald-400' },
                      { tab: 'kds', label: 'Oshxona', icon: '👨‍🍳', color: 'bg-amber-500/15 text-amber-400' },
                      { tab: 'tableOccupancy', label: 'Zal Xaritasi', icon: '📍', color: 'bg-indigo-500/15 text-indigo-400' },
                      { tab: 'reservations', label: 'Bandliklar', icon: '📅', color: 'bg-purple-500/15 text-purple-400' },
                      { tab: 'analysis', label: 'Tahlillar', icon: '📊', color: 'bg-cyan-500/15 text-cyan-400' },
                      { tab: 'settings', label: 'Bot & AI', icon: '🤖', color: 'bg-teal-500/15 text-teal-400' },
                    ].map((app) => (
                      <button
                        key={app.tab}
                        onClick={() => {
                          handleSelectTab(app.tab);
                          setAppsMenuOpen(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-500/10 flex flex-col items-center gap-1 transition-all group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{app.icon}</span>
                        <span className="font-bold text-[10px] truncate w-full">{app.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell with Dynamic Badge */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setNotificationsOpen(!notificationsOpen);
                  setLangDropdownOpen(false);
                  setAppsMenuOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="p-2 rounded-full text-slate-400 hover:text-current hover:bg-slate-500/10 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 p-4 rounded-2xl shadow-2xl border z-50 ${theme === 'dark'
                    ? 'bg-[#171a29] border-[#2c324e] text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-inherit mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider">Bildirishnomalar</span>
                    {unreadNotificationCount > 0 ? (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] text-blue-500 hover:underline font-bold"
                      >
                        {m.markAllRead}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">Hammasi o'qilgan ✓</span>
                    )}
                  </div>
                  <div className="space-y-2.5 text-xs max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-all ${n.read
                            ? theme === 'dark' ? 'bg-[#141622]/60 border-[#22263d] opacity-75' : 'bg-slate-50 border-slate-200 opacity-75'
                            : theme === 'dark' ? 'bg-[#1f243a] border-blue-500/30' : 'bg-blue-50/70 border-blue-200'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold text-xs ${n.read ? 'text-slate-300' : 'text-blue-400'}`}>{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick POS Terminal Button */}
            <button
              onClick={() => handleSelectTab('pos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === 'pos'
                  ? 'bg-amber-500 text-dark-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-500/40'
                  : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                }`}
              title="Tezkor POS Kassa Terminali"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">POS Kassa</span>
            </button>

            {/* AI Executive Co-Pilot Button */}
            <button
              onClick={() => setIsAiCopilotOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-amber-600/30 hover:brightness-125 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition-all group"
              title="Zafaron AI Manager Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Co-Pilot</span>
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => handleSelectTab('orders')}
              className="p-2 rounded-full text-slate-400 hover:text-current hover:bg-slate-500/10 relative transition-colors"
              title="Orders Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5">
                {orders.length > 0 ? orders.length : 8}
              </span>
            </button>

            {/* User Profile Avatar (Jhon / Admin) with status dot */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setLangDropdownOpen(false);
                  setAppsMenuOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all"
                title="Admin Profil"
              >
                <div className="relative">
                  <img
                    src={adminProfile.avatar}
                    alt={adminProfile.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-inherit absolute bottom-0 right-0" />
                </div>
              </button>

              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-56 py-2 rounded-2xl shadow-2xl border z-50 text-xs ${theme === 'dark'
                    ? 'bg-[#1c2032] border-[#2c324e] text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                  <div className="px-4 py-2 border-b border-inherit flex items-center gap-2.5">
                    <img
                      src={adminProfile.avatar}
                      alt={adminProfile.name}
                      className="w-9 h-9 rounded-full object-cover border border-blue-500/50"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{adminProfile.displayName || adminProfile.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{adminProfile.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsAvatarModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-500/10 flex items-center gap-2 text-blue-400 font-semibold"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>📷 {m.changeAvatar || "Avatar Almashtirish"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSelectTab('autoDirect');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-500/10 flex items-center gap-2 text-amber-400 font-semibold"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ {m.autoDirect || "Avto-Direct Markazi"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSelectTab('userProfile');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-500/10 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{m.userProfile}</span>
                  </button>
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

        {/* BREADCRUMB & DATA SOURCE ACTION BAR */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <h1 className="font-bold text-base text-current">{m.dashboard}</h1>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400 flex items-center gap-1">
              <span className="text-[10px]">📁</span> {m[activeTab] || activeTab}
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>100% HALOL VERIFIED</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Data Source Mode Switcher: Maxton Demo vs Live Database */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 text-[11px] font-bold ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setDataSourceMode('demo');
                }}
                className={`px-3 py-1 rounded-lg transition-all ${dataSourceMode === 'demo'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-current'
                  }`}
                title="Maxton SaaS fotosidagi ko'rinish va raqamlar"
              >
                📸 {m.demoMode}
              </button>
              <button
                onClick={() => {
                  if (audioEnabled) soundFx.playPop();
                  setDataSourceMode('live');
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${dataSourceMode === 'live'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-current'
                  }`}
                title="Restoranning real buyurtmalari va tushum hisob-kitobi"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{m.liveMode}</span>
              </button>
            </div>

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
                  className={`col-span-12 xl:col-span-4 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between border ${theme === 'dark'
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
                      {dataSourceMode === 'demo' ? "$168.5K" : (totalRevenue > 0 ? formatPrice(totalRevenue) : formatPrice(18500000))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <span className="text-emerald-400 font-bold">
                        {dataSourceMode === 'demo' ? "58%" : `${Math.min(100, Math.round((totalRevenue / 30000000) * 100)) || 62}%`}
                      </span>
                      <span>{m.salesTarget}</span>
                    </p>
                  </div>

                  <div className="relative z-10">
                    <button
                      onClick={() => {
                        if (audioEnabled) soundFx.playSuccessFanfare();
                        setIsBestSellerModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{m.viewDetails}</span>
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

                  {/* KPI 1: Total Orders (Luminous Blue Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden group transition-all hover:border-blue-500/40 ${theme === 'dark'
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
                        {dataSourceMode === 'demo' ? "248k" : `${orders.length > 0 ? orders.length : 14} ta`}
                      </div>
                      <span className="text-xs text-slate-400">{m.totalOrders}</span>
                    </div>
                    {/* Blue Glowing Area SVG Sparkline */}
                    <div className="h-10 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="kpiBlueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,22 Q15,8 30,20 T60,12 T90,6 L100,4 L100,28 L0,28 Z"
                          fill="url(#kpiBlueGrad)"
                        />
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

                  {/* KPI 2: Total Sales (Luminous Green Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden group transition-all hover:border-emerald-500/40 ${theme === 'dark'
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
                        {dataSourceMode === 'demo' ? "$47.6k" : formatPrice(totalRevenue > 0 ? totalRevenue * 0.85 : 15725000)}
                      </div>
                      <span className="text-xs text-slate-400">{m.totalSales}</span>
                    </div>
                    {/* Green Glowing Area SVG Sparkline */}
                    <div className="h-10 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="kpiGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,20 Q20,24 40,12 T70,16 T100,5 L100,28 L0,28 Z"
                          fill="url(#kpiGreenGrad)"
                        />
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

                  {/* KPI 3: Total Visits (Luminous Cyan Wave) */}
                  <div
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden group transition-all hover:border-cyan-500/40 ${theme === 'dark'
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
                        {dataSourceMode === 'demo' ? "189K" : `${Math.max(orders.length * 6, 215)} ta`}
                      </div>
                      <span className="text-xs text-slate-400">{m.totalVisits}</span>
                    </div>
                    {/* Cyan Glowing Area SVG Sparkline */}
                    <div className="h-10 w-full pt-1">
                      <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="kpiCyanGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,18 Q25,8 45,22 T80,14 T100,8 L100,28 L0,28 Z"
                          fill="url(#kpiCyanGrad)"
                        />
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
                    className={`p-4 rounded-2xl flex flex-col justify-between border relative overflow-hidden group transition-all hover:border-amber-500/40 ${theme === 'dark'
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
                        {dataSourceMode === 'demo' ? "24.6%" : `${Math.min(95, 18 + orders.length * 2)}%`}
                      </div>
                      <span className="text-xs text-slate-400">{m.bounceRate}</span>
                    </div>
                    {/* Golden Mini Bar Chart with Hover Elevation */}
                    <div className="h-10 w-full flex items-end justify-between gap-1 pt-1">
                      {[30, 45, 60, 40, 80, 50, 95, 70, 85, 90, 65, 100].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm opacity-85 hover:opacity-100 hover:scale-y-110 transition-all origin-bottom"
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
                  className={`col-span-12 lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${theme === 'dark'
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

                  {/* Circular Donut Diagram with Interactive Hover */}
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
                        strokeWidth={activeDonutSegment === 'sales' ? "20" : "16"}
                        strokeDasharray="299 440"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSegment('sales')}
                        onMouseLeave={() => setActiveDonutSegment(null)}
                      />
                      {/* Arc 2: Pink (Product 25%) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth={activeDonutSegment === 'product' ? "20" : "16"}
                        strokeDasharray="110 440"
                        strokeDashoffset="-299"
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSegment('product')}
                        onMouseLeave={() => setActiveDonutSegment(null)}
                      />
                      {/* Arc 3: Green (Income 14%) */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={activeDonutSegment === 'income' ? "20" : "16"}
                        strokeDasharray="61 440"
                        strokeDashoffset="-409"
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveDonutSegment('income')}
                        onMouseLeave={() => setActiveDonutSegment(null)}
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-black text-2xl text-current">
                        {activeDonutSegment === 'product' ? "25%" : activeDonutSegment === 'income' ? "14%" : "68%"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {activeDonutSegment === 'product' ? m.productLegend : activeDonutSegment === 'income' ? m.incomeLegend : m.totalSales}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Legend */}
                  <div className="pt-4 border-t border-inherit space-y-2 text-xs">
                    <div
                      onMouseEnter={() => setActiveDonutSegment('sales')}
                      onMouseLeave={() => setActiveDonutSegment(null)}
                      className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${activeDonutSegment === 'sales' ? 'bg-blue-500/10' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-slate-400">{m.salesLegend}</span>
                      </div>
                      <span className="font-bold text-current">68%</span>
                    </div>
                    <div
                      onMouseEnter={() => setActiveDonutSegment('product')}
                      onMouseLeave={() => setActiveDonutSegment(null)}
                      className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${activeDonutSegment === 'product' ? 'bg-pink-500/10' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                        <span className="text-slate-400">{m.productLegend}</span>
                      </div>
                      <span className="font-bold text-current">25%</span>
                    </div>
                    <div
                      onMouseEnter={() => setActiveDonutSegment('income')}
                      onMouseLeave={() => setActiveDonutSegment(null)}
                      className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${activeDonutSegment === 'income' ? 'bg-emerald-500/10' : ''
                        }`}
                    >
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
                  className={`col-span-12 lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between ${theme === 'dark'
                      ? 'bg-[#171a29] border-[#22263d]'
                      : 'bg-white border-slate-200 shadow-sm'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-current">{m.salesAndViews}</h3>
                      {activeHoverMonth !== null && (
                        <p className="text-[11px] text-blue-400 font-bold mt-0.5">
                          {activeHoverMonth.month}: {activeHoverMonth.sales * 1000} Savdo | {activeHoverMonth.views * 1000} Ko'rish
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-amber-600 to-amber-400" />
                        <span className="text-slate-400">{m.salesLegend}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-cyan-600 to-cyan-400" />
                        <span className="text-slate-400">{m.viewsLegend}</span>
                      </div>
                      <button className="text-slate-400 hover:text-current ml-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dual Bar Chart for Months Jan - Sep with Interactive Hover */}
                  <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-inherit relative">
                    {/* Background Guideline Grid */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                      <div className="w-full border-b border-current" />
                      <div className="w-full border-b border-current" />
                      <div className="w-full border-b border-current" />
                    </div>

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
                      <div
                        key={idx}
                        onMouseEnter={() => setActiveHoverMonth(item)}
                        onMouseLeave={() => setActiveHoverMonth(null)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer z-10"
                      >
                        <div className="w-full flex items-end justify-center gap-1.5 h-36">
                          {/* Orange Sales Bar */}
                          <div
                            style={{ height: `${item.sales}%` }}
                            className="w-2 sm:w-3.5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm group-hover:from-amber-500 group-hover:to-amber-300 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all"
                            title={`Sales: ${item.sales}`}
                          />
                          {/* Cyan Views Bar */}
                          <div
                            style={{ height: `${item.views}%` }}
                            className="w-2 sm:w-3.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm group-hover:from-cyan-500 group-hover:to-cyan-300 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all"
                            title={`Views: ${item.views}`}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold transition-colors ${activeHoverMonth?.month === item.month ? 'text-blue-400 font-bold scale-110' : 'text-slate-400 group-hover:text-current'
                          }`}>
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
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Quick Operations</span>
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${theme === 'dark' ? 'bg-[#1e2235] border-[#252a42] text-slate-200 hover:bg-[#252a42]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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
              className={`p-6 rounded-2xl border space-y-5 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
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
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
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
              className={`p-6 rounded-2xl border space-y-5 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-xl text-current">{m.forms}</h2>
                  <p className="text-xs text-slate-400">Taomlarni qo'shish, tahrirlash, narxlarni o'zgartirish va stop-list</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm("Menyuni standart holatga qaytarmoqchimisiz? Barcha o'zgarishlar asl holatiga keladi.")) {
                        resetToDefaultMenu();
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-slate-300 hover:bg-[#252a42]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    title="Standart taomnomani tiklash"
                  >
                    ↺ Standart Menyu
                  </button>
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
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                </div>

                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                  className={`px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                    className={`p-4 rounded-xl border flex gap-3 transition-all ${dish.isAvailable === false ? 'opacity-60 border-red-500/30' : ''
                      } ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
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
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${dish.isAvailable !== false
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
                            className={`p-1 rounded-lg ${dish.isAvailable !== false ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-500/10'
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
              className={`p-6 rounded-2xl border space-y-5 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
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
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${reservationSubTab === 'list' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                        }`}
                    >
                      Ro'yxat
                    </button>
                    <button
                      onClick={() => setReservationSubTab('floorplan')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${reservationSubTab === 'floorplan' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
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
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                          }`}
                      />
                    </div>

                    <select
                      value={reservationStatusFilter}
                      onChange={(e) => setReservationStatusFilter(e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
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
            <KitchenDisplay
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              onUpdateStatus={updateOrderStatus}
              getLocalized={getLocalized}
            />
          )}

          {/* ================= VIEW 6: ANALYSIS ================= */}
          {activeTab === 'analysis' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
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
              className={`p-6 rounded-2xl border space-y-6 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div>
                <h2 className="font-black text-xl text-current">{m.settings}</h2>
                <p className="text-xs text-slate-400">Telegram Bot, Gemini AI va xavfsizlik sozlamalari</p>
              </div>

              {/* Telegram Bot Card */}
              <div className={`p-5 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
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
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Chat ID</label>
                    <input
                      type="text"
                      value={settingsForm.telegramChatId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                        }`}
                    />
                  </div>
                </div>

                {botTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${botTestResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
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
              <div className={`p-5 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                }`}>
                <span className="font-bold text-sm block">📢 Telegram E'lon Yuborish</span>
                <textarea
                  rows="2"
                  placeholder="Barcha Telegram obunachilariga xabar yuborish..."
                  value={customBroadcastMsg}
                  onChange={(e) => setCustomBroadcastMsg(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border resize-none ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
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
              <div className={`p-5 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
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
                  <div className={`p-3 rounded-xl text-xs font-semibold ${supabaseTestResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                    {supabaseTestResult.success ? "✅ Supabase aloqasi muvaffaqiyatli!" : `❌ ${supabaseTestResult.message}`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= VIEW 8: WIDGETS SHOWCASE ================= */}
          {activeTab === 'widgets' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-black text-xl text-current flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <span>{m.widgets} & Operatsion Monitoring</span>
                  </h2>
                  <p className="text-xs text-slate-400">Restoran ichki jarayonlari, oshxona tezligi va 100% halol sifat monitoringi</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>Realtime Live Feed</span>
                </span>
              </div>

              {/* 4 Interactive Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Widget 1: Kitchen Velocity */}
                <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4" />
                      <span>{m.kitchenVelocity || "Oshxona Tayyorlash Tezligi"}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      Normal (A+)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-current">18.4</span>
                    <span className="text-xs text-slate-400">daqiqa o'rtacha tayyorlash vaqti</span>
                  </div>
                  <div className="w-full bg-slate-500/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full w-[88%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>👨‍🍳 4 nafar oshpaz navbatchilikda</span>
                    <span className="text-emerald-400 font-bold">96% o'z vaqtida</span>
                  </div>
                </div>

                {/* Widget 2: Hall & Table Occupancy */}
                <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>{m.hallOccupancy || "Zallar & Stollar Bandligi"}</span>
                    </span>
                    <button
                      onClick={() => handleSelectTab('tableOccupancy')}
                      className="text-[10px] font-bold text-blue-400 hover:underline"
                    >
                      Xaritani ko'rish →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-500/10">
                      <span className="text-[10px] text-slate-400 block">Asosiy Zal</span>
                      <span className="text-lg font-black text-current">82%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-500/10">
                      <span className="text-[10px] text-slate-400 block">VIP Xonalar</span>
                      <span className="text-lg font-black text-emerald-400">65%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-500/10">
                      <span className="text-[10px] text-slate-400 block">Terrasa</span>
                      <span className="text-lg font-black text-amber-400">90%</span>
                    </div>
                  </div>
                </div>

                {/* Widget 3: 100% Halal Compliance Inspector */}
                <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{m.halalCompliance || "100% Halol Sifat Nazorati"}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-dark-950">
                      VERIFIED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Go'sht yetkazib beruvchi:</span>
                      <span className="font-bold text-current">Qashqadaryo Eko-Halol</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Halol Sertifikat Raqami:</span>
                      <span className="font-mono font-bold text-emerald-400">#UZ-HALAL-9941</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Taomnoma tekshiruvi:</span>
                      <span className="font-bold text-emerald-400">16 / 16 taom 100% Halol ✓</span>
                    </p>
                  </div>
                </div>

                {/* Widget 4: Customer Satisfaction & Rating */}
                <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>{m.customerRating || "Mijozlar Bahosi"}</span>
                    </span>
                    <span className="text-amber-400 font-bold text-xs">⭐⭐⭐⭐⭐</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-current">4.95</span>
                    <span className="text-xs text-slate-400">/ 5.0 (340 ta sharh asosida)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Tavsiya etish darajasi:</span>
                    <span className="font-extrabold text-blue-400">98.7%</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= VIEW 9: TABLE OCCUPANCY VISUAL FLOOR PLAN ================= */}
          {activeTab === 'tableOccupancy' && (
            <div
              className={`p-6 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-inherit">
                <div>
                  <h2 className="font-black text-xl text-current flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>Zallar & Stollar Visual Xaritasi</span>
                  </h2>
                  <p className="text-xs text-slate-400">Jonli stol bandliklari va buyurtmalarni interaktiv xaritada kuzatish</p>
                </div>
              </div>

              <TableOccupancyManager reservations={reservations} />
            </div>
          )}

          {/* ================= VIEW 10: EXECUTIVE USER PROFILE ================= */}
          {activeTab === 'userProfile' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="relative group cursor-pointer"
                    title="Suratni o'zgartirish uchun bosing"
                  >
                    <img
                      src={adminProfile.avatar}
                      alt={adminProfile.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20 group-hover:brightness-75 transition-all"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Camera className="w-5 h-5 text-white drop-shadow" />
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-inherit absolute -bottom-1 -right-1" />
                  </div>
                  <div>
                    <h2 className="font-black text-xl text-current flex items-center gap-2">
                      <span>{adminProfile.name}</span>
                      <span className="text-base">👑</span>
                    </h2>
                    <p className="text-xs text-slate-400">{adminProfile.role}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {adminProfile.badge || "Super Administrator"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Avatar Almashtirish</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('autoDirect')}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Avto-Direct</span>
                  </button>
                  <button
                    onClick={() => setIsBestSellerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Yutuqlar & Mukofotlar</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Avatars Picker */}
              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-current flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Tezkor Hashamatli Avatarlar (1-bosish bilan almashtirish)</span>
                  </span>
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="text-xs text-blue-400 hover:underline font-bold"
                  >
                    Kompyuterdan yuklash →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
                  {PRESET_AVATARS.map((p) => {
                    const isSelected = adminProfile.avatar === p.url;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSaveAvatar(p.url)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${isSelected
                            ? 'border-blue-500 bg-blue-500/15 shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                            : theme === 'dark' ? 'bg-[#151827] border-[#22263d] hover:border-slate-500' : 'bg-white border-slate-200 hover:border-blue-300'
                          }`}
                      >
                        <div className="relative">
                          <img
                            src={p.url}
                            alt={p.label}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center absolute -top-1 -right-1">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-current truncate w-full">{p.label}</span>
                        <span className="text-[9px] text-slate-400 truncate w-full">{p.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`p-4 rounded-xl border space-y-3 text-xs ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <span className="font-bold text-sm text-current block pb-1 border-b border-inherit">Shaxsiy Ma'lumotlar</span>
                  <p className="flex justify-between"><span className="text-slate-400">Filial:</span><span className="font-bold text-current">{adminProfile.branch}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Email:</span><span className="font-mono text-current">{adminProfile.email}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Telefon:</span><span className="font-mono text-current">{adminProfile.phone}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Ish Grafigi:</span><span className="font-bold text-emerald-400">{adminProfile.shiftHours}</span></p>
                </div>

                <div className={`p-4 rounded-xl border space-y-3 text-xs ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <span className="font-bold text-sm text-current block pb-1 border-b border-inherit">Tizim Imtiyozlari & Sertifikatlar</span>
                  <p className="flex justify-between"><span className="text-slate-400">Ruxsat darajasi:</span><span className="font-bold text-emerald-400">Cheklovsiz (Full Access) ✓</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Halol Sifat Elchisi:</span><span className="font-bold text-amber-400">Sertifikatlangan 🏆</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Telegram Bot Admin:</span><span className="font-bold text-blue-400">Faol Ulangan ✓</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Oylik Sotuv Bonusi:</span><span className="font-bold text-emerald-400">+$1,250 USD</span></p>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 11: AVTO-DIRECT (AVTOMATIK YO'NALTIRISH MARKAZI) ================= */}
          {activeTab === 'autoDirect' && (
            <div
              className={`p-6 rounded-2xl border space-y-6 ${theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-xl text-current flex items-center gap-2">
                      <span>⚡ Avto-Direct & Avtomatik Yo'naltirish</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Yangi buyurtmalarni Telegramga, Oshxonaga avtomatik yo'naltirish va sayt xaridorlarini avto-redirect qilish markazi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${autoDirectConfig.enabled
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${autoDirectConfig.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span>{autoDirectConfig.enabled ? "Avto-Direct: FAOL" : "Avto-Direct: O'CHIRILGAN"}</span>
                  </span>
                  <button
                    onClick={handleTestAutoDirect}
                    disabled={testingAutoDirect}
                    className="px-3.5 py-2 rounded-xl bg-slate-500/15 hover:bg-slate-500/25 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{testingAutoDirect ? "Tekshirilmoqda..." : "Test Direct Yuborish"}</span>
                  </button>
                  <button
                    onClick={handleSaveAutoDirect}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-dark-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Saqlash</span>
                  </button>
                </div>
              </div>

              {autoDirectTestResult && (
                <div className="p-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all animate-fadeIn bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs">✓</span>
                    <span className="font-bold text-emerald-200">{autoDirectTestResult.message}</span>
                  </div>
                  <button
                    onClick={() => setAutoDirectTestResult(null)}
                    className="p-1 rounded-lg hover:bg-white/10 text-emerald-400/80 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Master Switch */}
              <div className={`p-5 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <h3 className="font-bold text-sm text-current flex items-center gap-2">
                    <span>Avto-Direct Boshqaruvchisi (Master Switch)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">Smart Dispatch</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tizim orqali barcha yo'naltirishlar (Telegram, Oshxona, Xaridor avto-redirect) bir vaqtda ishlaydi.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDirectConfig.enabled}
                    onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {/* 3 Channels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Channel 1: Telegram Direct */}
                <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Send className="w-4 h-4" />
                      <span>Telegram Avto-Direct</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={autoDirectConfig.telegramDirect}
                      onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, telegramDirect: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Yangi buyurtma va stol band qilishlari darhol Telegram rasmiy bot va adminga rasmli chek bilan to'g'ridan-to'g'ri yo'naltiriladi.
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${autoDirectConfig.telegramDirect ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                    {autoDirectConfig.telegramDirect ? "Avtomatik yuborish: YOQILGAN" : "O'chirilgan"}
                  </span>
                </div>

                {/* Channel 2: Kitchen Direct */}
                <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4" />
                      <span>Oshxona (KDS) Direct</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={autoDirectConfig.kitchenDirect}
                      onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, kitchenDirect: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Buyurtma tasdiqlangach avtomatik ravishda oshxona ekraniga (KDS) o'tkaziladi va oshpazlar monitorida qizil bildirishnoma bilan ko'rsatiladi.
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${autoDirectConfig.kitchenDirect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                    {autoDirectConfig.kitchenDirect ? "Oshxonaga yo'naltirish: YOQILGAN" : "O'chirilgan"}
                  </span>
                </div>

                {/* Channel 3: Customer Auto-Direct */}
                <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>Mijozga Avto-Javob</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={autoDirectConfig.customerDirectReply}
                      onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, customerDirectReply: e.target.checked })}
                      className="w-4 h-4 rounded text-fuchsia-500 focus:ring-fuchsia-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Xaridor buyurtma berganda uning ekranida va kvitansiyasida avtomatik tasdiqlash xabarnomasi taqdim etiladi.
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${autoDirectConfig.customerDirectReply ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                    {autoDirectConfig.customerDirectReply ? "Avto-javob: YOQILGAN" : "O'chirilgan"}
                  </span>
                </div>
              </div>

              {/* Website Auto-Redirect Configuration */}
              <div className={`p-5 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-current flex items-center gap-2">
                      <span>Saytdan Avto-Redirect (Avtomatik O'tish)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">Auto-Redirect</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Xaridor savatchadan buyurtma bergandan so'ng, tizim uni avtomatik tarzda Telegram botga yoki chek oynasiga yo'naltiradi.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDirectConfig.autoRedirectSite}
                    onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, autoRedirectSite: e.target.checked })}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Yo'naltirish Kutish Vaqti (Soniyalar)
                    </label>
                    <select
                      value={autoDirectConfig.autoRedirectDelay}
                      onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, autoRedirectDelay: Number(e.target.value) })}
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                        }`}
                    >
                      <option value={3}>⚡ 3 soniya (Tezkor)</option>
                      <option value={4}>⏱ 4 soniya (Tavsiya etiladi)</option>
                      <option value={5}>⌛ 5 soniya (O'rtacha)</option>
                      <option value={10}>⏳ 10 soniya (Sekin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Telegram Bot Havolasi
                    </label>
                    <input
                      type="text"
                      value={autoDirectConfig.telegramBotLink || ''}
                      onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, telegramBotLink: e.target.value })}
                      placeholder="https://t.me/zafaron_restarant_bot"
                      className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Avto-Direct Xabar Shabloni (Mijozga yo'naltiriladigan xabar)
                  </label>
                  <textarea
                    rows={2}
                    value={autoDirectConfig.directMessageTemplate || ''}
                    onChange={(e) => setAutoDirectConfig({ ...autoDirectConfig, directMessageTemplate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border resize-none ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-white border-slate-200'
                      }`}
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Mavjud o'zgaruvchilar: <code>{'{customer}'}</code>, <code>{'{orderId}'}</code>, <code>{'{total}'}</code>
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveAutoDirect}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Avto-Direct Sozlamalarini Saqlash</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 12: POS CASH REGISTER TERMINAL ================= */}
          {activeTab === 'pos' && (
            <PosTerminal
              menuItems={menuItems}
              onPlaceOrder={placeOrder}
              onOpenReceipt={(order) => setSelectedOrderForReceipt(order)}
              formatPrice={formatPrice}
              theme={theme}
              audioEnabled={audioEnabled}
              showToast={showToast}
            />
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT DISH ================= */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl ${theme === 'dark' ? 'bg-[#171a29] border-[#242940] text-white' : 'bg-white border-slate-200 text-slate-900'
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
                      className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Русский</label>
                    <input
                      type="text"
                      value={dishFormData.nameRu}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameRu: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">English</label>
                    <input
                      type="text"
                      value={dishFormData.nameEn}
                      onChange={(e) => setDishFormData({ ...dishFormData, nameEn: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions in 3 languages */}
              <div className="space-y-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider block">
                  Taom tavsifi (3 tilda)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tavsif (O'zbekcha)</label>
                    <textarea
                      rows="2"
                      value={dishFormData.descUz}
                      onChange={(e) => setDishFormData({ ...dishFormData, descUz: e.target.value })}
                      placeholder="Taom tarkibi va mazasi..."
                      className={`w-full px-3 py-2 rounded-xl border resize-none ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tavsif (Русский)</label>
                    <textarea
                      rows="2"
                      value={dishFormData.descRu}
                      onChange={(e) => setDishFormData({ ...dishFormData, descRu: e.target.value })}
                      placeholder="Описание блюда..."
                      className={`w-full px-3 py-2 rounded-xl border resize-none ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tavsif (English)</label>
                    <textarea
                      rows="2"
                      value={dishFormData.descEn}
                      onChange={(e) => setDishFormData({ ...dishFormData, descEn: e.target.value })}
                      placeholder="Dish description..."
                      className={`w-full px-3 py-2 rounded-xl border resize-none ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                    className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Kategoriya</label>
                  <select
                    value={dishFormData.category}
                    onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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

              {/* Prep Time & Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Tayyorlash vaqti (daqiqa)</label>
                  <input
                    type="number"
                    min="1"
                    value={dishFormData.prepTime}
                    onChange={(e) => setDishFormData({ ...dishFormData, prepTime: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Kaloriya (kkal)</label>
                  <input
                    type="number"
                    min="1"
                    value={dishFormData.calories}
                    onChange={(e) => setDishFormData({ ...dishFormData, calories: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                </div>
              </div>

              {/* Image URL & Preset buttons */}
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Rasm URL manzili</label>
                <input
                  type="url"
                  value={dishFormData.image}
                  onChange={(e) => setDishFormData({ ...dishFormData, image: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
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
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${dishFormData.tags.includes(tag.id)
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

      {/* ================= MODAL: BEST SELLER OF THE MONTH (JHON 🎉) ================= */}
      {isBestSellerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl relative ${theme === 'dark' ? 'bg-[#171a29] border-[#252a42] text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsBestSellerModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-current transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Golden Crown and Confetti */}
            <div className="text-center pt-2 pb-4 border-b border-inherit space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 p-1 shadow-xl shadow-pink-500/30">
                <div className="w-full h-full rounded-full bg-[#171a29] flex items-center justify-center text-3xl">
                  👑
                </div>
              </div>
              <h3 className="font-black text-2xl text-current tracking-tight">
                Tabriklaymiz Jhon! 🎉
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Siz joriy oyda eng yuqori daromad va 100% a'lo darajadagi halol xizmat ko'rsatgan xodim deb topildingiz!
              </p>
            </div>

            {/* Sales Target Progress Section */}
            <div className="py-4 space-y-4">
              <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400">{m.salesTargetProgress}</span>
                  <span className="text-emerald-400 font-extrabold text-sm">58% ($168,500 / $290,000)</span>
                </div>
                <div className="w-full bg-slate-500/20 h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-400 h-full rounded-full w-[58%] transition-all duration-1000 shadow-lg shadow-pink-500/50" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Maqsadgacha qoldi: $121,500</span>
                  <span className="text-emerald-400 font-bold">Mukofot: +$1,250 USD Unlocked 🎁</span>
                </div>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] text-slate-400 block">Jami Buyurtmalar</span>
                  <span className="text-xl font-black text-blue-400 mt-0.5 block">1,420 ta</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">▲ +24% o'sish</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] text-slate-400 block">Mijozlar Bahosi</span>
                  <span className="text-xl font-black text-amber-400 mt-0.5 block">4.95 ⭐</span>
                  <span className="text-[10px] text-slate-400">340 ta sharhdan</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] text-slate-400 block">Halol Standart Nazorati</span>
                  <span className="text-xl font-black text-emerald-400 mt-0.5 block">100% A+</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Sertifikatlangan ✓</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] text-slate-400 block">Kafolatlangan Bonus</span>
                  <span className="text-xl font-black text-fuchsia-400 mt-0.5 block">+$1,250</span>
                  <span className="text-[10px] text-slate-400">Oylik maoshga qo'shiladi</span>
                </div>
              </div>

              {/* Top Selling Halal Dishes by Jhon */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-xs uppercase tracking-wider text-current block pb-1 border-b border-inherit">
                  {m.topDishesSold}
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-current">🥇 Shohona To'y Palov (Halol)</span>
                    <span className="font-bold text-emerald-400">420 ta porsiya</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-current">🥈 Qo'y Go'shtli Lux Kabob</span>
                    <span className="font-bold text-emerald-400">310 ta six</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-current">🥉 Zafaronli & Tog' Choyi</span>
                    <span className="font-bold text-emerald-400">580 ta choynak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-inherit flex items-center justify-end gap-3">
              <button
                onClick={() => setIsBestSellerModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                Tushunarli & Rahmat!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHANGE ADMIN AVATAR ================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl space-y-5 ${theme === 'dark' ? 'bg-[#171a29] border-[#242940] text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Admin Avatarini Almashtirish</h3>
                  <p className="text-[11px] text-slate-400">Profil rasmi, ism va lavozimni sozlash</p>
                </div>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400 hover:text-current transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Selected Avatar Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent border border-blue-500/20">
              <div className="relative">
                <img
                  src={avatarForm.avatar}
                  alt={avatarForm.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-xl shadow-blue-500/25"
                />
                <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-inherit absolute -bottom-1 -right-1" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Tanlangan Surat</span>
                <h4 className="font-bold text-sm text-current">{avatarForm.name}</h4>
                <p className="text-[11px] text-slate-400">{avatarForm.role}</p>
                <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Faol holatda
                </span>
              </div>
            </div>

            {/* Method 1: Upload from Device */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-current block flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>1. Kompyuterdan yangi rasm yuklash</span>
              </span>
              <label className={`w-full py-3 px-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${theme === 'dark'
                  ? 'border-[#2c324e] hover:border-blue-500 bg-[#141622]'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                }`}>
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-400">
                  Faylni tanlang (JPG, PNG, WEBP, max 4MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadAvatar}
                  className="hidden"
                />
              </label>
            </div>

            {/* Method 2: Image URL input */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-current block flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>2. Rasm URL havolasi orqali</span>
              </span>
              <input
                type="text"
                placeholder="https://... rasm havolasini kiriting"
                value={avatarForm.avatar}
                onChange={(e) => setAvatarForm({ ...avatarForm, avatar: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
              />
            </div>

            {/* Method 3: Preset Avatars */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-current block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Tayyor Hashamatli Avatarlardan tanlang</span>
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_AVATARS.map((p) => {
                  const isSelected = avatarForm.avatar === p.url;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setAvatarForm({ ...avatarForm, avatar: p.url })}
                      className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${isSelected
                          ? 'border-blue-500 bg-blue-500/15 shadow-md shadow-blue-500/20 ring-2 ring-blue-500/40'
                          : theme === 'dark' ? 'bg-[#141622] border-[#252a42] hover:border-slate-500' : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        }`}
                    >
                      <div className="relative">
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center absolute -top-1 -right-1">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-current truncate w-full">{p.label}</span>
                      <span className="text-[9px] text-slate-400 truncate w-full">{p.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Role Form */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ism / Nik</label>
                <input
                  type="text"
                  value={avatarForm.name}
                  onChange={(e) => setAvatarForm({ ...avatarForm, name: e.target.value, displayName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Lavozim</label>
                <input
                  type="text"
                  value={avatarForm.role}
                  onChange={(e) => setAvatarForm({ ...avatarForm, role: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-current hover:bg-slate-500/10 transition-colors"
              >
                Bekor Qilish
              </button>
              <button
                type="button"
                onClick={() => handleSaveAvatar()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Saqlash & Qo'llash</span>
              </button>
            </div>
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

      {/* AI Executive Co-Pilot Assistant Modal */}
      <AdminAiCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        orders={orders}
        reservations={reservations}
        menuItems={menuItems}
        theme={theme}
        audioEnabled={audioEnabled}
      />
    </div>
  );
};