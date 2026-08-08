import { formatMoney } from "@/lib/money";

export { formatMoney };

export const ORDER_STATUS_LABEL = {
  pending_payment: "Awaiting payment",
  pending: "Awaiting payment",
  paid: "Paid — escrow held",
  confirmed: "Paid",
  seller_confirmed: "Seller confirmed",
  pickup_assigned: "Shipper assigned",
  picked_up: "Picked up",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export const ORDER_FLOW = [
  "pending_payment",
  "paid",
  "seller_confirmed",
  "pickup_assigned",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "completed",
];

/** Compact labels for the progress tracker */
export const ORDER_FLOW_SHORT = {
  pending_payment: "Payment",
  paid: "Paid",
  seller_confirmed: "Seller OK",
  pickup_assigned: "Shipper",
  picked_up: "Picked up",
  out_for_delivery: "Shipping",
  delivered: "Delivered",
  completed: "Done",
};

export function getFlowStepIndex(status) {
  const normalized = status === "pending" ? "pending_payment" : status === "confirmed" ? "paid" : status;
  const idx = ORDER_FLOW.indexOf(normalized);
  return idx >= 0 ? idx : 0;
}

export function getNextStepHint(
  status,
  { isBuyer = true, estimatedDeliveryAt, autoCompleteAt } = {},
) {
  const s = status === "pending" ? "pending_payment" : status;
  const etaSuffix = estimatedDeliveryAt
    ? ` Expected by ${formatDateTime(estimatedDeliveryAt)}.`
    : "";
  if (s === "cancelled") return "This order was cancelled.";
  if (s === "disputed") return "A dispute is open. ReBox admin will review.";
  if (s === "pending_payment") {
    return isBuyer
      ? "Complete PayPal payment to hold funds in escrow."
      : "Waiting for the buyer to pay.";
  }
  if (s === "paid") {
    return isBuyer
      ? "Payment is in escrow. Waiting for the seller to confirm stock."
      : "Buyer paid. Confirm you still have the item, or reject the order.";
  }
  if (s === "seller_confirmed") {
    return "Seller confirmed. Waiting for a shipper to be assigned.";
  }
  if (s === "pickup_assigned") {
    return `Shipper assigned and heading to the seller for pickup.${etaSuffix}`;
  }
  if (s === "picked_up") {
    return `Item collected from the seller. Preparing delivery to the buyer.${etaSuffix}`;
  }
  if (s === "out_for_delivery") {
    return `Out for delivery — almost there.${etaSuffix}`;
  }
  if (s === "delivered") {
    const deadline = autoCompleteAt
      ? ` Confirm by ${formatDateTime(autoCompleteAt)} or escrow may auto-release.`
      : " Inspect within 48 hours, then confirm to release escrow.";
    return isBuyer
      ? `Delivered.${deadline} Open a dispute with evidence if it does not match the listing.`
      : "Delivered. Waiting for buyer confirmation to release escrow.";
  }
  if (s === "completed") {
    return "Order completed. Escrow has been released.";
  }
  return "Follow the timeline below for updates.";
}

export function formatAddress(address) {
  if (!address) return "—";
  const parts = [
    address.fullName,
    address.phone,
    address.line1,
    address.line2,
    [address.district, address.city].filter(Boolean).join(", "),
    address.note ? `(${address.note})` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
}

export function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(value);
  }
}

export function formatRelativeTime(value, now = Date.now()) {
  if (!value) return "";
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "";
  const diffMs = target - now;
  const absMin = Math.round(Math.abs(diffMs) / 60000);
  if (absMin < 1) return diffMs >= 0 ? "now" : "just now";
  if (absMin < 60) {
    return diffMs >= 0 ? `in ${absMin} min` : `${absMin} min ago`;
  }
  const hours = Math.floor(absMin / 60);
  const mins = absMin % 60;
  if (hours < 48) {
    const label = mins ? `${hours}h ${mins}m` : `${hours}h`;
    return diffMs >= 0 ? `in ${label}` : `${label} ago`;
  }
  const days = Math.round(hours / 24);
  return diffMs >= 0 ? `in ${days} day(s)` : `${days} day(s) ago`;
}

function hoursFrom(base, hours) {
  const start = base ? new Date(base).getTime() : Date.now();
  if (Number.isNaN(start)) return new Date(Date.now() + hours * 3600000).toISOString();
  return new Date(start + hours * 3600000).toISOString();
}

/** Derive ETA even when older orders lack stored fields. */
export function resolveOrderTiming(order) {
  if (!order) {
    return { estimatedPickupAt: null, estimatedDeliveryAt: null };
  }
  const assignedAt = order.assignedAt || order.paidAt || order.createdAt || null;
  let estimatedPickupAt = order.estimatedPickupAt || null;
  let estimatedDeliveryAt = order.estimatedDeliveryAt || null;

  if (!estimatedPickupAt) {
    if (order.pickedUpAt) estimatedPickupAt = order.pickedUpAt;
    else if (order.shipper || assignedAt) estimatedPickupAt = hoursFrom(assignedAt, 2);
  }
  if (!estimatedDeliveryAt) {
    if (order.deliveredAt) estimatedDeliveryAt = order.deliveredAt;
    else if (order.pickedUpAt) estimatedDeliveryAt = hoursFrom(order.pickedUpAt, 2);
    else if (order.shipper || assignedAt) estimatedDeliveryAt = hoursFrom(assignedAt, 4);
  }

  return { estimatedPickupAt, estimatedDeliveryAt };
}

export function getEtaLabel(order, now = Date.now()) {
  if (!order) return null;
  if (order.deliveredAt) {
    return `Delivered ${formatDateTime(order.deliveredAt)}`;
  }
  const { estimatedDeliveryAt } = resolveOrderTiming(order);
  if (estimatedDeliveryAt) {
    return `Expected delivery ${formatDateTime(estimatedDeliveryAt)} · ${formatRelativeTime(estimatedDeliveryAt, now)}`;
  }
  return null;
}

export function isTerminalStatus(status) {
  return ["completed", "cancelled"].includes(status);
}
