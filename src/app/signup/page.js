import AuthLayout from "@/components/layout/AuthLayout";
import { SignupForm, EkycForm } from "@/components/auth/SignupForm";
import Stepper from "@/components/ui/Stepper";

export const metadata = {
  title: "Join ReBox",
};

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const isEkyc = params?.step === "ekyc";
  const current = isEkyc ? 2 : 1;

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <Stepper current={current} />
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-rb-ink">
              {isEkyc ? "Verify your identity" : "Join ReBox"}
            </h1>
            <p className="mt-2 text-sm text-rb-muted">
              {isEkyc
                ? "Complete eKYC to unlock listing and Premium Escrow."
                : "Create your secure account for frictionless trading."}
            </p>
          </div>
          {isEkyc ? <EkycForm /> : <SignupForm />}
        </div>
      </div>
    </AuthLayout>
  );
}
