import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export function ListingCard({ listing }) {
  const inEscrow = listing.status === "escrow";
  const autoReleaseHours =
    typeof listing.autoReleaseHours === "number"
      ? listing.autoReleaseHours
      : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-rb-border bg-white">
      <div className="relative aspect-[4/3]">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {inEscrow ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-rb-ink/55 text-white">
            <Icon name="lock" className="mb-2 size-6" />
            <Badge tone="blue">In Escrow</Badge>
          </div>
        ) : (
          <div className="absolute left-3 top-3">
            <Badge tone="green">Active</Badge>
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold text-rb-ink">{listing.title}</h3>
          <p className="text-lg font-bold text-rb-red">
            ${listing.price.toFixed(2)}
          </p>
          {!inEscrow && (
            <p className="text-xs text-rb-muted">{listing.offers} offers</p>
          )}
        </div>
        {inEscrow ? (
          <div>
            <div className="mb-1 flex justify-between text-xs text-rb-muted">
              <span>Auto-release</span>
              <span>
                {autoReleaseHours !== null ? `${autoReleaseHours}h left` : "—"}
              </span>
            </div>
            <div className="mb-3 h-1.5 rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{
                  width:
                    autoReleaseHours !== null
                      ? `${Math.max(10, 100 - autoReleaseHours * 2)}%`
                      : "30%",
                }}
              />
            </div>
            <Link
              href={ROUTES.product(listing.id)}
              className="text-sm font-semibold text-rb-red hover:underline"
            >
              View Unboxing Evidence →
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Manage
            </Button>
            <Button size="sm" className="flex-1">
              Promote
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export function AddItemCard() {
  return (
    <AuthGateButton
      href={ROUTES.postItem}
      reason={LOGIN_REASONS.sell}
      variant="ghost"
      className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-rb-border bg-rb-pink/40 p-6 text-center transition hover:border-rb-red hover:bg-rb-red-soft"
    >
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-rb-red shadow-sm">
        <Icon name="plus" className="size-6" />
      </span>
      <p className="font-semibold text-rb-ink">List New Item</p>
      <p className="mt-1 text-xs text-rb-muted">3 listing slots available</p>
    </AuthGateButton>
  );
}

export default function ListingGrid({ listings }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id + listing.status} listing={listing} />
      ))}
      <AddItemCard />
    </div>
  );
}
