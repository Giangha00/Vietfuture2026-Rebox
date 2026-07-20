import { Suspense } from "react";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

export const metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6 lg:px-8">
          Đang tải hồ sơ...
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
