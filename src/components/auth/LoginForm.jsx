"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || ROUTES.profile;

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        try {
          await login({ email, password });
          router.push(redirectTo);
        } catch (err) {
          setError(err?.message || "Invalid email or password.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="name@company.com"
        leftIcon={<Icon name="mail" className="size-4" />}
        required
      />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink">
            Password
          </label>
          <Link
            href={ROUTES.forgotPassword}
            className="text-xs font-semibold text-rb-red hover:underline"
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
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" fullWidth size="lg" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
        <Icon name="arrow" className="size-4" />
      </Button>
    </form>
  );
}
