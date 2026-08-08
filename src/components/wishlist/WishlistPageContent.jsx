"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Icon from "@/components/ui/Icon";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_REASONS } from "@/lib/auth";
import { formatMoney } from "@/lib/money";
import { ROUTES } from "@/lib/routes";
import { backendNotifyCartAdd } from "@/lib/rebox-backend-api";

export default function WishlistPageContent() {
  const { ready, items, count, removeItem, clearWishlist } = useWishlist();
  const { addItem, isInCart } = useCart();
  const { requireAuth, user, token } = useAuth();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6 lg:px-8">
        Loading wishlist...
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-rb-green-soft text-rb-green">
          <Icon name="heart" className="size-6" />
        </div>
        <h1 className="text-2xl font-bold text-rb-ink">Wishlist</h1>
        <p className="mt-3 text-rb-muted">
          Saved items will appear here. Browse the marketplace and tap the heart
          to save products you like.
        </p>
        <Button href={ROUTES.products} className="mt-8">
          Explore products
        </Button>
        <p className="mt-4 text-sm">
          <Link href={ROUTES.home} className="text-rb-green hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rb-ink sm:text-3xl">Wishlist</h1>
          <p className="mt-1 text-sm text-rb-muted">
            {count} saved item{count === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href={ROUTES.products} variant="outline" size="sm">
            Keep browsing
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setConfirmClear(true)}
          >
            Clear all
          </Button>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const inCart = isInCart(item.id);
          const isOwn = user?.id && item.seller?.id === user.id;
          const cover = item.image || item.images?.[0] || "";

          return (
            <li
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-rb-border bg-white"
            >
              <Link
                href={ROUTES.product(item.id)}
                className="relative aspect-[4/3] overflow-hidden bg-stone-100"
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
                {item.condition ? (
                  <div className="absolute left-3 top-3">
                    <Badge tone="soft">{item.condition}</Badge>
                  </div>
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <Link
                    href={ROUTES.product(item.id)}
                    className="line-clamp-2 font-semibold text-rb-ink hover:text-rb-green"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-lg font-bold text-rb-green">
                    {formatMoney(item.price)}
                  </p>
                  {item.location ? (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-rb-muted">
                      <Icon name="mapPin" className="size-3.5" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  ) : null}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={inCart ? "secondary" : "outline"}
                    size="sm"
                    disabled={Boolean(isOwn)}
                    onClick={() => {
                      requireAuth(
                        () => {
                          if (isOwn) return;
                          const result = addItem(item);
                          if (result.added && token) {
                            backendNotifyCartAdd({
                              token,
                              productId: item.id,
                              productTitle: item.title,
                            }).catch(() => {});
                          }
                        },
                        LOGIN_REASONS.buy,
                        ROUTES.order,
                      );
                    }}
                  >
                    <Icon name="cart" className="size-4" />
                    {inCart ? "In cart" : "Add to cart"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Icon name="x" className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear wishlist?"
        description="Remove all saved items from your wishlist."
        confirmLabel="Clear all"
        tone="danger"
        onConfirm={() => {
          clearWishlist();
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
