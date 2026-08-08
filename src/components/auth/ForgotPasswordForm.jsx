"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";
import {
  backendForgotPassword,
  backendResetPassword,
  backendVerifyResetOtp,
} from "@/lib/rebox-backend-api";
import {
  PASSWORD_HINT,
  hasFieldErrors,
  validateConfirmPassword,
  validateEmail,
  validateOtp,
  validatePassword,
} from "@/lib/validation";

const STEPS = ["email", "otp", "password"];

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const title = useMemo(() => {
    if (step === "otp") return "Enter OTP";
    if (step === "password") return "Set new password";
    return "Forgot password?";
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === "otp") return `Enter the code we sent to ${email}.`;
    if (step === "password") return "Choose a new password for your account.";
    return "Enter your email to receive a password reset code.";
  }, [email, step]);

  function clearField(name) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 border-rb-green bg-rb-green-soft text-rb-green">
          <Icon name="lock" className="size-6" />
        </span>
        <h1 className="text-2xl font-bold text-rb-ink">{title}</h1>
        <p className="mt-2 text-sm text-rb-muted">{subtitle}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {STEPS.map((item, index) => (
            <span
              key={item}
              className={[
                "size-2.5 rounded-full",
                index <= stepIndex ? "bg-rb-green" : "bg-rb-border",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {step === "email" ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError("");
            setSubmitting(true);
            const emailCheck = validateEmail(email);
            if (!emailCheck.ok) {
              setFieldErrors({ email: emailCheck.message });
              setSubmitting(false);
              return;
            }
            setFieldErrors({});
            try {
              const result = await backendForgotPassword({ email: emailCheck.email });
              if (result.emailConfigured) {
                setInfo("If that email exists, an OTP has been sent to your inbox.");
              } else if (result.debugCode) {
                setInfo(
                  `Email delivery is unavailable. Dev fallback OTP: ${result.debugCode}`,
                );
              } else {
                setInfo("If that email exists, an OTP has been sent.");
              }
              setStep("otp");
            } catch (err) {
              setFormError(err?.message || "Could not send OTP.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="example@rebox.vn"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearField("email");
            }}
            leftIcon={<Icon name="mail" className="size-4" />}
            required
            error={fieldErrors.email}
          />
          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          ) : null}
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Sending..." : "Send request"}
          </Button>
        </form>
      ) : null}

      {step === "otp" ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError("");
            setSubmitting(true);
            const otpCheck = validateOtp(otp);
            if (!otpCheck.ok) {
              setFieldErrors({ otp: otpCheck.message });
              setSubmitting(false);
              return;
            }
            setFieldErrors({});
            try {
              await backendVerifyResetOtp({ email: email.trim(), otp: otpCheck.otp });
              setInfo("OTP verified. Set your new password.");
              setStep("password");
            } catch (err) {
              setFieldErrors({
                otp: err?.message || "Invalid OTP. Check the code and try again.",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Input
            label="OTP Code"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              clearField("otp");
            }}
            leftIcon={<Icon name="lock" className="size-4" />}
            required
            error={fieldErrors.otp}
            hint={fieldErrors.otp ? undefined : "Enter the 6-digit code from your email."}
          />
          {info ? (
            <p className="rounded-xl border border-rb-mint bg-rb-green-soft px-3 py-2 text-sm text-rb-green">
              {info}
            </p>
          ) : null}
          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          ) : null}
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Checking..." : "Verify OTP"}
          </Button>
          <button
            type="button"
            className="w-full text-sm font-semibold text-rb-muted hover:text-rb-green"
            onClick={() => {
              setStep("email");
              setOtp("");
              setFieldErrors({});
              setFormError("");
            }}
          >
            Use a different email
          </button>
        </form>
      ) : null}

      {step === "password" ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError("");
            const passwordCheck = validatePassword(password, { field: "New password" });
            const confirmCheck = validateConfirmPassword(password, confirmPassword);
            const errors = {};
            if (!passwordCheck.ok) errors.password = passwordCheck.message;
            if (!confirmCheck.ok) errors.confirmPassword = confirmCheck.message;
            if (hasFieldErrors(errors)) {
              setFieldErrors(errors);
              return;
            }
            setFieldErrors({});
            setSubmitting(true);
            try {
              await backendResetPassword({
                email: email.trim(),
                otp: otp.trim(),
                password,
              });
              router.push(`${ROUTES.login}?reset=1`);
            } catch (err) {
              setFormError(err?.message || "Could not reset password.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Abcdef1!"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearField("password");
            }}
            leftIcon={<Icon name="lock" className="size-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Toggle password"
              >
                <Icon name={showPassword ? "eye-off" : "eye"} className="size-4" />
              </button>
            }
            required
            minLength={8}
            error={fieldErrors.password}
            hint={fieldErrors.password ? undefined : PASSWORD_HINT}
          />
          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Abcdef1!"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearField("confirmPassword");
            }}
            leftIcon={<Icon name="lock" className="size-4" />}
            required
            minLength={8}
            error={fieldErrors.confirmPassword}
          />
          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          ) : null}
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      ) : null}

      <div className="border-t border-rb-border pt-4 text-center">
        <Link
          href={ROUTES.login}
          className="inline-flex items-center gap-2 text-sm text-rb-muted hover:text-rb-green"
        >
          ← Back to Log in
        </Link>
      </div>
    </div>
  );
}
