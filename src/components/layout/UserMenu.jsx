"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const handleProfile = () => {
    setOpen(false);
    router.push(ROUTES.profile);
  };

  const handleOrders = () => {
    setOpen(false);
    router.push(ROUTES.orders);
  };

  const handleSelling = () => {
    setOpen(false);
    router.push(ROUTES.sellingOrders);
  };

  const handleOffers = () => {
    setOpen(false);
    router.push(ROUTES.offers);
  };

  const handleSellingOffers = () => {
    setOpen(false);
    router.push(ROUTES.sellingOffers);
  };

  const handleShipper = () => {
    setOpen(false);
    router.push(ROUTES.shipper);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-rb-border bg-rb-surface ring-rb-green/30 transition hover:border-rb-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-green"
        aria-label="Account"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover"
          sizes="36px"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-rb-border bg-white py-1 shadow-xl shadow-rb-ink/10 animate-fade-up"
        >
          <div className="border-b border-rb-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-rb-ink">{user.name}</p>
            {user.email ? (
              <p className="truncate text-xs text-rb-muted">{user.email}</p>
            ) : null}
            <p className="mt-1 inline-flex rounded-full bg-rb-green-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rb-green">
              {user.role === "shipper"
                ? "Shipper"
                : user.role === "admin"
                  ? "Admin"
                  : "Member · buy & sell"}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleProfile}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
          >
            <Icon name="user" className="size-4 text-rb-muted" />
            Profile
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleOrders}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
          >
            <Icon name="cart" className="size-4 text-rb-muted" />
            My Orders
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleSelling}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
          >
            <Icon name="box" className="size-4 text-rb-muted" />
            Selling orders
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleOffers}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
          >
            <Icon name="tag" className="size-4 text-rb-muted" />
            My offers
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleSellingOffers}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
          >
            <Icon name="tag" className="size-4 text-rb-muted" />
            Selling offers
          </button>

          {user.role === "shipper" || user.role === "admin" ? (
            <button
              type="button"
              role="menuitem"
              onClick={handleShipper}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-surface"
            >
              <Icon name="truck" className="size-4 text-rb-muted" />
              Shipper portal
            </button>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-green transition hover:bg-rb-green-soft"
          >
            <Icon name="logout" className="size-4" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
