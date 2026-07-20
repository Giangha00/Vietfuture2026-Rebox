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
  const { isAuthenticated, navigateWithAuth } = useAuth();

  const handleClick = (event) => {
    event.preventDefault();

    if (isAuthenticated) {
      if (onAuthedClick) {
        onAuthedClick();
        return;
      }

      if (href) router.push(href);
      return;
    }

    navigateWithAuth(href, reason);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
