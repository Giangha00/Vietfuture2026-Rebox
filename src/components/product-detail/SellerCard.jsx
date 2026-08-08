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

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-rb-border bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-rb-green-soft">
          <Image
            src={seller?.avatar || "/default-avatar.svg"}
            alt={seller?.name || "Seller"}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-rb-ink">{seller?.name || "Seller"}</p>
          <p className="inline-flex items-center gap-1 text-sm text-rb-muted">
            <Icon name="star" className="size-3.5 text-amber-500" />
            {rating !== null ? rating : "New seller"}
            <span className="text-rb-border">·</span>
            Active on ReBox
          </p>
        </div>
      </div>
      <Button href={ROUTES.profile} variant="secondary" size="sm">
        View page
      </Button>
    </div>
  );
}
