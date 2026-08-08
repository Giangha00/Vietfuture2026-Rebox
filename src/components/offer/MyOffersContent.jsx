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
  backendCancelOffer,
  backendFetchMyOffers,
} from "@/lib/rebox-backend-api";

const STATUS_LABEL = {
  pending: "Waiting for seller",
  accepted: "Accepted — checkout (item still listed until paid)",
  rejected: "Rejected",
  cancelled: "Cancelled",
  expired: "Expired",
};

export default function MyOffersContent() {
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
  const [confirmOffer, setConfirmOffer] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await backendFetchMyOffers(token);
      setOffers(list);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.offers })) return;
      setError(err?.message || "Could not load offers.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, token]);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(loginWithRedirect(ROUTES.offers));
      return;
    }
    requireVerified(ROUTES.offers);
  }, [isAuthenticated, ready, requireVerified, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !isEmailVerified || !token) return;
    load();
  }, [isAuthenticated, isEmailVerified, load, ready, token]);

  async function cancelOffer() {
    if (!confirmOffer?.id) return;
    setBusy(true);
    setError("");
    try {
      await backendCancelOffer({ token, id: confirmOffer.id });
      setConfirmOffer(null);
      await load();
    } catch (err) {
      setError(err?.message || "Could not cancel offer.");
      setConfirmOffer(null);
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

  const productTitle =
    confirmOffer?.product?.title || confirmOffer?.product?.name || "this item";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-3xl font-bold text-rb-ink">My offers</h1>
          <p className="mt-1 text-sm text-rb-muted">
            Fixed −5% / −10% / −15% offers you sent to sellers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button href={ROUTES.sellingOffers} variant="outline" size="sm">
            Selling offers
          </Button>
          <Button href={ROUTES.products} variant="outline" size="sm">
            Browse
          </Button>
        </div>
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
          <p className="font-semibold text-rb-ink">No offers yet</p>
          <Button href={ROUTES.products} className="mt-5">
            Find products
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {offers.map((offer) => {
            const product = offer.product || {};
            const productId = product._id || product.id || offer.product;
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
                      −{offer.discountPercent}% · {formatMoney(offer.offerPrice)}{" "}
                      (was {formatMoney(offer.listPrice)})
                    </p>
                    <p className="mt-1 text-xs text-rb-muted">
                      {STATUS_LABEL[offer.status] || offer.status}
                      {offer.expiresAt
                        ? ` · expires ${new Date(offer.expiresAt).toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offer.status === "accepted" && !offer.order ? (
                      <Button
                        size="sm"
                        href={`${ROUTES.order}?offerId=${offer.id}`}
                      >
                        Checkout
                      </Button>
                    ) : null}
                    {["pending", "accepted"].includes(offer.status) &&
                    !offer.order ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setConfirmOffer(offer)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(confirmOffer)}
        onClose={() => {
          if (busy) return;
          setConfirmOffer(null);
        }}
        title="Cancel this offer?"
        description={`Withdraw your −${confirmOffer?.discountPercent}% offer on “${productTitle}”. You can send a new offer later if the item is still available.`}
        confirmLabel="Cancel offer"
        tone="danger"
        loading={busy}
        onConfirm={cancelOffer}
      />
    </div>
  );
}
