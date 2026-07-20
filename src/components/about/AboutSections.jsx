import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";

export function AboutHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Badge tone="soft" className="mb-4 uppercase tracking-[0.14em]">
        Frictionless Trust
      </Badge>
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-rb-ink sm:text-5xl">
        Building <span className="text-rb-red">Silent Shopping</span> for
        Vietnam&apos;s second-hand economy
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-rb-muted">
        ReBox removes meetups, haggling friction, and trust gaps with escrow,
        escrow, and standardized station logistics.
      </p>
    </section>
  );
}

export function PhilosophySection() {
  const icons = [
    { icon: "shield", label: "Trust" },
    { icon: "bolt", label: "Speed" },
    { icon: "box", label: "Earth" },
  ];

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-rb-ink">
          The Silent Shopping Philosophy
        </h2>
        <p className="mt-4 text-rb-muted leading-relaxed">
          Trade should feel like supermarket logistics — quiet, standardized,
          and protected — not a risky sidewalk exchange.
        </p>
        <div className="mt-6 flex gap-6">
          {icons.map((item) => (
            <div key={item.label} className="text-center">
              <span className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-rb-pink text-rb-red">
                <Icon name={item.icon} className="size-6" />
              </span>
              <p className="text-sm font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1000&q=80"
          alt="Silent shopping"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <Badge tone="red" className="absolute bottom-4 left-4 uppercase">
          48h Auto-Release Escrow
        </Badge>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    {
      n: 1,
      title: "Pack",
      desc: "Seal your item in a ReBox with packing proof video.",
    },
    {
      n: 2,
      title: "Drop",
      desc: "Drop at any partner station locker — 24/7.",
    },
    {
      n: 3,
      title: "Get Paid",
      desc: "Escrow releases after confirmation or 48 hours.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">
          The 3-Step Efficiency Principle
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-rb-border p-6 text-center"
            >
              <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-rb-red text-white font-bold">
                {s.n}
              </span>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-rb-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MissionVisionGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-rb-border">
          <h3 className="text-xl font-bold text-rb-ink">Our Mission in Vietnam</h3>
          <p className="mt-3 text-sm leading-relaxed text-rb-muted">
            Make second-hand commerce as trustworthy as retail — with identity
            verification, escrow, and station logistics at national scale.
          </p>
        </div>
        <div className="rounded-2xl bg-rb-red p-8 text-white">
          <Icon name="box" className="mb-3 size-8" />
          <p className="text-4xl font-bold">150 Tons</p>
          <p className="mt-2 text-white/85">Waste diverted in 2022</p>
        </div>
        <div className="rounded-2xl bg-stone-100 p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-rb-muted">
            Strategic Partners
          </p>
          <p className="mt-3 text-2xl font-bold text-rb-ink">GS25 & Circle K</p>
        </div>
        <div className="rounded-2xl bg-rb-brown p-8 text-white">
          <h3 className="text-xl font-bold">Our Vision</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            A Southeast Asia where every pre-loved item moves through silent,
            standardized, escrow-backed channels.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutNetworkSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <h2 className="font-display text-3xl font-bold">
          The ReBox Network
        </h2>
        <p className="mt-3 text-rb-muted">
          Hundreds of smart lockers inside stores you already trust.
        </p>
        <ul className="mt-6 space-y-3">
          <li className="flex items-center gap-3 text-sm font-semibold">
            <Icon name="mapPin" className="size-5 text-rb-red" /> 500+ Stations
          </li>
          <li className="flex items-center gap-3 text-sm font-semibold">
            <Icon name="clock" className="size-5 text-rb-red" /> 24/7 Accessibility
          </li>
        </ul>
        <Button href={ROUTES.stations} className="mt-6">
          Find a Station Near You
        </Button>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-rb-pink">
        <Image
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&q=80"
          alt="Network map"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
