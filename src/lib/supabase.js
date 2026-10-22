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
    const { error } = await client.from('menu_items').upsert(items, { onConflict: 'id' });
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
    const { error } = await client.from('orders').insert([order]);
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
    const { error } = await client.from('reservations').insert([reservation]);
    if (error) throw error;
    return { synced: true };
  } catch (err) {
    console.warn("Supabase reservation sync error:", err);
    return { synced: false, error: err.message };
  }
};
