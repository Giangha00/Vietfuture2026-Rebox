"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { CURRENT_USER } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";
import { AUTH_STORAGE_KEY, LOGIN_REASONS } from "@/lib/auth";

const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createAuthUser({ name, email } = {}) {
  return {
    ...CURRENT_USER,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  };
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [loginModal, setLoginModal] = useState({
    open: false,
    reason: LOGIN_REASONS.default,
    redirectTo: null,
  });

  useEffect(() => {
    setUser(readStoredUser());
    setReady(true);
  }, []);

  const login = useCallback((userData) => {
    const nextUser = createAuthUser(userData);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    router.push(ROUTES.home);
  }, [router]);

  const openLoginModal = useCallback((reason = LOGIN_REASONS.default, redirectTo = null) => {
    setLoginModal({ open: true, reason, redirectTo });
  }, []);

  const closeLoginModal = useCallback(() => {
    setLoginModal((current) => ({ ...current, open: false }));
  }, []);

  const requireAuth = useCallback(
    (action, reason = LOGIN_REASONS.default, redirectTo = null) => {
      if (user) {
        action?.();
        return true;
      }

      openLoginModal(reason, redirectTo);
      return false;
    },
    [openLoginModal, user],
  );

  const navigateWithAuth = useCallback(
    (href, reason = LOGIN_REASONS.default) => {
      if (user) {
        router.push(href);
        return true;
      }

      openLoginModal(reason, href);
      return false;
    },
    [openLoginModal, router, user],
  );

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      login,
      logout,
      requireAuth,
      navigateWithAuth,
      openLoginModal,
      closeLoginModal,
    }),
    [
      closeLoginModal,
      login,
      logout,
      navigateWithAuth,
      openLoginModal,
      ready,
      requireAuth,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginRequiredModal
        open={loginModal.open}
        reason={loginModal.reason}
        redirectTo={loginModal.redirectTo}
        onClose={closeLoginModal}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
