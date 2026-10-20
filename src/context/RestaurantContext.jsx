import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredMenu,
  saveStoredMenu,
  resetStoredMenu,
  getStoredOrders,
  saveStoredOrders,
  addStoredOrder,
  getStoredReservations,
  saveStoredReservations,
  addStoredReservation
} from '../lib/storage';
import { syncMenuWithSupabase, sendOrderToSupabase, sendReservationToSupabase } from '../lib/supabase';
import { sendTelegramOrder, sendTelegramReservation } from '../services/telegramService';
import confetti from 'canvas-confetti';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  // Menu Items State
  const [menuItems, setMenuItems] = useState(() => getStoredMenu());

  // Orders State
  const [orders, setOrders] = useState(() => getStoredOrders());

  // Reservations State
  const [reservations, setReservations] = useState(() => getStoredReservations());

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState(200000);
  const [sortBy, setSortBy] = useState('default');

  // Dish Detail Modal State
  const [selectedDishModal, setSelectedDishModal] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Synchronize menu changes
  useEffect(() => {
    saveStoredMenu(menuItems);
  }, [menuItems]);

  // Synchronize orders changes
  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  // Synchronize reservations changes
  useEffect(() => {
    saveStoredReservations(reservations);
  }, [reservations]);

  // --- CRUD DISHES ---
  const addDish = async (dishData) => {
    const newDish = {
      ...dishData,
      id: `dish-${Date.now()}`,
      rating: dishData.rating || 5.0,
      ordersCount: dishData.ordersCount || 0,
      isAvailable: dishData.isAvailable !== undefined ? dishData.isAvailable : true
    };
    const updated = [newDish, ...menuItems];
    setMenuItems(updated);
    saveStoredMenu(updated);
    await syncMenuWithSupabase(updated);
    showToast("Yangi taom muvaffaqiyatli qo'shildi!");
    return newDish;
  };

  const updateDish = async (dishId, updatedFields) => {
    const updated = menuItems.map(item => item.id === dishId ? { ...item, ...updatedFields } : item);
    setMenuItems(updated);
    saveStoredMenu(updated);
    await syncMenuWithSupabase(updated);
    showToast("Taom ma'lumotlari muvaffaqiyatli yangilandi!");
  };

  const deleteDish = async (dishId) => {
    const updated = menuItems.filter(item => item.id !== dishId);
    setMenuItems(updated);
    saveStoredMenu(updated);
    await syncMenuWithSupabase(updated);
    showToast("Taom menyudan o'chirildi", "info");
  };

  const toggleDishAvailability = async (dishId) => {
    const dish = menuItems.find(i => i.id === dishId);
    if (!dish) return;
    await updateDish(dishId, { isAvailable: !dish.isAvailable });
  };

  const resetToDefaultMenu = () => {
    const defaultData = resetStoredMenu();
    setMenuItems(defaultData);
    showToast("Menyu standart holatga qaytarildi!", "info");
  };

  // --- ORDERS ---
  const placeOrder = async (orderPayload) => {
    const newOrder = {
      ...orderPayload,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1. Save locally
    const updatedOrders = addStoredOrder(newOrder);
    setOrders(updatedOrders);

    // 2. Celebrate with Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // 3. Sync to Supabase
    sendOrderToSupabase(newOrder);

    // 4. Send to Telegram Bot
    const tgRes = await sendTelegramOrder(newOrder);
    if (tgRes?.success) {
      showToast("Buyurtmangiz qabul qilindi va Telegram botga yuborildi!", "success");
    } else if (tgRes?.notConfigured) {
      showToast("Buyurtma qabul qilindi! (Telegram bot sozlanmagan)", "success");
    } else {
      showToast("Buyurtma qabul qilindi!", "success");
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Buyurtma holati o'zgartirildi: ${newStatus}`);
  };

  // --- RESERVATIONS ---
  const makeReservation = async (reservationPayload) => {
    const newReservation = {
      ...reservationPayload,
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // 1. Save locally
    const updated = addStoredReservation(newReservation);
    setReservations(updated);

    // 2. Confetti
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    // 3. Supabase
    sendReservationToSupabase(newReservation);

    // 4. Telegram Bot
    const tgRes = await sendTelegramReservation(newReservation);
    if (tgRes?.success) {
      showToast("Stol muvaffaqiyatli band qilindi va Telegram botga yuborildi!", "success");
    } else {
      showToast("Stol muvaffaqiyatli band qilindi!", "success");
    }

    return newReservation;
  };

  const updateReservationStatus = (resId, newStatus) => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: newStatus } : r));
    showToast("Stol bandligi yangilandi");
  };

  return (
    <RestaurantContext.Provider value={{
      menuItems,
      orders,
      reservations,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedTag,
      setSelectedTag,
      maxPriceFilter,
      setMaxPriceFilter,
      sortBy,
      setSortBy,
      selectedDishModal,
      setSelectedDishModal,
      toast,
      showToast,
      addDish,
      updateDish,
      deleteDish,
      toggleDishAvailability,
      resetToDefaultMenu,
      placeOrder,
      updateOrderStatus,
      makeReservation,
      updateReservationStatus
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
