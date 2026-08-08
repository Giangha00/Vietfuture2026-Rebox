"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Accordion from "@/components/ui/Accordion";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";
import { validateEmail, validateFullName } from "@/lib/validation";

const FAQ_ITEMS = [
  {
    q: "How does 48h escrow work?",
    a: "Buyer funds are held until the item is picked up and inspected. After confirmation—or automatically after 48 hours—funds release to the seller.",
  },
  {
    q: "How do seller ratings work?",
    a: "Ratings reflect completed trades, response time, and escrow history. Higher-rated sellers unlock Premium Escrow benefits.",
  },
  {
    q: "Where are ReBox Stations?",
    a: "Stations live inside Circle K and GS25 partners across HCMC and Hanoi. Use Contact → Physical Stations to find one near you.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Film a continuous unboxing video. Without video evidence, dispute claims may be restricted.",
  },
];

const STATIONS = [
  {
    city: "Ho Chi Minh",
    address: "Circle K Nguyễn Huệ, Q1",
    locker: "Smart Locker #A12",
    color: "red",
  },
  {
    city: "Hanoi",
    address: "GS25 Trần Hưng Đạo, Hoàn Kiếm",
    locker: "Smart Locker #HN-03",
    color: "blue",
  },
];

export function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-rb-border bg-white">
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-rb-surface" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Badge tone="soft" className="mb-4 uppercase tracking-[0.12em]">
          Support Channels
        </Badge>
        <h1 className="max-w-2xl font-sans text-4xl font-bold text-rb-ink sm:text-5xl">
          How can we help you secure your trade?
        </h1>
        <p className="mt-4 max-w-xl text-rb-muted">
          Dispute resolution, station help, and escrow questions — we&apos;re on
          it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="dark" href={ROUTES.help}>
            <Icon name="book" className="size-4" />
            Visit Help Center
          </Button>
          <Button variant="soft">
            <Icon name="check" className="size-4" />
            24/7 Dispute Resolution Active
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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
      className="rounded-2xl border border-rb-border bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const nameCheck = validateFullName(formData.get("name"));
        const emailCheck = validateEmail(formData.get("email"));
        const message = String(formData.get("message") || "").trim();
        const errors = {};
        if (!nameCheck.ok) errors.name = nameCheck.message;
        if (!emailCheck.ok) errors.email = emailCheck.message;
        if (message.length < 10) {
          errors.message =
            message.length === 0
              ? "Message is required. Tell us what you need help with."
              : `Message must be at least 10 characters (currently ${message.length}).`;
        }
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return;
        }
        setFieldErrors({});
        setSent(true);
      }}
    >
      <h2 className="mb-5 text-xl font-bold text-rb-ink">Send a Message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="name"
          placeholder="Your name"
          required
          minLength={2}
          error={fieldErrors.name}
          onChange={() => clearField("name")}
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          error={fieldErrors.email}
          onChange={() => clearField("email")}
        />
      </div>
      <div className="mt-4">
        <Select
          label="Subject"
          name="subject"
          options={[
            "Escrow question",
            "Station issue",
            "Account support",
            "Dispute",
            "Other",
          ]}
        />
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          minLength={10}
          onChange={() => clearField("message")}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          className={[
            "rounded-xl border bg-rb-surface/60 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2",
            fieldErrors.message
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-rb-border focus:border-rb-green focus:ring-rb-green/15",
          ].join(" ")}
          placeholder="Tell us what happened..."
        />
        {fieldErrors.message ? (
          <p className="text-xs font-medium text-red-600" role="alert">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="mt-5" fullWidth>
        {sent ? "Message Sent ✓" : "Send Message"}
      </Button>
    </form>
  );
}

export function ContactSidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl bg-rb-brown p-5 text-white">
        <Icon name="phone" className="mb-3 size-6" />
        <p className="text-sm text-white/70">Hotline</p>
        <p className="text-2xl font-bold tracking-wide">1900-REBOX</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-rb-border bg-white p-4">
          <p className="font-semibold text-rb-ink">Zalo Support</p>
          <p className="mt-1 text-xs text-rb-muted">Avg reply 12 min</p>
        </div>
        <div className="rounded-2xl border border-rb-border bg-white p-4">
          <p className="font-semibold text-rb-ink">Email Desk</p>
          <p className="mt-1 text-xs text-rb-muted">Avg reply 2 hrs</p>
        </div>
      </div>
      <div id="stations" className="rounded-2xl border border-rb-border bg-white p-5">
        <h3 className="mb-4 font-bold text-rb-ink">Physical Stations</h3>
        <ul className="space-y-4">
          {STATIONS.map((s) => (
            <li key={s.locker} className="flex gap-3">
              <span
                className={`mt-1 size-3 rounded-full ${
                  s.color === "red" ? "bg-rb-green" : "bg-sky-500"
                }`}
              />
              <div>
                <p className="font-semibold text-rb-ink">{s.city}</p>
                <p className="text-sm text-rb-muted">{s.address}</p>
                <p className="text-xs text-rb-muted">{s.locker}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="outline" fullWidth className="mt-5" href={ROUTES.about}>
          View Detailed Locations
        </Button>
      </div>
    </aside>
  );
}

export function GuaranteeBanner() {
  return (
    <section className="bg-rb-brown py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex gap-4">
          <Icon name="shield" className="size-8 shrink-0" />
          <div>
            <h3 className="text-xl font-bold">Dispute Resolution Guarantee</h3>
            <p className="mt-1 max-w-xl text-sm text-white/75">
              Unboxing evidence + escrow timeline = fair outcomes for buyers and
              sellers.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-white/25 px-4 py-3 text-center">
            <p className="text-lg font-bold">15,000+</p>
            <p className="text-xs text-white/70">Trades Secured</p>
          </div>
          <div className="rounded-xl border border-white/25 px-4 py-3 text-center">
            <p className="text-lg font-bold">4.9/5</p>
            <p className="text-xs text-white/70">Trust Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-3xl font-bold">
          Common Questions
        </h2>
        <p className="mt-2 text-rb-muted">Quick answers before you open a ticket.</p>
      </div>
      <Accordion items={FAQ_ITEMS} />
      <p className="mt-6 text-center">
        <a href={ROUTES.policy} className="text-sm font-semibold text-rb-green hover:underline">
          See all Help Articles →
        </a>
      </p>
    </section>
  );
}
