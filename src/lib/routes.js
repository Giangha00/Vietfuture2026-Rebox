/** Central route map — keep navigation in sync across Navbar/Footer/CTAs */
export const ROUTES = {
  home: "/",
  products: "/products",
  product: (id) => `/products/${id}`,
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  profileTab: (tab) => `/profile?tab=${tab}`,
  about: "/about",
  contact: "/contact",
  policy: "/policy",
  postItem: "/post-item",
  stations: "/contact#stations",
  forgotPassword: "/login#forgot",
};

export function loginWithRedirect(returnTo = ROUTES.home) {
  return `${ROUTES.login}?redirect=${encodeURIComponent(returnTo)}`;
}

export function signupWithRedirect(returnTo = ROUTES.home) {
  return `${ROUTES.signup}?redirect=${encodeURIComponent(returnTo)}`;
}

export const MAIN_NAV = [
  { label: "Home", href: ROUTES.home },
  { label: "Products", href: ROUTES.products },
  { label: "About Us", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
  { label: "Policy & Terms", href: ROUTES.policy },
];

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: ROUTES.about },
    { label: "Careers", href: ROUTES.about },
    { label: "Sustainability", href: ROUTES.about },
  ],
  services: [
    { label: "Account Security", href: ROUTES.policy },
    { label: "Escrow Protection", href: ROUTES.policy },
    { label: "ReBox Stations", href: ROUTES.stations },
  ],
  legal: [
    { label: "Terms of Service", href: ROUTES.policy },
    { label: "Privacy Policy", href: ROUTES.policy },
    { label: "Contact Support", href: ROUTES.contact },
  ],
};
