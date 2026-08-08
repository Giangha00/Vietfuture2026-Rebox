import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

const TOC = [
  { id: "terms", label: "Terms of Service" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "refund", label: "Refund Policy" },
];

export function PolicySidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-rb-border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-rb-ink">Policy Center</h2>
        <nav className="space-y-1">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-rb-ink transition hover:bg-rb-surface"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="rounded-2xl bg-rb-green-soft p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-rb-green">
          Need help?
        </p>
        <p className="mt-2 text-sm text-rb-muted">
          We&apos;re ready to answer your questions 24/7.
        </p>
        <Button href={ROUTES.help} size="sm" fullWidth className="mt-4">
          Contact support
        </Button>
      </div>
    </aside>
  );
}

export function TermsSection() {
  return (
    <section id="terms" className="scroll-mt-28 mb-12">
      <h2 className="text-2xl font-bold text-rb-green">Terms of Service</h2>
      <p className="mt-2 text-sm text-rb-muted">Last updated: May 24, 2024</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-rb-muted">
        <div>
          <h3 className="mb-2 font-bold text-rb-ink">1. Service definition</h3>
          <p>
            ReBox is a peer-to-peer marketplace that connects buyers and sellers
            of second-hand goods. We provide listing tools, messaging, and optional
            escrow and station shipping — we are not the seller of listed items
            unless expressly stated.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-rb-ink">2. User accounts</h3>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>You must provide accurate registration information.</li>
            <li>You are responsible for keeping your login credentials secure.</li>
            <li>One person may maintain only one primary account unless approved.</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-rb-ink">3. Listing rules</h3>
          <p>
            Listings must accurately describe condition, accessories, and defects.
            Prohibited items (weapons, counterfeits, hazardous goods, etc.) may not
            be listed. ReBox may remove listings that violate these rules.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-28 mb-12">
      <h2 className="text-2xl font-bold text-rb-green">Privacy Policy</h2>
      <p className="mt-4 text-sm leading-relaxed text-rb-muted">
        We collect account, transaction, and device data needed to operate the
        marketplace, prevent fraud, and improve the product.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-rb-surface p-5">
          <Icon name="shield" className="mb-3 size-6 text-rb-green" />
          <h3 className="font-bold text-rb-ink">Data we collect</h3>
          <p className="mt-2 text-sm text-rb-muted">
            Name, email, phone, listings, messages, and payment metadata required
            for escrow and support.
          </p>
        </div>
        <div className="rounded-2xl bg-rb-surface p-5">
          <Icon name="lock" className="mb-3 size-6 text-rb-green" />
          <h3 className="font-bold text-rb-ink">Payment security</h3>
          <p className="mt-2 text-sm text-rb-muted">
            Payment details are processed by trusted providers. We do not store
            full card numbers on ReBox servers.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 font-bold text-rb-ink">Cookies</h3>
        <p className="text-sm leading-relaxed text-rb-muted">
          We use cookies and similar technologies for authentication, preferences,
          and analytics. You can control cookies through your browser settings.
        </p>
      </div>
    </section>
  );
}

export function ShippingSection() {
  return (
    <section id="shipping" className="scroll-mt-28 mb-12">
      <h2 className="text-2xl font-bold text-rb-green">Shipping Policy</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-rb-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-rb-surface text-rb-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Area</th>
              <th className="px-4 py-3 font-semibold">Estimated time</th>
              <th className="px-4 py-3 font-semibold">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rb-border bg-white text-rb-ink">
            <tr>
              <td className="px-4 py-3">Inner city (HN / HCMC)</td>
              <td className="px-4 py-3">1–2 business days</td>
              <td className="px-4 py-3">Station locker / courier</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Inter-province</td>
              <td className="px-4 py-3">3–5 business days</td>
              <td className="px-4 py-3">Standard courier</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-rb-muted">
        Shipping fees may be paid by buyer, seller, or shared — as agreed in the
        listing or chat. Station drop-off follows locker size guidelines.
      </p>
    </section>
  );
}

export function RefundSection() {
  return (
    <section id="refund" className="scroll-mt-28 mb-12">
      <h2 className="text-2xl font-bold text-rb-green">Refund Policy</h2>
      <Alert
        variant="danger"
        title="Refund conditions"
        icon={<Icon name="info" className="size-5 text-rb-danger" />}
        className="mt-6 !rounded-2xl"
      >
        Refunds apply when the item significantly differs from the listing, arrives
        damaged, or never ships within the agreed window — subject to evidence.
      </Alert>
      <div className="mt-6">
        <h3 className="mb-2 font-bold text-rb-ink">Accepted return cases</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-rb-muted">
          <li>Item not as described (material defects omitted)</li>
          <li>Wrong item delivered</li>
          <li>Damaged in transit with unboxing evidence</li>
        </ul>
      </div>
      <div className="mt-6 rounded-2xl bg-rb-green-soft p-5">
        <h3 className="font-bold text-rb-green">Dispute resolution process</h3>
        <p className="mt-2 text-sm text-rb-muted">
          Open a dispute from your order page, submit photos or video, and our
          support team will mediate within 48 hours. Escrow funds stay held until
          the case is resolved.
        </p>
      </div>
    </section>
  );
}
