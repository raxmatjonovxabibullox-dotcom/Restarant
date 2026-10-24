import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Loader2, Database } from 'lucide-react';
import { soundFx } from '../hooks/useSoundEffects';

export const LoginModal = ({ setIsAdminView }) => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { t, lang } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const tLogin = {
    uz: {
      title: "Admin Panelga Kirish",
      subtitle: "Faqat Supabase'dagi tasdiqlangan administratorlar uchun",
      securityBadge: "Faqat Supabase Authentication foydalanuvchilari qabul qilinadi",
      emailLabel: "Supabase Email",
      emailPlaceholder: "admin@zafaron.uz yoki emailingiz",
      passwordLabel: "Maxfiy Parol",
      submitting: "Supabase tekshirilmoqda...",
      submitBtn: "Tizimga Kirish",
      notice: "Admin akkauntlarini qo'shish yoki parolni o'zgartirish Supabase Dashboard > Authentication > Users bo'limida amalga oshiriladi.",
      defaultError: "Login yoki parol noto'g'ri!"
    },
    ru: {
      title: "Вход в Панель Управления",
      subtitle: "Только для авторизованных администраторов через Supabase",
      securityBadge: "Принимаются только пользователи Supabase Authentication",
      emailLabel: "Email (Supabase)",
      emailPlaceholder: "admin@zafaron.uz или ваш email",
      passwordLabel: "Пароль",
      submitting: "Проверка в Supabase...",
      submitBtn: "Войти в Систему",
      notice: "Добавление администраторов и смена паролей выполняется в панели Supabase Dashboard > Authentication > Users.",
      defaultError: "Неверный логин или пароль!"
    },
    en: {
      title: "Administrator Login",
      subtitle: "Strict authentication via Supabase Database users only",
      securityBadge: "Only registered Supabase Authentication users accepted",
      emailLabel: "Supabase Email",
      emailPlaceholder: "admin@zafaron.uz or your email",
      passwordLabel: "Password",
      submitting: "Verifying with Supabase...",
      submitBtn: "Sign In",
      notice: "Admin accounts management and password resets are handled in Supabase Dashboard > Authentication > Users.",
      defaultError: "Invalid credentials!"
    }
  };

  const cur = tLogin[lang] || tLogin.uz;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      soundFx.playPop();
      const res = await login(email, password);
      if (res.success) {
        soundFx.playSuccessFanfare();
        closeLoginModal();
        if (setIsAdminView) {
          setIsAdminView(true);
        }
      } else {
        soundFx.playChime();
        setErrorMsg(res.message || cur.defaultError);
      }
    } catch (err) {
      setErrorMsg(err.message || cur.defaultError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeLoginModal}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
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
            {cur.title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            {cur.subtitle}
          </p>
        </div>

        {/* Supabase Security Badge */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-gold-500/20 flex items-center gap-2.5 text-xs text-gold-500 font-medium">
          <Database className="w-4 h-4 shrink-0 text-gold-400" />
          <span>{cur.securityBadge}</span>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {cur.emailLabel}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={cur.emailPlaceholder}
                style={{ paddingLeft: '2.75rem' }}
                className="glass-input w-full !pl-11 text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {cur.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '2.75rem' }}
                className="glass-input w-full !pl-11 text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            id="submit-login-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{cur.submitting}</span>
              </>
            ) : (
              <>
                <span>{cur.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Notice on how to manage admins in Supabase */}
        <div className="mt-5 pt-3.5 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
            {cur.notice}
          </p>
        </div>
      </div>
    </div>
  );
};
