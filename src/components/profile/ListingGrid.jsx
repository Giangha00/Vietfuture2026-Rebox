import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { formatMoney } from "@/lib/money";
import { ROUTES } from "@/lib/routes";

function moderationBadge(listing) {
  switch (listing.moderationStatus) {
    case "approved":
      return null;
    case "rejected":
      return <Badge tone="danger">Rejected</Badge>;
    default:
      return <Badge tone="gray">Pending</Badge>;
  }
}

function timeAgo(value) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ListingCard({ listing, busyId, onDelete }) {
  const inEscrow = listing.status === "escrow";
  const isBusy = busyId === listing.id;
  const canManage = !inEscrow;
  const conditionTone =
    listing.condition === "Like New" || listing.condition === "New"
      ? "green"
      : "orange";

  return (
    <article className="overflow-hidden rounded-2xl border border-rb-border bg-white transition hover:shadow-md">
      <div className="relative aspect-square">
        {listing.image ? (
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-stone-100 text-rb-muted">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {listing.condition ? (
            <Badge tone={conditionTone}>{listing.condition}</Badge>
          ) : null}
          {moderationBadge(listing)}
        </div>
        {inEscrow ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-rb-ink/55 text-white">
            <Icon name="lock" className="mb-2 size-6" />
            <Badge tone="blue">In Escrow</Badge>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-lg font-bold text-rb-ink">
          {formatMoney(listing.price)}
        </p>
        <h3 className="line-clamp-2 font-semibold text-rb-ink">{listing.title}</h3>
        <p className="inline-flex items-center gap-1 text-xs text-rb-muted">
          <Icon name="mapPin" className="size-3.5" />
          {listing.location || "Nationwide"}
          {listing.createdAt ? ` · ${timeAgo(listing.createdAt)}` : ""}
        </p>
        {listing.moderationStatus === "pending" ? (
          <p className="text-xs text-amber-700">Waiting for admin approval.</p>
        ) : null}
        {listing.moderationStatus === "rejected" ? (
          <p className="text-xs text-red-700">
            Rejected: {listing.rejectionReason || "No reason provided."} This
            product will not be listed — create a new listing to sell again.
          </p>
        ) : null}
        {canManage ? (
          <div className="flex gap-2 pt-1">
            {listing.moderationStatus === "rejected" ? (
              <Button
                href={ROUTES.postItem}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={isBusy}
              >
                List new item
              </Button>
            ) : (
              <Button
                href={ROUTES.editListing(listing.id)}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={isBusy}
              >
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              disabled={isBusy}
              onClick={() => onDelete?.(listing.id)}
            >
              {isBusy ? "..." : "Delete"}
            </Button>
          </div>
        ) : null}
        {listing.moderationStatus === "approved" ? (
          <Link
            href={ROUTES.product(listing.id)}
            className="inline-block text-sm font-semibold text-rb-green hover:underline"
          >
            View listing →
          </Link>
        ) : null}
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
      className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-rb-border bg-rb-surface p-6 text-center transition hover:border-rb-green hover:bg-rb-green-soft"
    >
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-rb-green shadow-sm">
        <Icon name="plus" className="size-6" />
      </span>
      <p className="font-semibold text-rb-ink">List new item</p>
      <p className="mt-1 text-xs text-rb-muted">Submitted listings need admin review</p>
    </AuthGateButton>
  );
}

export default function ListingGrid({ listings, busyId, onDelete }) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-rb-ink">Products for sale</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Icon name="search" className="size-4" />
            Filter
          </Button>
          <Button variant="secondary" size="sm">
            Newest
          </Button>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id + listing.moderationStatus}
            listing={listing}
            busyId={busyId}
            onDelete={onDelete}
          />
        ))}
        <AddItemCard />
      </div>
      {listings.length > 0 ? (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary">Load more products</Button>
        </div>
      ) : null}
    </div>
  );
}
