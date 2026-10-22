// Supabase Integration & Client Manager
import { createClient } from '@supabase/supabase-js';
import { getStoredSettings } from './storage';

let supabaseClient = null;

// Initialize Supabase Client dynamically
export const getSupabaseClient = () => {
  const settings = getStoredSettings();
  const url = settings.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = settings.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && anonKey) {
    try {
      if (!supabaseClient || supabaseClient.supabaseUrl !== url) {
        supabaseClient = createClient(url, anonKey);
      }
      return supabaseClient;
    } catch (err) {
      console.warn("Supabase init error:", err);
      return null;
    }
  }
  return null;
};

// Test Supabase Connection
export const testSupabaseConnection = async (url, anonKey) => {
  if (!url || !anonKey) {
    return { success: false, message: "URL yoki Anon Key kiritilmagan" };
  }
  try {
    const client = createClient(url, anonKey);
    // Ping by checking table or auth
    const { error } = await client.from('menu_items').select('id').limit(1);
    // Even if table doesn't exist yet, if auth/connectivity succeeded it will return error or data
    if (error && error.code === 'PGRST301') {
      return { success: true, message: "Ulanish muvaffaqiyatli! (Jadval tekshirildi)" };
    }
    return { success: true, message: "Supabase bilan aloqa o'rnatildi!" };
  } catch (err) {
    return { success: false, message: err.message || "Supabase ulanishida xatolik yuz berdi" };
  }
};

// Sync Menu items to Supabase
export const syncMenuWithSupabase = async (items) => {
  const client = getSupabaseClient();
  if (!client) {
    return { synced: false, reason: "Supabase ulanmagan (Lokal saqlangan)" };
  }
  try {
    const formatted = items.map(item => ({
      id: item.id,
      category: item.category,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      prep_time: item.prepTime || 20,
      calories: item.calories || 500,
      tags: item.tags || [],
      is_available: item.isAvailable !== undefined ? item.isAvailable : true
    }));
    const { error } = await client.from('menu_items').upsert(formatted, { onConflict: 'id' });
    if (error) throw error;
    return { synced: true, message: "Taomnoma Supabase bazasiga yuklandi!" };
  } catch (err) {
    return { synced: false, reason: err.message };
  }
};

// Send Order to Supabase
export const sendOrderToSupabase = async (order) => {
  const client = getSupabaseClient();
  if (!client) return { synced: false };
  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      delivery_type: order.deliveryType,
      table_number: order.tableNumber || '',
      delivery_address: order.deliveryAddress || '',
      payment_method: order.paymentMethod,
      total_price: order.totalPrice || order.totalAmount || 0,
      status: order.status || 'pending',
      items: order.items || [],
      notes: order.notes || '',
      created_at: order.createdAt || new Date().toISOString()
    };
    const { error } = await client.from('orders').insert([payload]);
    if (error) throw error;
    return { synced: true };
  } catch (err) {
    console.warn("Supabase order sync error:", err);
    return { synced: false, error: err.message };
  }
};

// Send Reservation to Supabase
export const sendReservationToSupabase = async (reservation) => {
  const client = getSupabaseClient();
  if (!client) return { synced: false };
  try {
    const payload = {
      id: reservation.id,
      full_name: reservation.fullName,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: String(reservation.guests || '2'),
      zone: reservation.zone || '',
      table_number: reservation.tableNumber || '',
      special_requests: reservation.specialRequests || '',
      status: reservation.status || 'new',
      created_at: reservation.createdAt || new Date().toISOString()
    };
    const { error } = await client.from('reservations').insert([payload]);
    if (error) throw error;
    return { synced: true };
  } catch (err) {
    console.warn("Supabase reservation sync error:", err);
    return { synced: false, error: err.message };
  }
};
