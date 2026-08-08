"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useWishlist } from "@/context/WishlistContext";
import { ROUTES } from "@/lib/routes";

export default function WishlistNavButton() {
  const { count, ready } = useWishlist();

  return (
    <Link
      href={ROUTES.wishlist}
      className="relative flex size-9 items-center justify-center rounded-full text-rb-muted transition hover:bg-rb-green-soft hover:text-rb-green"
      aria-label={ready && count > 0 ? `Wishlist, ${count} items` : "Wishlist"}
    >
      <Icon name="heart" className="size-4" filled={ready && count > 0} />
      {ready && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-rb-green px-1 text-[10px] font-bold leading-4 text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
