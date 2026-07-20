"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  current = 1,
  total = 1,
  basePath = "/products",
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);

  function hrefForPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <Link
        href={hrefForPage(Math.max(1, current - 1))}
        className="flex size-10 items-center justify-center rounded-xl border border-rb-border bg-white text-rb-muted hover:border-rb-red hover:text-rb-red"
      >
        ‹
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={hrefForPage(page)}
          className={[
            "flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition",
            page === current
              ? "bg-rb-red text-white"
              : "border border-rb-border bg-white text-rb-ink hover:border-rb-red",
          ].join(" ")}
        >
          {page}
        </Link>
      ))}
      {total > 5 && (
        <>
          <span className="px-1 text-rb-muted">…</span>
          <Link
            href={hrefForPage(total)}
            className="flex size-10 items-center justify-center rounded-xl border border-rb-border bg-white text-sm font-semibold"
          >
            {total}
          </Link>
        </>
      )}
      <Link
        href={hrefForPage(Math.min(total, current + 1))}
        className="flex size-10 items-center justify-center rounded-xl border border-rb-border bg-white text-rb-muted hover:border-rb-red hover:text-rb-red"
      >
        ›
      </Link>
    </nav>
  );
}
