import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Join ReBox",
};

export default function SignupPage() {
  return (
    <AuthLayout showLogo={false}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-rb-green text-white">
              <Icon name="box" className="size-6" />
            </span>
            <h1 className="text-2xl font-bold text-rb-green">Join ReBox</h1>
            <p className="mt-2 text-sm text-rb-muted">
              Building a sustainable consumption future together.
            </p>
          </div>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-rb-surface" />}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </AuthLayout>
  );
}
