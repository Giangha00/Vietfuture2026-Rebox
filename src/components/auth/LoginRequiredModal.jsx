"use client";

import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES, loginWithRedirect, signupWithRedirect } from "@/lib/routes";

const COPY = {
  [LOGIN_REASONS.sell]: {
    title: "Cần đăng nhập để đăng bán",
    description:
      "Bạn cần đăng nhập tài khoản ReBox trước khi đăng bán sản phẩm.",
  },
  [LOGIN_REASONS.buy]: {
    title: "Cần đăng nhập để mua hàng",
    description:
      "Bạn cần đăng nhập để mua sản phẩm và thanh toán qua hệ thống escrow an toàn.",
  },
  [LOGIN_REASONS.contact]: {
    title: "Cần đăng nhập để liên hệ",
    description:
      "Bạn cần đăng nhập để nhắn tin và liên hệ trực tiếp với người bán.",
  },
  [LOGIN_REASONS.default]: {
    title: "Cần đăng nhập",
    description: "Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.",
  },
};

export default function LoginRequiredModal({
  open,
  onClose,
  reason = LOGIN_REASONS.default,
  redirectTo = null,
}) {
  const copy = COPY[reason] ?? COPY[LOGIN_REASONS.default];
  const returnTo = redirectTo || ROUTES.home;
  const loginHref = loginWithRedirect(returnTo);
  const signupHref = signupWithRedirect(returnTo);

  return (
    <Modal open={open} onClose={onClose} title={copy.title}>
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl bg-rb-green-soft px-4 py-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-rb-green">
            <Icon name="lock" className="size-4" />
          </span>
          <p className="text-sm leading-relaxed text-rb-muted">{copy.description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={loginHref} fullWidth size="lg" onClick={onClose}>
            Đăng nhập
          </Button>
          <Button
            href={signupHref}
            variant="outline"
            fullWidth
            size="lg"
            onClick={onClose}
          >
            Tạo tài khoản
          </Button>
        </div>

        <p className="text-center text-xs text-rb-muted">
          Chưa có tài khoản?{" "}
          <Link href={signupHref} className="font-semibold text-rb-green hover:underline">
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </Modal>
  );
}
