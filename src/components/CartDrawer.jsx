import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { soundFx } from '../hooks/useSoundEffects';
import { PrintReceiptModal } from './PrintReceiptModal';
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
  Bike
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

export const CartDrawer = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, isCartOpen, closeCart } = useCart();
  const { placeOrder } = useRestaurant();
  const { getLocalized } = useLanguage();
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

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 15000 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert("Iltimos, ismingizni kiriting!");
      return;
    }

    if (!isValidUzPhone(customerPhone)) {
      alert("Iltimos, to'liq telefon raqamingizni kiriting:\nMasalan: +998 (90) 123-45-67");
      return;
    }

    setIsSubmitting(true);
    try {
      soundFx.playSuccessFanfare();
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

      // Simulate live order status advancement
      setTimeout(() => setTrackerStep(2), 2500); // 2. Oshxonada tayyorlanmoqda
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setPlacedOrder(null);
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
                  Buyurtma Savati {cart.length > 0 && `(${cart.length})`}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {placedOrder ? "Buyurtma holati" : "Zafaron Restaurant & Lounge"}
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
                    BUYURTMA #{placedOrder.id}
                  </span>
                  <h4 className="font-serif font-black text-2xl text-gray-900 dark:text-white">
                    Buyurtmangiz Qabul Qilindi!
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ma'lumotlar restoran administratoriga va Telegram botga yuborildi.
                  </p>
                </div>

                {/* ANIMATED REAL-TIME ORDER TRACKER */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/10 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                    Jonli Buyurtma Holati (Live Tracking)
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
                        <p className="text-xs font-bold text-gray-900 dark:text-white">1. Qabul qilindi va tasdiqlandi</p>
                        <p className="text-[10px] text-gray-400">Tizimda rasmiylashtirildi</p>
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
                          2. Oshxonada Bosh Oshpaz tayyorlamoqda
                        </p>
                        <p className="text-[10px] text-gray-400">Taxminiy vaqt: 15-20 daqiqa</p>
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
                          {placedOrder.deliveryType === 'dineIn' ? "3. Stolga yetkazishga tayyor" : "3. VIP Kuryer yo'lga chiqdi"}
                        </p>
                        <p className="text-[10px] text-gray-400">Tezkor xizmat</p>
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
                  <span>Rasmiy To'lov Chekini Ko'rish & Chop Etish</span>
                </button>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-dark-950 font-bold text-sm"
              >
                Tushunarli, Davom Etish
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
                  Savatingiz hozircha bo'sh
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Menyudan o'zingizga yoqqan shohona taomlarni tanlab, buyurtma bering.
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
                    🍽️ Restoranda (Stolga)
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
                    🛵 Yetkazib berish (+15K)
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Ismingiz *"
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
                      placeholder="+998 (90) 123-45-67 *"
                      value={customerPhone}
                      onKeyDown={blockNonPhoneKeys}
                      onChange={(e) => {
                        const formatted = handlePhoneInputChange(e, customerPhone);
                        setCustomerPhone(formatted);
                      }}
                      className="w-full glass-input text-xs py-2 font-mono"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Masalan: 90 123 45 67 (avtomatik formatlanadi)
                    </span>
                  </div>

                  {deliveryType === 'dineIn' ? (
                    <div>
                      <input
                        type="text"
                        placeholder="Stol raqami (masalan: 5 yoki VIP 1)"
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
                        placeholder="Yetkazish manzili (ko'cha, uy, mo'ljal) *"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full glass-input text-xs py-2"
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="Qo'shimcha izoh (masalan: ko'proq sous, piyozsiz...)"
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
                      <span>💳 Karta (Click/Payme)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="cartPayment"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="accent-gold-500"
                      />
                      <span>💵 Naqd pul</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Taomlar summasi:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-gray-500">
                      <span>Yetkazib berish:</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-1">
                    <span>JAMI TO'LOV:</span>
                    <span className="gold-gradient-text text-xl font-black">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Yuborilmoqda..." : `Buyurtmani Tasdiqlash • ${formatPrice(grandTotal)}`}</span>
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
