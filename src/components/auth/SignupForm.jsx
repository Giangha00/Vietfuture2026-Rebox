"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import {
  PASSWORD_HINT,
  PHONE_HINT,
  hasFieldErrors,
  normalizePhone,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@/lib/validation";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
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
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setFormError("");
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const fullName = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");
        const confirm = String(formData.get("confirmPassword") || "");

        const nameCheck = validateFullName(fullName);
        const emailCheck = validateEmail(email);
        const phoneCheck = validatePhone(phone, { required: true });
        const passwordCheck = validatePassword(password);
        const confirmCheck = validateConfirmPassword(password, confirm);

        const errors = {};
        if (!nameCheck.ok) errors.name = nameCheck.message;
        if (!emailCheck.ok) errors.email = emailCheck.message;
        if (!phoneCheck.ok) errors.phone = phoneCheck.message;
        if (!passwordCheck.ok) errors.password = passwordCheck.message;
        if (!confirmCheck.ok) errors.confirmPassword = confirmCheck.message;

        if (hasFieldErrors(errors)) {
          setFieldErrors(errors);
          setSubmitting(false);
          return;
        }
        setFieldErrors({});

        try {
          const result = await register({
            fullName: nameCheck.name,
            email: emailCheck.email,
            phone: phoneCheck.phone,
            password,
          });
          const params = new URLSearchParams({
            email: result.email || email,
            redirect: redirectTo,
          });
          if (result.debugCode) params.set("debug", result.debugCode);
          router.push(`${ROUTES.verifyEmail}?${params.toString()}`);
        } catch (err) {
          setFormError(err?.message || "Could not create account. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Input
        label="Full name"
        name="name"
        placeholder="Nguyen Van A"
        leftIcon={<Icon name="user" className="size-4" />}
        required
        minLength={2}
        error={fieldErrors.name}
        onChange={() => clearField("name")}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="example@rebox.vn"
        leftIcon={<Icon name="mail" className="size-4" />}
        required
        error={fieldErrors.email}
        onChange={() => clearField("email")}
      />
      <Input
        label="Phone number"
        type="tel"
        name="phone"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="0901234567"
        value={phone}
        onChange={(e) => {
          setPhone(normalizePhone(e.target.value));
          clearField("phone");
        }}
        leftIcon={<Icon name="phone" className="size-4" />}
        required
        maxLength={10}
        error={fieldErrors.phone}
        hint={fieldErrors.phone ? undefined : PHONE_HINT}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Abcdef1!"
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
          onChange={() => clearField("password")}
        />
        <Input
          label="Confirm"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Abcdef1!"
          leftIcon={<Icon name="shield" className="size-4" />}
          required
          minLength={8}
          error={fieldErrors.confirmPassword}
          onChange={() => clearField("confirmPassword")}
        />
      </div>
      <p className="text-xs leading-relaxed text-rb-muted">{PASSWORD_HINT}</p>
      <p className="text-xs leading-relaxed text-rb-muted">
        By signing up, you agree to ReBox{" "}
        <Link href={ROUTES.policy} className="font-semibold text-rb-green hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href={`${ROUTES.policy}#privacy`} className="font-semibold text-rb-green hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      {formError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}
      <Button type="submit" fullWidth size="lg" disabled={submitting}>
        {submitting ? "Creating..." : "Sign up"}
        <Icon name="arrow" className="size-4" />
      </Button>
      <div className="border-t border-rb-border pt-4 text-center text-sm text-rb-muted">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-bold text-rb-green hover:underline">
          Log in now
        </Link>
      </div>
    </form>
  );
}
