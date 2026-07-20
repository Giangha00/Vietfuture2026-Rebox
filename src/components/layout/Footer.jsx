import Link from "next/link";
import { FOOTER_LINKS, ROUTES } from "@/lib/routes";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Footer({ variant = "default" }) {
  if (variant === "auth") {
    return (
      <footer className="mt-auto border-t border-rb-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo className="text-xl" />
            <p className="mt-1 text-xs text-rb-muted">
              © 2024 ReBox. Frictionless Trust for Second-Hand Trading.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-rb-muted">
            <Link href={ROUTES.policy} className="hover:text-rb-red">
              Privacy Policy
            </Link>
            <Link href={ROUTES.policy} className="hover:text-rb-red">
              Terms of Service
            </Link>
            <Link href={ROUTES.policy} className="hover:text-rb-red">
              Account Security
            </Link>
            <Link href={ROUTES.contact} className="hover:text-rb-red">
              Trust & Safety
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "compact") {
    return (
      <footer className="border-t border-white/10 bg-rb-brown text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Logo light className="text-xl" />
            <p className="mt-2 text-xs text-white/60">
              © 2024 ReBox Escrow Marketplace. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <Link href={ROUTES.policy} className="hover:text-white">
              Verified Sellers
            </Link>
            <Link href={ROUTES.policy} className="hover:text-white">
              Escrow Protected
            </Link>
            <Link href={ROUTES.policy} className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href={ROUTES.contact} className="hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-rb-border bg-rb-pink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-rb-muted">
            Frictionless C2C trading with escrow and standardized ReBox
            station shipping.
          </p>
          <div className="flex gap-3 text-sm font-semibold text-rb-red">
            <span>FB</span>
            <span>IG</span>
            <span>YT</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-rb-ink">
            Company
          </h3>
          <ul className="space-y-2.5 text-sm text-rb-muted">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-rb-red">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-rb-ink">
            Services
          </h3>
          <ul className="space-y-2.5 text-sm text-rb-muted">
            {FOOTER_LINKS.services.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-rb-red">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-rb-ink">
            Newsletter
          </h3>
          <p className="mb-3 text-sm text-rb-muted">
            Station drops, escrow tips, and trust updates.
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="you@email.com"
              containerClassName="flex-1"
              className="!bg-white"
            />
            <Button type="submit" size="md">
              Join
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-rb-border/80 py-4 text-center text-xs text-rb-muted">
        © 2024 ReBox. Frictionless Trust for Second-Hand Trading.
      </div>
    </footer>
  );
}
