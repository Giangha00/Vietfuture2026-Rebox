import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-sm text-rb-muted">
          Circular business model for a sustainable future.
        </p>
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-rb-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-rb-muted">
              Log in to your ReBox account
            </p>
          </div>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-rb-surface" />}>
            <LoginForm />
          </Suspense>
          <SocialAuth />
          <p className="mt-6 text-center text-sm text-rb-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.signup}
              className="font-bold text-rb-green hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
