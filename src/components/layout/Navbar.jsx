"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV, ROUTES, loginWithRedirect } from "@/lib/routes";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/layout/Logo";
import UserMenu from "@/components/layout/UserMenu";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ variant = "default" }) {
  const pathname = usePathname();
  const { isAuthenticated, ready } = useAuth();
  const showSearch = pathname.startsWith("/policy");
  const loginHref = loginWithRedirect(pathname || ROUTES.home);

  return (
    <header className="sticky top-0 z-40 border-b border-rb-border/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {variant !== "minimal" && (
          <nav className="hidden items-center gap-1 md:flex">
            {MAIN_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "text-rb-red underline decoration-2 underline-offset-8"
                      : "text-rb-muted hover:text-rb-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {showSearch ? (
            <label className="relative hidden w-56 lg:block">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rb-muted"
              />
              <input
                type="search"
                placeholder="Search policies..."
                className="w-full rounded-full border border-rb-border bg-rb-pink/50 py-2 pl-9 pr-3 text-sm outline-none focus:border-rb-red"
              />
            </label>
          ) : (
            <>
              {isAuthenticated ? (
                <Link
                  href={ROUTES.profile}
                  className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-rb-muted hover:text-rb-ink sm:inline-flex"
                  aria-label="Notifications"
                >
                  <Icon name="bell" className="size-5" />
                  <span className="hidden lg:inline">Notifications</span>
                </Link>
              ) : null}

              <AuthGateButton
                href={ROUTES.postItem}
                reason={LOGIN_REASONS.sell}
                size="sm"
                className="!rounded-xl"
              >
                <Icon name="plus" className="size-4" />
                <span className="hidden sm:inline">Post Item</span>
              </AuthGateButton>

              {ready && isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link
                  href={loginHref}
                  className="flex size-9 items-center justify-center rounded-full border border-rb-border bg-rb-pink text-rb-muted hover:border-rb-red hover:text-rb-red"
                  aria-label="Đăng nhập"
                >
                  <Icon name="user" className="size-4" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
