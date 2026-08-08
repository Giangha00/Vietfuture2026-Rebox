"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ContentTabs from "@/components/profile/ContentTabs";
import ListingGrid from "@/components/profile/ListingGrid";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { isNeedsVerificationError } from "@/lib/auth";
import { loginWithRedirect } from "@/lib/routes";
import {
  backendDeleteProduct,
  fetchMyBackendProducts,
} from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";

export default function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "for-sale";
  const {
    ready,
    user,
    token,
    isAuthenticated,
    isEmailVerified,
    handleAuthError,
  } = useAuth();
  const [listings, setListings] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(loginWithRedirect("/profile"));
    }
  }, [isAuthenticated, ready, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !token) return;
    // Unverified users can still view profile; listings API requires verification.
    if (!isEmailVerified) {
      setListings([]);
      return;
    }

    let cancelled = false;
    (async () => {
      const rawProducts = await fetchMyBackendProducts(token);
      const normalized = rawProducts
        .map(normalizeBackendProduct)
        .filter(Boolean);
      if (!cancelled) setListings(normalized);
    })().catch((error) => {
      if (cancelled) return;
      if (isNeedsVerificationError(error)) {
        setListings([]);
        return;
      }
      setListings([]);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isEmailVerified, ready, token]);

  function requestDelete(id) {
    const listing = listings.find((item) => item.id === id) || { id };
    setDeleteError("");
    setDeleteTarget(listing);
  }

  async function confirmDelete() {
    if (!token || !deleteTarget?.id) return;
    setBusyId(deleteTarget.id);
    setDeleteError("");
    try {
      await backendDeleteProduct({ token, id: deleteTarget.id });
      setListings((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (error) {
      if (handleAuthError(error, { redirect: "/profile" })) return;
      setDeleteError(error?.message || "Could not delete listing.");
    } finally {
      setBusyId(null);
    }
  }

  if (!ready || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6 lg:px-8">
        Loading profile...
      </div>
    );
  }

  const activeListings = listings.filter((l) => l.status !== "escrow");

  return (
    <>
      <ProfileHeader user={user} listingCount={activeListings.length} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentTabs listingCount={activeListings.length} />
        {tab === "sold" ? (
          <div className="rounded-2xl border border-dashed border-rb-border bg-rb-surface px-6 py-16 text-center">
            <p className="font-semibold text-rb-ink">No sold items yet</p>
            <p className="mt-2 text-sm text-rb-muted">
              Completed sales will show up here.
            </p>
          </div>
        ) : tab === "reviews" ? (
          <div className="rounded-2xl border border-dashed border-rb-border bg-rb-surface px-6 py-16 text-center">
            <p className="font-semibold text-rb-ink">No reviews yet</p>
            <p className="mt-2 text-sm text-rb-muted">
              Buyer and seller reviews will appear here.
            </p>
          </div>
        ) : (
          <ListingGrid
            listings={listings}
            busyId={busyId}
            onDelete={requestDelete}
          />
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (busyId) return;
          setDeleteTarget(null);
          setDeleteError("");
        }}
        title="Delete this listing?"
        description={
          deleteError ||
          `Permanently delete “${deleteTarget?.title || "this listing"}”. This cannot be undone.`
        }
        confirmLabel="Delete listing"
        tone="danger"
        loading={Boolean(busyId)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
