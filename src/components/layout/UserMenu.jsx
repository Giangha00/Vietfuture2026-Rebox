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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-rb-border bg-rb-pink ring-rb-red/30 transition hover:border-rb-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-red"
        aria-label="Tài khoản"
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
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={handleProfile}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-ink transition hover:bg-rb-pink"
          >
            <Icon name="user" className="size-4 text-rb-muted" />
            Thông tin
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rb-red transition hover:bg-rb-red-soft"
          >
            <Icon name="logout" className="size-4" />
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}
