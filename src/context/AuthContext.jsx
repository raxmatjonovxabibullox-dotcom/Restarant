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
            isSupabaseUser: true,
            loggedInAt: new Date().toISOString()
          };
          setUser(authUser);
          saveStoredAuth(authUser);
        } else {
          // Strictly clear if no active Supabase session
          setUser(null);
          saveStoredAuth(null);
        }
        setIsLoadingAuth(false);
      }).catch(() => {
        if (isMounted) setIsLoadingAuth(false);
      });

      // 2. Listen to Supabase Auth State changes (login, logout, token refresh)
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split('@')[0] || 'admin',
            displayName: session.user.user_metadata?.full_name || session.user.email,
            role: 'admin',
            isSupabaseUser: true,
            loggedInAt: new Date().toISOString()
          };
          setUser(authUser);
          saveStoredAuth(authUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          saveStoredAuth(null);
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

  // Pure Supabase Auth Login (boshqa parollar va lokal bypass mutlaqo taqiqlanadi)
  const login = async (emailInput, password) => {
    const cleanEmail = emailInput?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        message: "Supabase email va maxfiy parolni kiriting!"
      };
    }

    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        message: "Supabase serveriga ulanish mavjud emas! Sozlamalarni tekshiring."
      };
    }

    let emailToUse = cleanEmail;
    if (!emailToUse.includes('@')) {
      emailToUse = `${cleanEmail}@zafaron.uz`;
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: emailToUse,
        password: cleanPassword
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          return {
            success: false,
            message: "Supabase: Noto'g'ri login yoki parol! Boshqa parollar mumkin emas, faqat Supabase'dagi to'g'ri foydalanuvchi qabul qilinadi."
          };
        }
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            message: "Supabase: Pochtangiz (Email) tasdiqlanmagan. Iltimos pochtangizdagi tasdiqlash xatini tekshiring yoki yangi hisob oching."
          };
        }
        return {
          success: false,
          message: `Supabase: ${error.message}`
        };
      }

      if (data?.user) {
        const authUser = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split('@')[0] || cleanEmail,
          displayName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || cleanEmail,
          role: 'admin',
          isSupabaseUser: true,
          loggedInAt: new Date().toISOString()
        };
        setUser(authUser);
        saveStoredAuth(authUser);
        return { success: true, user: authUser };
      }

      return { success: false, message: "Supabase foydalanuvchisi topilmadi!" };
    } catch (err) {
      return { success: false, message: err.message || "Supabase tizimiga kirishda xatolik yuz berdi" };
    }
  };

  // Direct Supabase User Registration (Sign Up)
  const signUp = async (emailInput, password, fullName = '') => {
    const cleanEmail = emailInput?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: "Email va parolni to'ldiring!" };
    }

    let emailToUse = cleanEmail;
    if (!emailToUse.includes('@')) {
      emailToUse = `${cleanEmail}@zafaron.uz`;
    }

    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: "Supabase serveriga ulanish mavjud emas!" };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: emailToUse,
        password: cleanPassword,
        options: {
          data: {
            full_name: fullName.trim() || emailToUse.split('@')[0],
            role: 'admin'
          }
        }
      });

      if (error) {
        return { success: false, message: `Supabase: ${error.message}` };
      }

      if (data?.user) {
        const authUser = {
          id: data.user.id,
          email: data.user.email || emailToUse,
          username: (data.user.email || emailToUse).split('@')[0],
          displayName: fullName.trim() || data.user.user_metadata?.full_name || emailToUse.split('@')[0],
          role: 'admin',
          isSupabaseUser: true,
          loggedInAt: new Date().toISOString()
        };
        setUser(authUser);
        saveStoredAuth(authUser);
        return { success: true, user: authUser };
      }

      return { success: false, message: "Supabase'da foydalanuvchi yaratilmadi!" };
    } catch (err) {
      return { success: false, message: err.message || "Supabase ro'yxatdan o'tish xatosi" };
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
      signUp,
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
