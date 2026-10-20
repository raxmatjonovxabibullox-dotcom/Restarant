import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, User, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

export const LoginModal = ({ setIsAdminView }) => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (res.success) {
      closeLoginModal();
      if (res.user.role === 'admin') {
        setIsAdminView(true);
      }
    } else {
      setErrorMsg(res.message || t('auth.invalidCredentials'));
    }
  };

  // Quick Demo Admin Helper
  const handleQuickAdminLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    const res = login('admin', 'admin123');
    if (res.success) {
      closeLoginModal();
      setIsAdminView(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeLoginModal}
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-400 p-0.5 shadow-gold-500/30 shadow-lg mb-3">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <h2 className="font-serif font-bold text-2xl text-gray-900 dark:text-white">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('auth.username')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin yoki username"
                className="glass-input w-full pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-10 text-sm"
              />
            </div>
          </div>

          <button
            id="submit-login-btn"
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all hover:scale-[1.02]"
          >
            <span>{t('auth.signIn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Admin Button */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            {t('auth.adminHint')}
          </div>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-2 px-3 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gold-500/10 hover:border-gold-500/40 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gold-500 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            1-Klikda Tezkor Admin Kirish (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
