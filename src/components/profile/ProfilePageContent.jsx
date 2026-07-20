"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountStatsCard, {
  SecurityBadgesCard,
} from "@/components/profile/AccountStatsCard";
import ContentTabs from "@/components/profile/ContentTabs";
import ListingGrid from "@/components/profile/ListingGrid";
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LISTINGS } from "@/lib/mock-data";
import { loginWithRedirect } from "@/lib/routes";

export default function ProfilePageContent() {
  const router = useRouter();
  const { ready, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(loginWithRedirect("/profile"));
    }
  }, [isAuthenticated, ready, router]);

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
          <ListingGrid listings={PROFILE_LISTINGS} />
        </div>
      </div>
    </>
  );
}
