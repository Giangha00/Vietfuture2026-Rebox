"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function PostItemGuard({ children }) {
  const pathname = usePathname();
  const { ready, isAuthenticated, openLoginModal } = useAuth();

  useEffect(() => {
    if (!ready || isAuthenticated) return;
    openLoginModal(LOGIN_REASONS.sell, pathname || ROUTES.postItem);
  }, [isAuthenticated, openLoginModal, pathname, ready]);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-rb-border bg-white p-8 text-center text-sm text-rb-muted">
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-rb-border bg-rb-pink/40 p-8 text-center">
        <p className="font-semibold text-rb-ink">Cần đăng nhập để đăng bán</p>
        <p className="mt-2 text-sm text-rb-muted">
          Vui lòng đăng nhập để tiếp tục đăng sản phẩm của bạn.
        </p>
      </div>
    );
  }

  return children;
}
