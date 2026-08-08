"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatMoney } from "@/lib/money";
import { ROUTES } from "@/lib/routes";

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

export default function ProductCard({ product, variant = "default" }) {
  const href = ROUTES.product(product.id);
  const images = Array.isArray(product.images) ? product.images : [];
  const cover = images[0] || "";
  const isHome = variant === "home";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-rb-border bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link href={href} className="absolute inset-0 block">
          {cover ? (
            <Image
              src={cover}
              alt={product.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : null}
        </Link>

        {product.verified ? (
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <Badge tone="soft" icon={<Icon name="check" className="size-3" />}>
              Verified
            </Badge>
          </div>
        ) : product.condition ? (
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <Badge tone={product.condition === "Like New" || product.condition === "New" ? "green" : "orange"}>
              {product.condition}
            </Badge>
          </div>
        ) : null}

        <WishlistButton
          product={product}
          variant="overlay"
          iconClassName="size-4"
          stopPropagation
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        {isHome ? (
          <>
            <Link href={href} className="line-clamp-2 text-sm font-semibold text-rb-ink hover:text-rb-green">
              {product.title}
            </Link>
            <p className="text-base font-bold text-rb-ink">
              {formatMoney(product.price)}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-6 shrink-0 overflow-hidden rounded-full bg-rb-green-soft">
                  {product.seller?.avatar ? (
                    <Image
                      src={product.seller.avatar}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 object-cover"
                    />
                  ) : null}
                </span>
                <span className="truncate text-xs text-rb-muted">
                  {product.seller?.name || "Seller"}
                </span>
              </div>
              {product.seller?.rating ? (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-rb-ink">
                  <Icon name="star" className="size-3.5 text-amber-400" />
                  {product.seller.rating}
                </span>
              ) : (
                <span className="shrink-0 text-xs text-rb-muted">
                  {timeAgo(product.createdAt) || product.location}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-bold text-rb-green">
                {formatMoney(product.price)}
              </p>
              {product.condition ? (
                <Badge tone="soft">{product.condition}</Badge>
              ) : null}
            </div>
            {product.brand ? (
              <p className="text-xs font-medium uppercase tracking-wide text-rb-muted">
                {product.brand}
                {product.highlightSpecs?.length
                  ? ` · ${product.highlightSpecs.join(" · ")}`
                  : ""}
              </p>
            ) : null}
            <Link href={href} className="line-clamp-2 font-semibold text-rb-ink hover:text-rb-green">
              {product.title}
            </Link>
            <p className="mt-auto inline-flex items-center gap-1 text-xs text-rb-muted">
              <Icon name="mapPin" className="size-3.5" />
              <span className="truncate">
                {product.location || "Nationwide"}
                {product.createdAt ? ` · ${timeAgo(product.createdAt)}` : ""}
              </span>
            </p>
          </>
        )}
      </div>
    </article>
  );
}
