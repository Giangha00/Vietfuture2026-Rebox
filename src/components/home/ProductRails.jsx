import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ROUTES } from "@/lib/routes";
import { fetchBackendProducts } from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";

export async function ProductRails() {
  const backendProducts = await fetchBackendProducts().catch(() => []);
  const products = backendProducts
    .map(normalizeBackendProduct)
    .filter(Boolean);

  const forYou = products.slice(0, 4);
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  return (
    <>
      <ProductRail title="For you" products={forYou} />
      <ProductRail title="Newly listed" products={newest} />
    </>
  );
}

function ProductRail({ title, products }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-rb-ink sm:text-3xl">{title}</h2>
        <Link
          href={ROUTES.products}
          className="text-sm font-semibold text-rb-green hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="home" />
        ))}
      </div>
    </section>
  );
}
