import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, saveStoredAuth } from '../lib/storage';
import { getSupabaseClient } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuth());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Sync Supabase Auth session on mount and listen to changes
  useEffect(() => {
    let isMounted = true;
    const client = getSupabaseClient();

    if (client) {
      // 1. Check existing Supabase session
      client.auth.getSession().then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split('@')[0] || 'admin',
            displayName: session.user.user_metadata?.full_name || session.user.email,
            role: 'admin',
            loggedInAt: new Date().toISOString()
          };
          setUser(authUser);
          saveStoredAuth(authUser);
        } else {
          // If no active Supabase session, keep local master admin if flagged, otherwise clear
          const stored = getStoredAuth();
          if (stored?.role === 'admin' && !session && !stored?.isLocalMaster) {
            setUser(null);
            saveStoredAuth(null);
          }
        }
        setIsLoadingAuth(false);
      }).catch(() => {
        if (isMounted) setIsLoadingAuth(false);
      });

      // 2. Listen to Supabase Auth State changes (login, logout, token refresh)
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split('@')[0] || 'admin',
            displayName: session.user.user_metadata?.full_name || session.user.email,
            role: 'admin',
            loggedInAt: new Date().toISOString()
          };
          setUser(authUser);
          saveStoredAuth(authUser);
        } else if (event === 'SIGNED_OUT') {
          const stored = getStoredAuth();
          if (!stored?.isLocalMaster) {
            setUser(null);
            saveStoredAuth(null);
          }
        }
      });

      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  // Supabase Login with Master Admin fallback
  const login = async (emailInput, password) => {
    const cleanEmail = emailInput?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // 1. Check Master Admin Credentials
    const isMasterEmail = cleanEmail === 'admin@zafaron.uz' || cleanEmail === 'admin';
    const validMasterPasswords = ['admin123', 'zafaron2025', 'zafaron2026', 'admin'];
    
    if (isMasterEmail && validMasterPasswords.includes(cleanPassword)) {
      const masterUser = {
        id: 'master-admin-zafaron',
        email: 'admin@zafaron.uz',
        username: 'admin',
        displayName: 'Bosh Administrator (Executive Suite)',
        role: 'admin',
        isLocalMaster: true,
        loggedInAt: new Date().toISOString()
      };
      setUser(masterUser);
      saveStoredAuth(masterUser);
      return { success: true, user: masterUser };
    }

    const client = getSupabaseClient();
    if (!client) {
      // If client not connected and not master credentials
      return {
        success: false,
        message: "Supabase serveriga ulanish mavjud emas. Master admin uchun 'admin@zafaron.uz' / 'admin123' dan foydalaning!"
      };
    }

    if (!cleanEmail) {
      return { success: false, message: "Iltimos, Supabase emailingizni kiriting!" };
    }

    if (!cleanEmail.includes('@')) {
      return {
        success: false,
        message: "Iltimos, to'liq emailingizni kiriting (masalan: admin@zafaron.uz yoki admin@example.com)"
      };
    }

    if (!cleanPassword) {
      return { success: false, message: "Iltimos, parolingizni kiriting!" };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: "Noto'g'ri email yoki parol! Supabase foydalanuvchisi yoki Master Admin ('admin@zafaron.uz' / 'admin123') dan foydalaning."
          };
        }
        return { success: false, message: error.message };
      }

      if (data?.user) {
        const authUser = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split('@')[0] || 'admin',
          displayName: data.user.user_metadata?.full_name || data.user.email,
          role: 'admin',
          loggedInAt: new Date().toISOString()
        };
        setUser(authUser);
        saveStoredAuth(authUser);
        return { success: true, user: authUser };
      }

      return { success: false, message: "Foydalanuvchi ma'lumotlari topilmadi!" };
    } catch (err) {
      return { success: false, message: err.message || "Tizimga kirishda xatolik yuz berdi" };
    }
  };

  const logout = async () => {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.auth.signOut();
      }
    } catch (e) {
      console.warn("SignOut error:", e);
    }
    setUser(null);
    saveStoredAuth(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: Boolean(user && user.role === 'admin'),
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      login,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
