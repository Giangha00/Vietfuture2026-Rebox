"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function PhoneInput() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink">
        Phone Number (for OTP)
      </label>
      <div className="flex gap-2">
        <select className="w-20 rounded-xl border border-rb-border bg-rb-pink/60 px-2 text-sm outline-none focus:border-rb-red">
          <option>+84</option>
          <option>+1</option>
          <option>+66</option>
        </select>
        <input
          type="tel"
          placeholder="555-0123"
          className="flex-1 rounded-xl border border-rb-border bg-rb-pink/60 px-4 py-3 text-sm outline-none focus:border-rb-red focus:bg-white focus:ring-2 focus:ring-rb-red/15"
        />
      </div>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(ROUTES.signupEkyc);
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
      <PhoneInput />
      <Input
        label="Create Password"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="••••••••"
        hint="Minimum 8 characters with numbers and symbols."
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} className="size-4" />
          </button>
        }
        required
      />
      <Alert icon={<Icon name="info" className="size-4 text-rb-red" />}>
        To list items for sale, you will be required to complete eKYC
        verification in the next step.
      </Alert>
      <Button type="submit" fullWidth size="lg">
        Create Account
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

export function EkycForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectTo = searchParams.get("redirect") || ROUTES.profile;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        login();
        router.push(redirectTo);
      }}
    >
      <Alert variant="note" title="Identity verification">
        Upload a clear photo of your national ID or passport. This unlocks
        listing and Premium Escrow.
      </Alert>
      <Input label="ID Number" name="idNumber" placeholder="Enter ID number" />
      <div className="rounded-2xl border border-dashed border-rb-border bg-rb-pink/40 px-4 py-10 text-center">
        <Icon name="camera" className="mx-auto mb-2 size-8 text-rb-muted" />
        <p className="text-sm font-semibold text-rb-ink">Upload ID document</p>
        <p className="mt-1 text-xs text-rb-muted">JPG or PNG · max 5MB</p>
      </div>
      <Button type="submit" fullWidth size="lg">
        Submit eKYC
        <Icon name="arrow" className="size-4" />
      </Button>
      <p className="text-center text-sm text-rb-muted">
        <Link href={ROUTES.signup} className="font-bold text-rb-red hover:underline">
          ← Back to Account Info
        </Link>
      </p>
    </form>
  );
}
