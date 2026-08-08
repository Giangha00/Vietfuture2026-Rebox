import AuthLayout from "@/components/layout/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-rb-border bg-white p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthLayout>
  );
}
