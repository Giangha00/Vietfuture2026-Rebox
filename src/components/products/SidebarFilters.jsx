"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import {
  FILTER_CATEGORIES,
  FILTER_CONDITIONS,
  STATION_FILTERS,
  buildProductsQuery,
  parseProductSearchParams,
  searchParamsToObject,
} from "@/lib/product-filters";

export default function SidebarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseProductSearchParams(searchParamsToObject(searchParams));

  const [minPrice, setMinPrice] = useState(current.minPrice);
  const [maxPrice, setMaxPrice] = useState(current.maxPrice);

  useEffect(() => {
    setMinPrice(current.minPrice);
    setMaxPrice(current.maxPrice);
  }, [current.minPrice, current.maxPrice]);

  function pushFilters(updates) {
    const query = buildProductsQuery(searchParamsToObject(searchParams), {
      ...updates,
      page: 1,
    });
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function toggleCategory(name) {
    let next;

    if (current.categories.length === 0) {
      next = FILTER_CATEGORIES.filter((item) => item !== name);
    } else if (current.categories.includes(name)) {
      next = current.categories.filter((item) => item !== name);
    } else {
      next = [...current.categories, name];
    }

    if (next.length === FILTER_CATEGORIES.length) {
      next = [];
    }

    pushFilters({ categories: next });
  }

  function applyPriceRange() {
    pushFilters({ minPrice, maxPrice });
  }

  return (
    <aside className="space-y-8 rounded-2xl border border-rb-border bg-white p-5">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          Category
        </h3>
        <div className="space-y-2.5">
          {FILTER_CATEGORIES.map((name) => (
            <Checkbox
              key={name}
              id={`cat-${name}`}
              label={name}
              checked={
                current.categories.length === 0
                  ? true
                  : current.categories.includes(name)
              }
              onChange={() => toggleCategory(name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          AI Condition Grade
        </h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => pushFilters({ condition: "" })}
            className={[
              "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
              !current.condition
                ? "bg-rb-red-soft text-rb-red"
                : "bg-stone-50 text-rb-muted hover:bg-rb-pink",
            ].join(" ")}
          >
            All conditions
          </button>
          {FILTER_CONDITIONS.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => pushFilters({ condition })}
              className={[
                "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                current.condition === condition
                  ? "bg-rb-red-soft text-rb-red"
                  : "bg-stone-50 text-rb-muted hover:bg-rb-pink",
              ].join(" ")}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            onBlur={applyPriceRange}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyPriceRange();
            }}
            placeholder="Min"
            inputMode="numeric"
            className="w-full rounded-xl border border-rb-border px-3 py-2 text-sm outline-none focus:border-rb-red"
          />
          <span className="text-rb-muted">—</span>
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            onBlur={applyPriceRange}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyPriceRange();
            }}
            placeholder="Max"
            inputMode="numeric"
            className="w-full rounded-xl border border-rb-border px-3 py-2 text-sm outline-none focus:border-rb-red"
          />
        </div>
      </div>

      <Select
        label="ReBox Station"
        value={current.station}
        onChange={(event) => pushFilters({ station: event.target.value })}
        options={Object.entries(STATION_FILTERS).map(([value, label]) => ({
          value,
          label,
        }))}
      />
    </aside>
  );
}
