import React from 'react';
import { UtensilsCrossed, RefreshCw, Home, Sparkles, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ZAFARON ErrorBoundary intercepted error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleResetStorage = () => {
    try {
      // Clear potentially corrupted local storage keys while preserving auth
      const auth = localStorage.getItem('zafaron_auth_v1');
      localStorage.clear();
      if (auth) localStorage.setItem('zafaron_auth_v1', auth);
    } catch (e) {
      console.warn("Storage clear warning:", e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090e] text-white flex items-center justify-center p-4 select-none">
          {/* Ambient Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-lg w-full bg-[#121522] border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            {/* Logo */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-400 p-0.5 shadow-gold-500/30 shadow-xl">
              <div className="w-full h-full bg-[#0a0c14] rounded-[14px] flex items-center justify-center text-gold-400">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
            </div>

            <div>
              <span className="font-display font-black text-2xl gold-gradient-text tracking-widest block">
                ZAFARON
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 uppercase block mt-0.5">
                Restaurant & Lounge
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Sahifani Qayta Yuklash Talab Qilinadi
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Kutilmagan texnik to'xtalish bartaraf etildi. Iltimos, sahifani yangilang yoki asosiy menyuga o'ting.
              </p>
              <p className="text-[11px] text-gray-500 italic">
                (Пожалуйста, обновите страницу / Please refresh the page)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-6 rounded-2xl gold-gradient-bg text-dark-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sahifani Yangilash (Refresh)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleGoHome}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 transition-all"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Bosh Sahifa</span>
                </button>

                <button
                  onClick={this.handleResetStorage}
                  className="py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-gold-500/30 text-gold-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  title="Keshni tozalash va tiklash"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Keshni Tiklash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
