import React, { useState } from 'react';
import { Crown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { soundFx } from '../../hooks/useSoundEffects';

const INITIAL_TABLES = [
  { id: 'T-1', number: '1', zoneKey: 'main', seats: 2, status: 'free', currentGuest: null },
  { id: 'T-2', number: '2', zoneKey: 'main', seats: 4, status: 'occupied', currentGuest: 'Otabek R.' },
  { id: 'T-3', number: '3', zoneKey: 'main', seats: 4, status: 'free', currentGuest: null },
  { id: 'T-4', number: '4', zoneKey: 'main', seats: 6, status: 'free', currentGuest: null },
  { id: 'T-5', number: '5', zoneKey: 'main', seats: 8, status: 'occupied', currentGuest: 'Sherzod M.' },
  { id: 'T-6', number: '6', zoneKey: 'terrace', seats: 2, status: 'free', currentGuest: null },
  { id: 'T-7', number: '7', zoneKey: 'terrace', seats: 4, status: 'free', currentGuest: null },
  { id: 'T-8', number: '8', zoneKey: 'terrace', seats: 6, status: 'occupied', currentGuest: 'Farrux T.' },
  { id: 'VIP-1', number: 'VIP 1', zoneKey: 'vip', seats: 10, status: 'occupied', currentGuest: 'Davron B. (Bank)' },
  { id: 'VIP-2', number: 'VIP 2', zoneKey: 'vip', seats: 14, status: 'free', currentGuest: null },
];

export const TableOccupancyManager = ({ reservations = [] } = {}) => {
  const { lang } = useLanguage();

  const tTables = {
    uz: {
      zones: {
        main: "Asosiy Hashamatli Zal",
        terrace: "Ochiq Havo Terrasasi",
        vip: "VIP Oltin Xona"
      },
      totalTables: "Jami Stollar Soni",
      tablesCount: (c) => `${c} ta stol`,
      fullCapacity: "Restoran to'liq sig'imi",
      occupiedTables: "Hozirda Band Stollar",
      freeTables: "Bo'sh Joylar",
      readyGuests: "Yangi mehmonlarni qabul qilishga tayyor",
      realtimeTitle: "Stollarning Real Vaqtdagi Holati",
      realtimeSubtitle: "Stol ustiga bosish orqali uning holatini o'zgartiring (Bo'shatish yoki Band qilish)",
      resetBtn: "Standart holat",
      seats: (s) => `${s} kishilik`,
      occupiedBadge: "BAND QILINGAN",
      freeBadge: "BO'SH",
      guestPrefix: "Mehmon (Band)"
    },
    ru: {
      zones: {
        main: "Главный Роскошный Зал",
        terrace: "Летняя Терраса",
        vip: "VIP Золотая Комната"
      },
      totalTables: "Всего Столов",
      tablesCount: (c) => `${c} столов`,
      fullCapacity: "Полная вместимость ресторана",
      occupiedTables: "Занятые Столы",
      freeTables: "Свободные Столы",
      readyGuests: "Готовы к приему новых гостей",
      realtimeTitle: "Статус Столов в Реальном Времени",
      realtimeSubtitle: "Нажмите на стол для изменения статуса (Освободить или Занять)",
      resetBtn: "По умолчанию",
      seats: (s) => `на ${s} персон`,
      occupiedBadge: "ЗАНЯТ",
      freeBadge: "СВОБОДЕН",
      guestPrefix: "Гость (Занят)"
    },
    en: {
      zones: {
        main: "Main Luxury Hall",
        terrace: "Open Air Terrace",
        vip: "VIP Golden Room"
      },
      totalTables: "Total Tables",
      tablesCount: (c) => `${c} tables`,
      fullCapacity: "Full restaurant seating capacity",
      occupiedTables: "Occupied Tables",
      freeTables: "Available Tables",
      readyGuests: "Ready to welcome new guests",
      realtimeTitle: "Real-time Table Occupancy",
      realtimeSubtitle: "Click on any table to toggle status (Vacant or Occupied)",
      resetBtn: "Default layout",
      seats: (s) => `${s} seats`,
      occupiedBadge: "OCCUPIED",
      freeBadge: "AVAILABLE",
      guestPrefix: "Guest (Occupied)"
    }
  };

  const cur = tTables[lang] || tTables.uz;

  const [tables, setTables] = useState(() => {
    try {
      const stored = localStorage.getItem('zafaron_admin_tables_v1');
      return stored ? JSON.parse(stored) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const saveTables = (updated) => {
    setTables(updated);
    try {
      localStorage.setItem('zafaron_admin_tables_v1', JSON.stringify(updated));
    } catch {}
  };

  const toggleTableStatus = (tableId) => {
    soundFx.playChime();
    const updated = tables.map((t) => {
      if (t.id === tableId) {
        const nextStatus = t.status === 'occupied' ? 'free' : 'occupied';
        return {
          ...t,
          status: nextStatus,
          currentGuest: nextStatus === 'occupied' ? cur.guestPrefix : null
        };
      }
      return t;
    });
    saveTables(updated);
  };

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const freeCount = tables.length - occupiedCount;
  const occupancyPercent = Math.round((occupiedCount / tables.length) * 100);

  const getZoneName = (table) => {
    if (table.zoneKey && cur.zones[table.zoneKey]) {
      return cur.zones[table.zoneKey];
    }
    if (table.zone) {
      if (table.zone.includes('VIP')) return cur.zones.vip;
      if (table.zone.includes('Terrasa') || table.zone.includes('Terrace')) return cur.zones.terrace;
      return cur.zones.main;
    }
    return cur.zones.main;
  };

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-1">
          <span className="text-xs text-gray-500 font-semibold">{cur.totalTables}</span>
          <div className="font-serif font-black text-2xl text-gray-900 dark:text-white">
            {cur.tablesCount(tables.length)}
          </div>
          <span className="text-[11px] text-gray-400">{cur.fullCapacity}</span>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-1">
          <span className="text-xs text-gray-500 font-semibold">{cur.occupiedTables}</span>
          <div className="font-serif font-black text-2xl text-amber-500">
            {occupiedCount} ({occupancyPercent}%)
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              style={{ width: `${occupancyPercent}%` }}
              className="bg-gold-500 h-full rounded-full transition-all"
            />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-1">
          <span className="text-xs text-gray-500 font-semibold">{cur.freeTables}</span>
          <div className="font-serif font-black text-2xl text-emerald-500">
            {cur.tablesCount(freeCount)}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">{cur.readyGuests}</span>
        </div>
      </div>

      {/* Visual Table Grid */}
      <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold-500" />
              {cur.realtimeTitle}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {cur.realtimeSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playPop();
              saveTables(INITIAL_TABLES);
            }}
            className="text-xs text-gray-400 hover:text-gold-500 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{cur.resetBtn}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
          {tables.map((table) => {
            const isOccupied = table.status === 'occupied';
            return (
              <div
                key={table.id}
                onClick={() => toggleTableStatus(table.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 space-y-2 text-center ${
                  isOccupied
                    ? 'bg-amber-500/10 border-gold-500 shadow-glow'
                    : 'bg-emerald-500/5 border-emerald-500/40 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOccupied ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {cur.seats(table.seats)}
                  </span>
                </div>

                <div className="font-serif font-black text-xl text-gray-900 dark:text-white">
                  #{table.number}
                </div>

                <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate">
                  {getZoneName(table)}
                </span>

                <div className="pt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold block ${
                    isOccupied
                      ? 'bg-amber-500 text-dark-950'
                      : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {isOccupied ? cur.occupiedBadge : cur.freeBadge}
                  </span>
                  {table.currentGuest && (
                    <span className="text-[10px] text-gray-400 block truncate mt-1">
                      {table.currentGuest}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
