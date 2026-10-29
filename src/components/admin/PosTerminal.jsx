import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Utensils,
  User,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  Coffee,
  X,
  ChefHat
} from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';

export const PosTerminal = ({
  menuItems = [],
  onPlaceOrder,
  onOpenReceipt,
  formatPrice,
  theme = 'dark',
  audioEnabled = true,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedHall, setSelectedHall] = useState('main'); // 'main' | 'terrace' | 'vip' | 'banquet'
  const [selectedTable, setSelectedTable] = useState('1');
  const [guestCount, setGuestCount] = useState(2);
  const [waiterName, setWaiterName] = useState('Sardor (Ofitsiant)');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'card' | 'click'
  const [discountPercent, setDiscountPercent] = useState(0); // 0, 5, 10, 15
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available Halls and Table numbers
  const HALLS = [
    { id: 'main', name: 'Asosiy Zal', count: 12, prefix: 'A-' },
    { id: 'terrace', name: 'Panoramali Terrasa', count: 8, prefix: 'T-' },
    { id: 'vip', name: 'VIP Oltin Xona', count: 4, prefix: 'VIP-' },
    { id: 'banquet', name: 'Banket Zali', count: 6, prefix: 'B-' }
  ];

  // Categories list derived from menu
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map(d => d.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [menuItems]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return menuItems.filter(dish => {
      const matchCat = selectedCategory === 'all' || dish.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        dish.nameUz?.toLowerCase().includes(q) ||
        dish.nameRu?.toLowerCase().includes(q) ||
        dish.nameEn?.toLowerCase().includes(q) ||
        dish.name?.toLowerCase().includes(q);
      return matchCat && matchQuery && dish.available !== false;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Add dish to POS cart
  const handleAddToCart = (dish) => {
    if (audioEnabled) soundFx.playPop();
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleUpdateQty = (dishId, delta) => {
    if (audioEnabled) soundFx.playPop();
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (dishId) => {
    if (audioEnabled) soundFx.playPop();
    setCart(prev => prev.filter(item => item.id !== dishId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const serviceFee = useMemo(() => {
    return (subtotal - discountAmount) * 0.10; // 10% standard service fee
  }, [subtotal, discountAmount]);

  const totalAmount = useMemo(() => {
    return subtotal - discountAmount + serviceFee;
  }, [subtotal, discountAmount, serviceFee]);

  // Submit order to Kitchen & POS
  const handleSubmitPosOrder = async () => {
    if (cart.length === 0) {
      showToast?.("⚠️ Savat bo'sh! Kamida bitta taom tanlang.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const hallObj = HALLS.find(h => h.id === selectedHall);
      const fullTableNumber = `${hallObj?.prefix || ''}${selectedTable}`;

      const newOrderPayload = {
        customerName: `Mehmon (Stol ${fullTableNumber})`,
        customerPhone: '+998 71 200 88 99',
        items: cart.map(item => ({
          id: item.id,
          name: item.nameUz || item.name || 'Taom',
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryType: 'dineIn',
        tableNumber: fullTableNumber,
        deliveryAddress: `${hallObj?.name || 'Asosiy Zal'}, Stol #${fullTableNumber}`,
        paymentMethod: paymentMethod === 'cash' ? 'naqd' : paymentMethod === 'card' ? 'karta' : 'click',
        subtotal,
        discountAmount,
        serviceFee,
        total: totalAmount,
        notes: `Ofitsiant: ${waiterName} | Mehmonlar: ${guestCount} kishi${orderNotes ? ' | ' + orderNotes : ''}`,
        status: 'pending', // goes to Kitchen KDS immediately
        source: 'pos_terminal',
        createdAt: new Date().toISOString()
      };

      const createdOrder = await onPlaceOrder(newOrderPayload);

      if (audioEnabled) soundFx.playSuccess();
      showToast?.(`✅ Buyurtma #${createdOrder?.id || 'YANGI'} kassa orqali qabul qilindi va oshxonaga uzatildi!`, "success");

      // Offer instant receipt print
      if (onOpenReceipt && createdOrder) {
        onOpenReceipt(createdOrder);
      }

      // Reset cart
      setCart([]);
      setOrderNotes('');
    } catch (err) {
      console.error(err);
      showToast?.("Xatolik yuz berdi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHallObj = HALLS.find(h => h.id === selectedHall) || HALLS[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-dark-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-xl text-current flex items-center gap-2">
              <span>Smart POS Kassa Terminali</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LIVE TERMINAL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Restoran zallari, ofitsiantlar va tezkor kassa buyurtmalarini boshqarish markazi
            </p>
          </div>
        </div>

        {/* Quick Active Stats */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
          }`}>
            <ChefHat className="w-4 h-4 text-emerald-400" />
            <span>KDS Oshxona Ulangan ✓</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
          }`}>
            <User className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">{waiterName}</span>
          </div>
        </div>
      </div>

      {/* POS Main Grid: Left Dishes, Right Order Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MENU CATALOG & DISH SELECTION (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Categories */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Taom nomi, tarkibi yoki kodi bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#141622] border-[#252a42] text-white focus:border-amber-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-current absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-dark-950 shadow-md shadow-amber-500/20'
                      : theme === 'dark'
                        ? 'bg-[#1c2032] text-slate-400 hover:text-white border border-[#252a42]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? '✨ Barchasi' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredDishes.map((dish) => {
              const inCart = cart.find(i => i.id === dish.id);
              return (
                <div
                  key={dish.id}
                  onClick={() => handleAddToCart(dish)}
                  className={`p-3 rounded-2xl border cursor-pointer select-none transition-all duration-200 group relative flex flex-col justify-between ${
                    inCart
                      ? 'border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                      : theme === 'dark'
                        ? 'bg-[#171a29] border-[#22263d] hover:border-amber-500/50 hover:bg-[#1a1e30]'
                        : 'bg-white border-slate-200 hover:border-amber-500/50 hover:shadow-md'
                  }`}
                >
                  {/* Dish Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                    <img
                      src={dish.image || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"}
                      alt={dish.nameUz || dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {inCart && (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-dark-950 font-black text-xs flex items-center justify-center absolute top-2 right-2 shadow-glow">
                        {inCart.quantity}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-sm absolute bottom-1.5 left-1.5">
                      HALOL
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h4 className="font-bold text-xs text-current line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {dish.nameUz || dish.name}
                    </h4>
                    <p className="font-black text-xs text-amber-500 mt-0.5">
                      {formatPrice ? formatPrice(dish.price) : `${(dish.price || 0).toLocaleString()} UZS`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: POS RECEIPT TICKET & TABLE SELECTION (5 Cols) */}
        <div className={`lg:col-span-5 p-5 rounded-3xl border space-y-5 sticky top-4 ${
          theme === 'dark' ? 'bg-[#171a29] border-[#22263d]' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          
          {/* Hall & Table Selector */}
          <div className="space-y-3 pb-4 border-b border-inherit">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Restoran Zali & Stol</span>
              </span>
              <span className="text-xs font-bold text-amber-400">
                {currentHallObj.name} (#{currentHallObj.prefix}{selectedTable})
              </span>
            </div>

            {/* Hall Tabs */}
            <div className="grid grid-cols-4 gap-1.5">
              {HALLS.map(hall => (
                <button
                  key={hall.id}
                  onClick={() => {
                    setSelectedHall(hall.id);
                    setSelectedTable('1');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold truncate transition-all ${
                    selectedHall === hall.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : theme === 'dark' ? 'bg-[#1c2032] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hall.name}
                </button>
              ))}
            </div>

            {/* Table Number Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Array.from({ length: currentHallObj.count }).map((_, idx) => {
                const tableNum = String(idx + 1);
                const isSelected = selectedTable === tableNum;
                return (
                  <button
                    key={tableNum}
                    onClick={() => setSelectedTable(tableNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-dark-950 shadow-md shadow-amber-500/25 scale-105'
                        : theme === 'dark' ? 'bg-[#1c2032] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tableNum}
                  </button>
                );
              })}
            </div>

            {/* Guest Count & Waiter */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Mehmonlar Soni</label>
                <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#141622] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="text-slate-400 hover:text-current font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-current">{guestCount} kishi</span>
                  <button
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="text-slate-400 hover:text-current font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Ofitsiant</label>
                <input
                  type="text"
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-current flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Buyurtma Tarkibi ({cart.length})</span>
              </span>
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Tozalash</span>
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Coffee className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">Savat bo'sh. Chap tarafdan taomlarni tanlang.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                      theme === 'dark' ? 'bg-[#1c2032] border-[#252a42]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-current truncate">{item.nameUz || item.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatPrice ? formatPrice(item.price) : `${item.price?.toLocaleString()} UZS`} x {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 flex items-center justify-center font-bold text-current"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-right min-w-[70px] text-current">
                      {formatPrice ? formatPrice(item.price * item.quantity) : `${(item.price * item.quantity).toLocaleString()} UZS`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount & Kitchen Notes */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-inherit text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Chegirma / VIP Karta</label>
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                  theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value={0}>0% (Oddiy)</option>
                <option value={5}>5% (Doimiy Mehmon)</option>
                <option value={10}>10% (VIP Oltin Karta)</option>
                <option value={15}>15% (Executive Maxsus)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">To'lov Usuli</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                  theme === 'dark' ? 'bg-[#141622] border-[#252a42] text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="cash">💵 Naqd Pul</option>
                <option value="card">💳 Humo / Uzcard / Visa</option>
                <option value="click">📱 Click / Payme</option>
              </select>
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
            theme === 'dark' ? 'bg-[#141622] border-[#252a42]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between text-slate-400">
              <span>Taomlar qiymati:</span>
              <span className="font-semibold text-current">
                {formatPrice ? formatPrice(subtotal) : `${subtotal.toLocaleString()} UZS`}
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Chegirma ({discountPercent}%):</span>
                <span className="font-semibold">
                  -{formatPrice ? formatPrice(discountAmount) : `${discountAmount.toLocaleString()} UZS`}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Xizmat haqi (10%):</span>
              <span className="font-semibold text-current">
                +{formatPrice ? formatPrice(serviceFee) : `${serviceFee.toLocaleString()} UZS`}
              </span>
            </div>

            <div className="pt-2 border-t border-inherit flex justify-between items-baseline">
              <span className="font-black text-sm text-current">Jami To'lov:</span>
              <span className="text-xl font-black text-amber-500">
                {formatPrice ? formatPrice(totalAmount) : `${totalAmount.toLocaleString()} UZS`}
              </span>
            </div>
          </div>

          {/* Action Buttons: Place Order & Print Ticket */}
          <div className="space-y-2">
            <button
              onClick={handleSubmitPosOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 disabled:opacity-50 text-dark-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? "Oshxonaga uzatilmoqda..." : "Buyurtmani Tasdiqlash & KDSga Yuborish"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
