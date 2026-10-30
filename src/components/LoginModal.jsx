import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Loader2, Database, Sparkles } from 'lucide-react';
import { soundFx } from '../hooks/useSoundEffects';

export const LoginModal = ({ setIsAdminView }) => {
  const { isLoginModalOpen, closeLoginModal, login, signUp } = useAuth();
  const { lang } = useLanguage();

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const tLogin = {
    uz: {
      title: authMode === 'login' ? "Supabase Admin Kirish" : "Yangi Supabase Admin Qo'shish",
      subtitle: "Faqat rasmiy Supabase Authentication tizimi orqali",
      securityBadge: "Supabase Live Auth & Role-Based Access Control",
      tabLogin: "Tizimga Kirish (Supabase)",
      tabSignUp: "Ro'yxatdan O'tish (Supabase)",
      nameLabel: "To'liq Ism (Full Name)",
      namePlaceholder: "Masalan: Jasur Rahimov",
      emailLabel: "Supabase Email yoki Foydalanuvchi nomi",
      emailPlaceholder: "admin@zafaron.uz yoki user@gmail.com",
      passwordLabel: "Maxfiy Parol",
      submitting: "Supabase tekshirmoqda...",
      submitBtn: authMode === 'login' ? "Supabase orqali Kirish" : "Supabase'da Ro'yxatdan O'tish",
      notice: "🔒 Boshqa parollar mumkin emas! Faqat Supabase bazasida mavjud bo'lgan foydalanuvchilar qabul qilinadi. Baza: mvmrndhvcvjccliqyyvk.supabase.co",
      defaultError: "Login yoki parol noto'g'ri! Faqat Supabase foydalanuvchilari qabul qilinadi."
    },
    ru: {
      title: authMode === 'login' ? "Вход в Supabase Админ" : "Регистрация в Supabase",
      subtitle: "Исключительно через официальную аутентификацию Supabase",
      securityBadge: "Supabase Live Auth & Защита Данных",
      tabLogin: "Вход (Supabase)",
      tabSignUp: "Регистрация (Supabase)",
      nameLabel: "Полное Имя",
      namePlaceholder: "Например: Жасур Рахимов",
      emailLabel: "Email или Имя пользователя Supabase",
      emailPlaceholder: "admin@zafaron.uz или user@gmail.com",
      passwordLabel: "Пароль",
      submitting: "Supabase проверяет...",
      submitBtn: authMode === 'login' ? "Войти через Supabase" : "Зарегистрироваться в Supabase",
      notice: "🔒 Другие пароли отключены! Доступ разрешен только пользователям базы данных Supabase.",
      defaultError: "Неверный логин или пароль! Доступ только для пользователей Supabase."
    },
    en: {
      title: authMode === 'login' ? "Supabase Admin Portal" : "Register Supabase Admin",
      subtitle: "Strictly authenticated via official Supabase Auth",
      securityBadge: "Supabase Live Auth & Role-Based Security",
      tabLogin: "Sign In (Supabase)",
      tabSignUp: "Register (Supabase)",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. Jasur Rahimov",
      emailLabel: "Supabase Email or Username",
      emailPlaceholder: "admin@zafaron.uz or user@gmail.com",
      passwordLabel: "Password",
      submitting: "Verifying with Supabase...",
      submitBtn: authMode === 'login' ? "Sign In with Supabase" : "Create Account in Supabase",
      notice: "🔒 Other passwords are not allowed! Only verified Supabase users can access the system.",
      defaultError: "Invalid credentials! Only authorized Supabase users are accepted."
    }
  };

  const cur = tLogin[lang] || tLogin.uz;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      soundFx.playPop();
      let res;
      if (authMode === 'signup') {
        res = await signUp(email, password, fullName);
      } else {
        res = await login(email, password);
      }

      if (res.success) {
        soundFx.playSuccessFanfare();
        setSuccessMsg("Supabase foydalanuvchisi qabul qilindi! Admin panel ochilmoqda...");
        setTimeout(() => {
          closeLoginModal();
          if (setIsAdminView) {
            setIsAdminView(true);
          }
        }, 300);
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

        {/* Tab Switcher: Login vs SignUp */}
        <div className="mb-4 grid grid-cols-2 p-1 rounded-2xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-white dark:bg-dark-900 text-amber-500 dark:text-gold-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {cur.tabLogin}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-white dark:bg-dark-900 text-amber-500 dark:text-gold-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {cur.tabSignUp}
          </button>
        </div>

        {/* Supabase Security Badge */}
        <div className="mb-4 p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800/80 border border-gray-200 dark:border-white/5 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
          <Database className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{cur.securityBadge}</span>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 text-center font-medium leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {cur.nameLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={cur.namePlaceholder}
                  style={{ paddingLeft: '2.75rem' }}
                  className="glass-input w-full !pl-11 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

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
                type="text"
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
            className="w-full py-3 rounded-xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none text-dark-950"
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
