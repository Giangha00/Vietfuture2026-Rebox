"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useOrderEvents } from "@/hooks/useOrderEvents";
import { ORDER_STATUS_LABEL, formatDateTime, formatMoney, resolveOrderTiming } from "@/lib/order-status";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import { backendFetchMyOrders } from "@/lib/rebox-backend-api";

export default function OrdersPageContent() {
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
        const list = await backendFetchMyOrders(token);
        setOrders(list);
      } catch (err) {
        if (handleAuthError(err, { redirect: ROUTES.orders })) return;
        setError(err?.message || "Could not load orders.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [handleAuthError, token],
  );

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.orders));
      return;
    }
    requireVerified(ROUTES.orders);
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
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-3xl font-bold text-rb-ink">My Orders</h1>
          <p className="mt-1 text-sm text-rb-muted">
            Track payment, shipping, and escrow for your purchases.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href={ROUTES.sellingOrders} variant="outline" size="sm">
            Selling orders
          </Button>
          <Button href={ROUTES.order} variant="outline" size="sm">
            <Icon name="cart" className="size-4" />
            Open cart
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-rb-muted">Loading...</p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rb-border bg-white px-6 py-16 text-center">
          <p className="font-semibold text-rb-ink">No orders yet</p>
          <p className="mt-1 text-sm text-rb-muted">
            Add products to your cart and place an order.
          </p>
          <Button href={ROUTES.products} className="mt-5">
            Browse products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const timing = resolveOrderTiming(order);
            return (
            <Link
              key={order.id}
              href={ROUTES.orderDetail(order.id)}
              className="block rounded-2xl border border-rb-border bg-white p-5 transition hover:border-rb-green/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-rb-muted">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 font-semibold text-rb-ink">
                    {order.items?.length || 0} item(s) ·{" "}
                    {formatMoney(order.totalAmount, order.currency)}
                  </p>
                  <p className="mt-1 text-xs text-rb-muted">
                    Escrow: {order.escrowStatus || "none"} · Pay:{" "}
                    {order.paymentStatus || "unpaid"}
                  </p>
                  {order.shipper?.fullName ? (
                    <p className="mt-1 text-xs text-rb-muted">
                      Shipper: {order.shipper.fullName}
                      {timing.estimatedDeliveryAt
                        ? ` · ETA ${formatDateTime(timing.estimatedDeliveryAt)}`
                        : ""}
                    </p>
                  ) : timing.estimatedDeliveryAt ? (
                    <p className="mt-1 text-xs text-rb-green">
                      ETA {formatDateTime(timing.estimatedDeliveryAt)}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-rb-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-rb-ink">
                  {ORDER_STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {(order.items || []).map((item, index) => {
                  const productId =
                    item.product?._id || item.product?.id || item.product;
                  return (
                    <li key={`${order.id}-${index}`} className="flex gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-rb-ink">{item.title}</p>
                        <p className="text-sm text-rb-muted">
                          {formatMoney(item.price)}
                          {item.seller?.fullName
                            ? ` · ${item.seller.fullName}`
                            : ""}
                          {productId ? ` · #${String(productId).slice(-6)}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
