import Icon from "@/components/ui/Icon";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";

const BUYER_CONFIRM_HOURS = 48;

export default function InspectionReport({ product }) {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-rb-border bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-sans text-2xl font-bold text-rb-ink">
            Listing review
          </h2>
          {product.verified ? (
            <Badge tone="soft" icon={<Icon name="check" className="size-3" />}>
              ReBox Verified
            </Badge>
          ) : (
            <Badge tone="soft">Admin-approved</Badge>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-rb-muted">
          {product.verified
            ? "This listing passed admin review and an extra QC check (photos, specs, and condition claims)."
            : "This listing was reviewed by ReBox admin before going live. Specs and condition below are declared by the seller."}{" "}
          Couriers only transport the item — they confirm a basic match at pickup,
          then you inspect after delivery.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {(product.specs || []).map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl bg-rb-surface/50 px-4 py-3"
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
        title="Buyer inspection window"
        icon={<Icon name="shield" className="size-5 text-sky-600" />}
        className="!rounded-2xl !border !border-sky-100 !border-l-4 h-fit"
      >
        After delivery, inspect within {BUYER_CONFIRM_HOURS} hours. Confirm
        received to release escrow, or open a dispute with unboxing photos/video
        if something does not match the listing. Escrow may auto-release after
        the window if you take no action.
      </Alert>
    </section>
  );
}
