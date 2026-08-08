"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { backendResendVerification } from "@/lib/rebox-backend-api";
import { validateOtp } from "@/lib/validation";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeEmailVerification } = useAuth();

  const initialEmail = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirect") || ROUTES.home;
  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [info, setInfo] = useState(
    searchParams.get("debug")
      ? `Dev fallback OTP (email not delivered): ${searchParams.get("debug")}`
      : "Enter the 6-digit code sent to your email.",
  );
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(email) && otp.trim().length === 6,
    [email, otp],
  );

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-rb-muted">
          Missing email. Please sign up or sign in again.
        </p>
        <Button href={ROUTES.signup} fullWidth>
          Back to Sign Up
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setFormError("");
        const otpCheck = validateOtp(otp);
        if (!otpCheck.ok) {
          setFieldError(otpCheck.message);
          return;
        }
        setFieldError("");
        setSubmitting(true);
        try {
          await completeEmailVerification({ email, otp: otpCheck.otp });
          router.push(redirectTo);
        } catch (err) {
          setFieldError(err?.message || "Invalid verification code. Double-check the digits.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="rounded-xl border border-rb-border bg-rb-surface/40 px-4 py-3 text-sm text-rb-muted">
        We sent a verification code to{" "}
        <span className="font-semibold text-rb-ink">{email}</span>
      </div>

      <Input
        label="OTP Code"
        name="otp"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="6-digit code"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
          setFieldError("");
        }}
        leftIcon={<Icon name="lock" className="size-4" />}
        required
        minLength={6}
        maxLength={6}
        error={fieldError}
        hint={fieldError ? undefined : "6-digit code from your email"}
      />

      {info ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {info}
        </p>
      ) : null}
      {formError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <Button type="submit" fullWidth size="lg" disabled={submitting || !canSubmit}>
        {submitting ? "Verifying..." : "Verify email"}
      </Button>

      <button
        type="button"
        className="w-full text-sm font-semibold text-rb-green hover:underline disabled:opacity-50"
        disabled={resending}
        onClick={async () => {
          setResending(true);
          setFormError("");
          setFieldError("");
          try {
            const result = await backendResendVerification({ email });
            if (result.emailConfigured) {
              setInfo("A new verification code was sent to your email.");
            } else if (result.debugCode) {
              setInfo(
                `Email delivery is unavailable. Dev fallback OTP: ${result.debugCode}`,
              );
            } else {
              setInfo("A new verification code was generated. Check your email.");
            }
          } catch (err) {
            setFormError(err?.message || "Could not resend code.");
          } finally {
            setResending(false);
          }
        }}
      >
        {resending ? "Sending..." : "Resend code"}
      </button>

      <p className="text-center text-sm text-rb-muted">
        <Link href={ROUTES.login} className="font-bold text-rb-green hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
