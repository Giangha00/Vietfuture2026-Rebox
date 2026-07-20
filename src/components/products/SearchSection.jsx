"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { buildProductsQuery, searchParamsToObject } from "@/lib/product-filters";
import { ROUTES } from "@/lib/routes";

const QUICK = [
  { id: "escrow", label: "Escrow Only" },
  { id: "nearby", label: "Within 5km" },
  { id: "budget", label: "Under $200" },
];

export default function SearchSection({ initialQuery = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const filters = searchParams.getAll("filter");
    setActive(filters);
  }, [searchParams]);

  function onSearch(event) {
    event.preventDefault();
    const queryString = buildProductsQuery(searchParamsToObject(searchParams), {
      q: query,
      filters: active,
      page: 1,
    });
    router.push(queryString ? `${ROUTES.products}?${queryString}` : ROUTES.products);
  }

  function toggle(id) {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <section className="border-b border-rb-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-rb-ink sm:text-4xl">
          Find your next secure deal.
        </h1>
        <form onSubmit={onSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rb-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sneakers, electronics..."
              className="h-14 w-full rounded-2xl border border-rb-border bg-rb-pink/40 pl-12 pr-4 text-sm outline-none focus:border-rb-red focus:ring-2 focus:ring-rb-red/15"
            />
          </div>
          <Button type="submit" size="xl" className="!rounded-2xl sm:min-w-36">
            Search
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK.map((chip) => {
            const on = active.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggle(chip.id)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
                  on
                    ? "bg-rb-blue-soft text-sky-900"
                    : "border border-rb-border bg-white text-rb-muted hover:border-rb-red/40",
                ].join(" ")}
              >
                {on && <Icon name="check" className="size-3.5" />}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
