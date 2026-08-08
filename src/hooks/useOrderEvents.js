"use client";

import { useEffect, useRef } from "react";
import { backendFetchOrderById } from "@/lib/rebox-backend-api";

/**
 * Poll for order updates.
 *
 * Avoids EventSource/SSE: `php artisan serve` is single-threaded, so a
 * long-lived SSE connection freezes every other API call (orders, notifications,
 * Filament admin).
 *
 * @param {string|null} token
 * @param {(payload: { orderId: string, status?: string, order?: object }) => void} onUpdate
 * @param {{ enabled?: boolean, orderId?: string|null, intervalMs?: number }} [options]
 */
export function useOrderEvents(token, onUpdate, options = {}) {
  const { enabled = true, orderId = null, intervalMs = 8000 } = options;
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const lastSignatureRef = useRef("");

  useEffect(() => {
    if (!enabled || !token || typeof window === "undefined") return undefined;

    let cancelled = false;
    let timer = null;
    let inFlight = false;

    const signatureFor = (order) => {
      if (!order) return "";
      return [
        order.id || order._id || "",
        order.status || "",
        order.paymentStatus || "",
        order.updatedAt || "",
        order.assignedAt || "",
        order.deliveredAt || "",
        order.completedAt || "",
      ].join("|");
    };

    const tick = async () => {
      if (cancelled || inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        if (orderId) {
          const order = await backendFetchOrderById({ token, id: orderId });
          if (cancelled || !order) return;
          const next = signatureFor(order);
          if (next && next !== lastSignatureRef.current) {
            lastSignatureRef.current = next;
            onUpdateRef.current?.({
              orderId: String(order.id || order._id || orderId),
              status: order.status,
              order,
            });
          }
        } else {
          // List pages supply their own reload handler; just nudge them.
          onUpdateRef.current?.({ orderId: "", status: "poll" });
        }
      } catch {
        // Ignore transient poll errors; next tick retries.
      } finally {
        inFlight = false;
      }
    };

    // Detail pages: fetch immediately. List pages: wait one interval to avoid
    // doubling the initial page load request.
    if (orderId) {
      tick();
    }
    timer = window.setInterval(tick, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, intervalMs, orderId, token]);
}
