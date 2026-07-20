import Link from "next/link";
import { ROUTES } from "@/lib/routes";

function PartnerBadge({ name, count }) {
  return (
    <div className="rounded-2xl border border-rb-border bg-white px-5 py-4 shadow-sm">
      <p className="font-bold text-rb-ink">{name}</p>
      <p className="mt-1 text-sm text-rb-muted">{count} active stations</p>
    </div>
  );
}

export default function NetworkSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-rb-ink">
            Our Growing Network
          </h2>
          <p className="mt-3 max-w-md text-rb-muted">
            Drop and pick up at convenience stores you already visit — powered
            by Circle K and GS25 partnerships.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <PartnerBadge name="Circle K Partnership" count="320+" />
            <PartnerBadge name="GS25 Partnership" count="210+" />
          </div>
          <Link
            href={ROUTES.stations}
            className="mt-6 inline-flex text-sm font-semibold text-rb-red hover:underline"
          >
            Find your nearest station →
          </Link>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-rb-pink">
          <div className="absolute inset-6 rounded-[2rem] border border-rb-border/60 bg-[radial-gradient(circle_at_30%_40%,#f8d7d0,transparent_45%),radial-gradient(circle_at_70%_60%,#e8eef8,transparent_40%)]">
            <span className="absolute left-[28%] top-[35%] size-4 rounded-full bg-rb-red shadow-lg shadow-rb-red/40" />
            <span className="absolute left-[62%] top-[52%] size-4 rounded-full bg-sky-500 shadow-lg shadow-sky-500/40" />
            <span className="absolute left-[45%] top-[22%] size-3 rounded-full bg-rb-brown/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
