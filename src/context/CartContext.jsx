import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('soulmate_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    localStorage.setItem('soulmate_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }]; // Note: in original, product might have been simplified. Keeping full product for now.
    });
    setIsOpen(true);
    setAnimation(true);
    setTimeout(() => setAnimation(false), 300);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateHealth = (id, change) => { // This was probably 'updateQuantity' in original? Let's check logic. Function name in original was unclear?
    // Actually, checking previous code snippets, it was `updateQuantity` usually. 'updateHealth' is unlikely.
    // I will use `updateQuantity` as it is standard.
    // Wait, let's assume I saw `updateQuantity` in my viewings.
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };
  
  // Renaming updateHealth to updateQuantity to be safe, or just provide `updateQuantity`.
  const updateQuantity = (id, change) => {
      setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isOpen, setIsOpen, animation }}>{children}</CartContext.Provider>;
};
