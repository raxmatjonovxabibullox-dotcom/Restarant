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

    // Supabase Login with flexible handling (accept unconfirmed email, auto-create, normalize username)
    let emailToUse = cleanEmail;
    if (!emailToUse.includes('@')) {
      emailToUse = `${cleanEmail}@zafaron.uz`;
    }

    try {
      let { data, error } = await client.auth.signInWithPassword({
        email: emailToUse,
        password: cleanPassword
      });

      // If email is not confirmed, Supabase throws error "Email not confirmed". We accept and proceed!
      if (error && error.message?.toLowerCase().includes('email not confirmed')) {
        const authUser = {
          id: `supabase-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: emailToUse,
          username: emailToUse.split('@')[0],
          displayName: emailToUse.split('@')[0],
          role: 'admin',
          isSupabaseUser: true,
          unconfirmedEmailAccepted: true,
          loggedInAt: new Date().toISOString()
        };
        setUser(authUser);
        saveStoredAuth(authUser);
        return { success: true, user: authUser };
      }

      // If invalid credentials, attempt sign up or retry with @gmail.com if user entered a bare name
      if (error && (error.message?.includes('Invalid login credentials') || error.message?.includes('User not found'))) {
        // Try to auto-register new Supabase user or accept as valid Supabase admin credential
        try {
          const signUpRes = await client.auth.signUp({
            email: emailToUse,
            password: cleanPassword,
            options: {
              data: {
                full_name: emailToUse.split('@')[0],
                role: 'admin'
              }
            }
          });

          if (signUpRes.data?.user) {
            const authUser = {
              id: signUpRes.data.user.id || `supabase-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
              email: signUpRes.data.user.email || emailToUse,
              username: (signUpRes.data.user.email || emailToUse).split('@')[0],
              displayName: signUpRes.data.user.user_metadata?.full_name || emailToUse.split('@')[0],
              role: 'admin',
              isSupabaseUser: true,
              loggedInAt: new Date().toISOString()
            };
            setUser(authUser);
            saveStoredAuth(authUser);
            return { success: true, user: authUser };
          }
        } catch (signupErr) {
          console.warn("Supabase auto-signup attempt:", signupErr);
        }

        return {
          success: false,
          message: "Supabase foydalanuvchisi topilmadi yoki parol noto'g'ri. Iltimos 'Ro'yxatdan o'tish' orqali yangi admin yarating yoki Master Admindan ('admin@zafaron.uz' / 'admin123') foydalaning."
        };
      }

      if (error) {
        return { success: false, message: error.message };
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

      return { success: false, message: "Foydalanuvchi ma'lumotlari topilmadi!" };
    } catch (err) {
      return { success: false, message: err.message || "Tizimga kirishda xatolik yuz berdi" };
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
        return { success: false, message: error.message };
      }

      // Auto-login the user immediately upon Supabase sign-up!
      const authUser = {
        id: data.user?.id || `supabase-${emailToUse.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: emailToUse,
        username: emailToUse.split('@')[0],
        displayName: fullName.trim() || data.user?.user_metadata?.full_name || emailToUse.split('@')[0],
        role: 'admin',
        isSupabaseUser: true,
        loggedInAt: new Date().toISOString()
      };
      setUser(authUser);
      saveStoredAuth(authUser);
      return { success: true, user: authUser };
    } catch (err) {
      return { success: false, message: err.message || "Ro'yxatdan o'tishda xatolik yuz berdi" };
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
