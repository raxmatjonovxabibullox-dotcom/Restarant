import React from 'react';
import {
  Activity,
  DollarSign,
  Crown,
  ChefHat,
  Bike,
  Bot,
  Star,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

export const ExecutiveTickerBar = ({ totalRevenue = 18500000, vipDepositTotal = 500000, ordersCount = 18 }) => {
  const { formatPrice } = useCurrency();
  const { theme } = useTheme();

  const metrics = [
    {
      id: 'revenue',
      label: "Bugungi Tushum",
      val: formatPrice(totalRevenue),
      trend: "+14.8%",
      isPositive: true,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30"
    },
    {
      id: 'vip',
      label: "VIP Depozitlar",
      val: formatPrice(vipDepositTotal),
      trend: "2 ta xona band",
      isPositive: true,
      icon: Crown,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30"
    },
    {
      id: 'orders',
      label: "Faol Buyurtmalar",
      val: `${ordersCount} ta`,
      trend: "Real-vaqt",
      isPositive: true,
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30"
    },
    {
      id: 'kitchen',
      label: "Oshxona Yuklamasi",
      val: "35% (Optimal)",
      trend: "Normal",
      isPositive: true,
      icon: ChefHat,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30"
    },
    {
      id: 'bot',
      label: "Telegram AI Bot",
      val: "Online 🟢",
      trend: "24/7 Faol",
      isPositive: true,
      icon: Bot,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30"
    },
    {
      id: 'rating',
      label: "Google & Mehmon Reytingi",
      val: "4.9 ⭐",
      trend: "1,248 ta sharh",
      isPositive: true,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30"
    }
  ];

  return (
    <div className={`py-2 px-4 rounded-2xl border flex items-center gap-3 overflow-x-auto scrollbar-none text-xs ${
      theme === 'dark' ? 'bg-[#151826]/90 border-[#22263d]' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 font-black text-[10px] text-amber-400 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>LIVE PULSE</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${m.bg} shrink-0 transition-transform hover:scale-[1.02]`}
            >
              <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">{m.label}:</span>
                <span className={`font-mono font-bold ${m.color}`}>{m.val}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {m.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
