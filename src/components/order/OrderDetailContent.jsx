"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import {
  ORDER_FLOW,
  ORDER_FLOW_SHORT,
  ORDER_STATUS_LABEL,
  formatAddress,
  formatDateTime,
  formatMoney,
  formatRelativeTime,
  getEtaLabel,
  getFlowStepIndex,
  getNextStepHint,
  isTerminalStatus,
  resolveOrderTiming,
} from "@/lib/order-status";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import {
  backendCancelOrder,
  backendConfirmDelivery,
  backendFetchOrderById,
  backendOpenDispute,
  backendSellerConfirmOrder,
  backendSellerRejectOrder,
  backendStartOrderPayment,
} from "@/lib/rebox-backend-api";
import { useOrderEvents } from "@/hooks/useOrderEvents";

export default function OrderDetailContent({ orderId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    token,
    user,
    handleAuthError,
    requireVerified,
  } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [banner, setBanner] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!token || !orderId) return;
    if (!silent) {
      setLoading(true);
      setError("");
    }
    try {
      const data = await backendFetchOrderById({ token, id: orderId });
      if (!data) {
        if (!silent) setError("Order not found.");
        setOrder(null);
        return;
      }
      setOrder(data);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.orderDetail(orderId) })) return;
      if (!silent) setError(err?.message || "Could not load order.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [handleAuthError, orderId, token]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.orderDetail(orderId)));
      return;
    }
    if (!requireVerified(ROUTES.orderDetail(orderId))) {
      setLoading(false);
    }
  }, [isAuthenticated, orderId, ready, requireVerified, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !isEmailVerified || !token) return;
    load();
  }, [isAuthenticated, isEmailVerified, load, ready, token]);

  useOrderEvents(
    token,
    (payload) => {
      if (payload?.order) {
        setOrder(payload.order);
        setLoading(false);
        return;
      }
      load({ silent: true });
    },
    {
      enabled: Boolean(ready && isAuthenticated && isEmailVerified && token && orderId),
      orderId,
      intervalMs: 5000,
    },
  );

  useEffect(() => {
    const active =
      order &&
      !["completed", "cancelled", "delivered"].includes(order.status);
    if (!active) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, [order]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (!payment) return;
    if (payment === "success") setBanner("Payment successful. Escrow is holding funds.");
    if (payment === "cancelled") setBanner("PayPal checkout was cancelled.");
    if (payment === "failed") {
      setBanner(
        `Payment failed: ${searchParams.get("reason") || "Please try again."}`,
      );
    }
  }, [searchParams]);

  const buyerId = order?.buyer?.id || order?.buyer?._id || order?.buyer;
  const isBuyer = user?.id && String(buyerId) === String(user.id);
  const isSeller = useMemo(() => {
    if (!user?.id || !order?.items) return false;
    return order.items.some(
      (item) => String(item.seller?.id || item.seller?._id || item.seller) === String(user.id),
    );
  }, [order, user?.id]);

  async function runAction(key, fn) {
    setBusy(key);
    setActionError("");
    try {
      const result = await fn();
      if (result?.order) setOrder(result.order);
      else await load();
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.orderDetail(orderId) })) return;
      setActionError(err?.message || "Action failed.");
    } finally {
      setBusy("");
    }
  }

  async function payWithPaypal() {
    await runAction("pay", async () => {
      const result = await backendStartOrderPayment({ token, id: orderId });
      if (result?.approveUrl) {
        window.location.href = result.approveUrl;
        return result;
      }
      throw new Error("PayPal approve URL missing.");
    });
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-rb-muted">
        Loading order...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-rb-muted">
        Redirecting to login...
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-rb-muted">
        Verify your email to view this order.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-rb-muted">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Order not found."}
        </p>
        <Button href={ROUTES.orders} className="mt-4" variant="outline">
          Back to orders
        </Button>
      </div>
    );
  }

  const status = order.status;
  const statusLabel = ORDER_STATUS_LABEL[status] || status;
  const flowIndex = getFlowStepIndex(status);
  const timing = resolveOrderTiming(order);
  const nextHint = getNextStepHint(status, {
    isBuyer: Boolean(isBuyer),
    estimatedDeliveryAt: timing.estimatedDeliveryAt,
    autoCompleteAt: order.autoCompleteAt,
  });
  const terminal = isTerminalStatus(status) || status === "disputed";
  const etaLabel = getEtaLabel({ ...order, ...timing }, now);
  const seller = order.items?.[0]?.seller;
  const pickupRelative = timing.estimatedPickupAt
    ? formatRelativeTime(timing.estimatedPickupAt, now)
    : "";
  const deliveryRelative = timing.estimatedDeliveryAt
    ? formatRelativeTime(timing.estimatedDeliveryAt, now)
    : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={isSeller && !isBuyer ? ROUTES.sellingOrders : ROUTES.orders}
            className="text-sm font-semibold text-rb-green hover:underline"
          >
            ← My orders
          </Link>
          <h1 className="mt-2 font-sans text-3xl font-bold text-rb-ink">
            Track order
          </h1>
          <p className="mt-1 text-sm text-rb-muted">
            #{String(order.id).slice(-8)} · {statusLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-rb-green">
            {formatMoney(order.totalAmount, order.currency)}
          </p>
          <p className="text-xs text-rb-muted">
            Fee {formatMoney(order.platformFee)} · Seller{" "}
            {formatMoney(order.sellerPayout)}
          </p>
          <p className="text-xs text-rb-muted">
            Escrow: {order.escrowStatus} · Pay: {order.paymentStatus}
          </p>
        </div>
      </div>

      {banner ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {banner}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      <section className="mb-6 rounded-2xl border border-rb-border bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-semibold text-rb-ink">Order progress</h2>
          <p className="text-sm font-medium text-rb-green">{statusLabel}</p>
        </div>
        {!terminal ? (
          <ol className="mt-5 flex flex-wrap items-center gap-1 sm:gap-2">
            {ORDER_FLOW.map((step, index) => {
              const done = index < flowIndex;
              const active = index === flowIndex;
              return (
                <li
                  key={step}
                  className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2"
                >
                  <div className="flex min-w-0 flex-col items-center gap-1">
                    <span
                      className={[
                        "flex size-7 items-center justify-center rounded-full text-[11px] font-bold sm:size-8 sm:text-xs",
                        done || active
                          ? "bg-rb-green text-white"
                          : "bg-stone-200 text-rb-muted",
                      ].join(" ")}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={[
                        "max-w-[4.5rem] truncate text-center text-[10px] font-medium sm:max-w-none sm:text-xs",
                        active ? "text-rb-ink" : "text-rb-muted",
                      ].join(" ")}
                    >
                      {ORDER_FLOW_SHORT[step] || step}
                    </span>
                  </div>
                  {index < ORDER_FLOW.length - 1 ? (
                    <div
                      className={[
                        "mb-4 h-px min-w-2 flex-1",
                        done ? "bg-rb-green" : "bg-stone-200",
                      ].join(" ")}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}
        <p className="mt-4 rounded-xl bg-stone-50 px-3 py-2 text-sm text-rb-ink">
          <span className="font-semibold">Next: </span>
          {nextHint}
        </p>
        {etaLabel ? (
          <p className="mt-2 rounded-xl border border-rb-green/30 bg-rb-green-soft px-3 py-2 text-sm font-semibold text-rb-green">
            {etaLabel}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-rb-border bg-white p-5">
            <h2 className="font-semibold text-rb-ink">Delivery info</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-stone-50 p-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-rb-muted">
                  Shipper
                </p>
                {order.shipper ? (
                  <div className="mt-1 space-y-1 text-rb-ink">
                    <p className="font-semibold">{order.shipper.fullName}</p>
                    {order.shipper.phone ? (
                      <p className="text-rb-muted">Phone: {order.shipper.phone}</p>
                    ) : null}
                    {order.shipper.email ? (
                      <p className="text-rb-muted">Email: {order.shipper.email}</p>
                    ) : null}
                    <p className="text-xs text-rb-muted">
                      Assigned {formatDateTime(order.assignedAt)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-rb-muted">
                    Not assigned yet — waiting for a shipper after seller confirms.
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-stone-50 p-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-rb-muted">
                  Timing
                </p>
                <ul className="mt-1 space-y-1 text-rb-ink">
                  <li>
                    <span className="text-rb-muted">ETA pickup:</span>{" "}
                    <strong>
                      {timing.estimatedPickupAt
                        ? formatDateTime(timing.estimatedPickupAt)
                        : "Waiting for shipper"}
                    </strong>
                    {pickupRelative && !order.pickedUpAt ? (
                      <span className="ml-1 text-xs text-rb-green">({pickupRelative})</span>
                    ) : null}
                  </li>
                  <li>
                    <span className="text-rb-muted">ETA delivery:</span>{" "}
                    <strong>
                      {timing.estimatedDeliveryAt
                        ? formatDateTime(timing.estimatedDeliveryAt)
                        : "Waiting for shipper"}
                    </strong>
                    {deliveryRelative && !order.deliveredAt ? (
                      <span className="ml-1 text-xs text-rb-green">({deliveryRelative})</span>
                    ) : null}
                  </li>
                  <li>
                    <span className="text-rb-muted">Picked up:</span>{" "}
                    {formatDateTime(order.pickedUpAt)}
                  </li>
                  <li>
                    <span className="text-rb-muted">Delivered:</span>{" "}
                    {formatDateTime(order.deliveredAt)}
                  </li>
                </ul>
              </div>
            </div>
            {seller ? (
              <p className="mt-3 text-sm text-rb-muted">
                Seller: <strong className="text-rb-ink">{seller.fullName || "—"}</strong>
                {seller.phone ? ` · ${seller.phone}` : ""}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-rb-border bg-white p-5">
            <h2 className="font-semibold text-rb-ink">Items</h2>
            <ul className="mt-3 space-y-3">
              {(order.items || []).map((item) => (
                <li key={String(item.product?._id || item.product)} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {item.image ? (
                      <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium text-rb-ink">{item.title}</p>
                    <p className="text-sm text-rb-muted">
                      {formatMoney(item.price)} · Seller{" "}
                      {item.seller?.fullName || "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-rb-border bg-white p-5">
            <h2 className="font-semibold text-rb-ink">Addresses</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rb-muted">
                  Delivery
                </p>
                <p className="mt-1 text-rb-ink">{formatAddress(order.deliveryAddress)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rb-muted">
                  Pickup
                </p>
                <p className="mt-1 text-rb-ink">{formatAddress(order.pickupAddress)}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-rb-border bg-white p-5">
            <h2 className="font-semibold text-rb-ink">Status history</h2>
            <p className="mt-1 text-xs text-rb-muted">
              Full log of payment, escrow, pickup, and delivery updates.
            </p>
            <ol className="mt-3 space-y-3">
              {[...(order.timeline || [])].reverse().map((ev, idx) => (
                <li key={`${ev.status}-${idx}`} className="flex gap-3 text-sm">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-rb-green" />
                  <div>
                    <p className="font-medium text-rb-ink">
                      {ORDER_STATUS_LABEL[ev.status] || ev.status}
                    </p>
                    {ev.note ? <p className="text-rb-muted">{ev.note}</p> : null}
                    <p className="text-xs text-rb-muted">
                      {ev.at ? new Date(ev.at).toLocaleString() : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {order.dispute?.reason ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">Dispute</h2>
              <p className="mt-2 text-sm text-amber-900">{order.dispute.reason}</p>
            </section>
          ) : null}
        </div>

        <aside className="h-fit space-y-3 rounded-2xl border border-rb-border bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold text-rb-ink">Actions</h2>
          {isBuyer && status === "paid" ? (
            <p className="text-sm text-rb-muted">
              Nothing to do right now — seller must confirm stock before
              shipping starts.
            </p>
          ) : null}

          {isBuyer && ["pending_payment", "pending"].includes(status) ? (
            <Button
              fullWidth
              disabled={busy === "pay"}
              onClick={() => setConfirm("pay")}
            >
              <Icon name="cart" className="size-4" />
              {busy === "pay" ? "Redirecting…" : "Pay with PayPal"}
            </Button>
          ) : null}

          {isBuyer && ["pending_payment", "pending", "paid"].includes(status) ? (
            <Button
              fullWidth
              variant="outline"
              disabled={Boolean(busy)}
              onClick={() => setConfirm("cancel")}
            >
              Cancel order
            </Button>
          ) : null}

          {isSeller && status === "paid" ? (
            <>
              <Button
                fullWidth
                disabled={busy === "confirm"}
                onClick={() => setConfirm("confirm-stock")}
              >
                {busy === "confirm" ? "Confirming…" : "Confirm stock"}
              </Button>
              <Button
                fullWidth
                variant="outline"
                disabled={Boolean(busy)}
                onClick={() => setConfirm("reject")}
              >
                Reject order
              </Button>
            </>
          ) : null}

          {isBuyer && status === "delivered" ? (
            <div className="space-y-2">
              <Button
                fullWidth
                disabled={busy === "done"}
                onClick={() => setConfirm("received")}
              >
                {busy === "done" ? "Confirming…" : "Confirm received — release escrow"}
              </Button>
              {order.autoCompleteAt ? (
                <p className="text-center text-xs text-rb-muted">
                  Inspect by {formatDateTime(order.autoCompleteAt)}. Escrow may
                  auto-release after that if you take no action. Dispute if the
                  item does not match.
                </p>
              ) : (
                <p className="text-center text-xs text-rb-muted">
                  Inspect the item, then confirm — or open a dispute with evidence.
                </p>
              )}
            </div>
          ) : null}

          {isBuyer && ["delivered", "out_for_delivery"].includes(status) ? (
            <div className="space-y-2 border-t border-rb-border pt-3">
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={3}
                minLength={10}
                maxLength={500}
                placeholder="Describe the issue (min 10 characters)…"
                className="w-full rounded-xl border border-rb-border px-3 py-2 text-sm"
              />
              <Button
                fullWidth
                variant="outline"
                disabled={disputeReason.trim().length < 10 || Boolean(busy)}
                onClick={() => {
                  if (disputeReason.trim().length < 10) {
                    setActionError("Dispute reason must be at least 10 characters.");
                    return;
                  }
                  runAction("dispute", () =>
                    backendOpenDispute({
                      token,
                      id: orderId,
                      reason: disputeReason.trim(),
                    }),
                  );
                }}
              >
                Open dispute
              </Button>
            </div>
          ) : null}

          {user?.role === "shipper" ? (
            <Button href={ROUTES.shipper} fullWidth variant="outline">
              Open shipper portal
            </Button>
          ) : null}
        </aside>
      </div>

      <ConfirmModal
        open={confirm === "pay"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Pay with PayPal?"
        description="You will be redirected to PayPal to complete payment for this order."
        confirmLabel="Continue to PayPal"
        loading={busy === "pay"}
        onConfirm={async () => {
          await payWithPaypal();
          setConfirm(null);
        }}
      />

      <ConfirmModal
        open={confirm === "cancel"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Cancel this order?"
        description="The order will be cancelled and reserved items can become available again."
        confirmLabel="Cancel order"
        tone="danger"
        loading={busy === "cancel"}
        onConfirm={async () => {
          await runAction("cancel", () =>
            backendCancelOrder({
              token,
              id: orderId,
              reason: "Cancelled by buyer",
            }),
          );
          setConfirm(null);
        }}
      />

      <ConfirmModal
        open={confirm === "confirm-stock"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Confirm you still have the item?"
        description="This tells the buyer the item is ready and shipping can start."
        confirmLabel="Confirm stock"
        loading={busy === "confirm"}
        onConfirm={async () => {
          await runAction("confirm", () =>
            backendSellerConfirmOrder({ token, id: orderId }),
          );
          setConfirm(null);
        }}
      />

      <ConfirmModal
        open={confirm === "reject"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Reject this order?"
        description="The buyer will be notified and payment handling will follow your reject flow."
        confirmLabel="Reject order"
        tone="danger"
        loading={busy === "reject"}
        reasonLabel="Reason"
        reasonPlaceholder="Why are you rejecting?"
        onConfirm={async (reason) => {
          await runAction("reject", () =>
            backendSellerRejectOrder({
              token,
              id: orderId,
              reason: reason || "Seller rejected order",
            }),
          );
          setConfirm(null);
        }}
      />

      <ConfirmModal
        open={confirm === "received"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Confirm you received the item?"
        description="This releases escrow to the seller. Only confirm after you have the item."
        confirmLabel="Confirm received"
        loading={busy === "done"}
        onConfirm={async () => {
          await runAction("done", () =>
            backendConfirmDelivery({ token, id: orderId }),
          );
          setConfirm(null);
        }}
      />
    </div>
  );
}
