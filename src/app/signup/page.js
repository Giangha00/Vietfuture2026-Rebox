import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Join ReBox",
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-rb-ink">Join ReBox</h1>
            <p className="mt-2 text-sm text-rb-muted">
              Create your secure account for frictionless trading.
            </p>
          </div>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-rb-pink/60" />}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </AuthLayout>
  );
}
