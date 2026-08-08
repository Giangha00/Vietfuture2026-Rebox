"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { isNeedsVerificationError } from "@/lib/auth";
import {
  backendFetchNotifications,
  backendMarkAllNotificationsRead,
  backendMarkNotificationRead,
  backendSendTestNotification,
} from "@/lib/rebox-backend-api";
import {
  disablePushNotifications,
  enablePushNotifications,
  isPushConfigured,
  listenForForegroundMessages,
  syncPushTokenIfEnabled,
} from "@/lib/fcm";

function formatTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "";
  }
}

export default function NotificationBell() {
  const router = useRouter();
  const { token, isAuthenticated, isEmailVerified } = useAuth();
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const pushConfigured = isPushConfigured();

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    setPermissionDenied(Notification.permission === "denied");
  }, [open]);

  const refresh = useCallback(async () => {
    if (!token || !isEmailVerified) return;
    setLoading(true);
    try {
      const data = await backendFetchNotifications(token);
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      if (isNeedsVerificationError(err)) {
        setItems([]);
        setUnreadCount(0);
        return;
      }
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isEmailVerified, token]);

  useEffect(() => {
    if (!isAuthenticated || !token || !isEmailVerified) {
      setItems([]);
      setUnreadCount(0);
      return undefined;
    }

    let cancelled = false;
    let unsubscribe = () => {};

    const boot = async () => {
      setLoading(true);
      try {
        const data = await backendFetchNotifications(token);
        if (!cancelled) {
          setItems(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setUnreadCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }

      const fcmToken = await syncPushTokenIfEnabled(token);
      if (!cancelled) {
        const granted =
          typeof Notification !== "undefined" && Notification.permission === "granted";
        setPushEnabled(Boolean(fcmToken) || granted);
      }

      const unsub = await listenForForegroundMessages((payload) => {
        const title = payload.notification?.title || "ReBox";
        const body = payload.notification?.body || "";
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted" &&
          body
        ) {
          new Notification(title, { body });
        }
        refresh();
      });
      if (!cancelled) {
        unsubscribe = typeof unsub === "function" ? unsub : () => {};
      }
    };

    boot();
    const interval = window.setInterval(() => {
      refresh();
    }, 30000);

    return () => {
      cancelled = true;
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [isAuthenticated, isEmailVerified, refresh, token]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!isAuthenticated) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          setError("");
          if (!open) refresh();
        }}
        className="relative flex size-9 items-center justify-center rounded-full text-rb-muted transition hover:bg-rb-green-soft hover:text-rb-green sm:inline-flex"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Icon name="bell" className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-rb-green text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-rb-border bg-white shadow-xl shadow-rb-ink/10 animate-fade-up">
          <div className="flex items-center justify-between border-b border-rb-border px-4 py-3">
            <p className="text-sm font-semibold text-rb-ink">Notifications</p>
            <button
              type="button"
              className="text-xs font-semibold text-rb-green hover:underline"
              onClick={async () => {
                if (!token) return;
                await backendMarkAllNotificationsRead(token);
                refresh();
              }}
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 border-b border-rb-border px-4 py-3">
            {!pushConfigured ? (
              <p className="text-xs text-rb-muted">
                Add Firebase web keys to `.env.local` to enable browser push.
              </p>
            ) : permissionDenied ? (
              <p className="text-xs text-red-600">
                Notifications are blocked. Click the lock icon next to the URL →
                Site settings → Notifications → Allow, then reload this page.
              </p>
            ) : pushEnabled ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await backendSendTestNotification({ token });
                      await refresh();
                    } catch (err) {
                      setError(err?.message || "Failed to send test notification.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Send test
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await disablePushNotifications(token);
                      setPushEnabled(false);
                    } catch (err) {
                      setError(err?.message || "Failed to disable push.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Disable
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                fullWidth
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await enablePushNotifications(token);
                    setPushEnabled(true);
                    setPermissionDenied(false);
                  } catch (err) {
                    if (typeof Notification !== "undefined") {
                      setPermissionDenied(Notification.permission === "denied");
                    }
                    setError(err?.message || "Failed to enable push.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Enable push notifications
              </Button>
            )}
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-rb-muted">Loading...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-rb-muted">
                No notifications yet.
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    "block w-full border-b border-rb-border px-4 py-3 text-left transition hover:bg-rb-green-soft/60",
                    item.readAt ? "opacity-70" : "bg-rb-green-soft/40",
                  ].join(" ")}
                  onClick={async () => {
                    if (!item.readAt && token) {
                      await backendMarkNotificationRead({ token, id: item.id });
                    }
                    setOpen(false);
                    if (item.link) router.push(item.link);
                    refresh();
                  }}
                >
                  <p className="text-sm font-semibold text-rb-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-rb-muted">{item.body}</p>
                  <p className="mt-1 text-[11px] text-rb-muted">
                    {formatTime(item.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
