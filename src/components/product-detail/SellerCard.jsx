import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

export default function SellerCard({ seller }) {
  const rating =
    typeof seller?.rating === "number" && Number.isFinite(seller.rating)
      ? seller.rating
      : null;
  const trades =
    typeof seller?.trades === "number" && Number.isFinite(seller.trades)
      ? seller.trades
      : null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-rb-border bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="relative size-12 overflow-hidden rounded-full">
          <Image
            src={seller.avatar}
            alt={seller.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-rb-ink">{seller.name}</p>
          <p className="inline-flex items-center gap-1 text-sm text-rb-muted">
            <Icon name="star" className="size-3.5 text-amber-500" />
            {rating !== null ? `${rating} (${trades ?? 0} trades)` : "Rating —"}
          </p>
        </div>
      </div>
      <Button href={ROUTES.profile} variant="outline" size="sm">
        View Profile
      </Button>
    </div>
  );
}

export function InstantBargain({ price }) {
  const offers = [0.05, 0.1, 0.15].map((pct) => ({
    pct,
    value: (price * (1 - pct)).toFixed(2),
  }));

  return (
    <div className="rounded-2xl border border-rb-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-rb-ink">Instant Bargain</h3>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <Icon name="bolt" className="size-3.5" />
          Smart Pricing
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {offers.map((o) => (
          <button
            key={o.pct}
            type="button"
            className="rounded-xl border border-rb-border px-2 py-3 text-center text-xs font-semibold transition hover:border-rb-red hover:bg-rb-red-soft"
          >
            -{o.pct * 100}%
            <span className="mt-1 block text-sm text-rb-red">${o.value}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-rb-muted">
        Offers pre-authorize payment. Seller accepts or declines within 2 hours.
      </p>
    </div>
  );
}
