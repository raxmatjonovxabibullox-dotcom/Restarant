import React from 'react';
import { ChefHat, Clock, CheckCircle2, Flame, Bike, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { soundFx } from '../../hooks/useSoundEffects';

export const KitchenDisplay = ({ orders, updateOrderStatus, formatPrice, getLocalized }) => {
  // Filter only active orders for the kitchen (pending or cooking)
  const kitchenOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'cooking'
  );

  const handleStartCooking = (orderId) => {
    soundFx.playChime();
    updateOrderStatus(orderId, 'cooking');
  };

  const handleMarkReady = (orderId, deliveryType) => {
    soundFx.playSuccessFanfare();
    const nextStatus = deliveryType === 'delivery' ? 'delivering' : 'completed';
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* KDS Header & Filter Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-dark-900 border border-gold-500/30 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-gold-400">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white flex items-center gap-2">
              Oshxona Ekrani (Kitchen Display System)
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-dark-950">
                {kitchenOrders.length} ta faol chipta
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Bosh oshpaz va oshpazlar guruhi uchun real vaqtdagi faol pishirish chiptalari
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-gold-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            Jonli monitoring
          </span>
        </div>
      </div>

      {/* Kitchen Order Tickets Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border border-gray-200 dark:border-white/10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
            Barcha taomlar pishirib bo'lingan!
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Hozirda oshxona uchun yangi buyurtmalar navbati yo'q. Yangi buyurtma kelishi bilan bu yerda chipta paydo bo'ladi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => {
            const isCooking = order.status === 'cooking';
            const elapsedMinutes = Math.max(
              1,
              Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
            );

            return (
              <div
                key={order.id}
                className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl ${
                  isCooking
                    ? 'bg-amber-500/5 dark:bg-amber-950/20 border-gold-500'
                    : 'bg-white dark:bg-dark-900 border-gray-200 dark:border-white/10'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Order ID, Type, Timer */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                    <div>
                      <span className="font-serif font-black text-lg gold-gradient-text block">
                        #{order.id}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                        {order.deliveryType === 'dineIn' ? (
                          <span className="text-emerald-500 flex items-center gap-1 font-bold">
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                            Stol #{order.tableNumber || "Ko'rsatilmagan"}
                          </span>
                        ) : (
                          <span className="text-blue-500 flex items-center gap-1 font-bold">
                            <Bike className="w-3.5 h-3.5" />
                            Yetkazib berish
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        elapsedMinutes > 25
                          ? 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse'
                          : elapsedMinutes > 15
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {elapsedMinutes} daq. oldin
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {isCooking ? '🔥 Olov ustida' : '⏳ Kutilmoqda'}
                      </span>
                    </div>
                  </div>

                  {/* Customer name */}
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    <span>Mijoz: </span>
                    <b className="text-gray-900 dark:text-white">{order.customerName}</b>
                    {order.customerPhone && (
                      <span className="text-gray-400 ml-2 font-mono">({order.customerPhone})</span>
                    )}
                  </div>

                  {/* Dish Items Checklist */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-800/80 border border-gray-200 dark:border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Tayyorlanadigan taomlar:
                    </span>
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between text-xs py-1 border-b border-gray-200/50 dark:border-white/5 last:border-none"
                      >
                        <div className="flex-1 pr-2">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {item.quantity}x {getLocalized(item.name)}
                          </span>
                          {item.selectedPortion && (
                            <span className="text-[11px] text-gold-500 block">
                              Portsiya: {item.selectedPortion}
                            </span>
                          )}
                          {item.selectedAddons?.length > 0 && (
                            <span className="text-[10px] text-emerald-500 block">
                              Qo'shimcha: {item.selectedAddons.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 italic">
                      Izoh: "{order.notes}"
                    </div>
                  )}
                </div>

                {/* Big Action Buttons */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex gap-2">
                  {!isCooking ? (
                    <button
                      onClick={() => handleStartCooking(order.id)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-dark-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Pishirishni Boshlash</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkReady(order.id, order.deliveryType)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {order.deliveryType === 'delivery'
                          ? "Tayyor! Kuryerga Topshirish"
                          : "Tayyor! Stolga Yetkazish"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
