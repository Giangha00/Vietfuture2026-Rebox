"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildProductsQuery,
  parseProductSearchParams,
  searchParamsToObject,
} from "@/lib/product-filters";

export default function ProductListHeader({ count, query }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseProductSearchParams(searchParamsToObject(searchParams));

  function setSort(sort) {
    const queryString = buildProductsQuery(searchParamsToObject(searchParams), {
      sort,
      page: 1,
    });
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const title = query
    ? `Results for “${query}”`
    : current.categories.length === 1
      ? `Results for ${current.categories[0]}`
      : "Results for all products";

  return (
    <div className="mb-6 space-y-4">
      <h1 className="text-2xl font-bold text-rb-green sm:text-3xl">{title}</h1>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-rb-muted">
          Showing{" "}
          <span className="font-semibold text-rb-ink">
            {count.toLocaleString()} products
          </span>
        </p>
        <div className="inline-flex rounded-xl border border-rb-border bg-white p-1 text-sm">
          {[
            { value: "newest", label: "Newest" },
            { value: "price-asc", label: "Lowest price" },
          ].map((opt) => {
            const active =
              current.sort === opt.value ||
              (opt.value === "newest" &&
                (current.sort === "relevance" || !current.sort));
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value)}
                className={[
                  "rounded-lg px-4 py-2 font-medium transition",
                  active
                    ? "bg-rb-green text-white"
                    : "text-rb-muted hover:text-rb-ink",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
