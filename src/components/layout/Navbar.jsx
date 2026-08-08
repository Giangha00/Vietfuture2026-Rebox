"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORY_NAV, MAIN_NAV, ROUTES, loginWithRedirect } from "@/lib/routes";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/layout/Logo";
import UserMenu from "@/components/layout/UserMenu";
import NotificationBell from "@/components/layout/NotificationBell";
import CartButton from "@/components/layout/CartButton";
import WishlistNavButton from "@/components/layout/WishlistNavButton";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { fetchBackendCategories } from "@/lib/rebox-backend-api";

export default function Navbar({ variant = "default" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const loginHref = loginWithRedirect(pathname || ROUTES.home);
  const [query, setQuery] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState(CATEGORY_NAV);

  useEffect(() => {
    let cancelled = false;
    fetchBackendCategories()
      .then((list) => {
        if (cancelled) return;
        const fromApi = (Array.isArray(list) ? list : [])
          .map((c) => ({ name: c.name, slug: c.slug }))
          .filter((c) => {
            const slug = String(c.slug || "").toLowerCase();
            const name = String(c.name || "").toLowerCase();
            return name && slug !== "more" && name !== "more";
          })
          .map((c) => ({
            label: c.name,
            href: `${ROUTES.products}?category=${encodeURIComponent(c.name)}`,
          }));
        setCategoryLinks([
          { label: "All products", href: ROUTES.products },
          ...fromApi,
        ]);
      })
      .catch(() => {
        if (!cancelled) setCategoryLinks(CATEGORY_NAV);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${ROUTES.products}?q=${encodeURIComponent(q)}` : ROUTES.products);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rb-border/70 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
        <Logo className="shrink-0 text-xl sm:text-2xl" />

        {variant !== "minimal" && (
          <form onSubmit={onSearch} className="relative mx-auto hidden min-w-0 flex-1 max-w-xl md:block">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-rb-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full rounded-full border border-rb-border bg-rb-surface py-2.5 pl-10 pr-4 text-sm text-rb-ink outline-none transition placeholder:text-rb-muted/70 focus:border-rb-green focus:bg-white focus:ring-2 focus:ring-rb-green/15"
            />
          </form>
        )}

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {variant !== "minimal" && (
            <nav className="mr-1 hidden items-center gap-0.5 lg:flex">
              {MAIN_NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-lg px-3 py-2 text-sm font-medium transition",
                      active
                        ? "text-rb-green"
                        : "text-rb-muted hover:text-rb-ink",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div
                className="relative"
                onMouseEnter={() => setCatsOpen(true)}
                onMouseLeave={() => setCatsOpen(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-rb-muted transition hover:text-rb-ink"
                  aria-expanded={catsOpen}
                >
                  Categories
                  <span className={`text-[10px] transition ${catsOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {catsOpen && (
                  <div className="absolute right-0 top-full z-50 max-h-80 min-w-44 overflow-y-auto rounded-xl border border-rb-border bg-white py-1 shadow-lg">
                    {categoryLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-rb-ink hover:bg-rb-green-soft"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          )}

          <AuthGateButton
            href={ROUTES.postItem}
            reason={LOGIN_REASONS.sell}
            size="sm"
            className="!rounded-xl !px-3 sm:!px-4"
          >
            <Icon name="plus" className="size-4" />
            <span className="hidden sm:inline">Post Item</span>
          </AuthGateButton>

          <WishlistNavButton />
          <CartButton />
          <NotificationBell />

          {ready && isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              href={loginHref}
              className="flex size-9 items-center justify-center rounded-full border border-rb-border bg-rb-surface text-rb-muted hover:border-rb-green hover:text-rb-green"
              aria-label="Log in"
            >
              <Icon name="user" className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {variant !== "minimal" && (
        <form onSubmit={onSearch} className="border-t border-rb-border/60 px-4 pb-3 pt-2 md:hidden">
          <label className="relative block">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rb-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-rb-border bg-rb-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rb-green focus:bg-white"
            />
          </label>
        </form>
      )}
    </header>
  );
}
