import React from 'react';
import { X, Printer } from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';

export const PrintDailyReportModal = ({ isOpen, onClose, orders, reservations, menuItems, formatPrice }) => {
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

  const nowString = new Date().toLocaleString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-md print:hidden" />

      <div className="relative w-full max-w-lg bg-white text-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up print:m-0 print:p-2 print:shadow-none print:w-full print:max-w-none print:border-none">
        {/* Action Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
            Kunlik Kassa & Smena Hisoboti
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold text-xs shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Chop Etish</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT BODY */}
        <div className="space-y-4 font-mono text-xs">
          <div className="text-center pb-3 border-b-2 border-dashed border-gray-400">
            <h1 className="font-serif font-black text-2xl tracking-wider text-gray-900 uppercase">
              ZAFARON RESTAURANT & LOUNGE
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              RASMIY KUNLIK SMENA HISOBOTI
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              Sana va vaqt: {nowString}
            </p>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-2 py-2 border-b border-gray-200">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-600 block">
              1. MOLIYAVIY TUSHUM STATISTIKASI:
            </span>
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>JAMI KUNLIK SAVDO:</span>
              <span className="text-gold-600 font-black">{formatPrice(totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>• Karta (Click / Payme):</span>
              <span className="font-semibold">{formatPrice(cardRevenue)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>• Naqd pul:</span>
              <span className="font-semibold">{formatPrice(cashRevenue)}</span>
            </div>
          </div>

          {/* Orders & Guest metrics */}
          <div className="space-y-1.5 py-2 border-b border-gray-200">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-600 block">
              2. BUYURTMA VA MEHMONLAR:
            </span>
            <div className="flex justify-between">
              <span>Jami buyurtmalar:</span>
              <span className="font-bold">{orders.length} ta</span>
            </div>
            <div className="flex justify-between">
              <span>• Restoranda (Stol):</span>
              <span className="font-semibold">{dineInCount} ta</span>
            </div>
            <div className="flex justify-between">
              <span>• Yetkazib berish (Delivery):</span>
              <span className="font-semibold">{deliveryCount} ta</span>
            </div>
            <div className="flex justify-between">
              <span>Stol bandliklari:</span>
              <span className="font-bold">{reservations.length} ta</span>
            </div>
          </div>

          {/* Top Selling Dishes */}
          <div className="space-y-1.5 py-2 border-b border-gray-200">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-600 block">
              3. ENG KO'P SOTILGAN TAOMLAR:
            </span>
            {menuItems.slice(0, 4).map((dish, i) => (
              <div key={dish.id} className="flex justify-between text-[11px]">
                <span>{i + 1}. {typeof dish.name === 'object' ? dish.name.uz : dish.name}</span>
                <span className="font-bold">{formatPrice(dish.price)}</span>
              </div>
            ))}
          </div>

          {/* Signatures */}
          <div className="pt-6 space-y-4 text-[11px] text-gray-600">
            <div className="flex justify-between border-b pb-2">
              <span>Bosh Administrator: _________________</span>
              <span>Imzo: _________</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Katta Kassir: ______________________</span>
              <span>Imzo: _________</span>
            </div>
            <p className="text-[10px] text-center text-gray-400 italic pt-2">
              Zafaron Lounge avtomatlashtirilgan boshqaruv tizimi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
