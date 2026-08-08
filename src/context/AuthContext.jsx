"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES, verifyEmailWithParams } from "@/lib/routes";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";
import {
  getVerificationEmailFromError,
  isNeedsVerificationError,
  LOGIN_REASONS,
} from "@/lib/auth";
import {
  backendFetchMe,
  backendLogin,
  backendRegister,
  backendUpdateMe,
  backendVerifyEmail,
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
  const pathname = usePathname();
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

  const redirectToVerifyEmail = useCallback(
    ({ email, redirect, debugCode } = {}) => {
      const href = verifyEmailWithParams({
        email: email || user?.email || "",
        redirect: redirect || pathname || ROUTES.home,
        debugCode,
      });
      router.push(href);
      return href;
    },
    [pathname, router, user?.email],
  );

  const handleAuthError = useCallback(
    (error, { redirect, email } = {}) => {
      if (!isNeedsVerificationError(error)) return false;

      redirectToVerifyEmail({
        email: getVerificationEmailFromError(error, email || user?.email),
        redirect: redirect || pathname || ROUTES.home,
        debugCode: error?.debugCode || error?.data?.debugCode,
      });
      return true;
    },
    [pathname, redirectToVerifyEmail, user?.email],
  );

  const login = useCallback(
    async ({ email, password }) => {
      try {
        const result = await backendLogin({ email, password });
        saveToken(result.token);
        const normalized = normalizeBackendUser(result.user);
        setUser(normalized);
        return normalized;
      } catch (error) {
        if (error?.data?.needsVerification) {
          const verifyError = new Error(error.message);
          verifyError.needsVerification = true;
          verifyError.email = error.data.email || email;
          verifyError.debugCode = error.data.debugCode;
          throw verifyError;
        }
        throw error;
      }
    },
    [saveToken],
  );

  const register = useCallback(async ({ fullName, email, phone, password }) => {
    const result = await backendRegister({ fullName, email, phone, password });
    return result;
  }, []);

  const completeEmailVerification = useCallback(
    async ({ email, otp }) => {
      const result = await backendVerifyEmail({ email, otp });
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
      if (!user) {
        openLoginModal(reason, redirectTo);
        return false;
      }

      if (!user.emailVerified) {
        redirectToVerifyEmail({
          email: user.email,
          redirect: redirectTo || pathname || ROUTES.home,
        });
        return false;
      }

      action?.();
      return true;
    },
    [openLoginModal, pathname, redirectToVerifyEmail, user],
  );

  const requireVerified = useCallback(
    (redirectTo = null) => {
      if (!user) {
        openLoginModal(LOGIN_REASONS.default, redirectTo);
        return false;
      }

      if (!user.emailVerified) {
        redirectToVerifyEmail({
          email: user.email,
          redirect: redirectTo || pathname || ROUTES.home,
        });
        return false;
      }

      return true;
    },
    [openLoginModal, pathname, redirectToVerifyEmail, user],
  );

  const navigateWithAuth = useCallback(
    (href, reason = LOGIN_REASONS.default) => {
      if (!user) {
        openLoginModal(reason, href);
        return false;
      }

      if (!user.emailVerified) {
        redirectToVerifyEmail({
          email: user.email,
          redirect: href || pathname || ROUTES.home,
        });
        return false;
      }

      router.push(href);
      return true;
    },
    [openLoginModal, pathname, redirectToVerifyEmail, router, user],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(user),
      isEmailVerified: Boolean(user?.emailVerified),
      login,
      register,
      completeEmailVerification,
      updateProfile,
      logout,
      requireAuth,
      requireVerified,
      navigateWithAuth,
      redirectToVerifyEmail,
      handleAuthError,
      openLoginModal,
      closeLoginModal,
    }),
    [
      closeLoginModal,
      completeEmailVerification,
      handleAuthError,
      login,
      register,
      updateProfile,
      logout,
      navigateWithAuth,
      openLoginModal,
      ready,
      redirectToVerifyEmail,
      requireAuth,
      requireVerified,
      token,
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
