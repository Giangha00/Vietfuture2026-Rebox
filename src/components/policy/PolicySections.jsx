import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

const PROHIBITED_ITEMS = [
  { title: "Hazmat", desc: "Flammables, chemicals, batteries outside approved limits." },
  { title: "Perishables", desc: "Food, plants, or anything that spoils in transit." },
  { title: "Counterfeits", desc: "Replica goods or unauthorized branded merchandise." },
  { title: "Live Animals", desc: "No live pets or biological specimens." },
  { title: "Restricted", desc: "Weapons, controlled substances, adult content." },
  { title: "Cash/Value", desc: "Cash, gift cards, crypto hardware wallets with funds." },
];

const TOC = [
  { id: "data-privacy", n: 1, label: "Data Privacy", icon: "shield" },
  { id: "escrow", n: 2, label: "Escrow Protection", icon: "lock" },
  { id: "prohibited", n: 3, label: "Prohibited Items", icon: "ban" },
  { id: "dispute", n: 4, label: "Dispute Resolution", icon: "camera" },
];

export function PolicySidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl bg-rb-pink p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-rb-red">
          Table of Contents
        </h2>
        <nav className="space-y-2">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-rb-ink hover:bg-white"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-white text-rb-red">
                <Icon name={item.icon} className="size-4" />
              </span>
              <span>
                {item.n}. {item.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
      <div className="rounded-2xl bg-sky-50 p-5">
        <div className="mb-2 flex items-center gap-2 font-bold text-rb-ink">
          <Icon name="info" className="size-5 text-sky-600" />
          Need Help?
        </div>
        <p className="mb-4 text-sm text-rb-muted">
          Legal or compliance questions? Our team responds within one business
          day.
        </p>
        <Button href={ROUTES.contact} variant="dark" size="sm" fullWidth>
          Contact Compliance
        </Button>
      </div>
    </aside>
  );
}

export function PolicyHeader() {
  return (
    <header className="mb-10">
      <Badge tone="gray" icon={<Icon name="clock" className="size-3.5" />}>
        Last Updated: June 15, 2024
      </Badge>
      <h1 className="mt-4 font-display text-4xl font-bold text-rb-ink">
        Privacy Policy & Terms of Use
      </h1>
      <p className="mt-4 max-w-2xl text-rb-muted leading-relaxed">
        These terms define how ReBox protects your data, holds escrow funds, and
        resolves disputes — the foundation of Frictionless Trust.
      </p>
    </header>
  );
}

export function PolicySection({ id, number, icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 mb-12">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-rb-ink">
        <span className="flex size-9 items-center justify-center rounded-xl bg-rb-red-soft text-rb-red">
          <Icon name={icon} className="size-5" />
        </span>
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

export function DataPrivacySection() {
  return (
    <PolicySection
      id="data-privacy"
      number={1}
      icon="shield"
      title="Data Privacy (GDPR compliant)"
    >
      <p className="mb-4 text-sm leading-relaxed text-rb-muted">
        We collect only what is required to operate your account, process
        transactions, and prevent fraud.
      </p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-rb-red-soft p-4">
          <h3 className="font-bold text-rb-red">Data Minimization</h3>
          <p className="mt-1 text-sm text-rb-muted">
            We store account and transaction data needed for escrow — not
            unnecessary copies.
          </p>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4">
          <h3 className="font-bold text-rb-red">User Rights</h3>
          <p className="mt-1 text-sm text-rb-muted">
            Access, correct, or delete your personal data under GDPR-aligned
            controls.
          </p>
        </div>
      </div>
      <Alert variant="note" title="Transparency Note">
        Logistics partners receive locker codes and delivery metadata only —
        never your full identity dossier.
      </Alert>
    </PolicySection>
  );
}

export function EscrowSection() {
  return (
    <PolicySection
      id="escrow"
      number={2}
      icon="lock"
      title="Escrow Protection Terms"
    >
      <div className="rounded-2xl border border-rb-border bg-white p-5">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="font-bold text-rb-ink">The 48h Release Window</h3>
            <ul className="mt-3 space-y-2 text-sm text-rb-muted">
              {[
                "Funds are held until pickup + inspection",
                "Buyer confirmation releases payout instantly",
                "No action after 48h triggers auto-release",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 size-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-sky-50 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-sky-800">
              Example Workflow
            </p>
            <ol className="flex items-center justify-between gap-2 text-center text-xs font-bold">
              {["Payment", "Delivery", "Release"].map((step, i) => (
                <li key={step} className="flex-1">
                  <span
                    className={`mx-auto mb-2 flex size-8 items-center justify-center rounded-full ${
                      i === 2 ? "bg-sky-600 text-white" : "bg-white text-sky-800"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </PolicySection>
  );
}

export function ProhibitedSection() {
  return (
    <PolicySection
      id="prohibited"
      number={3}
      icon="ban"
      title="Prohibited Items"
    >
      <p className="mb-4 text-sm text-rb-muted">
        To ensure logistics safety, the following items are strictly prohibited
        from ReBox Stations.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROHIBITED_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-rb-border bg-white p-4"
          >
            <Icon name="ban" className="mb-2 size-5 text-rb-red" />
            <h3 className="font-bold text-rb-ink">{item.title}</h3>
            <p className="mt-1 text-xs text-rb-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </PolicySection>
  );
}

export function DisputeSection() {
  return (
    <PolicySection
      id="dispute"
      number={4}
      icon="camera"
      title="Dispute Resolution & Unboxing Evidence"
    >
      <p className="mb-4 text-sm text-rb-muted">
        Claims rely on <strong className="text-rb-ink">objective evidence</strong> —
        continuous packing and unboxing video.
      </p>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Seller: Packing Proof",
            image:
              "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80",
            caption: "Film sealing the ReBox before drop-off.",
          },
          {
            title: "Buyer: Unboxing Proof",
            image:
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
            caption: "Film opening end-to-end without cuts.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="overflow-hidden rounded-2xl border border-rb-border bg-white"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-rb-ink">{card.title}</h3>
              <p className="mt-1 text-sm italic text-rb-muted">{card.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <Alert
        variant="warning"
        title="No Video = Restricted Claim"
        icon={<Icon name="info" className="size-5 text-orange-600" />}
        className="!px-4 !py-4"
      >
        Without continuous unboxing video, dispute eligibility may be limited.
      </Alert>
    </PolicySection>
  );
}

export function AcknowledgeSection() {
  return (
    <div className="mt-8 border-t border-rb-border pt-10 text-center">
      <h3 className="text-xl font-bold text-rb-ink">Acknowledging our Terms</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-rb-muted">
        By continuing to use ReBox, you confirm that you have read and agreed to
        these policies.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href={ROUTES.products}>I Agree</Button>
        <Button variant="secondary">Download PDF</Button>
      </div>
    </div>
  );
}
