import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Utensils,
  Truck,
  CreditCard,
  Banknote,
  Send
} from 'lucide-react';
import { handlePhoneInputChange, blockNonPhoneKeys, isValidUzPhone } from '../lib/phoneUtils';

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { placeOrder } = useRestaurant();
  const { t, getLocalized } = useLanguage();

  const [deliveryType, setDeliveryType] = useState('dineIn'); // dineIn or delivery
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

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

    if (deliveryType === 'dineIn' && !tableNumber.trim()) {
      alert(t('common.requiredField') + ": Stol raqami");
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert(t('common.requiredField') + ": Yetkazish manzili");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        tableNumber: deliveryType === 'dineIn' ? tableNumber.trim() : '',
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : '',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        paymentMethod
      };

      await placeOrder(orderPayload);
      clearCart();
      closeCart();
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setTableNumber('');
      setDeliveryAddress('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {t('cart.title')}
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {totalItems} {t('cart.itemsCount')}
                </span>
              </div>
            </div>
            <button
              id="close-cart-btn"
              onClick={closeCart}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">
                  {t('cart.emptyTitle')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                  {t('cart.emptyDesc')}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-gray-800 flex items-center gap-3 transition-all"
                >
                  <img
                    src={item.image}
                    alt={getLocalized(item.name)}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {getLocalized(item.name)}
                    </h4>
                    <p className="text-xs font-semibold text-gold-500 mt-0.5">
                      {item.price.toLocaleString()} {t('common.currency')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gold-500 hover:text-dark-950 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gold-500 hover:text-dark-950 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 mt-3">
                      {(item.price * item.quantity).toLocaleString()} {t('common.currency')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-dark-950/50 space-y-4">
              <form onSubmit={handleSubmitOrder} className="space-y-3">
                {/* Delivery Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/70 dark:bg-dark-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('dineIn')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'dineIn'
                        ? 'bg-white dark:bg-gold-500 text-gray-900 dark:text-dark-950 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    {t('cart.deliveryDineIn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-white dark:bg-gold-500 text-gray-900 dark:text-dark-950 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    {t('cart.deliveryHome')}
                  </button>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={t('cart.customerName')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="glass-input text-xs w-full"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={customerPhone}
                    onKeyDown={blockNonPhoneKeys}
                    onChange={(e) => {
                      const formatted = handlePhoneInputChange(e, customerPhone);
                      setCustomerPhone(formatted);
                    }}
                    className="glass-input text-xs w-full font-mono"
                  />
                </div>

                {/* Conditional Field: Table number or Address */}
                {deliveryType === 'dineIn' ? (
                  <input
                    type="text"
                    required
                    placeholder={t('cart.tableNumber')}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="glass-input text-xs w-full"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    placeholder={t('cart.deliveryAddress')}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="glass-input text-xs w-full"
                  />
                )}

                {/* Payment Method */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-semibold'
                        : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {t('cart.payCard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-semibold'
                        : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    {t('cart.payCash')}
                  </button>
                </div>

                {/* Summary & Submit */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500 dark:text-gray-400">{t('cart.totalPrice')}:</span>
                    <span className="font-bold text-lg gold-gradient-text">
                      {totalPrice.toLocaleString()} {t('common.currency')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl gold-gradient-bg flex items-center justify-center gap-2 text-sm font-bold shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <span>{t('common.loading')}</span>
                    ) : (
                      <>
                        <span>{t('cart.placeOrder')}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-1.5">
                    Telegram Bot va Supabase bazasiga avtomatik yuboriladi
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
