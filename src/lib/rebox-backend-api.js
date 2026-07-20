const DEFAULT_BACKEND_URL = "http://localhost:5000";

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
    throw new Error(message);
  }

  return data;
}

export async function fetchBackendProducts() {
  const data = await backendFetchJson("/api/products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function fetchBackendProductById(id) {
  const data = await backendFetchJson(`/api/products/${id}`);
  return data?.product || null;
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
  return { token: data.token, user: data.user };
}

export async function backendUploadImages({ token, files }) {
  const list = Array.from(files || []).filter(Boolean);
  if (list.length === 0) return [];

  const formData = new FormData();
  list.forEach((file) => formData.append("images", file));

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
  description,
  price,
  condition,
  images = [],
  categoryId,
  stationId,
}) {
  const data = await backendFetchJson("/api/products", {
    method: "POST",
    token,
    body: {
      title,
      description,
      price,
      condition,
      images,
      category: categoryId,
      station: stationId,
    },
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
}) {
  const body = {};
  if (fullName !== undefined) body.fullName = fullName;
  if (email !== undefined) body.email = email;
  if (phone !== undefined) body.phone = phone;
  if (bio !== undefined) body.bio = bio;
  if (avatarUrl !== undefined) body.avatarUrl = avatarUrl;

  const data = await backendFetchJson("/api/auth/me", {
    method: "PATCH",
    token,
    body,
  });

  return data?.user || null;
}
