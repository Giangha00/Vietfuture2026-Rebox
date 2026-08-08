"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, verifyEmailWithParams } from "@/lib/routes";
import Button from "@/components/ui/Button";

export default function PostItemGuard({ children }) {
  const pathname = usePathname();
  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    user,
    openLoginModal,
  } = useAuth();

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
      <div className="rounded-2xl border border-dashed border-rb-border bg-rb-surface/40 p-8 text-center">
        <p className="font-semibold text-rb-ink">Cần đăng nhập để đăng bán</p>
        <p className="mt-2 text-sm text-rb-muted">
          Vui lòng đăng nhập để tiếp tục đăng sản phẩm của bạn.
        </p>
      </div>
    );
  }

  if (!isEmailVerified) {
    const href = verifyEmailWithParams({
      email: user?.email,
      redirect: pathname || ROUTES.postItem,
    });

    return (
      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-8 text-center">
        <p className="font-semibold text-rb-ink">Cần xác minh email để đăng bán</p>
        <p className="mt-2 text-sm text-rb-muted">
          Nhập mã OTP đã gửi tới {user?.email || "email của bạn"} trước khi đăng
          sản phẩm.
        </p>
        <div className="mt-4 flex justify-center">
          <Button href={href}>Verify email</Button>
        </div>
      </div>
    );
  }

  return children;
}
