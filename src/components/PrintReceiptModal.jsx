import React from 'react';
import { X, Printer } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

export const PrintReceiptModal = ({ order, isOpen, onClose }) => {
  const { formatPrice } = useCurrency();
  const { getLocalized } = useLanguage();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    soundFx.playChime();
    window.print();
  };

  const parsedDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const currentDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-md print:hidden" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-slide-up print:m-0 print:p-4 print:shadow-none print:w-full print:max-w-none print:border-none">
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
            Rasmiy To'lov Cheki
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RECEIPT CONTENT (Printable) */}
        <div className="space-y-4 font-mono text-xs">
          {/* Brand Header */}
          <div className="text-center pb-3 border-b border-dashed border-gray-300">
            <h2 className="font-serif font-black text-xl tracking-wider text-gray-900 uppercase">
              ZAFARON
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Restaurant & Lounge
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Toshkent sh., Amir Temur shoh ko'chasi, 45
            </p>
            <p className="text-[10px] text-gray-500">
              Tel: +998 71 200 88 99
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-1 text-gray-700 pb-3 border-b border-dashed border-gray-300">
            <div className="flex justify-between">
              <span>CHEK RAQAMI:</span>
              <span className="font-bold text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>SANA VA VAQT:</span>
              <span>{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span>MIJOZ:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>TEL:</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>TUR:</span>
              <span className="font-bold">
                {order.deliveryType === 'dineIn'
                  ? `Restoranda (Stol: ${order.tableNumber || '-'})`
                  : `Yetkazib berish`}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between">
                <span>MANZIL:</span>
                <span className="text-right truncate max-w-[180px]">{order.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 border-b pb-1">
              <span>TAOM</span>
              <span className="text-right">SUMMA</span>
            </div>
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <div className="flex-1 pr-2">
                  <span className="font-semibold">{getLocalized(item.name)}</span>
                  <div className="text-[10px] text-gray-500">
                    {item.quantity} x {formatPrice(item.price)}
                    {item.selectedPortion && ` (${item.selectedPortion})`}
                  </div>
                </div>
                <span className="font-bold whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total & Summary */}
          <div className="pt-3 border-t border-dashed border-gray-400 space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Xizmat haqi (0%):</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t">
              <span>JAMI TO'LOV:</span>
              <span className="text-gold-600 font-black">{formatPrice(order.totalPrice || order.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>To'lov usuli:</span>
              <span className="font-semibold uppercase">{order.paymentMethod === 'card' ? 'Karta (Payme/Click)' : 'Naqd pul'}</span>
            </div>
          </div>

          {/* QR Code and Footer Message */}
          <div className="text-center pt-4 border-t border-dashed border-gray-300 space-y-2">
            <div className="flex justify-center">
              {/* Dynamic QR Code Mockup */}
              <div className="p-2 border border-gray-300 rounded-lg inline-block bg-white">
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
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Tashrifingiz uchun tashakkur!
            </p>
            <p className="text-[9px] text-gray-400">
              www.zafaron-restaurant.uz • @zafaron_lounge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
