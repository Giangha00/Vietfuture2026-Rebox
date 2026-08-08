import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <p className="font-sans text-3xl font-bold text-rb-green">ReBox</p>
            <h1 className="mt-3 text-2xl font-bold text-rb-ink">Verify email</h1>
            <p className="mt-2 text-sm text-rb-muted">
              Confirm your account with the OTP sent to your inbox.
            </p>
          </div>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-rb-surface/60" />}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </AuthLayout>
  );
}
