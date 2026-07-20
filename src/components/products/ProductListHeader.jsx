"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/ui/Select";
import { buildProductsQuery, parseProductSearchParams, searchParamsToObject } from "@/lib/product-filters";

export default function ProductListHeader({ count, query }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseProductSearchParams(searchParamsToObject(searchParams));

  function onSortChange(event) {
    const queryString = buildProductsQuery(searchParamsToObject(searchParams), {
      sort: event.target.value,
      page: 1,
    });
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-rb-muted">
        Showing{" "}
        <span className="font-semibold text-rb-ink">{count} results</span>
        {query ? (
          <>
            {" "}
            for <span className="font-semibold text-rb-ink">&apos;{query}&apos;</span>
          </>
        ) : null}
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-rb-muted">Sort by</span>
        <Select
          value={current.sort}
          onChange={onSortChange}
          className="!w-auto !py-2"
          options={[
            { value: "relevance", label: "Relevance" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "newest", label: "Newest" },
          ]}
        />
      </div>
    </div>
  );
}
