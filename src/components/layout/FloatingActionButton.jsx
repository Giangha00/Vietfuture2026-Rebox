"use client";

import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function FloatingActionButton() {
  return (
    <AuthGateButton
      href={ROUTES.postItem}
      reason={LOGIN_REASONS.sell}
      aria-label="Post item"
      className="fixed bottom-6 right-6 z-50 !size-14 !rounded-full !p-0 shadow-lg shadow-rb-green/30 hover:scale-105"
    >
      <Icon name="plus" className="size-6" />
    </AuthGateButton>
  );
}
