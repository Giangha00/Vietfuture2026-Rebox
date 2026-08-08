"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function buildPageItems(current, total, siblings = 1) {
  const totalNumbers = siblings * 2 + 5;

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;

  const items = [1];

  if (showLeftDots) {
    items.push("left-ellipsis");
  } else {
    for (let page = 2; page < left; page += 1) items.push(page);
  }

  for (let page = left; page <= right; page += 1) {
    if (page !== 1 && page !== total) items.push(page);
  }

  if (showRightDots) {
    items.push("right-ellipsis");
  } else {
    for (let page = right + 1; page < total; page += 1) items.push(page);
  }

  items.push(total);

  return items;
}

export default function Pagination({ current = 1, total = 1 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total <= 1) return null;

  const safeCurrent = Math.min(Math.max(1, current), total);

  function hrefForPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const items = buildPageItems(safeCurrent, total);
  const isFirst = safeCurrent <= 1;
  const isLast = safeCurrent >= total;

  const arrowBase =
    "flex size-10 items-center justify-center rounded-xl border border-rb-border bg-white text-rb-muted transition";
  const arrowEnabled = "hover:border-rb-green hover:text-rb-green";
  const arrowDisabled = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {isFirst ? (
        <span
          aria-disabled="true"
          className={[arrowBase, arrowDisabled].join(" ")}
        >
          ‹
        </span>
      ) : (
        <Link
          href={hrefForPage(safeCurrent - 1)}
          aria-label="Previous page"
          className={[arrowBase, arrowEnabled].join(" ")}
        >
          ‹
        </Link>
      )}

      {items.map((item) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={item} className="px-1 text-rb-muted">
              …
            </span>
          );
        }

        const active = item === safeCurrent;
        return (
          <Link
            key={item}
            href={hrefForPage(item)}
            aria-current={active ? "page" : undefined}
            className={[
              "flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition",
              active
                ? "bg-rb-green text-white"
                : "border border-rb-border bg-white text-rb-ink hover:border-rb-green",
            ].join(" ")}
          >
            {item}
          </Link>
        );
      })}

      {isLast ? (
        <span
          aria-disabled="true"
          className={[arrowBase, arrowDisabled].join(" ")}
        >
          ›
        </span>
      ) : (
        <Link
          href={hrefForPage(safeCurrent + 1)}
          aria-label="Next page"
          className={[arrowBase, arrowEnabled].join(" ")}
        >
          ›
        </Link>
      )}
    </nav>
  );
}
