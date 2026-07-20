import Icon from "@/components/ui/Icon";
import Alert from "@/components/ui/Alert";

export default function InspectionReport({ product }) {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-rb-border bg-white p-6">
        <h2 className="font-display text-2xl font-bold text-rb-ink">
          Detailed Inspection Report
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-rb-muted">
          {product.description} Our AI-Vision pipeline scores surface wear,
          authenticity markers, and packaging integrity before listing goes live.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {product.specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl bg-rb-pink/50 px-4 py-3"
            >
              <dt className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">
                {spec.label}
              </dt>
              <dd className="mt-1 font-semibold text-rb-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Alert
        variant="note"
        title="ReBox Promise"
        icon={<Icon name="shield" className="size-5 text-sky-600" />}
        className="!rounded-2xl !border !border-sky-100 !border-l-4 h-fit"
      >
        Buyer funds stay in escrow for 48 hours after delivery. Confirm
        inspection or let auto-release handle payout — disputes need unboxing
        video evidence.
      </Alert>
    </section>
  );
}
