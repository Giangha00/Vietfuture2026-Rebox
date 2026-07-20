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
import { ROUTES } from "@/lib/routes";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";
import { LOGIN_REASONS } from "@/lib/auth";
import {
  backendFetchMe,
  backendLogin,
  backendRegister,
  backendUpdateMe,
} from "@/lib/rebox-backend-api";
import { normalizeBackendUser } from "@/lib/normalize-backend";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "rebox_backend_token";

function readStoredToken() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);
  const [loginModal, setLoginModal] = useState({
    open: false,
    reason: LOGIN_REASONS.default,
    redirectTo: null,
  });

  useEffect(() => {
    const storedToken = readStoredToken();
    if (!storedToken) {
      setReady(true);
      return;
    }

    setToken(storedToken);
    backendFetchMe(storedToken)
      .then((u) => setUser(normalizeBackendUser(u)))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const saveToken = useCallback((nextToken) => {
    setToken(nextToken);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const result = await backendLogin({ email, password });
      saveToken(result.token);
      const normalized = normalizeBackendUser(result.user);
      setUser(normalized);
      return normalized;
    },
    [saveToken],
  );

  const register = useCallback(
    async ({ fullName, email, phone, password }) => {
      const result = await backendRegister({ fullName, email, phone, password });
      saveToken(result.token);
      const normalized = normalizeBackendUser(result.user);
      setUser(normalized);
      return normalized;
    },
    [saveToken],
  );

  const updateProfile = useCallback(
    async (payload) => {
      if (!token) throw new Error("You must be logged in.");
      const updated = await backendUpdateMe({ token, ...payload });
      const normalized = normalizeBackendUser(updated);
      setUser(normalized);
      return normalized;
    },
    [token],
  );

  const logout = useCallback(async () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
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
      token,
      ready,
      isAuthenticated: Boolean(user),
      login,
      register,
      updateProfile,
      logout,
      requireAuth,
      navigateWithAuth,
      openLoginModal,
      closeLoginModal,
    }),
    [
      closeLoginModal,
      login,
      register,
      updateProfile,
      logout,
      navigateWithAuth,
      openLoginModal,
      ready,
      token,
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
