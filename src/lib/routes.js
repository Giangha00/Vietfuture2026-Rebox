/** Central route map — keep navigation in sync across Navbar/Footer/CTAs */
export const ROUTES = {
  home: "/",
  products: "/products",
  product: (id) => `/products/${id}`,
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  profileTab: (tab) => `/profile?tab=${tab}`,
  editListing: (id) => `/profile/listings/${id}/edit`,
  about: "/about",
  contact: "/contact",
  policy: "/policy",
  help: "/help",
  postItem: "/post-item",
  order: "/order",
  orders: "/orders",
  orderDetail: (id) => `/orders/${id}`,
  sellingOrders: "/orders/selling",
  shipper: "/shipper",
  offers: "/offers",
  sellingOffers: "/offers/selling",
  wishlist: "/wishlist",
  stations: "/contact#stations",
  forgotPassword: "/forgot-password",
  verifyEmail: "/verify-email",
};

export function loginWithRedirect(returnTo = ROUTES.home) {
  return `${ROUTES.login}?redirect=${encodeURIComponent(returnTo)}`;
}

export function signupWithRedirect(returnTo = ROUTES.home) {
  return `${ROUTES.signup}?redirect=${encodeURIComponent(returnTo)}`;
}

export function verifyEmailWithParams({
  email,
  redirect = ROUTES.home,
  debugCode,
} = {}) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (redirect) params.set("redirect", redirect);
  if (debugCode) params.set("debug", String(debugCode));
  const query = params.toString();
  return query ? `${ROUTES.verifyEmail}?${query}` : ROUTES.verifyEmail;
}

export const MAIN_NAV = [
  { label: "Explore", href: ROUTES.products },
];

export const CATEGORY_NAV = [
  { label: "All products", href: ROUTES.products },
];

export const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: ROUTES.about },
    { label: "Sustainability", href: ROUTES.about },
    { label: "Safety", href: ROUTES.policy },
  ],
  support: [
    { label: "Terms of Service", href: ROUTES.policy },
    { label: "Privacy Policy", href: `${ROUTES.policy}#privacy` },
    { label: "Help Center", href: ROUTES.help },
  ],
};
