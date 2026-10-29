import React, { useState } from 'react';
import { Users, Sparkles, Check, Eye, Crown, Info, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../hooks/useSoundEffects';

// Floor plan table layout data with multilingual zone and view
const TABLES = [
  // ZAL 1: Shohona Asosiy Zal
  {
    id: 'T-1',
    number: '1',
    seats: 2,
    type: 'romantic',
    shape: 'round',
    x: 18,
    y: 25,
    status: 'available',
    zone: {
      uz: 'Asosiy Hashamatli Zal',
      ru: 'Главный Роскошный Зал',
      en: 'Main Luxury Hall'
    },
    view: {
      uz: 'Sahnaga yaqin',
      ru: 'Близко к сцене',
      en: 'Near live stage'
    }
  },
  {
    id: 'T-2',
    number: '2',
    seats: 4,
    type: 'standard',
    shape: 'square',
    x: 38,
    y: 25,
    status: 'available',
    zone: {
      uz: 'Asosiy Hashamatli Zal',
      ru: 'Главный Роскошный Зал',
      en: 'Main Luxury Hall'
    },
    view: {
      uz: 'Markaziy zal',
      ru: 'Центральный зал',
      en: 'Central hall view'
    }
  },
  {
    id: 'T-3',
    number: '3',
    seats: 4,
    type: 'standard',
    shape: 'square',
    x: 58,
    y: 25,
    status: 'occupied',
    zone: {
      uz: 'Asosiy Hashamatli Zal',
      ru: 'Главный Роскошный Зал',
      en: 'Main Luxury Hall'
    },
    view: {
      uz: 'Markaziy zal',
      ru: 'Центральный зал',
      en: 'Central hall view'
    }
  },
  {
    id: 'T-4',
    number: '4',
    seats: 6,
    type: 'lounge',
    shape: 'rect',
    x: 28,
    y: 55,
    status: 'available',
    zone: {
      uz: 'Asosiy Hashamatli Zal',
      ru: 'Главный Роскошный Зал',
      en: 'Main Luxury Hall'
    },
    view: {
      uz: 'Katta divan',
      ru: 'Большой мягкий диван',
      en: 'Large lounge sofa'
    }
  },
  {
    id: 'T-5',
    number: '5',
    seats: 8,
    type: 'banquet',
    shape: 'rect',
    x: 58,
    y: 55,
    status: 'available',
    zone: {
      uz: 'Asosiy Hashamatli Zal',
      ru: 'Главный Роскошный Зал',
      en: 'Main Luxury Hall'
    },
    view: {
      uz: 'Shohona zal markazi',
      ru: 'Центр роскошного зала',
      en: 'Center of luxury hall'
    }
  },

  // ZAL 2: Ochiq Havo Terrasasi (Panoramik)
  {
    id: 'T-6',
    number: '6',
    seats: 2,
    type: 'panoramic',
    shape: 'round',
    x: 82,
    y: 20,
    status: 'available',
    zone: {
      uz: "Ochiq Havo Terrasasi (Manzarali)",
      ru: "Летняя Терраса (Панорама)",
      en: "Open Air Terrace (Panoramic)"
    },
    view: {
      uz: 'Toshkent kechki panoramasi',
      ru: 'Вечерняя панорама Ташкента',
      en: 'Tashkent evening skyline'
    }
  },
  {
    id: 'T-7',
    number: '7',
    seats: 4,
    type: 'panoramic',
    shape: 'square',
    x: 82,
    y: 45,
    status: 'available',
    zone: {
      uz: "Ochiq Havo Terrasasi (Manzarali)",
      ru: "Летняя Терраса (Панорама)",
      en: "Open Air Terrace (Panoramic)"
    },
    view: {
      uz: 'Shahar chiroqlari',
      ru: 'Огни ночного города',
      en: 'City night lights'
    }
  },
  {
    id: 'T-8',
    number: '8',
    seats: 6,
    type: 'panoramic',
    shape: 'rect',
    x: 82,
    y: 72,
    status: 'available',
    zone: {
      uz: "Ochiq Havo Terrasasi (Manzarali)",
      ru: "Летняя Терраса (Панорама)",
      en: "Open Air Terrace (Panoramic)"
    },
    view: {
      uz: 'Terrasa burchagi',
      ru: 'Уютный угол террасы',
      en: 'Cozy terrace corner'
    }
  },

  // ZAL 3: VIP Alohida Xonalar
  {
    id: 'VIP-1',
    number: 'VIP 1',
    seats: 10,
    type: 'vip',
    shape: 'vip',
    vipFee: 200000,
    depositText: '200,000 UZS Depozit',
    x: 18,
    y: 82,
    status: 'available',
    zone: {
      uz: "VIP Alohida Xona (6-12 kishi)",
      ru: "VIP Отдельный Зал (6-12 гостей)",
      en: "VIP Private Chamber (6-12 guests)"
    },
    view: {
      uz: 'Alohida VIP xona & Kamin (200,000 UZS Depozit)',
      ru: 'Приватная комната и камин (200,000 сум депозит)',
      en: 'Private room with fireplace (200,000 UZS deposit)'
    }
  },
  {
    id: 'VIP-2',
    number: 'VIP 2',
    seats: 14,
    type: 'vip',
    shape: 'vip',
    vipFee: 300000,
    depositText: '300,000 UZS Depozit',
    x: 45,
    y: 82,
    status: 'occupied',
    zone: {
      uz: "VIP Alohida Xona (6-12 kishi)",
      ru: "VIP Отдельный Зал (6-12 гостей)",
      en: "VIP Private Chamber (6-12 guests)"
    },
    view: {
      uz: 'Prezident VIP Suite (300,000 UZS Depozit)',
      ru: 'Президентский VIP Сьют (300,000 сум депозит)',
      en: 'Presidential VIP Suite (300,000 UZS deposit)'
    }
  },
];

export const TableFloorPlan = ({ selectedTable, onSelectTable }) => {
  const { lang } = useLanguage();
  const [hoveredTable, setHoveredTable] = useState(null);

  const tPlan = {
    uz: {
      legendFree: "Bo'sh stol",
      legendSelected: "Tanlangan",
      legendOccupied: "Band qilingan",
      legendHint: "Stolni tanlash uchun uning ustiga bosing",
      zoneMain: "Shohona Zal",
      zoneTerrace: "Panoramik Terrasa",
      zoneVip: "VIP Oltin Xonalar",
      tablePrefix: "Stol #",
      seats: (s) => `${s} kishilik`,
      statusOccupied: "Band qilingan",
      statusFree: "Bo'sh",
      selectedAlert: (num, seats, zone) => (
        <>Tanlandi: <b className="text-gold-500 font-bold">Stol #{num}</b> ({seats} kishilik, {zone})</>
      ),
      confirmedBadge: "Joy tasdiqlandi"
    },
    ru: {
      legendFree: "Свободен",
      legendSelected: "Выбран",
      legendOccupied: "Занят",
      legendHint: "Нажмите на стол, чтобы выбрать его",
      zoneMain: "Роскошный Зал",
      zoneTerrace: "Панорамная Терраса",
      zoneVip: "VIP Золотые Залы",
      tablePrefix: "Стол #",
      seats: (s) => `на ${s} персон`,
      statusOccupied: "Занят",
      statusFree: "Свободен",
      selectedAlert: (num, seats, zone) => (
        <>Выбран: <b className="text-gold-500 font-bold">Стол #{num}</b> (на {seats} персон, {zone})</>
      ),
      confirmedBadge: "Стол выбран"
    },
    en: {
      legendFree: "Available",
      legendSelected: "Selected",
      legendOccupied: "Occupied",
      legendHint: "Click on any table to reserve it",
      zoneMain: "Luxury Hall",
      zoneTerrace: "Panoramic Terrace",
      zoneVip: "VIP Golden Rooms",
      tablePrefix: "Table #",
      seats: (s) => `${s} seats`,
      statusOccupied: "Occupied",
      statusFree: "Available",
      selectedAlert: (num, seats, zone) => (
        <>Selected: <b className="text-gold-500 font-bold">Table #{num}</b> ({seats} seats, {zone})</>
      ),
      confirmedBadge: "Table Confirmed"
    }
  };

  const cur = tPlan[lang] || tPlan.uz;

  const getLocalizedField = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.uz || field.en || '';
  };

  const handleTableClick = (table) => {
    if (table.status === 'occupied') {
      soundFx.playPop();
      return;
    }
    soundFx.playChime();
    // Normalize localized zone name before emitting
    onSelectTable({
      ...table,
      zone: getLocalizedField(table.zone)
    });
  };

  return (
    <div className="space-y-4">
      {/* Legend & Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/50 dark:bg-dark-800/60 border border-gray-200 dark:border-white/10 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border-2 border-emerald-500 inline-block" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{cur.legendFree}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border-2 border-gold-500 shadow-glow inline-block" />
            <span className="text-gold-500 font-bold">{cur.legendSelected}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gray-400/20 border-2 border-gray-400 dark:border-gray-600 inline-block" />
            <span className="text-gray-400 font-medium">{cur.legendOccupied}</span>
          </div>
        </div>

        <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-gold-500" />
          <span>{cur.legendHint}</span>
        </div>
      </div>

      {/* Visual Floor Map Canvas Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-gray-100 via-gray-50 to-amber-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-850 rounded-3xl border-2 border-gray-200 dark:border-gold-500/20 overflow-hidden shadow-2xl p-4 select-none">
        {/* Floor Zones Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#d99708_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* Zone Markers / Labels */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
          <Crown className="w-3.5 h-3.5 text-gold-500" />
          <span>{cur.zoneMain}</span>
        </div>

        <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[11px] font-bold text-amber-500 uppercase tracking-widest pointer-events-none">
          <Sun className="w-3.5 h-3.5" />
          <span>{cur.zoneTerrace}</span>
        </div>

        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest pointer-events-none">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>{cur.zoneVip}</span>
        </div>

        {/* Divider lines between zones */}
        <div className="absolute top-0 right-1/4 bottom-0 w-px border-r border-dashed border-gray-300 dark:border-white/10 pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 right-1/4 h-px border-b border-dashed border-gray-300 dark:border-white/10 pointer-events-none" />

        {/* Render Tables */}
        {TABLES.map((table) => {
          const isSelected = selectedTable?.id === table.id;
          const isOccupied = table.status === 'occupied';

          return (
            <div
              key={table.id}
              style={{ left: `${table.x}%`, top: `${table.y}%` }}
              onMouseEnter={() => setHoveredTable(table)}
              onMouseLeave={() => setHoveredTable(null)}
              onClick={() => handleTableClick(table)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                isOccupied ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'
              }`}
            >
              {/* Outer Glow Ring for Selected Table */}
              {isSelected && (
                <div className="absolute -inset-2.5 rounded-full border-2 border-gold-400 animate-ping opacity-75" />
              )}

              {/* Table Body Shape */}
              <div
                className={`flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all ${
                  table.shape === 'round'
                    ? 'w-12 h-12 sm:w-14 sm:h-14 rounded-full'
                    : table.shape === 'vip'
                    ? 'w-16 h-12 sm:w-20 sm:h-14 rounded-2xl border-2'
                    : table.shape === 'rect'
                    ? 'w-16 h-11 sm:w-20 sm:h-12 rounded-xl'
                    : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl'
                } ${
                  isSelected
                    ? 'bg-gradient-to-tr from-amber-500 to-gold-400 text-dark-950 border-2 border-white shadow-glow scale-105'
                    : isOccupied
                    ? 'bg-gray-200 dark:bg-dark-800 border border-gray-300 dark:border-gray-700 text-gray-400'
                    : 'bg-white dark:bg-dark-800 border-2 border-emerald-500/70 text-gray-800 dark:text-gray-100 hover:border-gold-500 hover:shadow-gold-500/20'
                }`}
              >
                <span className="text-[11px] sm:text-xs leading-none">#{table.number}</span>
                <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] mt-0.5 opacity-80">
                  <Users className="w-2.5 h-2.5" />
                  <span>{table.seats}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow-md ${
                  isSelected
                    ? 'bg-white text-gold-600'
                    : isOccupied
                    ? 'bg-red-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {isSelected ? <Check className="w-2.5 h-2.5" /> : isOccupied ? '✕' : '✓'}
              </span>
            </div>
          );
        })}

        {/* Hover / Selected Info Tooltip */}
        {(hoveredTable || selectedTable) && (
          <div className="absolute bottom-3 right-4 z-20 p-3 rounded-xl bg-white/95 dark:bg-dark-900/95 border border-gold-500/40 backdrop-blur-md shadow-xl text-left max-w-xs animate-fade-in pointer-events-none">
            {(() => {
              const active = hoveredTable || selectedTable;
              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      {cur.tablePrefix}{active.number}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      active.status === 'occupied'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {active.status === 'occupied' ? cur.statusOccupied : cur.statusFree}
                    </span>
                  </div>
                  <p className="text-xs text-gold-500 font-medium">{getLocalizedField(active.zone)}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-600 dark:text-gray-300 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold-500" />
                      {cur.seats(active.seats)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gold-500" />
                      {getLocalizedField(active.view)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Selected Table Alert */}
      {selectedTable && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/40 text-xs sm:text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span className="text-gray-900 dark:text-white font-medium">
              {cur.selectedAlert(selectedTable.number, selectedTable.seats, getLocalizedField(selectedTable.zone))}
            </span>
          </div>
          <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
            {cur.confirmedBadge}
          </span>
        </div>
      )}
    </div>
  );
};
