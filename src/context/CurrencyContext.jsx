import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  UZS: { code: 'UZS', symbol: "so'm", name: "O'zbek so'mi", rate: 1, position: 'after' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 12850, position: 'before' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 13950, position: 'before' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Рубль', rate: 135, position: 'after' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('zafaron_currency_v1') || 'UZS';
    } catch {
      return 'UZS';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zafaron_currency_v1', currency);
    } catch {}
  }, [currency]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.UZS;

  const formatPrice = (amountInUzs) => {
    if (!amountInUzs && amountInUzs !== 0) return '';
    const num = Number(amountInUzs);
    if (isNaN(num)) return amountInUzs;

    if (currency === 'UZS') {
      return `${Math.round(num).toLocaleString('ru-RU')} ${activeCurrency.symbol}`;
    }

    const converted = num / activeCurrency.rate;
    const formattedNum = converted >= 10 ? converted.toFixed(1) : converted.toFixed(2);

    if (activeCurrency.position === 'before') {
      return `${activeCurrency.symbol}${formattedNum}`;
    }
    return `${formattedNum} ${activeCurrency.symbol}`;
  };

  const convertAmount = (amountInUzs) => {
    if (!amountInUzs) return 0;
    if (currency === 'UZS') return amountInUzs;
    return Number((amountInUzs / activeCurrency.rate).toFixed(2));
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      activeCurrency,
      formatPrice,
      convertAmount,
      availableCurrencies: Object.values(CURRENCIES),
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
