import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredCart, saveStoredCart } from '../lib/storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => getStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  // Add item
  const addToCart = (dish, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...dish, quantity }];
      }
    });
  };

  // Update quantity
  const updateQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart((prev) =>
      prev.map(item => item.id === dishId ? { ...item, quantity: newQty } : item)
    );
  };

  // Remove item
  const removeFromCart = (dishId) => {
    setCart((prev) => prev.filter(item => item.id !== dishId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Computations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
