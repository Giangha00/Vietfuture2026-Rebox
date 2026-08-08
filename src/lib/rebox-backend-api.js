const DEFAULT_BACKEND_URL = "http://localhost:5001";

export const REBOX_BACKEND_URL =
  process.env.NEXT_PUBLIC_REBOX_BACKEND_URL || DEFAULT_BACKEND_URL;

export async function backendFetchJson(
  path,
  { method = "GET", token, body } = {},
) {
  const url = `${REBOX_BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = undefined;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: payload,
    // For server components we want always up-to-date data.
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function fetchBackendProducts() {
  const data = await backendFetchJson("/api/products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function fetchMyBackendProducts(token) {
  const data = await backendFetchJson("/api/products/mine", { token });
  return Array.isArray(data?.products) ? data.products : [];
}

export async function fetchBackendProductById(id, token) {
  const data = await backendFetchJson(`/api/products/${id}`, { token });
  return data?.product || null;
}

export async function backendUpdateProduct({
  token,
  id,
  title,
  description,
  price,
  condition,
  images = [],
  categoryId,
  acceptsOffers,
}) {
  const body = {
    title,
    description,
    price,
    condition,
    images,
    category: categoryId,
  };
  if (acceptsOffers !== undefined) body.acceptsOffers = acceptsOffers;

  const data = await backendFetchJson(`/api/products/${id}`, {
    method: "PATCH",
    token,
    body,
  });
  return data?.product || data;
}

export async function backendDeleteProduct({ token, id }) {
  return backendFetchJson(`/api/products/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchBackendCategories() {
  const data = await backendFetchJson("/api/categories");
  return Array.isArray(data?.categories) ? data.categories : [];
}

export async function fetchBackendStations() {
  const data = await backendFetchJson("/api/stations");
  return Array.isArray(data?.stations) ? data.stations : [];
}

export async function backendLogin({ email, password }) {
  const data = await backendFetchJson("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return { token: data.token, user: data.user };
}

export async function backendRegister({ fullName, email, phone, password }) {
  const data = await backendFetchJson("/api/auth/register", {
    method: "POST",
    body: { fullName, email, phone, password },
  });
  return {
    token: data.token || null,
    user: data.user || null,
    needsVerification: Boolean(data.needsVerification),
    email: data.email || email,
    debugCode: data.debugCode,
    expiresInSeconds: data.expiresInSeconds,
    emailConfigured: data.emailConfigured,
  };
}

export async function backendVerifyEmail({ email, otp }) {
  const data = await backendFetchJson("/api/auth/verify-email", {
    method: "POST",
    body: { email, otp },
  });
  return { token: data.token, user: data.user };
}

export async function backendResendVerification({ email }) {
  return backendFetchJson("/api/auth/resend-verification", {
    method: "POST",
    body: { email },
  });
}

export async function backendForgotPassword({ email }) {
  return backendFetchJson("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function backendVerifyResetOtp({ email, otp }) {
  return backendFetchJson("/api/auth/verify-reset-otp", {
    method: "POST",
    body: { email, otp },
  });
}

export async function backendResetPassword({ email, otp, password }) {
  return backendFetchJson("/api/auth/reset-password", {
    method: "POST",
    body: { email, otp, password },
  });
}

export async function backendUploadImages({ token, files }) {
  const list = Array.from(files || []).filter(Boolean);
  if (list.length === 0) return [];

  const formData = new FormData();
  list.forEach((file) => formData.append("images[]", file));

  const url = `${REBOX_BACKEND_URL}/api/uploads`;
  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.message || data?.error || `Upload failed (${res.status})`;
    throw new Error(message);
  }

  return Array.isArray(data?.urls) ? data.urls : [];
}

export async function backendCreateProduct({
  token,
  title,
  brand,
  description,
  price,
  condition,
  images = [],
  categoryId,
  attributes = {},
  pickupAddress = null,
  acceptsOffers = true,
}) {
  const body = {
    title,
    brand,
    description,
    price,
    condition,
    images,
    category: categoryId,
    attributes,
    acceptsOffers,
  };
  if (pickupAddress) body.pickupAddress = pickupAddress;

  const data = await backendFetchJson("/api/products", {
    method: "POST",
    token,
    body,
  });

  return data?.product || data;
}

export async function backendFetchMe(token) {
  const data = await backendFetchJson("/api/auth/me", { token });
  return data?.user || null;
}

export async function backendUpdateMe({
  token,
  fullName,
  email,
  phone,
  bio,
  avatarUrl,
  deliveryAddress,
  pickupAddress,
}) {
  const body = {};
  if (fullName !== undefined) body.fullName = fullName;
  if (email !== undefined) body.email = email;
  if (phone !== undefined) body.phone = phone;
  if (bio !== undefined) body.bio = bio;
  if (avatarUrl !== undefined) body.avatarUrl = avatarUrl;
  if (deliveryAddress !== undefined) body.deliveryAddress = deliveryAddress;
  if (pickupAddress !== undefined) body.pickupAddress = pickupAddress;

  const data = await backendFetchJson("/api/auth/me", {
    method: "PATCH",
    token,
    body,
  });

  return data?.user || null;
}

export async function backendRegisterFcmToken({ token, fcmToken }) {
  return backendFetchJson("/api/notifications/fcm-token", {
    method: "POST",
    token,
    body: { token: fcmToken },
  });
}

export async function backendRemoveFcmToken({ token, fcmToken }) {
  return backendFetchJson("/api/notifications/fcm-token", {
    method: "DELETE",
    token,
    body: { token: fcmToken },
  });
}

export async function backendFetchNotifications(token) {
  const data = await backendFetchJson("/api/notifications", { token });
  return {
    notifications: Array.isArray(data?.notifications) ? data.notifications : [],
    unreadCount: Number(data?.unreadCount || 0),
  };
}

export async function backendMarkNotificationRead({ token, id }) {
  const data = await backendFetchJson(`/api/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
  return data?.notification || null;
}

export async function backendMarkAllNotificationsRead(token) {
  return backendFetchJson("/api/notifications/read-all", {
    method: "PATCH",
    token,
  });
}

export async function backendSendTestNotification({ token, title, body }) {
  return backendFetchJson("/api/notifications/test", {
    method: "POST",
    token,
    body: { title, body },
  });
}

export async function backendNotifyCartAdd({ token, productId, productTitle }) {
  return backendFetchJson("/api/notifications/cart", {
    method: "POST",
    token,
    body: { productId, productTitle },
  });
}

export async function backendCreateOrder({
  token,
  productIds,
  note = "",
  deliveryAddress = null,
  pickupAddress = null,
  offerId = null,
}) {
  const body = {
    note,
    deliveryAddress,
    pickupAddress,
  };
  if (offerId) {
    body.offerId = offerId;
  } else {
    body.productIds = productIds;
  }
  const data = await backendFetchJson("/api/orders", {
    method: "POST",
    token,
    body,
  });
  return data?.order || data;
}

export async function backendFetchMyOrders(token) {
  const data = await backendFetchJson("/api/orders/mine", { token });
  return Array.isArray(data?.orders) ? data.orders : [];
}

export async function backendFetchSellingOrders(token) {
  const data = await backendFetchJson("/api/orders/selling", { token });
  return Array.isArray(data?.orders) ? data.orders : [];
}

export async function backendFetchOrderById({ token, id }) {
  const data = await backendFetchJson(`/api/orders/${id}`, { token });
  return data?.order || null;
}

export async function backendStartOrderPayment({ token, id }) {
  return backendFetchJson(`/api/orders/${id}/pay`, {
    method: "POST",
    token,
  });
}

export async function backendSellerConfirmOrder({ token, id, pickupAddress }) {
  return backendFetchJson(`/api/orders/${id}/seller-confirm`, {
    method: "POST",
    token,
    body: pickupAddress ? { pickupAddress } : {},
  });
}

export async function backendSellerRejectOrder({ token, id, reason }) {
  return backendFetchJson(`/api/orders/${id}/seller-reject`, {
    method: "POST",
    token,
    body: { reason },
  });
}

export async function backendCancelOrder({ token, id, reason }) {
  return backendFetchJson(`/api/orders/${id}/cancel`, {
    method: "POST",
    token,
    body: { reason },
  });
}

export async function backendAssignShipper({
  token,
  id,
  shipperId,
  estimatedDeliveryAt,
  estimatedPickupAt,
}) {
  return backendFetchJson(`/api/orders/${id}/assign-shipper`, {
    method: "POST",
    token,
    body: {
      ...(shipperId ? { shipperId } : {}),
      ...(estimatedDeliveryAt ? { estimatedDeliveryAt } : {}),
      ...(estimatedPickupAt ? { estimatedPickupAt } : {}),
    },
  });
}

export async function backendShipperUpdateStatus({
  token,
  id,
  status,
  note = "",
  pickupCheck,
  estimatedDeliveryAt,
  estimatedPickupAt,
}) {
  return backendFetchJson(`/api/orders/${id}/shipper-status`, {
    method: "POST",
    token,
    body: {
      status,
      note,
      ...(pickupCheck ? { pickupCheck } : {}),
      ...(estimatedDeliveryAt ? { estimatedDeliveryAt } : {}),
      ...(estimatedPickupAt ? { estimatedPickupAt } : {}),
    },
  });
}

export async function backendFetchShipperJobs(token) {
  return backendFetchJson("/api/orders/shipper/jobs", { token });
}

export async function backendConfirmDelivery({ token, id }) {
  return backendFetchJson(`/api/orders/${id}/confirm-delivery`, {
    method: "POST",
    token,
  });
}

export async function backendOpenDispute({ token, id, reason, evidence = [] }) {
  return backendFetchJson(`/api/orders/${id}/dispute`, {
    method: "POST",
    token,
    body: { reason, evidence },
  });
}

export async function backendFetchPaypalStatus() {
  return backendFetchJson("/api/payments/paypal/status");
}

export async function backendFetchOfferOptions() {
  return backendFetchJson("/api/offers/options");
}

export async function backendCreateOffer({
  token,
  productId,
  discountPercent,
  message = "",
}) {
  const data = await backendFetchJson("/api/offers", {
    method: "POST",
    token,
    body: { productId, discountPercent, message },
  });
  return data?.offer || data;
}

export async function backendFetchMyOffers(token) {
  const data = await backendFetchJson("/api/offers/mine", { token });
  return Array.isArray(data?.offers) ? data.offers : [];
}

export async function backendFetchSellingOffers(token) {
  const data = await backendFetchJson("/api/offers/selling", { token });
  return Array.isArray(data?.offers) ? data.offers : [];
}

export async function backendFetchOfferById({ token, id }) {
  const data = await backendFetchJson(`/api/offers/${id}`, { token });
  return data?.offer || null;
}

export async function backendAcceptOffer({ token, id }) {
  return backendFetchJson(`/api/offers/${id}/accept`, {
    method: "POST",
    token,
  });
}

export async function backendRejectOffer({ token, id, reason = "" }) {
  return backendFetchJson(`/api/offers/${id}/reject`, {
    method: "POST",
    token,
    body: { reason },
  });
}

export async function backendCancelOffer({ token, id }) {
  return backendFetchJson(`/api/offers/${id}/cancel`, {
    method: "POST",
    token,
  });
}
