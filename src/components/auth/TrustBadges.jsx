import Icon from "@/components/ui/Icon";

export default function TrustBadges() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-rb-border bg-white px-4 py-2 text-xs font-semibold text-rb-ink">
        <Icon name="shield" className="size-4 text-rb-red" />
        Escrow Protected
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-rb-border bg-white px-4 py-2 text-xs font-semibold text-rb-ink">
        <Icon name="lock" className="size-4 text-rb-red" />
        eKYC Verified
      </span>
    </div>
  );
}
