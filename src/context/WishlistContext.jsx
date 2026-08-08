"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "rebox_wishlist_items";

function toWishlistItem(product) {
  if (!product?.id) return null;
  return {
    id: String(product.id),
    title: product.title || "",
    price: Number(product.price || 0),
    image: product.image || product.images?.[0] || "",
    images: Array.isArray(product.images) ? product.images : [],
    condition: product.condition || "",
    location: product.location || product.station || "",
    category: product.category || "",
    verified: Boolean(product.verified),
    seller: {
      id: product.seller?.id || "",
      name: product.seller?.name || "Seller",
      avatar: product.seller?.avatar || "",
    },
    savedAt: new Date().toISOString(),
  };
}

function readStoredWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        ...item,
        id: String(item.id),
      }))
      .filter((item) => item.id);
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredWishlist());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, ready]);

  const isSaved = useCallback(
    (productId) => {
      if (!productId) return false;
      return items.some((item) => item.id === String(productId));
    },
    [items],
  );

  const addItem = useCallback((product) => {
    const next = toWishlistItem(product);
    if (!next) return { added: false, reason: "invalid" };

    let result = { added: false, reason: "exists" };
    setItems((current) => {
      if (current.some((item) => item.id === next.id)) {
        result = { added: false, reason: "exists" };
        return current;
      }
      result = { added: true, reason: "ok" };
      return [next, ...current];
    });
    return result;
  }, []);

  const removeItem = useCallback((productId) => {
    const id = String(productId || "");
    if (!id) return;
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toggleItem = useCallback(
    (product) => {
      if (!product?.id) return { saved: false };
      const id = String(product.id);
      const exists = items.some((item) => item.id === id);
      if (exists) {
        removeItem(id);
        return { saved: false };
      }
      addItem(product);
      return { saved: true };
    },
    [addItem, items, removeItem],
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      items,
      count: items.length,
      isSaved,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
    }),
    [
      addItem,
      clearWishlist,
      isSaved,
      items,
      ready,
      removeItem,
      toggleItem,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
