"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import {
  FILTER_CONDITIONS,
  STATION_FILTERS,
  buildProductsQuery,
  parseProductSearchParams,
  searchParamsToObject,
} from "@/lib/product-filters";
import { fetchBackendCategories } from "@/lib/rebox-backend-api";

export default function SidebarFilters({ categories: initialCategories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parseProductSearchParams(searchParamsToObject(searchParams));

  const [categories, setCategories] = useState(
    initialCategories.map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean),
  );
  const [minPrice, setMinPrice] = useState(current.minPrice);
  const [maxPrice, setMaxPrice] = useState(current.maxPrice);

  useEffect(() => {
    setMinPrice(current.minPrice);
    setMaxPrice(current.maxPrice);
  }, [current.minPrice, current.maxPrice]);

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(
        initialCategories
          .map((c) => (typeof c === "string" ? c : c.name))
          .filter(Boolean),
      );
      return;
    }

    let cancelled = false;
    fetchBackendCategories()
      .then((list) => {
        if (cancelled) return;
        setCategories(
          (Array.isArray(list) ? list : [])
            .filter((c) => {
              const slug = String(c.slug || "").toLowerCase();
              const name = String(c.name || "").toLowerCase();
              return name && slug !== "more" && name !== "more";
            })
            .map((c) => c.name),
        );
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [initialCategories]);

  function pushFilters(updates) {
    const query = buildProductsQuery(searchParamsToObject(searchParams), {
      ...updates,
      page: 1,
    });
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function toggleCategory(name) {
    const next = current.categories.includes(name)
      ? current.categories.filter((item) => item !== name)
      : [...current.categories, name];

    pushFilters({ categories: next });
  }

  function applyPriceRange() {
    pushFilters({ minPrice, maxPrice });
  }

  function clearAll() {
    router.push(pathname);
  }

  const allSelected = current.categories.length === 0;

  return (
    <aside className="space-y-7 rounded-2xl border border-rb-border bg-white p-5">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          Categories
        </h3>
        <div className="space-y-2.5">
          <Checkbox
            id="cat-all"
            label="All products"
            checked={allSelected}
            onChange={() => pushFilters({ categories: [] })}
          />
          {categories.map((name) => (
            <Checkbox
              key={name}
              id={`cat-${name}`}
              label={name}
              checked={current.categories.includes(name)}
              onChange={() => toggleCategory(name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          Price range
        </h3>
        <div className="flex items-center gap-2">
          <input
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="From"
            inputMode="numeric"
            className="w-full rounded-xl border border-rb-border bg-rb-surface px-3 py-2 text-sm outline-none focus:border-rb-green"
          />
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="To"
            inputMode="numeric"
            className="w-full rounded-xl border border-rb-border bg-rb-surface px-3 py-2 text-sm outline-none focus:border-rb-green"
          />
        </div>
        <button
          type="button"
          onClick={applyPriceRange}
          className="mt-2 w-full rounded-xl bg-rb-mint px-3 py-2 text-sm font-semibold text-rb-green hover:bg-rb-green-soft"
        >
          Apply
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-rb-ink">
          Condition
        </h3>
        <div className="flex flex-wrap gap-2">
          {["New", ...FILTER_CONDITIONS].map((condition) => {
            const active = current.condition === condition;
            return (
              <button
                key={condition}
                type="button"
                onClick={() =>
                  pushFilters({ condition: active ? "" : condition })
                }
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-rb-green text-white"
                    : "border border-rb-border bg-white text-rb-muted hover:border-rb-green hover:text-rb-green",
                ].join(" ")}
              >
                {condition}
              </button>
            );
          })}
        </div>
      </div>

      <Select
        label="Location"
        value={current.station}
        onChange={(event) => pushFilters({ station: event.target.value })}
        options={[
          { value: "all", label: "Nationwide" },
          ...Object.entries(STATION_FILTERS)
            .filter(([value]) => value !== "all")
            .map(([value, label]) => ({ value, label })),
        ]}
      />

      <button
        type="button"
        onClick={clearAll}
        className="inline-flex items-center gap-2 text-sm font-semibold text-rb-danger hover:underline"
      >
        <Icon name="x" className="size-4" />
        Clear all filters
      </button>
    </aside>
  );
}
