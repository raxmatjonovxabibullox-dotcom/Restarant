import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { soundFx } from '../hooks/useSoundEffects';
import { luxuryConfetti } from '../utils/confetti';
import { PrintReceiptModal } from './PrintReceiptModal';
import { getStoredAutoDirect } from '../lib/storage';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Printer,
  CheckCircle2,
  ChefHat,
  Bike,
  Zap,
  ExternalLink
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

export const CartDrawer = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, isCartOpen, closeCart } = useCart();
  const { placeOrder } = useRestaurant();
  const { lang, getLocalized } = useLanguage();
  const { formatPrice } = useCurrency();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('dineIn'); // 'dineIn' or 'delivery'
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success and Tracker state
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [trackerStep, setTrackerStep] = useState(1);

  // Auto-Direct Countdown & Redirect State
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(null);
  const [isRedirectCancelled, setIsRedirectCancelled] = useState(false);

  // Multilingual Cart Dictionary
  const tCart = {
    title: lang === 'ru' ? 'Корзина Заказа' : lang === 'en' ? 'Shopping Cart' : 'Buyurtma Savati',
    statusTitle: lang === 'ru' ? 'Статус заказа' : lang === 'en' ? 'Order Status' : 'Buyurtma holati',
    brandSubtitle: 'Zafaron Restaurant & Lounge',
    orderNum: lang === 'ru' ? 'ЗАКАЗ' : lang === 'en' ? 'ORDER' : 'BUYURTMA',
    orderReceived: lang === 'ru' ? 'Ваш Заказ Принят!' : lang === 'en' ? 'Your Order is Confirmed!' : 'Buyurtmangiz Qabul Qilindi!',
    orderSentInfo: lang === 'ru' ? 'Информация отправлена администратору и в Telegram бот.' : lang === 'en' ? 'Details dispatched to restaurant admin and Telegram bot.' : "Ma'lumotlar restoran administratoriga va Telegram botga yuborildi.",
    liveTracking: lang === 'ru' ? 'Статус Заказа в Реальном Времени' : lang === 'en' ? 'Live Order Tracking' : 'Jonli Buyurtma Holati (Live Tracking)',
    step1Title: lang === 'ru' ? '1. Принят и подтвержден' : lang === 'en' ? '1. Accepted and confirmed' : '1. Qabul qilindi va tasdiqlandi',
    step1Desc: lang === 'ru' ? 'Оформлен в системе' : lang === 'en' ? 'Processed in system' : 'Tizimda rasmiylashtirildi',
    step2Title: lang === 'ru' ? '2. Шеф-повар готовит на кухне' : lang === 'en' ? '2. Chef is cooking in kitchen' : '2. Oshxonada Bosh Oshpaz tayyorlamoqda',
    step2Desc: lang === 'ru' ? 'Примерное время: 15-20 минут' : lang === 'en' ? 'Estimated time: 15-20 min' : 'Taxminiy vaqt: 15-20 daqiqa',
    step3DineIn: lang === 'ru' ? '3. Готов к подаче на стол' : lang === 'en' ? '3. Ready to serve at table' : '3. Stolga yetkazishga tayyor',
    step3Delivery: lang === 'ru' ? '3. VIP Курьер выехал' : lang === 'en' ? '3. VIP Courier dispatched' : "3. VIP Kuryer yo'lga chiqdi",
    step3Desc: lang === 'ru' ? 'Быстрый сервис' : lang === 'en' ? 'Prompt service' : 'Tezkor xizmat',
    viewReceiptBtn: lang === 'ru' ? 'Посмотреть и напечатать официальный чек' : lang === 'en' ? 'View & Print Official Receipt' : "Rasmiy To'lov Chekini Ko'rish & Chop Etish",
    continueBtn: lang === 'ru' ? 'Понятно, продолжить' : lang === 'en' ? 'Got it, continue' : 'Tushunarli, Davom Etish',
    emptyTitle: lang === 'ru' ? 'Ваша корзина пуста' : lang === 'en' ? 'Your cart is empty' : "Savatingiz hozircha bo'sh",
    emptyDesc: lang === 'ru' ? 'Выберите изысканные блюда из нашего меню и оформите заказ.' : lang === 'en' ? 'Select delicious gourmet dishes from our menu and place an order.' : "Menyudan o'zingizga yoqqan shohona taomlarni tanlab, buyurtma bering.",
    dineInBtn: lang === 'ru' ? '🍽️ В зале (Стол)' : lang === 'en' ? '🍽️ Dine-in (Table)' : '🍽️ Restoranda (Stolga)',
    deliveryBtn: lang === 'ru' ? '🛵 Доставка (+15K)' : lang === 'en' ? '🛵 Delivery (+15K)' : '🛵 Yetkazib berish (+15K)',
    namePlaceholder: lang === 'ru' ? 'Ваше имя *' : lang === 'en' ? 'Your Name *' : 'Ismingiz *',
    phonePlaceholder: lang === 'ru' ? '+998 (90) 123-45-67 *' : lang === 'en' ? '+998 (90) 123-45-67 *' : '+998 (90) 123-45-67 *',
    phoneHint: lang === 'ru' ? 'Например: 90 123 45 67 (автоформат)' : lang === 'en' ? 'e.g. 90 123 45 67 (auto-formatted)' : 'Masalan: 90 123 45 67 (avtomatik formatlanadi)',
    tablePlaceholder: lang === 'ru' ? 'Номер стола (например: 5 или VIP 1)' : lang === 'en' ? 'Table number (e.g. 5 or VIP 1)' : 'Stol raqami (masalan: 5 yoki VIP 1)',
    addressPlaceholder: lang === 'ru' ? 'Адрес доставки (улица, дом, ориентир) *' : lang === 'en' ? 'Delivery address (street, apt, landmark) *' : "Yetkazish manzili (ko'cha, uy, mo'ljal) *",
    notesPlaceholder: lang === 'ru' ? 'Пожелания к заказу (без лука, побольше соуса...)' : lang === 'en' ? 'Special requests (no onions, extra sauce...)' : "Qo'shimcha izoh (masalan: ko'proq sous, piyozsiz...)",
    cardPay: lang === 'ru' ? '💳 Карта (Click/Payme)' : lang === 'en' ? '💳 Card (Click/Payme)' : '💳 Karta (Click/Payme)',
    cashPay: lang === 'ru' ? '💵 Наличные' : lang === 'en' ? '💵 Cash' : '💵 Naqd pul',
    subtotalLabel: lang === 'ru' ? 'Сумма блюд:' : lang === 'en' ? 'Subtotal:' : 'Taomlar summasi:',
    deliveryLabel: lang === 'ru' ? 'Доставка:' : lang === 'en' ? 'Delivery:' : 'Yetkazib berish:',
    totalLabel: lang === 'ru' ? 'ИТОГО К ОПЛАТЕ:' : lang === 'en' ? 'TOTAL PAYMENT:' : "JAMI TO'LOV:",
    submittingBtn: lang === 'ru' ? 'Отправка заказа...' : lang === 'en' ? 'Submitting order...' : 'Yuborilmoqda...',
    confirmBtn: lang === 'ru' ? 'Подтвердить Заказ' : lang === 'en' ? 'Confirm Order' : 'Buyurtmani Tasdiqlash',
    alertName: lang === 'ru' ? 'Пожалуйста, введите ваше имя!' : lang === 'en' ? 'Please enter your name!' : 'Iltimos, ismingizni kiriting!',
    alertPhone: lang === 'ru' ? 'Пожалуйста, введите полный номер телефона:\nНапример: +998 (90) 123-45-67' : lang === 'en' ? 'Please enter a valid phone number:\ne.g. +998 (90) 123-45-67' : "Iltimos, to'liq telefon raqamingizni kiriting:\nMasalan: +998 (90) 123-45-67"
  };

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 15000 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert(tCart.alertName);
      return;
    }

    if (!isValidUzPhone(customerPhone)) {
      alert(tCart.alertPhone);
      return;
    }

    setIsSubmitting(true);
    try {
      soundFx.playSuccess();
      luxuryConfetti.burst({ x: 0.5, y: 0.4, count: 130 });
      const orderPayload = {
        items: cart,
        totalPrice: grandTotal,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        tableNumber: deliveryType === 'dineIn' ? tableNumber : '',
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : '',
        paymentMethod,
        notes: notes.trim()
      };

      const newOrder = await placeOrder(orderPayload);
      setPlacedOrder(newOrder);
      setTrackerStep(1);

      // Trigger Avto-Direct countdown if enabled
      const autoDirect = getStoredAutoDirect();
      if (autoDirect?.enabled && autoDirect?.autoRedirectSite) {
        setIsRedirectCancelled(false);
        const delay = autoDirect.autoRedirectDelay || 4;
        setAutoRedirectTimer(delay);
      }

      // Simulate live order status advancement
      setTimeout(() => setTrackerStep(2), 2500); // 2. Oshxonada tayyorlanmoqda
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avto-Direct countdown effect
  useEffect(() => {
    if (autoRedirectTimer === null || isRedirectCancelled) return;
    if (autoRedirectTimer <= 0) {
      const autoDirect = getStoredAutoDirect();
      const botUrl = autoDirect?.telegramBotLink || 'https://t.me/zafaron_restarant_bot';
      window.open(botUrl, '_blank', 'noopener,noreferrer');
      setAutoRedirectTimer(null);
      return;
    }
    const timer = setTimeout(() => {
      setAutoRedirectTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoRedirectTimer, isRedirectCancelled]);

  const handleCloseAndReset = () => {
    setPlacedOrder(null);
    setAutoRedirectTimer(null);
    setIsRedirectCancelled(false);
    closeCart();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div onClick={handleCloseAndReset} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

        {/* Drawer Container */}
        <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-white/10 shadow-2xl h-full flex flex-col z-10 animate-slide-up">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl gold-gradient-bg text-dark-950 font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {tCart.title} {cart.length > 0 && `(${cart.length})`}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {placedOrder ? tCart.statusTitle : tCart.brandSubtitle}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {placedOrder ? (
            /* LIVE ORDER TRACKER & SUCCESS VIEW */
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-500 block">
                    {tCart.orderNum} #{placedOrder.id}
                  </span>
                  <h4 className="font-serif font-black text-2xl text-gray-900 dark:text-white">
                    {tCart.orderReceived}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tCart.orderSentInfo}
                  </p>
                </div>

                {/* Real-time Avto-Direct Banner */}
                {autoRedirectTimer !== null && autoRedirectTimer > 0 && !isRedirectCancelled && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-blue-500/15 border border-gold-500/30 flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gold-500 text-dark-950 font-black flex items-center justify-center text-xs shadow-glow shrink-0">
                        ⚡ {autoRedirectTimer}s
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>Avto-Direct yo'naltirilmoqda</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          Telegram botga avtomatik o'tilmoqda...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getStoredAutoDirect()?.telegramBotLink || "https://t.me/zafaron_restarant_bot"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-gold-500 text-dark-950 font-bold text-[10px] hover:brightness-110 flex items-center gap-1"
                      >
                        <span>O'tish</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsRedirectCancelled(true)}
                        className="px-2 py-1.5 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 font-bold text-[10px] hover:bg-gray-300 dark:hover:bg-dark-600"
                      >
                        To'xtatish
                      </button>
                    </div>
                  </div>
                )}

                {/* ANIMATED REAL-TIME ORDER TRACKER */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                    {tCart.liveTracking}
                  </span>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackerStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{tCart.step1Title}</p>
                        <p className="text-[10px] text-gray-400">{tCart.step1Desc}</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackerStep >= 2 ? 'bg-gold-500 text-dark-950 shadow-glow animate-pulse' : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                      }`}>
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${trackerStep >= 2 ? 'text-gold-500' : 'text-gray-400'}`}>
                          {tCart.step2Title}
                        </p>
                        <p className="text-[10px] text-gray-400">{tCart.step2Desc}</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        trackerStep >= 3 ? 'bg-gold-500 text-dark-950' : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                      }`}>
                        <Bike className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${trackerStep >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                          {placedOrder.deliveryType === 'dineIn' ? tCart.step3DineIn : tCart.step3Delivery}
                        </p>
                        <p className="text-[10px] text-gray-400">{tCart.step3Desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Receipt Button */}
                <button
                  onClick={() => setIsReceiptOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gold-500/10 border border-gray-300 dark:border-white/10 hover:border-gold-500 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4 text-gold-500" />
                  <span>{tCart.viewReceiptBtn}</span>
                </button>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm"
              >
                {tCart.continueBtn}
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* EMPTY CART */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  {tCart.emptyTitle}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  {tCart.emptyDesc}
                </p>
              </div>
            </div>
          ) : (
            /* CART ITEMS & CHECKOUT FORM */
            <div className="flex-1 overflow-y-auto flex flex-col justify-between">
              {/* Items List */}
              <div className="p-5 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10"
                  >
                    <img
                      src={item.image}
                      alt={getLocalized(item.name)}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {getLocalized(item.name)}
                      </h4>
                      {item.selectedPortion && (
                        <span className="text-[10px] text-gold-500 font-semibold block">
                          {item.selectedPortion}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gold-500 block mt-0.5">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-dark-700 border border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gold-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gold-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playPop();
                        removeFromCart(item.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="p-5 border-t border-gray-200 dark:border-white/10 space-y-4 bg-gray-50/50 dark:bg-dark-950/50">
                {/* Delivery Type Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setDeliveryType('dineIn');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      deliveryType === 'dineIn'
                        ? 'gold-gradient-bg text-dark-950 shadow-sm'
                        : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {tCart.dineInBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setDeliveryType('delivery');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      deliveryType === 'delivery'
                        ? 'gold-gradient-bg text-dark-950 shadow-sm'
                        : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {tCart.deliveryBtn}
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={tCart.namePlaceholder}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full glass-input text-xs py-2"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      placeholder={tCart.phonePlaceholder}
                      value={customerPhone}
                      onKeyDown={blockNonPhoneKeys}
                      onChange={(e) => {
                        const formatted = handlePhoneInputChange(e, customerPhone);
                        setCustomerPhone(formatted);
                      }}
                      className="w-full glass-input text-xs py-2 font-mono"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {tCart.phoneHint}
                    </span>
                  </div>

                  {deliveryType === 'dineIn' ? (
                    <div>
                      <input
                        type="text"
                        placeholder={tCart.tablePlaceholder}
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full glass-input text-xs py-2"
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        required
                        placeholder={tCart.addressPlaceholder}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full glass-input text-xs py-2"
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder={tCart.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full glass-input text-xs py-2"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="cartPayment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-gold-500"
                      />
                      <span>{tCart.cardPay}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="cartPayment"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="accent-gold-500"
                      />
                      <span>{tCart.cashPay}</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>{tCart.subtotalLabel}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-gray-500">
                      <span>{tCart.deliveryLabel}</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1">
                    <span>{tCart.totalLabel}</span>
                    <span className="gold-gradient-text text-xl font-black">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? tCart.submittingBtn : `${tCart.confirmBtn} • ${formatPrice(grandTotal)}`}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {placedOrder && (
        <PrintReceiptModal
          order={placedOrder}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </>
  );
};
