"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function AuthGateButton({
  href,
  reason = LOGIN_REASONS.default,
  onAuthedClick,
  children,
  ...props
}) {
  const router = useRouter();
  const {
    isAuthenticated,
    isEmailVerified,
    user,
    openLoginModal,
    redirectToVerifyEmail,
  } = useAuth();

  const handleClick = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      openLoginModal(reason, href || null);
      return;
    }

    if (!isEmailVerified) {
      redirectToVerifyEmail({
        email: user?.email,
        redirect: href || undefined,
      });
      return;
    }

    if (onAuthedClick) {
      onAuthedClick();
      return;
    }

    if (href) router.push(href);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
