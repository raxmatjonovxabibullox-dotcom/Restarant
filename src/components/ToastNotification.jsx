import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastNotification = () => {
  const { toast } = useRestaurant();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : isError
          ? 'bg-red-950/90 border-red-500/40 text-red-200'
          : 'bg-dark-900/90 border-gold-500/40 text-gold-200'
      }`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Info className="w-5 h-5 text-gold-400" />
          )}
        </div>
        <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
          {toast.message}
        </p>
      </div>
    </div>
  );
};
