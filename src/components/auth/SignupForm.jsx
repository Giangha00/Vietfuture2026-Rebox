"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = searchParams.get("redirect") || ROUTES.profile;

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const fullName = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const password = String(formData.get("password") || "");

        try {
          await register({ fullName, email, phone, password });
          router.push(redirectTo);
        } catch (err) {
          setError(err?.message || "Could not create account. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Input label="Full Name" name="name" placeholder="John Doe" required />
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="name@example.com"
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink">
          Phone Number
        </label>
        <div className="flex gap-2">
          <select
            name="phoneCountry"
            defaultValue="+84"
            className="w-20 rounded-xl border border-rb-border bg-rb-pink/60 px-2 text-sm outline-none focus:border-rb-red"
          >
            <option>+84</option>
            <option>+1</option>
            <option>+66</option>
          </select>
          <input
            type="tel"
            name="phone"
            placeholder="555-0123"
            className="flex-1 rounded-xl border border-rb-border bg-rb-pink/60 px-4 py-3 text-sm outline-none focus:border-rb-red focus:bg-white focus:ring-2 focus:ring-rb-red/15"
          />
        </div>
      </div>
      <Input
        label="Create Password"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="••••••••"
        hint="Minimum 8 characters with numbers and symbols."
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
      />
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" fullWidth size="lg" disabled={submitting}>
        {submitting ? "Creating..." : "Create Account"}
        <Icon name="arrow" className="size-4" />
      </Button>
      <p className="text-center text-sm text-rb-muted">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-bold text-rb-red hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
