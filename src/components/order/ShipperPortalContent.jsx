"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { ORDER_STATUS_LABEL, formatAddress, formatDateTime, formatMoney } from "@/lib/order-status";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import {
  backendAssignShipper,
  backendFetchShipperJobs,
  backendShipperUpdateStatus,
} from "@/lib/rebox-backend-api";
import { useOrderEvents } from "@/hooks/useOrderEvents";

const NEXT_STATUS = {
  pickup_assigned: "picked_up",
  picked_up: "out_for_delivery",
  out_for_delivery: "delivered",
};

const NEXT_LABEL = {
  picked_up: "Mark picked up",
  out_for_delivery: "Out for delivery",
  delivered: "Mark delivered",
};

function defaultEtaLocalValue(hoursFromNow = 4) {
  const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ShipperPortalContent() {
  const router = useRouter();
  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    token,
    user,
    handleAuthError,
    requireVerified,
  } = useAuth();

  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickupModal, setPickupModal] = useState(null); // order id
  const [mismatchNote, setMismatchNote] = useState("");
  const [busy, setBusy] = useState("");
  const [etaDelivery, setEtaDelivery] = useState(() => defaultEtaLocalValue(4));
  const [etaPickup, setEtaPickup] = useState(() => defaultEtaLocalValue(2));
  const reloadTimer = useRef(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!token) return;
    if (!silent) setLoading(true);
    setError("");
    try {
      const data = await backendFetchShipperJobs(token);
      setAvailable(Array.isArray(data?.available) ? data.available : []);
      setMine(Array.isArray(data?.mine) ? data.mine : []);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.shipper })) return;
      setError(err?.message || "Could not load jobs.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [handleAuthError, token]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.shipper));
      return;
    }
    requireVerified(ROUTES.shipper);
  }, [isAuthenticated, ready, requireVerified, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !isEmailVerified || !token) return;
    if (user?.role !== "shipper" && user?.role !== "admin") return;
    load();
  }, [isAuthenticated, isEmailVerified, load, ready, token, user?.role]);

  useOrderEvents(
    token,
    () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
      reloadTimer.current = window.setTimeout(() => {
        load({ silent: true });
      }, 250);
    },
    {
      enabled: Boolean(
        ready &&
          isAuthenticated &&
          isEmailVerified &&
          token &&
          (user?.role === "shipper" || user?.role === "admin"),
      ),
    },
  );

  useEffect(
    () => () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
    },
    [],
  );

  async function claim(orderId) {
    setBusy(orderId);
    setError("");
    try {
      await backendAssignShipper({
        token,
        id: orderId,
        estimatedDeliveryAt: etaDelivery
          ? new Date(etaDelivery).toISOString()
          : undefined,
        estimatedPickupAt: etaPickup
          ? new Date(etaPickup).toISOString()
          : undefined,
      });
      await load();
    } catch (err) {
      setError(err?.message || "Could not claim job.");
    } finally {
      setBusy("");
    }
  }

  async function advance(order, { pickupCheck, note } = {}) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    if (order.status === "pickup_assigned" && !pickupCheck) {
      setPickupModal(order);
      setMismatchNote("");
      setError("");
      return;
    }

    setBusy(order.id);
    setError("");
    try {
      await backendShipperUpdateStatus({
        token,
        id: order.id,
        status: next,
        note: note || "",
        pickupCheck,
        estimatedDeliveryAt: etaDelivery
          ? new Date(etaDelivery).toISOString()
          : undefined,
        estimatedPickupAt: etaPickup
          ? new Date(etaPickup).toISOString()
          : undefined,
      });
      setPickupModal(null);
      setMismatchNote("");
      await load();
    } catch (err) {
      setError(err?.message || "Could not update status.");
    } finally {
      setBusy("");
    }
  }

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted">
        Loading...
      </div>
    );
  }

  if (user?.role !== "shipper" && user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-sans text-2xl font-bold text-rb-ink">Shipper portal</h1>
        <p className="mt-2 text-sm text-rb-muted">
          Your account is not a shipper. Ask an admin to set your role to{" "}
          <code>shipper</code>.
        </p>
        <Button href={ROUTES.home} className="mt-6" variant="outline">
          Home
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-sans text-3xl font-bold text-rb-ink">Shipper portal</h1>
      <p className="mt-1 text-sm text-rb-muted">
        Claim jobs, confirm the item matches the listing at pickup, then deliver.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {pickupModal ? (
        <div className="mt-4 rounded-2xl border border-rb-border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-rb-ink">Pickup check</h3>
          <p className="mt-1 text-sm text-rb-muted">
            Order #{String(pickupModal.id).slice(-8)} — does the item match the
            listing (type, brand/model, obvious condition)?
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={busy === pickupModal.id}
              onClick={() =>
                advance(pickupModal, {
                  pickupCheck: "match",
                  note: "Item matches listing at pickup.",
                })
              }
            >
              {busy === pickupModal.id ? "Updating…" : "Matches — pick up"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy === pickupModal.id}
              onClick={() => setPickupModal(null)}
            >
              Cancel
            </Button>
          </div>
          <div className="mt-4 border-t border-rb-border pt-4">
            <label className="text-xs font-bold uppercase tracking-wide text-rb-muted">
              Report mismatch (do not pick up)
            </label>
            <textarea
              value={mismatchNote}
              onChange={(e) => setMismatchNote(e.target.value)}
              rows={3}
              minLength={10}
              maxLength={500}
              placeholder="What is wrong? e.g. wrong model, much more damaged, missing item…"
              className="mt-1 w-full rounded-xl border border-rb-border px-3 py-2 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              disabled={
                busy === pickupModal.id || mismatchNote.trim().length < 10
              }
              onClick={() =>
                advance(pickupModal, {
                  pickupCheck: "mismatch",
                  note: mismatchNote.trim(),
                })
              }
            >
              Report mismatch → dispute
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 rounded-2xl border border-rb-border bg-white p-4 sm:grid-cols-2">
        <label className="text-sm text-rb-ink">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-rb-muted">
            ETA pickup
          </span>
          <input
            type="datetime-local"
            value={etaPickup}
            onChange={(e) => setEtaPickup(e.target.value)}
            className="w-full rounded-xl border border-rb-border px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-rb-ink">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-rb-muted">
            ETA delivery (shown to buyer)
          </span>
          <input
            type="datetime-local"
            value={etaDelivery}
            onChange={(e) => setEtaDelivery(e.target.value)}
            className="w-full rounded-xl border border-rb-border px-3 py-2 text-sm"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-rb-muted">Loading jobs...</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="font-semibold text-rb-ink">Available</h2>
            <ul className="mt-3 space-y-3">
              {available.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-rb-border p-6 text-sm text-rb-muted">
                  No jobs waiting.
                </li>
              ) : (
                available.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-2xl border border-rb-border bg-white p-4"
                  >
                    <p className="font-semibold text-rb-ink">
                      #{String(order.id).slice(-8)} · {formatMoney(order.totalAmount)}
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      Pickup: {formatAddress(order.pickupAddress)}
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      Deliver: {formatAddress(order.deliveryAddress)}
                    </p>
                    <p className="mt-2 text-xs font-medium text-rb-green">
                      Claim with ETA delivery {etaDelivery.replace("T", " ")}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        disabled={busy === order.id}
                        onClick={() => claim(order.id)}
                      >
                        {busy === order.id ? "Claiming…" : "Claim job + set ETA"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        href={ROUTES.orderDetail(order.id)}
                      >
                        Details
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-rb-ink">My jobs</h2>
            <ul className="mt-3 space-y-3">
              {mine.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-rb-border p-6 text-sm text-rb-muted">
                  No active jobs.
                </li>
              ) : (
                mine.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-2xl border border-rb-border bg-white p-4"
                  >
                    <p className="font-semibold text-rb-ink">
                      #{String(order.id).slice(-8)} ·{" "}
                      {ORDER_STATUS_LABEL[order.status] || order.status}
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      Pickup: {formatAddress(order.pickupAddress)}
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      Deliver: {formatAddress(order.deliveryAddress)}
                    </p>
                    <p className="mt-2 text-xs text-rb-green">
                      ETA delivery: {formatDateTime(order.estimatedDeliveryAt)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {NEXT_STATUS[order.status] ? (
                        <Button
                          size="sm"
                          disabled={busy === order.id}
                          onClick={() => advance(order)}
                        >
                          {busy === order.id
                            ? "Updating…"
                            : NEXT_LABEL[NEXT_STATUS[order.status]]}
                        </Button>
                      ) : null}
                      <Link
                        href={ROUTES.orderDetail(order.id)}
                        className="inline-flex items-center rounded-xl border border-rb-border px-3 py-1.5 text-sm font-semibold text-rb-ink hover:border-rb-green"
                      >
                        Details
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
