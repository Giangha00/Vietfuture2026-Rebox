"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useOrderEvents } from "@/hooks/useOrderEvents";
import { ORDER_STATUS_LABEL, formatMoney } from "@/lib/order-status";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import { backendFetchSellingOrders } from "@/lib/rebox-backend-api";

export default function SellingOrdersContent() {
  const router = useRouter();
  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    token,
    handleAuthError,
    requireVerified,
  } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reloadTimer = useRef(null);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!token) return;
      if (!silent) setLoading(true);
      setError("");
      try {
        const list = await backendFetchSellingOrders(token);
        setOrders(list);
      } catch (err) {
        if (handleAuthError(err, { redirect: ROUTES.sellingOrders })) return;
        setError(err?.message || "Could not load selling orders.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [handleAuthError, token],
  );

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.sellingOrders));
      return;
    }
    requireVerified(ROUTES.sellingOrders);
  }, [isAuthenticated, ready, requireVerified, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !isEmailVerified || !token) return;
    load();
  }, [isAuthenticated, isEmailVerified, load, ready, token]);

  useOrderEvents(
    token,
    () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
      reloadTimer.current = window.setTimeout(() => {
        load({ silent: true });
      }, 250);
    },
    { enabled: Boolean(ready && isAuthenticated && isEmailVerified && token) },
  );

  useEffect(
    () => () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
    },
    [],
  );

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-3xl font-bold text-rb-ink">
            Selling orders
          </h1>
          <p className="mt-1 text-sm text-rb-muted">
            Confirm stock after the buyer pays. Escrow releases when delivery is confirmed.
          </p>
        </div>
        <Button href={ROUTES.orders} variant="outline" size="sm">
          My purchases
        </Button>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-rb-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rb-border bg-white px-6 py-16 text-center">
          <p className="font-semibold text-rb-ink">No selling orders yet</p>
          <Button href={ROUTES.profile} className="mt-5" variant="outline">
            View my listings
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={ROUTES.orderDetail(order.id)}
                className="block rounded-2xl border border-rb-border bg-white p-5 transition hover:border-rb-green/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-rb-ink">
                      #{String(order.id).slice(-8)} ·{" "}
                      {ORDER_STATUS_LABEL[order.status] || order.status}
                    </p>
                    <p className="mt-1 text-sm text-rb-muted">
                      {(order.items || []).map((i) => i.title).join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <p className="font-bold text-rb-green">
                    {formatMoney(order.totalAmount, order.currency)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
