"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Icon from "@/components/ui/Icon";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ROUTES } from "@/lib/routes";
import {
  backendCreateOffer,
  backendNotifyCartAdd,
} from "@/lib/rebox-backend-api";

import { formatMoney } from "@/lib/money";

const OFFER_PERCENTS = [5, 10, 15];

function calcOfferPrice(listPrice, pct) {
  return Math.max(
    0.01,
    Math.round(listPrice * (1 - pct / 100) * 100) / 100,
  );
}

export default function ProductActions({ product }) {
  const router = useRouter();
  const { requireAuth, requireVerified, user, token, handleAuthError } =
    useAuth();
  const { addItem, isInCart } = useCart();
  const isOwn = user?.id && product.seller?.id === user.id;
  const inCart = isInCart(product.id);

  const [selectedPercent, setSelectedPercent] = useState(null);
  const [offerBusy, setOfferBusy] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerError, setOfferError] = useState("");
  const [confirm, setConfirm] = useState(null);

  const listPrice = Number(product.price || 0);
  const canOffer =
    !isOwn &&
    product.acceptsOffers !== false &&
    product.moderationStatus === "approved" &&
    (product.listingStatus === "active" || product.status === "active");

  const notifyCartAdd = () => {
    if (!token) return;
    backendNotifyCartAdd({
      token,
      productId: product.id,
      productTitle: product.title,
    }).catch(() => {});
  };

  const executeBuy = () => {
    if (isOwn) {
      setCartMessage("You cannot buy your own listing.");
      return;
    }
    const result = addItem(product);
    if (result.added) notifyCartAdd();
    router.push(ROUTES.order);
  };

  const requestBuy = () => {
    requireAuth(
      () => {
        if (!requireVerified(ROUTES.product(product.id))) return;
        setConfirm("buy");
      },
      LOGIN_REASONS.buy,
      ROUTES.order,
    );
  };

  const handleAddToCart = () => {
    requireAuth(
      () => {
        if (!requireVerified(ROUTES.product(product.id))) return;
        if (isOwn) {
          setCartMessage("You cannot buy your own listing.");
          return;
        }
        const result = addItem(product);
        if (result.added) {
          setCartMessage("Added to cart");
          notifyCartAdd();
        } else if (result.reason === "exists") {
          setCartMessage("Already in cart");
        }
        window.setTimeout(() => setCartMessage(""), 1800);
      },
      LOGIN_REASONS.buy,
      ROUTES.order,
    );
  };

  const requestSendOffer = () => {
    if (!selectedPercent) {
      setOfferError("Choose a discount first (−5%, −10%, or −15%).");
      return;
    }

    requireAuth(
      () => {
        if (!requireVerified(ROUTES.product(product.id))) return;
        if (isOwn) {
          setOfferError("You cannot offer on your own listing.");
          return;
        }
        setConfirm("offer");
      },
      LOGIN_REASONS.buy,
      ROUTES.product(product.id),
    );
  };

  const executeSendOffer = async () => {
    if (!token || !selectedPercent) return;
    setOfferBusy(true);
    setOfferError("");
    setOfferMessage("");
    try {
      await backendCreateOffer({
        token,
        productId: product.id,
        discountPercent: selectedPercent,
      });
      setOfferMessage(
        `Offer −${selectedPercent}% sent. Seller has 48h to respond. Listing stays open for others until someone pays.`,
      );
      setConfirm(null);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.product(product.id) })) {
        return;
      }
      setOfferError(err?.message || "Could not send offer.");
      setConfirm(null);
    } finally {
      setOfferBusy(false);
    }
  };

  const selectedOfferPrice = selectedPercent
    ? calcOfferPrice(listPrice, selectedPercent)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          fullWidth
          size="lg"
          disabled={Boolean(isOwn)}
          onClick={requestBuy}
        >
          <Icon name="cart" className="size-5" />
          Buy now
        </Button>
        <Button
          fullWidth
          size="lg"
          variant={inCart ? "secondary" : "outline"}
          disabled={Boolean(isOwn)}
          onClick={handleAddToCart}
        >
          <Icon name="cart" className="size-5" />
          {inCart ? "In cart" : "Add to cart"}
        </Button>
      </div>
      {cartMessage ? (
        <p className="text-center text-xs font-medium text-rb-muted">
          {cartMessage}
        </p>
      ) : null}

      <Button fullWidth variant="outline" size="md" href={ROUTES.offers}>
        My offers
      </Button>

      {!isOwn && canOffer ? (
        <div className="rounded-2xl border border-rb-border bg-white p-4">
          <p className="text-sm font-semibold text-rb-ink">Make an offer</p>
          <p className="mt-1 text-xs text-rb-muted">
            Select a discount, then send. Seller can accept or reject within 48
            hours — the item stays listed until checkout.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {OFFER_PERCENTS.map((pct) => {
              const offerPrice = calcOfferPrice(listPrice, pct);
              const selected = selectedPercent === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  disabled={offerBusy}
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedPercent(pct);
                    setOfferError("");
                  }}
                  className={`rounded-xl border px-2 py-3 text-center transition disabled:opacity-50 ${
                    selected
                      ? "border-rb-green bg-rb-green-soft ring-2 ring-rb-green/40"
                      : "border-rb-border bg-rb-surface/50 hover:border-rb-green hover:bg-rb-green-soft"
                  }`}
                >
                  <span className="block text-sm font-bold text-rb-green">
                    −{pct}%
                  </span>
                  <span className="mt-0.5 block text-[11px] text-rb-muted">
                    {formatMoney(offerPrice)}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            fullWidth
            className="mt-3"
            size="md"
            disabled={offerBusy || !selectedPercent}
            onClick={requestSendOffer}
          >
            {selectedPercent
              ? `Send −${selectedPercent}% offer`
              : "Send offer"}
          </Button>

          {offerMessage ? (
            <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {offerMessage}{" "}
              <a href={ROUTES.offers} className="font-semibold underline">
                View my offers
              </a>
            </p>
          ) : null}
          {offerError ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {offerError}
            </p>
          ) : null}
        </div>
      ) : !isOwn ? (
        <p className="rounded-2xl border border-dashed border-rb-border bg-white px-4 py-3 text-sm text-rb-muted">
          {product.acceptsOffers === false
            ? "The seller is not accepting offers on this listing. You can still buy at the listed price."
            : product.moderationStatus !== "approved"
              ? "Offers unlock after admin approves this listing."
              : "Offers are unavailable while this item is reserved or sold."}
        </p>
      ) : (
        <p className="text-sm text-rb-muted">This is your listing.</p>
      )}

      <ConfirmModal
        open={confirm === "buy"}
        onClose={() => setConfirm(null)}
        title="Buy this item?"
        description={`Continue to checkout for “${product.title || "this item"}” at ${formatMoney(listPrice)}.`}
        confirmLabel="Continue to checkout"
        onConfirm={() => {
          setConfirm(null);
          executeBuy();
        }}
      />

      <ConfirmModal
        open={confirm === "offer"}
        onClose={() => {
          if (offerBusy) return;
          setConfirm(null);
        }}
        title="Send this offer?"
        description={`Offer −${selectedPercent}% (${formatMoney(selectedOfferPrice)}) on “${product.title || "this item"}”. The seller has 48 hours to respond.`}
        confirmLabel="Send offer"
        loading={offerBusy}
        onConfirm={executeSendOffer}
      />
    </div>
  );
}
