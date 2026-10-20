import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, saveStoredAuth } from '../lib/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuth());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    saveStoredAuth(user);
  }, [user]);

  const login = (username, password) => {
    // Admin credentials
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'admin' && password === 'admin123') {
      const adminData = {
        username: 'admin',
        displayName: 'Boshqaruvchi (Admin)',
        role: 'admin',
        loggedInAt: new Date().toISOString()
      };
      setUser(adminData);
      return { success: true, user: adminData };
    }

    // Client/Guest credentials with any username
    if (cleanUser && password.length >= 3) {
      const userData = {
        username: cleanUser,
        displayName: username.trim(),
        role: 'customer',
        loggedInAt: new Date().toISOString()
      };
      setUser(userData);
      return { success: true, user: userData };
    }

    return { success: false, message: "Noto'g'ri login yoki parol!" };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
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
