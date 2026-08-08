import Link from "next/link";
import { FOOTER_LINKS, ROUTES } from "@/lib/routes";
import Logo from "@/components/layout/Logo";
import Icon from "@/components/ui/Icon";

export default function Footer({ variant = "default" }) {
  if (variant === "auth" || variant === "minimal") {
    return (
      <footer className="mt-auto py-8 text-center text-xs text-rb-muted">
        © 2024 ReBox. Circular Commerce for a Sustainable Future.
      </footer>
    );
  }

  if (variant === "compact") {
    return (
      <footer className="border-t border-rb-border bg-rb-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Logo className="text-xl" />
            <p className="mt-2 text-xs text-rb-muted">
              © 2024 ReBox Marketplace. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-rb-muted">
            <Link href={ROUTES.policy} className="hover:text-rb-green">
              Privacy Policy
            </Link>
            <Link href={ROUTES.help} className="hover:text-rb-green">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-rb-border bg-rb-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-rb-muted">
            A transparent second-hand marketplace for sustainable consumption.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-rb-ink">About us</h3>
          <ul className="space-y-2.5 text-sm text-rb-muted">
            {FOOTER_LINKS.about.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-rb-green">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-rb-ink">Support</h3>
          <ul className="space-y-2.5 text-sm text-rb-muted">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-rb-green">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-rb-ink">Connect</h3>
          <div className="flex gap-3">
            <a
              href="https://rebox.vn"
              className="flex size-10 items-center justify-center rounded-full border border-rb-border bg-white text-rb-muted transition hover:border-rb-green hover:text-rb-green"
              aria-label="Website"
            >
              <Icon name="mapPin" className="size-4" />
            </a>
            <a
              href="mailto:hello@rebox.vn"
              className="flex size-10 items-center justify-center rounded-full border border-rb-border bg-white text-rb-muted transition hover:border-rb-green hover:text-rb-green"
              aria-label="Email"
            >
              <Icon name="mail" className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-rb-border py-4 text-center text-xs text-rb-muted">
        © 2024 ReBox Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
