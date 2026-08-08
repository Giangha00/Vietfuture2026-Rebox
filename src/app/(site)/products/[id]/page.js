import Link from "next/link";
import ImageGallery from "@/components/product-detail/ImageGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductCard from "@/components/products/ProductCard";
import Icon from "@/components/ui/Icon";
import { notFound } from "next/navigation";
import {
  fetchBackendProductById,
  fetchBackendProducts,
} from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const raw = await fetchBackendProductById(id);
    const product = normalizeBackendProduct(raw);
    if (!product) return {};
    return { title: product.title, description: product.description };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let rawProduct = null;
  try {
    rawProduct = await fetchBackendProductById(id);
  } catch {
    return notFound();
  }

  const product = normalizeBackendProduct(rawProduct);
  if (!product) return notFound();

  const all = await fetchBackendProducts().catch(() => []);
  const similar = all
    .map(normalizeBackendProduct)
    .filter((p) => p && p.id !== product.id)
    .filter((p) => !product.category || p.category === product.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-rb-muted">
        <Link href={ROUTES.home} className="hover:text-rb-green">
          Home
        </Link>
        <span>›</span>
        <Link href={ROUTES.products} className="hover:text-rb-green">
          {product.category || "Products"}
        </Link>
        <span>›</span>
        <span className="truncate text-rb-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery
          images={product.images}
          title={product.title}
          verified={product.verified}
        />
        <ProductInfo product={product} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-bold text-rb-ink">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-rb-muted">
              {product.description || "No description provided."}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-rb-ink">Ships from</h2>
            <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-rb-border bg-rb-surface">
              <div className="text-center text-rb-muted">
                <Icon name="mapPin" className="mx-auto mb-2 size-8 text-rb-green" />
                <p className="text-sm font-medium text-rb-ink">
                  {product.location || "Location shared after chat"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {similar.length > 0 ? (
          <aside>
            <h2 className="mb-4 text-xl font-bold text-rb-ink">Similar products</h2>
            <div className="space-y-4">
              {similar.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
