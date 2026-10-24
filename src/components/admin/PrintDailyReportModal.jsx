import React from 'react';
import { X, Printer } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { soundFx } from '../../hooks/useSoundEffects';

export const PrintDailyReportModal = ({ isOpen, onClose, orders, reservations, menuItems, formatPrice }) => {
  const { lang, getLocalized } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playChime();
    window.print();
  };

  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'cancelled' ? sum + Number(o.totalPrice || o.totalAmount || 0) : sum),
    0
  );

  const cardRevenue = orders.reduce(
    (sum, o) =>
      o.status !== 'cancelled' && o.paymentMethod === 'card'
        ? sum + Number(o.totalPrice || o.totalAmount || 0)
        : sum,
    0
  );

  const cashRevenue = totalRevenue - cardRevenue;

  const dineInCount = orders.filter((o) => o.deliveryType === 'dineIn').length;
  const deliveryCount = orders.filter((o) => o.deliveryType === 'delivery').length;

  const nowString = new Date().toLocaleString(
    lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  // Localized texts
  const tReport = {
    barTitle: lang === 'ru' ? 'Ежедневный Кассовый Отчет' : lang === 'en' ? 'Daily Cash & Shift Report' : 'Kunlik Kassa & Smena Hisoboti',
    printBtn: lang === 'ru' ? 'Печать' : lang === 'en' ? 'Print Report' : 'Chop Etish',
    subtitle: lang === 'ru' ? 'ОФИЦИАЛЬНЫЙ КАССОВЫЙ ОТЧЕТ СМЕНЫ' : lang === 'en' ? 'OFFICIAL DAILY SHIFT AUDIT REPORT' : 'RASMIY KUNLIK SMENA HISOBOTI',
    dateTime: lang === 'ru' ? 'Дата и время' : lang === 'en' ? 'Date & Time' : 'Sana va vaqt',
    sec1: lang === 'ru' ? '1. ФИНАНСОВАЯ СТАТИСТИКА ВЫРУЧКИ:' : lang === 'en' ? '1. FINANCIAL REVENUE SUMMARY:' : '1. MOLIYAVIY TUSHUM STATISTIKASI:',
    totalRevenue: lang === 'ru' ? 'ОБЩАЯ ВЫРУЧКА ЗА ДЕНЬ:' : lang === 'en' ? 'TOTAL DAILY REVENUE:' : 'JAMI KUNLIK SAVDO:',
    cardRev: lang === 'ru' ? '• Картой (Click / Payme):' : lang === 'en' ? '• Card (Click / Payme):' : '• Karta (Click / Payme):',
    cashRev: lang === 'ru' ? '• Наличные:' : lang === 'en' ? '• Cash on delivery:' : '• Naqd pul:',
    sec2: lang === 'ru' ? '2. ЗАКАЗЫ И ГОСТИ:' : lang === 'en' ? '2. ORDERS & GUEST METRICS:' : '2. BUYURTMA VA MEHMONLAR:',
    totalOrders: lang === 'ru' ? 'Всего заказов:' : lang === 'en' ? 'Total Orders:' : 'Jami buyurtmalar:',
    dineIn: lang === 'ru' ? '• В зале (Столик):' : lang === 'en' ? '• Dine-in (Table):' : '• Restoranda (Stol):',
    delivery: lang === 'ru' ? '• Доставка (Delivery):' : lang === 'en' ? '• Delivery:' : '• Yetkazib berish (Delivery):',
    resCount: lang === 'ru' ? 'Бронирование столов:' : lang === 'en' ? 'Table Reservations:' : 'Stol bandliklari:',
    sec3: lang === 'ru' ? '3. ЛИДЕРЫ ПРОДАЖ (ХИТЫ):' : lang === 'en' ? '3. TOP SELLING DISHES:' : '3. ENG KO\'P SOTILGAN TAOMLAR:',
    adminSign: lang === 'ru' ? 'Главный Администратор: _______________' : lang === 'en' ? 'Executive Administrator: _______________' : 'Bosh Administrator: _________________',
    cashierSign: lang === 'ru' ? 'Старший Кассир: ____________________' : lang === 'en' ? 'Senior Cashier: ____________________' : 'Katta Kassir: ______________________',
    signature: lang === 'ru' ? 'Подпись: _________' : lang === 'en' ? 'Signature: _________' : 'Imzo: _________',
    footerNote: lang === 'ru' ? 'Автоматизированная система управления Zafaron Lounge' : lang === 'en' ? 'Zafaron Lounge Automated Hospitality System' : 'Zafaron Lounge avtomatlashtirilgan boshqaruv tizimi'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-2 print:w-full print:max-w-none">
        {/* Action Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-white/10 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider gold-gradient-text">
            {tReport.barTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{tReport.printBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT BODY */}
        <div className="space-y-4 font-mono text-xs">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-gray-300 dark:border-gray-700 print:border-gray-400">
            <h1 className="font-serif font-black text-2xl tracking-wider text-gray-900 dark:text-white uppercase print:text-black">
              ZAFARON RESTAURANT & LOUNGE
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5 print:text-gray-600">
              {tReport.subtitle}
            </p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 print:text-gray-600">
              {tReport.dateTime}: {nowString}
            </p>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-2 py-2 border-b border-gray-200 dark:border-gray-800 print:border-gray-300">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 block print:text-gray-600">
              {tReport.sec1}
            </span>
            <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white print:text-black">
              <span>{tReport.totalRevenue}</span>
              <span className="text-gold-600 dark:text-gold-400 font-black print:text-black">{formatPrice(totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 print:text-gray-700">
              <span>{tReport.cardRev}</span>
              <span className="font-semibold">{formatPrice(cardRevenue)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 print:text-gray-700">
              <span>{tReport.cashRev}</span>
              <span className="font-semibold">{formatPrice(cashRevenue)}</span>
            </div>
          </div>

          {/* Orders & Guest metrics */}
          <div className="space-y-1.5 py-2 border-b border-gray-200 dark:border-gray-800 print:border-gray-300">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 block print:text-gray-600">
              {tReport.sec2}
            </span>
            <div className="flex justify-between text-gray-800 dark:text-gray-200 print:text-black">
              <span>{tReport.totalOrders}</span>
              <span className="font-bold">{orders.length}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 print:text-gray-700">
              <span>{tReport.dineIn}</span>
              <span className="font-semibold">{dineInCount}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 print:text-gray-700">
              <span>{tReport.delivery}</span>
              <span className="font-semibold">{deliveryCount}</span>
            </div>
            <div className="flex justify-between text-gray-800 dark:text-gray-200 print:text-black">
              <span>{tReport.resCount}</span>
              <span className="font-bold">{reservations.length}</span>
            </div>
          </div>

          {/* Top Selling Dishes */}
          <div className="space-y-1.5 py-2 border-b border-gray-200 dark:border-gray-800 print:border-gray-300">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 block print:text-gray-600">
              {tReport.sec3}
            </span>
            {menuItems.slice(0, 4).map((dish, i) => (
              <div key={dish.id} className="flex justify-between text-[11px] text-gray-800 dark:text-gray-200 print:text-black">
                <span>{i + 1}. {getLocalized(dish.name)}</span>
                <span className="font-bold">{formatPrice(dish.price)}</span>
              </div>
            ))}
          </div>

          {/* Signatures */}
          <div className="pt-6 space-y-4 text-[11px] text-gray-600 dark:text-gray-400 print:text-gray-600">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 print:border-gray-400">
              <span>{tReport.adminSign}</span>
              <span>{tReport.signature}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 print:border-gray-400">
              <span>{tReport.cashierSign}</span>
              <span>{tReport.signature}</span>
            </div>
            <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 italic pt-2 print:text-gray-400">
              {tReport.footerNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
