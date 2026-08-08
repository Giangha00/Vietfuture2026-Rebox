"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/money";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import {
  backendAcceptOffer,
  backendFetchSellingOffers,
  backendRejectOffer,
} from "@/lib/rebox-backend-api";

const STATUS_LABEL = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
  expired: "Expired",
};

export default function SellingOffersContent() {
  const router = useRouter();
  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    token,
    handleAuthError,
    requireVerified,
  } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await backendFetchSellingOffers(token);
      setOffers(list);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.sellingOffers })) return;
      setError(err?.message || "Could not load offers.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, token]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.sellingOffers));
      return;
    }
    requireVerified(ROUTES.sellingOffers);
  }, [isAuthenticated, ready, requireVerified, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !isEmailVerified || !token) return;
    load();
  }, [isAuthenticated, isEmailVerified, load, ready, token]);

  async function acceptOffer() {
    if (!confirm?.offer?.id) return;
    setBusy(true);
    setError("");
    try {
      await backendAcceptOffer({ token, id: confirm.offer.id });
      setConfirm(null);
      await load();
    } catch (err) {
      setError(err?.message || "Could not accept offer.");
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  }

  async function rejectOffer(reason) {
    if (!confirm?.offer?.id) return;
    setBusy(true);
    setError("");
    try {
      await backendRejectOffer({
        token,
        id: confirm.offer.id,
        reason: reason || "",
      });
      setConfirm(null);
      await load();
    } catch (err) {
      setError(err?.message || "Could not reject offer.");
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted">
        Loading...
      </div>
    );
  }

  const activeOffer = confirm?.offer;
  const productTitle =
    activeOffer?.product?.title || activeOffer?.product?.name || "this item";
  const buyerName = activeOffer?.buyer?.fullName || "this buyer";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-3xl font-bold text-rb-ink">
            Selling offers
          </h1>
          <p className="mt-1 text-sm text-rb-muted">
            Accept agrees the price with that buyer. The listing stays open until
            someone checks out and pays.
          </p>
        </div>
        <Button href={ROUTES.offers} variant="outline" size="sm">
          My offers
        </Button>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-rb-muted">Loading...</p>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rb-border bg-white px-6 py-16 text-center">
          <p className="font-semibold text-rb-ink">No offers on your listings</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {offers.map((offer) => {
            const product = offer.product || {};
            const productId = product._id || product.id || offer.product;
            const buyer = offer.buyer || {};
            return (
              <li
                key={offer.id}
                className="rounded-2xl border border-rb-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={ROUTES.product(productId)}
                      className="font-semibold text-rb-ink hover:text-rb-green"
                    >
                      {product.title || "Product"}
                    </Link>
                    <p className="mt-1 text-sm text-rb-muted">
                      {buyer.fullName || "Buyer"} · −{offer.discountPercent}% ·{" "}
                      {formatMoney(offer.offerPrice)} (list{" "}
                      {formatMoney(offer.listPrice)})
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      {STATUS_LABEL[offer.status] || offer.status}
                    </p>
                  </div>
                  {offer.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => setConfirm({ type: "accept", offer })}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setConfirm({ type: "reject", offer })}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={confirm?.type === "accept"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Accept this offer?"
        description={`Agree to sell “${productTitle}” to ${buyerName} for ${formatMoney(activeOffer?.offerPrice)} (−${activeOffer?.discountPercent}%). The listing stays open until someone checks out.`}
        confirmLabel="Accept offer"
        loading={busy}
        onConfirm={acceptOffer}
      />

      <ConfirmModal
        open={confirm?.type === "reject"}
        onClose={() => {
          if (busy) return;
          setConfirm(null);
        }}
        title="Reject this offer?"
        description={`Decline the −${activeOffer?.discountPercent}% offer from ${buyerName} on “${productTitle}”.`}
        confirmLabel="Reject offer"
        tone="danger"
        loading={busy}
        reasonLabel="Reason (optional)"
        reasonPlaceholder="Tell the buyer why…"
        onConfirm={rejectOffer}
      />
    </div>
  );
}
