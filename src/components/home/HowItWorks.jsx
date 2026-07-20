import Image from "next/image";

const STEPS = [
  {
    n: 1,
    title: "Pack It",
    desc: "Place your item in a standardized ReBox. Snap packing proof before you seal.",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f2103256?w=600&q=80",
  },
  {
    n: 2,
    title: "Drop at ReBox Station",
    desc: "Drop at Circle K or GS25 lockers anytime. No meetups, no awkward handoffs.",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80",
  },
  {
    n: 3,
    title: "Get Paid",
    desc: "Funds release after buyer confirmation—or automatically after 48 hours.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  },
];

export default function StepCard({ step }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-rb-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="p-6">
        <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-rb-red text-lg font-bold text-white">
          {step.n}
        </span>
        <h3 className="text-lg font-bold text-rb-ink">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-rb-muted">{step.desc}</p>
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </article>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-rb-ink">
            The Frictionless 3-Step Flow
          </h2>
          <p className="mt-3 text-rb-muted">
            Pack, drop, get paid — silent shopping for sellers and buyers.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <StepCard key={step.n} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
