import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import SellerCard, { InstantBargain } from "@/components/product-detail/SellerCard";
import ProductActions from "@/components/product-detail/ProductActions";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-rb-ink">
          {product.title}
        </h1>
        <button
          type="button"
          className="rounded-full border border-rb-border p-2 text-rb-muted hover:text-rb-red"
          aria-label="Save"
        >
          <Icon name="heart" className="size-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-3xl font-bold text-rb-red">
          ${product.price.toFixed(2)}
        </p>
        {product.originalPrice && (
          <>
            <p className="text-lg text-rb-muted line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
            <Badge tone="soft">{product.discount}% OFF</Badge>
          </>
        )}
      </div>

      <SellerCard seller={product.seller} />
      <InstantBargain price={product.price} />

      <ProductActions product={product} />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-rb-border bg-white p-4">
          <Icon name="box" className="mb-2 size-5 text-rb-red" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">
            Required ReBox
          </p>
          <p className="font-semibold text-rb-ink">{product.boxSize}</p>
        </div>
        <div className="rounded-2xl border border-rb-border bg-white p-4">
          <Icon name="check" className="mb-2 size-5 text-emerald-600" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-rb-muted">
            Condition
          </p>
          <p className="font-semibold text-rb-ink">{product.conditionGrade}</p>
          <p className="text-xs text-rb-muted">AI-graded</p>
        </div>
      </div>

      <div className="rounded-2xl border border-rb-red/20 bg-rb-red-soft p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-rb-ink">Nearest ReBox Station</p>
            <p className="mt-1 text-sm text-rb-muted">{product.station}</p>
          </div>
          <button type="button" className="text-sm font-semibold text-rb-red">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
