import { Suspense } from "react";
import SearchSection from "@/components/products/SearchSection";
import SidebarFilters from "@/components/products/SidebarFilters";
import ProductListHeader from "@/components/products/ProductListHeader";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import { PRODUCTS } from "@/lib/mock-data";
import { filterProducts, parseProductSearchParams } from "@/lib/product-filters";

export const metadata = {
  title: "Products",
  description: "Browse escrow-protected second-hand goods on ReBox.",
};

const PER_PAGE = 6;

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const parsed = parseProductSearchParams(params);
  const filtered = filterProducts(PRODUCTS, params);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(parsed.page, totalPages);
  const start = (page - 1) * PER_PAGE;
  const pageProducts = filtered.slice(start, start + PER_PAGE);

  return (
    <>
      <Suspense fallback={<div className="h-40 border-b border-rb-border bg-white" />}>
        <SearchSection initialQuery={parsed.q} />
      </Suspense>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Suspense fallback={<div className="h-96 rounded-2xl border border-rb-border bg-white" />}>
          <SidebarFilters />
        </Suspense>
        <div>
          <Suspense fallback={<div className="mb-5 h-10" />}>
            <ProductListHeader count={filtered.length} query={parsed.q} />
          </Suspense>
          {pageProducts.length > 0 ? (
            <ProductGrid products={pageProducts} />
          ) : (
            <div className="rounded-2xl border border-dashed border-rb-border bg-rb-pink/30 px-6 py-16 text-center">
              <p className="font-semibold text-rb-ink">No products match your filters</p>
              <p className="mt-2 text-sm text-rb-muted">
                Try adjusting category, condition, or price range.
              </p>
            </div>
          )}
          <Pagination current={page} total={totalPages} />
        </div>
      </div>
    </>
  );
}
