"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "rebox_cart_items";

function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, ready]);

  const addItem = useCallback((product) => {
    if (!product?.id) return { added: false, reason: "invalid" };

    let result = { added: false, reason: "exists" };
    setItems((current) => {
      if (current.some((item) => item.id === product.id)) {
        result = { added: false, reason: "exists" };
        return current;
      }
      result = { added: true, reason: "ok" };
      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price || 0),
          image: product.image || product.images?.[0] || "",
          condition: product.condition || "",
          location: product.location || product.station || "",
          sellerId: product.seller?.id || "",
          sellerName: product.seller?.name || "Seller",
        },
      ];
    });
    return result;
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleItem = useCallback(
    (product) => {
      const exists = items.some((item) => item.id === product.id);
      if (exists) {
        removeItem(product.id);
        return { selected: false };
      }
      addItem(product);
      return { selected: true };
    },
    [addItem, items, removeItem],
  );

  const isInCart = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [items],
  );

  const value = useMemo(
    () => ({
      ready,
      items,
      count: items.length,
      totalAmount,
      addItem,
      removeItem,
      clearCart,
      toggleItem,
      isInCart,
    }),
    [
      addItem,
      clearCart,
      isInCart,
      items,
      ready,
      removeItem,
      toggleItem,
      totalAmount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
