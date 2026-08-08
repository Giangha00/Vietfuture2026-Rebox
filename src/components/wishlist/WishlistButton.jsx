"use client";

import Icon from "@/components/ui/Icon";
import { useWishlist } from "@/context/WishlistContext";

const VARIANTS = {
  overlay:
    "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white",
  ghost:
    "rounded-full border border-rb-border p-2 transition hover:border-rb-green",
  plain: "inline-flex items-center justify-center transition",
};

export default function WishlistButton({
  product,
  variant = "ghost",
  className = "",
  iconClassName = "size-5",
  stopPropagation = false,
}) {
  const { ready, isSaved, toggleItem } = useWishlist();
  const saved = ready && isSaved(product?.id);

  return (
    <button
      type="button"
      className={[
        VARIANTS[variant] || VARIANTS.ghost,
        saved ? "text-red-500" : "text-rb-muted hover:text-rb-green",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      onClick={(event) => {
        if (stopPropagation) {
          event.preventDefault();
          event.stopPropagation();
        }
        toggleItem(product);
      }}
    >
      <Icon
        name="heart"
        className={iconClassName}
        filled={saved}
      />
    </button>
  );
}
