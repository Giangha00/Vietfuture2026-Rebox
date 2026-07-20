"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountStatsCard, {
  SecurityBadgesCard,
} from "@/components/profile/AccountStatsCard";
import ContentTabs from "@/components/profile/ContentTabs";
import ListingGrid from "@/components/profile/ListingGrid";
import { useAuth } from "@/context/AuthContext";
import { loginWithRedirect } from "@/lib/routes";
import { fetchBackendProducts } from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";

export default function ProfilePageContent() {
  const router = useRouter();
  const { ready, user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(loginWithRedirect("/profile"));
    }
  }, [isAuthenticated, ready, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !user?.id) return;

    let cancelled = false;
    (async () => {
      const rawProducts = await fetchBackendProducts();
      const normalized = rawProducts
        .map(normalizeBackendProduct)
        .filter(Boolean);
      const mine = normalized.filter((p) => p.seller?.id === user.id);
      if (!cancelled) setListings(mine);
    })().catch(() => {
      if (!cancelled) setListings([]);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, ready, user?.id]);

  if (!ready || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6 lg:px-8">
        Đang tải hồ sơ...
      </div>
    );
  }

  return (
    <>
      <ProfileHeader user={user} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-4">
          <AccountStatsCard user={user} />
          <SecurityBadgesCard badges={user.badges} />
        </aside>
        <div>
          <ContentTabs />
          <ListingGrid listings={listings} />
        </div>
      </div>
    </>
  );
}
