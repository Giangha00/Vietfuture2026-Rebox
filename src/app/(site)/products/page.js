import { Suspense } from "react";
import SidebarFilters from "@/components/products/SidebarFilters";
import ProductListHeader from "@/components/products/ProductListHeader";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import { filterProducts, parseProductSearchParams } from "@/lib/product-filters";
import {
  fetchBackendCategories,
  fetchBackendProducts,
} from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";

export const metadata = {
  title: "Products",
  description: "Browse second-hand goods on ReBox.",
};

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const parsed = parseProductSearchParams(params);
  const [backendProducts, backendCategories] = await Promise.all([
    fetchBackendProducts(),
    fetchBackendCategories().catch(() => []),
  ]);
  const normalizedProducts = backendProducts
    .map(normalizeBackendProduct)
    .filter(Boolean);
  const filtered = filterProducts(normalizedProducts, params);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(parsed.page, totalPages);
  const start = (page - 1) * PER_PAGE;
  const pageProducts = filtered.slice(start, start + PER_PAGE);
  const categoryNames = (Array.isArray(backendCategories) ? backendCategories : [])
    .filter((c) => {
      const slug = String(c.slug || "").toLowerCase();
      const name = String(c.name || "").toLowerCase();
      return slug !== "more" && name !== "more";
    })
    .map((c) => c.name)
    .filter(Boolean);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <Suspense fallback={<div className="h-96 rounded-2xl border border-rb-border bg-white" />}>
        <SidebarFilters categories={categoryNames} />
      </Suspense>
      <div>
        <Suspense fallback={<div className="mb-5 h-10" />}>
          <ProductListHeader count={filtered.length} query={parsed.q} />
        </Suspense>
        {pageProducts.length > 0 ? (
          <ProductGrid products={pageProducts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-rb-border bg-rb-surface px-6 py-16 text-center">
            <p className="font-semibold text-rb-ink">No products match your filters</p>
            <p className="mt-2 text-sm text-rb-muted">
              Try adjusting category, condition, or price range.
            </p>
          </div>
        )}
        <Pagination current={page} total={totalPages} />
      </div>
    </div>
  );
}
