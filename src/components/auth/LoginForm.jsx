"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, verifyEmailWithParams } from "@/lib/routes";
import { hasFieldErrors, validateEmail, validateRequiredText } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [info, setInfo] = useState(
    searchParams.get("reset") === "1"
      ? "Password updated. You can sign in with your new password."
      : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || ROUTES.home;

  function clearField(name) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setFormError("");
        setInfo("");
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        const emailCheck = validateEmail(email);
        const passwordCheck = validateRequiredText(password, {
          field: "Password",
          min: 1,
        });

        const errors = {};
        if (!emailCheck.ok) errors.email = emailCheck.message;
        if (!passwordCheck.ok) {
          errors.password = "Password is required to sign in.";
        }

        if (hasFieldErrors(errors)) {
          setFieldErrors(errors);
          setSubmitting(false);
          return;
        }
        setFieldErrors({});

        try {
          await login({ email: emailCheck.email, password });
          router.push(redirectTo);
        } catch (err) {
          if (err?.needsVerification) {
            router.push(
              verifyEmailWithParams({
                email: err.email || email,
                redirect: redirectTo,
                debugCode: err.debugCode,
              }),
            );
            return;
          }
          setFormError(err?.message || "Invalid email or password.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="example@gmail.com"
        leftIcon={<Icon name="mail" className="size-4" />}
        required
        error={fieldErrors.email}
        onChange={() => clearField("email")}
      />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
            Password
          </label>
          <Link
            href={ROUTES.forgotPassword}
            className="text-xs font-medium text-rb-ink hover:text-rb-green"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          leftIcon={<Icon name="lock" className="size-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-rb-muted hover:text-rb-ink"
              aria-label="Toggle password"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} className="size-4" />
            </button>
          }
          required
          error={fieldErrors.password}
          onChange={() => clearField("password")}
        />
      </div>
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
        {submitting ? "Signing in..." : "Log in"}
        <Icon name="arrow" className="size-4" />
      </Button>
    </form>
  );
}
