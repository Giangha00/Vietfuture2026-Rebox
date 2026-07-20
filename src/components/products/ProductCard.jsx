import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

export default function ProductCard({ product }) {
  const href = ROUTES.product(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-rb-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={href} className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone={product.condition === "Like New" ? "green" : "gray"}>
            {product.condition}
          </Badge>
          {product.premiumEscrow && <Badge tone="blue">Premium Escrow</Badge>}
        </div>
        {product.verified && (
          <div className="absolute bottom-3 right-3">
            <Badge tone="outline" icon={<Icon name="check" className="size-3" />}>
              Verified
            </Badge>
          </div>
        )}
        {product.images.length > 1 && (
          <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 flex-col gap-1 sm:flex">
            {product.images.slice(0, 3).map((src, i) => (
              <span
                key={src}
                className="relative size-10 overflow-hidden rounded-md border-2 border-white shadow"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                {i === 0 && (
                  <span className="absolute inset-0 ring-2 ring-inset ring-rb-red" />
                )}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={href} className="font-semibold text-rb-ink hover:text-rb-red">
            {product.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-rb-red">
              ${product.price.toLocaleString()}
            </p>
            {product.autoOffer && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                <Icon name="bolt" className="size-3" />
                Auto-Offer
              </span>
            )}
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-rb-muted">
            <Icon name="mapPin" className="size-3.5" />
            {product.location}
          </p>
        </div>

        {product.cta === "instant" ? (
          <Button href={href} fullWidth size="sm">
            Instant Checkout
          </Button>
        ) : (
          <Button href={href} variant="outline" fullWidth size="sm">
            View Security Details
          </Button>
        )}
      </div>
    </article>
  );
}
