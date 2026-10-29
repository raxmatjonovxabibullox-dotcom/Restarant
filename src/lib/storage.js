// LocalStorage persistence service for Zafaron Restaurant
import { initialMenu, initialOrders, initialReservations } from '../data/initialMenu.js';

const KEYS = {
  MENU: 'zafaron_menu_items_v1',
  ORDERS: 'zafaron_orders_v1',
  RESERVATIONS: 'zafaron_reservations_v1',
  SETTINGS: 'zafaron_settings_v1',
  AUTH: 'zafaron_auth_v1',
  LANGUAGE: 'zafaron_language_v1',
  THEME: 'zafaron_theme_v1',
  CART: 'zafaron_cart_v1',
  ADMIN_PROFILE: 'zafaron_admin_profile_v1',
  AUTODIRECT: 'zafaron_autodirect_v1'
};

// Menu Items
export const getStoredMenu = () => {
  try {
    const data = localStorage.getItem(KEYS.MENU);
    if (!data) {
      localStorage.setItem(KEYS.MENU, JSON.stringify(initialMenu));
      return initialMenu;
    }
    const parsed = JSON.parse(data);
    // Guarantee 100% Halal tag and smooth HD imagery on all menu items
    const validated = parsed.map(dish => {
      const tags = Array.isArray(dish.tags) ? [...dish.tags] : [];
      if (!tags.includes('halal')) tags.push('halal');
      return {
        ...dish,
        tags,
        image: dish.image ? dish.image.replace('w=800&q=80', 'w=1200&q=85') : dish.image
      };
    });
    return validated;
  } catch (e) {
    console.error("Storage error:", e);
    return initialMenu;
  }
};

export const saveStoredMenu = (items) => {
  try {
    localStorage.setItem(KEYS.MENU, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save menu:", e);
  }
};

export const resetStoredMenu = () => {
  localStorage.setItem(KEYS.MENU, JSON.stringify(initialMenu));
  return initialMenu;
};

// Orders
export const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialOrders;
  }
};

export const saveStoredOrders = (orders) => {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
};

export const addStoredOrder = (order) => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);
  return updated;
};

// Reservations
export const getStoredReservations = () => {
  try {
    const data = localStorage.getItem(KEYS.RESERVATIONS);
    if (!data) {
      localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(initialReservations));
      return initialReservations;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialReservations;
  }
};

export const saveStoredReservations = (reservations) => {
  localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
};

export const addStoredReservation = (reservation) => {
  const current = getStoredReservations();
  const updated = [reservation, ...current];
  saveStoredReservations(updated);
  return updated;
};

// System Settings (Telegram bot, Supabase)
export const getStoredSettings = () => {
  const defaults = {
    telegramBotToken: '8745462281:AAF5BD8D70egcA30oGnqdpLjWjwwmGcdHZ8',
    telegramChatId: '8170197389',
    supabaseUrl: 'https://mvmrndhvcvjccliqyyvk.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXJuZGh2Y3ZqY2NsaXF5eXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NzQxOTUsImV4cCI6MjEwODI1MDE5NX0.f1XkYgaqZof0FFNjhjMoS5akylU_a2QELD8qe9C60yY',
    restaurantPhone: '+998 71 200 88 99',
    restaurantAddress: "Toshkent sh., Amir Temur shoh ko'chasi, 45",
  };

  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(data);
    let updated = false;
    if (!parsed.telegramChatId) {
      parsed.telegramChatId = defaults.telegramChatId;
      updated = true;
    }
    if (!parsed.telegramBotToken || parsed.telegramBotToken === '8975969633:AAGyCg0Y38OvLae3EOnuWDCMXuJwS_9jY9Y') {
      parsed.telegramBotToken = defaults.telegramBotToken;
      updated = true;
    }
    if (!parsed.supabaseUrl) {
      parsed.supabaseUrl = defaults.supabaseUrl;
      updated = true;
    }
    if (!parsed.supabaseAnonKey) {
      parsed.supabaseAnonKey = defaults.supabaseAnonKey;
      updated = true;
    }
    if (updated) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return defaults;
  }
};

export const saveStoredSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// Cart
export const getStoredCart = () => {
  try {
    const data = localStorage.getItem(KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredCart = (cart) => {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
};

// Auth
export const getStoredAuth = () => {
  try {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveStoredAuth = (auth) => {
  if (auth) {
    localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
  } else {
    localStorage.removeItem(KEYS.AUTH);
  }
};

// Admin Profile (Avatar, Name, Role, Contact)
export const DEFAULT_ADMIN_PROFILE = {
  name: "Jhon Doe",
  username: "admin",
  displayName: "Jhon (Admin)",
  role: "Boshqaruvchi Administrator & Best Seller",
  badge: "Super Administrator",
  email: "admin@zafaron.uz",
  phone: "+998 (90) 123-45-67",
  branch: "Zafaron Lounge Tashkent",
  shiftHours: "09:00 - 23:00 (To'liq smena)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
};

export const getStoredAdminProfile = () => {
  try {
    const data = localStorage.getItem(KEYS.ADMIN_PROFILE);
    if (!data) {
      localStorage.setItem(KEYS.ADMIN_PROFILE, JSON.stringify(DEFAULT_ADMIN_PROFILE));
      return DEFAULT_ADMIN_PROFILE;
    }
    const parsed = JSON.parse(data);
    return { ...DEFAULT_ADMIN_PROFILE, ...parsed };
  } catch (e) {
    return DEFAULT_ADMIN_PROFILE;
  }
};

export const saveStoredAdminProfile = (profile) => {
  try {
    const current = getStoredAdminProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(KEYS.ADMIN_PROFILE, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save admin profile:", e);
    return profile;
  }
};

// Auto-Direct Settings (Orders & Reservations Auto-Routing + Telegram Auto-Redirect)
export const DEFAULT_AUTODIRECT = {
  enabled: true,
  telegramDirect: true, // Orders and reservations directly forwarded to Telegram bot
  kitchenDirect: true,  // Auto-forward order to Kitchen Display System (KDS)
  customerDirectReply: true, // Auto-send direct confirmation to customer
  autoRedirectSite: true, // Automatically redirect customer after placing order
  autoRedirectDelay: 4, // Countdown in seconds before redirecting
  redirectDestination: 'telegramBot', // 'telegramBot' | 'menu' | 'receipt'
  telegramBotLink: 'https://t.me/zafaron_restarant_bot',
  directMessageTemplate: "Hurmatli {customer}! Zafaron Restaurant & Lounge'dagi #{orderId} sonli buyurtmangiz qabul qilindi va tayyorlashga yo'naltirildi. Rahmat! 🍽✨"
};

export const getStoredAutoDirect = () => {
  try {
    const data = localStorage.getItem(KEYS.AUTODIRECT);
    if (!data) {
      localStorage.setItem(KEYS.AUTODIRECT, JSON.stringify(DEFAULT_AUTODIRECT));
      return DEFAULT_AUTODIRECT;
    }
    const parsed = JSON.parse(data);
    return { ...DEFAULT_AUTODIRECT, ...parsed };
  } catch (e) {
    return DEFAULT_AUTODIRECT;
  }
};

export const saveStoredAutoDirect = (config) => {
  try {
    const current = getStoredAutoDirect();
    const updated = { ...current, ...config };
    localStorage.setItem(KEYS.AUTODIRECT, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save autodirect config:", e);
    return config;
  }
};
