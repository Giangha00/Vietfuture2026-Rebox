"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function ContentTabs({ listingCount = 0 }) {
  const params = useSearchParams();
  const active = params.get("tab") || "for-sale";

  const TABS = [
    { id: "for-sale", label: `For sale (${listingCount})` },
    { id: "sold", label: "Sold" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-rb-border">
      {TABS.map((tab) => {
        const isActive = active === tab.id || (active === "listings" && tab.id === "for-sale");
        return (
          <Link
            key={tab.id}
            href={ROUTES.profileTab(tab.id)}
            className={[
              "whitespace-nowrap px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "border-b-2 border-rb-green text-rb-green"
                : "text-rb-muted hover:text-rb-ink",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
