import Link from "next/link";
import { ROUTES } from "@/lib/routes";

function CityBadge({ name, note }) {
  return (
    <div className="rounded-2xl border border-rb-border bg-white px-5 py-4 shadow-sm">
      <p className="font-bold text-rb-ink">{name}</p>
      <p className="mt-1 text-sm text-rb-muted">{note}</p>
    </div>
  );
}

export default function NetworkSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-sans text-3xl font-bold text-rb-ink">
            Courier coverage
          </h2>
          <p className="mt-3 max-w-md text-rb-muted">
            Door-to-door pickup and delivery across major cities — keep items at
            home until a courier arrives.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <CityBadge name="Ho Chi Minh" note="Courier pickup & delivery" />
            <CityBadge name="Ha Noi" note="Courier pickup & delivery" />
          </div>
          <Link
            href={ROUTES.help}
            className="mt-6 inline-flex text-sm font-semibold text-rb-green hover:underline"
          >
            How courier delivery works →
          </Link>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-rb-surface">
          <div className="absolute inset-6 rounded-[2rem] border border-rb-border/60 bg-[radial-gradient(circle_at_30%_40%,#f8d7d0,transparent_45%),radial-gradient(circle_at_70%_60%,#e8eef8,transparent_40%)]">
            <span className="absolute left-[28%] top-[35%] size-4 rounded-full bg-rb-green shadow-lg shadow-rb-green/40" />
            <span className="absolute left-[62%] top-[52%] size-4 rounded-full bg-sky-500 shadow-lg shadow-sky-500/40" />
            <span className="absolute left-[45%] top-[22%] size-3 rounded-full bg-rb-brown/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
