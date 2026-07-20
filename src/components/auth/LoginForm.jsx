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

  const redirectTo = searchParams.get("redirect") || ROUTES.profile;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "");
        login({ email });
        router.push(redirectTo);
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
      <Button type="submit" fullWidth size="lg">
        Sign In
        <Icon name="arrow" className="size-4" />
      </Button>
    </form>
  );
}
