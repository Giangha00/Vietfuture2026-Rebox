"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, verifyEmailWithParams } from "@/lib/routes";
import Icon from "@/components/ui/Icon";

const HIDDEN_PREFIXES = [
  ROUTES.verifyEmail,
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
];

export default function VerifyEmailBanner() {
  const pathname = usePathname();
  const { ready, user, isAuthenticated } = useAuth();

  if (!ready || !isAuthenticated || !user || user.emailVerified) {
    return null;
  }

  if (HIDDEN_PREFIXES.some((path) => pathname?.startsWith(path))) {
    return null;
  }

  const href = verifyEmailWithParams({
    email: user.email,
    redirect: pathname || ROUTES.home,
  });

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="inline-flex items-start gap-2 sm:items-center">
          <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-amber-700 sm:mt-0" />
          <span>
            Verify <span className="font-semibold">{user.email}</span> to sell,
            order, and upload.
          </span>
        </p>
        <Link
          href={href}
          className="shrink-0 font-semibold text-amber-900 underline-offset-2 hover:underline"
        >
          Enter verification code
        </Link>
      </div>
    </div>
  );
}
