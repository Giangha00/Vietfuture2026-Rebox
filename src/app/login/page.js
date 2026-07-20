import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";
import TrustBadges from "@/components/auth/TrustBadges";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <p className="font-display text-3xl font-bold text-rb-red">
              ReBox
            </p>
            <h1 className="mt-3 text-2xl font-bold text-rb-ink">Welcome Back</h1>
            <p className="mt-2 text-sm text-rb-muted">
              Enter your details to access your secure trading hub.
            </p>
          </div>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-rb-pink/60" />}>
            <LoginForm />
          </Suspense>
          <SocialAuth />
          <p className="mt-6 text-center text-sm text-rb-muted">
            New to the supermarket?{" "}
            <Link
              href={ROUTES.signup}
              className="font-bold text-rb-red hover:underline"
            >
              Sign up for a ReBox account
            </Link>
          </p>
        </div>
        <TrustBadges />
      </div>
    </AuthLayout>
  );
}
