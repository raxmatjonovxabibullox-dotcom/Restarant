// LocalStorage persistence service for Zafaron Restaurant
import { initialMenu, initialOrders, initialReservations } from '../data/initialMenu';

const KEYS = {
  MENU: 'zafaron_menu_items_v1',
  ORDERS: 'zafaron_orders_v1',
  RESERVATIONS: 'zafaron_reservations_v1',
  SETTINGS: 'zafaron_settings_v1',
  AUTH: 'zafaron_auth_v1',
  LANGUAGE: 'zafaron_language_v1',
  THEME: 'zafaron_theme_v1',
  CART: 'zafaron_cart_v1'
};

// Menu Items
export const getStoredMenu = () => {
  try {
    const data = localStorage.getItem(KEYS.MENU);
    if (!data) {
      localStorage.setItem(KEYS.MENU, JSON.stringify(initialMenu));
      return initialMenu;
    }
    return JSON.parse(data);
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
    telegramBotToken: '8975969633:AAGyCg0Y38OvLae3EOnuWDCMXuJwS_9jY9Y',
    telegramChatId: '8170197389',
    supabaseUrl: 'https://mvmrndhvcvjccliqyyvk.supabase.co',
    supabaseAnonKey: '',
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
      parsed.telegramChatId = '8170197389';
      updated = true;
    }
    if (!parsed.telegramBotToken) {
      parsed.telegramBotToken = '8975969633:AAGyCg0Y38OvLae3EOnuWDCMXuJwS_9jY9Y';
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
