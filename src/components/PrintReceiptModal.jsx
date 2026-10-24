import React from 'react';
import { X, Printer } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

export const PrintReceiptModal = ({ order, isOpen, onClose }) => {
  const { formatPrice } = useCurrency();
  const { lang, getLocalized } = useLanguage();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    soundFx.playChime();
    window.print();
  };

  const parsedDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const currentDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleString(
        lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    : '';

  // Localized receipt labels
  const tReceipt = {
    modalTitle: lang === 'ru' ? 'Официальный Чек Оплаты' : lang === 'en' ? 'Official Payment Receipt' : "Rasmiy To'lov Cheki",
    printBtn: lang === 'ru' ? 'Печать' : lang === 'en' ? 'Print' : 'Chop etish',
    address: lang === 'ru' ? 'г. Ташкент, пр-т Амира Темура, 45' : lang === 'en' ? 'Tashkent, 45 Amir Temur Avenue' : "Toshkent sh., Amir Temur shoh ko'chasi, 45",
    receiptNum: lang === 'ru' ? 'НОМЕР ЧЕКА:' : lang === 'en' ? 'RECEIPT #:' : 'CHEK RAQAMI:',
    dateTime: lang === 'ru' ? 'ДАТА И ВРЕМЯ:' : lang === 'en' ? 'DATE & TIME:' : 'SANA VA VAQT:',
    customer: lang === 'ru' ? 'КЛИЕНТ:' : lang === 'en' ? 'CUSTOMER:' : 'MIJOZ:',
    phone: lang === 'ru' ? 'ТЕЛЕФОН:' : lang === 'en' ? 'PHONE:' : 'TEL:',
    type: lang === 'ru' ? 'СПОСОБ:' : lang === 'en' ? 'SERVICE:' : 'TUR:',
    dineIn: (t) => lang === 'ru' ? `В зале (Стол: ${t || '-'})` : lang === 'en' ? `Dine-in (Table: ${t || '-'})` : `Restoranda (Stol: ${t || '-'})`,
    delivery: lang === 'ru' ? 'Доставка курьером' : lang === 'en' ? 'Home Delivery' : 'Yetkazib berish',
    addressLabel: lang === 'ru' ? 'АДРЕС:' : lang === 'en' ? 'ADDRESS:' : 'MANZIL:',
    dishHeader: lang === 'ru' ? 'БЛЮДО' : lang === 'en' ? 'ITEM' : 'TAOM',
    sumHeader: lang === 'ru' ? 'СУММА' : lang === 'en' ? 'AMOUNT' : 'SUMMA',
    serviceFee: lang === 'ru' ? 'Обслуживание (0%):' : lang === 'en' ? 'Service Fee (0%):' : 'Xizmat haqi (0%):',
    totalPayment: lang === 'ru' ? 'ИТОГО К ОПЛАТЕ:' : lang === 'en' ? 'TOTAL PAYMENT:' : "JAMI TO'LOV:",
    paymentMethod: lang === 'ru' ? 'Способ оплаты:' : lang === 'en' ? 'Payment Method:' : "To'lov usuli:",
    card: lang === 'ru' ? 'Карта (Payme/Click)' : lang === 'en' ? 'Card (Payme/Click)' : 'Karta (Payme/Click)',
    cash: lang === 'ru' ? 'Наличные' : lang === 'en' ? 'Cash' : 'Naqd pul',
    thankYou: lang === 'ru' ? 'Спасибо за визит!' : lang === 'en' ? 'Thank you for your dining!' : 'Tashrifingiz uchun tashakkur!'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-slide-up print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-4 print:w-full print:max-w-none">
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-white/10 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider gold-gradient-text">
            {tReceipt.modalTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{tReceipt.printBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RECEIPT CONTENT (Printable) */}
        <div className="space-y-4 font-mono text-xs">
          {/* Brand Header */}
          <div className="text-center pb-3 border-b border-dashed border-gray-300 dark:border-gray-700 print:border-gray-400">
            <h2 className="font-serif font-black text-xl tracking-wider text-gray-900 dark:text-white uppercase print:text-black">
              ZAFARON
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 print:text-gray-600">
              Restaurant & Lounge
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 print:text-gray-600">
              {tReceipt.address}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 print:text-gray-600">
              Tel: +998 71 200 88 99
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-1 text-gray-700 dark:text-gray-300 pb-3 border-b border-dashed border-gray-300 dark:border-gray-700 print:border-gray-400 print:text-gray-700">
            <div className="flex justify-between">
              <span>{tReceipt.receiptNum}</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>{tReceipt.dateTime}</span>
              <span>{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span>{tReceipt.customer}</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>{tReceipt.phone}</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>{tReceipt.type}</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">
                {order.deliveryType === 'dineIn'
                  ? tReceipt.dineIn(order.tableNumber)
                  : tReceipt.delivery}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between">
                <span>{tReceipt.addressLabel}</span>
                <span className="text-right truncate max-w-[180px]">{order.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-1 print:border-gray-300 print:text-gray-600">
              <span>{tReceipt.dishHeader}</span>
              <span className="text-right">{tReceipt.sumHeader}</span>
            </div>
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <div className="flex-1 pr-2">
                  <span className="font-semibold text-gray-900 dark:text-white print:text-black">{getLocalized(item.name)}</span>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 print:text-gray-600">
                    {item.quantity} x {formatPrice(item.price)}
                    {item.selectedPortion && ` (${item.selectedPortion})`}
                  </div>
                </div>
                <span className="font-bold whitespace-nowrap text-gray-900 dark:text-white print:text-black">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total & Summary */}
          <div className="pt-3 border-t border-dashed border-gray-400 dark:border-gray-700 space-y-1.5 print:border-gray-400">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 print:text-gray-600">
              <span>{tReceipt.serviceFee}</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-800 print:border-gray-300 print:text-black">
              <span>{tReceipt.totalPayment}</span>
              <span className="text-gold-600 dark:text-gold-400 font-black print:text-black">{formatPrice(order.totalPrice || order.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 print:text-gray-600">
              <span>{tReceipt.paymentMethod}</span>
              <span className="font-semibold uppercase text-gray-700 dark:text-gray-300 print:text-gray-700">
                {order.paymentMethod === 'card' ? tReceipt.card : tReceipt.cash}
              </span>
            </div>
          </div>

          {/* QR Code and Footer Message */}
          <div className="text-center pt-4 border-t border-dashed border-gray-300 dark:border-gray-700 space-y-2 print:border-gray-400">
            <div className="flex justify-center">
              {/* Dynamic QR Code Mockup */}
              <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg inline-block bg-white shadow-sm">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z" fill="black" />
                  <path d="M18 18h14v14h-14z M68 18h14v14h-14z M18 68h14v14h-14z" fill="white" />
                  <rect x="45" y="15" width="8" height="20" fill="black" />
                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="60" y="60" width="15" height="15" fill="black" />
                  <rect x="80" y="70" width="10" height="15" fill="black" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest print:text-gray-600">
              {tReceipt.thankYou}
            </p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 print:text-gray-400">
              www.zafaron-restaurant.uz • @zafaron_lounge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
