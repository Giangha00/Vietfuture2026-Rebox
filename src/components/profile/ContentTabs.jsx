"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const TABS = [
  { id: "listings", label: "My Listings" },
  { id: "purchases", label: "Purchase History" },
  { id: "saved", label: "Saved Items" },
  { id: "settings", label: "Settings" },
];

export default function ContentTabs() {
  const params = useSearchParams();
  const active = params.get("tab") || "listings";

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-rb-border">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={ROUTES.profileTab(tab.id)}
            className={[
              "whitespace-nowrap px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "border-b-2 border-rb-red text-rb-red"
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
