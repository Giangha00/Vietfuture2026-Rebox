import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import SellerCard from "@/components/product-detail/SellerCard";
import ProductActions from "@/components/product-detail/ProductActions";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatMoney } from "@/lib/money";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-rb-ink sm:text-3xl">
          {product.title}
        </h1>
        <WishlistButton product={product} variant="ghost" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {product.brand ? <Badge tone="soft">{product.brand}</Badge> : null}
        <Badge tone="soft">Condition: {product.condition}</Badge>
        {product.category ? <Badge tone="soft">{product.category}</Badge> : null}
        {product.location ? (
          <span className="inline-flex items-center gap-1 text-sm text-rb-muted">
            <Icon name="mapPin" className="size-4" />
            {product.location}
          </span>
        ) : null}
      </div>

      <p className="text-3xl font-bold text-rb-green">
        {formatMoney(product.price)}
      </p>

      <ProductActions product={product} />

      <div className="rounded-2xl bg-rb-green-soft p-4">
        <div className="flex gap-3">
          <Icon name="shield" className="size-5 shrink-0 text-rb-green" />
          <div>
            <p className="font-semibold text-rb-ink">Buyer protection</p>
            <p className="mt-1 text-sm text-rb-muted">
              Get a refund if the item doesn&apos;t match the listing description.
            </p>
          </div>
        </div>
      </div>

      <SellerCard seller={product.seller} />

      <div className="rounded-2xl border border-rb-border bg-white p-4">
        <h3 className="mb-3 font-bold text-rb-ink">Specs & condition</h3>
        <ul className="space-y-2.5 text-sm">
          {(product.specs || []).map((spec) => (
            <li key={spec.label} className="flex justify-between gap-4">
              <span className="text-rb-muted">{spec.label}</span>
              <span className="text-right font-medium text-rb-ink">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
