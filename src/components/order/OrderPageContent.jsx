"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Icon from "@/components/ui/Icon";
import AddressFields, { EMPTY_ADDRESS } from "@/components/ui/AddressFields";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { LOGIN_REASONS } from "@/lib/auth";
import { formatMoney } from "@/lib/money";
import { ROUTES, loginWithRedirect } from "@/lib/routes";
import {
  backendCreateOrder,
  backendFetchOfferById,
  backendStartOrderPayment,
} from "@/lib/rebox-backend-api";
import { validateAddress } from "@/lib/validation";
import { useFieldErrors } from "@/hooks/useFieldErrors";

export default function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  const {
    ready,
    isAuthenticated,
    isEmailVerified,
    token,
    user,
    requireAuth,
    requireVerified,
    handleAuthError,
    updateProfile,
  } = useAuth();
  const { items, totalAmount, removeItem, clearCart } = useCart();

  const [note, setNote] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [delivery, setDelivery] = useState(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const { fieldErrors, setFieldErrors, clearField } = useFieldErrors();
  const [error, setError] = useState("");
  const [acceptedOffer, setAcceptedOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(Boolean(offerId));
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace(
        loginWithRedirect(
          offerId ? `${ROUTES.order}?offerId=${offerId}` : ROUTES.order,
        ),
      );
      return;
    }
    requireVerified(
      offerId ? `${ROUTES.order}?offerId=${offerId}` : ROUTES.order,
    );
  }, [isAuthenticated, offerId, ready, requireVerified, router]);

  useEffect(() => {
    setSelectedIds(items.map((item) => item.id));
  }, [items]);

  useEffect(() => {
    if (!user) return;
    setDelivery((prev) => ({
      ...prev,
      fullName: user.deliveryAddress?.fullName || user.name || prev.fullName,
      phone: user.deliveryAddress?.phone || user.phone || prev.phone,
      line1: user.deliveryAddress?.line1 || prev.line1,
      line2: user.deliveryAddress?.line2 || prev.line2,
      city: user.deliveryAddress?.city || prev.city,
      district: user.deliveryAddress?.district || prev.district,
      note: user.deliveryAddress?.note || prev.note,
    }));
  }, [user]);

  useEffect(() => {
    if (!offerId || !token || !isEmailVerified) {
      setOfferLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setOfferLoading(true);
      setError("");
      try {
        const offer = await backendFetchOfferById({ token, id: offerId });
        if (cancelled) return;
        if (offer?.status !== "accepted") {
          setError("This offer is not accepted or is no longer available.");
          setAcceptedOffer(null);
        } else if (offer.order) {
          setError("This offer already has an order.");
          setAcceptedOffer(null);
        } else {
          setAcceptedOffer(offer);
        }
      } catch (err) {
        if (!cancelled) {
          if (
            handleAuthError(err, {
              redirect: `${ROUTES.order}?offerId=${offerId}`,
            })
          ) {
            return;
          }
          setError(err?.message || "Could not load offer.");
          setAcceptedOffer(null);
        }
      } finally {
        if (!cancelled) setOfferLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [handleAuthError, isEmailVerified, offerId, token]);

  const selectedItems = useMemo(
    () =>
      items.filter(
        (item) =>
          selectedIds.includes(item.id) &&
          !(user?.id && item.sellerId === user.id),
      ),
    [items, selectedIds, user?.id],
  );

  const checkoutItems = useMemo(() => {
    if (acceptedOffer) {
      const product = acceptedOffer.product || {};
      const productId = product._id || product.id || acceptedOffer.product;
      return [
        {
          id: String(productId),
          title: product.title || "Item",
          price: acceptedOffer.offerPrice,
          listPrice: acceptedOffer.listPrice,
          discountPercent: acceptedOffer.discountPercent,
          image: Array.isArray(product.images) ? product.images[0] || "" : "",
          sellerName: acceptedOffer.seller?.fullName || "Seller",
          fromOffer: true,
        },
      ];
    }
    return selectedItems;
  }, [acceptedOffer, selectedItems]);

  const selectedTotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [checkoutItems],
  );

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function placeOrder() {
    if (
      !requireVerified(
        offerId ? `${ROUTES.order}?offerId=${offerId}` : ROUTES.order,
      )
    ) {
      return;
    }
    if (!token) return;
    if (checkoutItems.length === 0) {
      setError("Select at least one product to order.");
      return;
    }

    const addressCheck = validateAddress(delivery, {
      requiredFields: ["fullName", "phone", "line1", "city"],
      labels: {
        fullName: "Full name",
        phone: "Delivery phone",
        line1: "Address line",
        city: "City",
      },
    });
    if (!addressCheck.ok) {
      setFieldErrors(addressCheck.errors);
      setError("Fix the highlighted delivery fields before paying.");
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    setError("");
    try {
      try {
        await updateProfile({
          deliveryAddress: addressCheck.address,
        });
      } catch {
        // Non-blocking
      }

      const order = await backendCreateOrder({
        token,
        productIds: acceptedOffer
          ? undefined
          : checkoutItems.map((item) => item.id),
        offerId: acceptedOffer?.id || null,
        note,
        deliveryAddress: addressCheck.address,
      });

      if (!acceptedOffer) {
        checkoutItems.forEach((item) => removeItem(item.id));
      }

      try {
        const pay = await backendStartOrderPayment({
          token,
          id: order.id,
        });
        if (pay?.approveUrl) {
          window.location.href = pay.approveUrl;
          return;
        }
      } catch (payErr) {
        router.push(
          `${ROUTES.orderDetail(order.id)}?payment=failed&reason=${encodeURIComponent(payErr.message || "PayPal not ready")}`,
        );
        return;
      }

      router.push(ROUTES.orderDetail(order.id));
    } catch (err) {
      if (
        handleAuthError(err, {
          redirect: offerId ? `${ROUTES.order}?offerId=${offerId}` : ROUTES.order,
        })
      ) {
        return;
      }
      setError(err?.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6">
        Loading checkout...
      </div>
    );
  }

  if (offerId && offerLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-rb-muted sm:px-6">
        Loading accepted offer...
      </div>
    );
  }

  const emptyCart = !acceptedOffer && items.length === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-3xl font-bold text-rb-ink">
            {acceptedOffer ? "Checkout offer" : "Checkout"}
          </h1>
          <p className="mt-1 text-sm text-rb-muted">
            {acceptedOffer
              ? `Paying accepted −${acceptedOffer.discountPercent}% offer price via PayPal.`
              : "Place order → PayPal → courier picks up from seller → delivers to you → escrow release."}
          </p>
        </div>
        <Button href={ROUTES.products} variant="outline" size="sm">
          Browse products
        </Button>
      </div>

      {emptyCart ? (
        <div className="rounded-2xl border border-dashed border-rb-border bg-white px-6 py-16 text-center">
          <Icon name="cart" className="mx-auto mb-3 size-8 text-rb-muted" />
          <p className="font-semibold text-rb-ink">Your cart is empty</p>
          <Button href={ROUTES.products} className="mt-5">
            Go to products
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {!acceptedOffer ? (
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="font-semibold text-rb-green hover:underline"
                  onClick={() => setSelectedIds(items.map((item) => item.id))}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className="text-rb-muted hover:text-rb-ink"
                  onClick={() => setConfirmClear(true)}
                >
                  Clear cart
                </button>
              </div>
            ) : null}

            {acceptedOffer
              ? checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-rb-green/40 bg-white p-4 ring-2 ring-rb-green/10"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-rb-ink">{item.title}</p>
                      <p className="mt-0.5 text-xs text-rb-muted">
                        −{item.discountPercent}% offer · was{" "}
                        {formatMoney(item.listPrice)}
                      </p>
                      <p className="mt-2 font-bold text-rb-green">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  </div>
                ))
              : items.map((item) => {
                  const checked = selectedIds.includes(item.id);
                  const isOwn = user?.id && item.sellerId === user.id;
                  return (
                    <label
                      key={item.id}
                      className={[
                        "flex cursor-pointer gap-4 rounded-2xl border bg-white p-4 transition",
                        checked
                          ? "border-rb-green/50 ring-2 ring-rb-green/10"
                          : "border-rb-border",
                        isOwn ? "opacity-60" : "",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="mt-2 size-4 accent-rb-green"
                        checked={checked}
                        disabled={Boolean(isOwn)}
                        onChange={() => toggleSelected(item.id)}
                      />
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={ROUTES.product(item.id)}
                              className="font-semibold text-rb-ink hover:text-rb-green"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-rb-muted">
                              {item.condition || "—"} · {item.sellerName}
                            </p>
                            {isOwn ? (
                              <p className="mt-1 text-xs text-red-600">
                                You cannot buy your own listing.
                              </p>
                            ) : null}
                          </div>
                          <p className="shrink-0 font-bold text-rb-green">
                            {formatMoney(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="mt-3 text-xs font-semibold text-rb-muted hover:text-rb-green"
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </label>
                  );
                })}

            <section className="rounded-2xl border border-rb-border bg-white p-5">
              <h2 className="font-semibold text-rb-ink">Delivery address</h2>
              <AddressFields
                className="mt-4"
                idPrefix="delivery"
                value={delivery}
                onChange={(next) => {
                  setDelivery((prev) => {
                    for (const key of Object.keys(next)) {
                      if (next[key] !== prev[key]) clearField(key);
                    }
                    return next;
                  });
                }}
                fieldErrors={fieldErrors}
                requiredKeys={["fullName", "phone", "line1", "city"]}
                noteLabel="Delivery note"
              />
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-rb-border bg-white p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold text-rb-ink">Order summary</h2>
            <p className="mt-1 text-sm text-rb-muted">
              {acceptedOffer
                ? "1 accepted offer"
                : `${selectedItems.length} selected / ${items.length} in cart`}
            </p>
            <p className="mt-4 text-2xl font-bold text-rb-green">
              {formatMoney(selectedTotal)}
            </p>
            {!acceptedOffer ? (
              <p className="text-xs text-rb-muted">
                Cart total {formatMoney(totalAmount)} · Paid via PayPal Sandbox
              </p>
            ) : (
              <p className="text-xs text-rb-muted">
                List was {formatMoney(acceptedOffer.listPrice)}
              </p>
            )}

            <div className="mt-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
                  Note for courier / seller
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="rounded-xl border border-rb-border bg-rb-surface/60 px-4 py-3 text-sm outline-none focus:border-rb-green focus:bg-white"
                  placeholder="Delivery window, building access, questions..."
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button
              fullWidth
              size="lg"
              className="mt-5"
              disabled={submitting || checkoutItems.length === 0}
              onClick={() =>
                requireAuth(
                  () => setConfirmPay(true),
                  LOGIN_REASONS.buy,
                  offerId ? `${ROUTES.order}?offerId=${offerId}` : ROUTES.order,
                )
              }
            >
              <Icon name="cart" className="size-5" />
              {submitting
                ? "Redirecting to PayPal..."
                : `Pay with PayPal (${checkoutItems.length})`}
            </Button>
          </aside>
        </div>
      )}

      <ConfirmModal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear your cart?"
        description="All items will be removed from the cart."
        confirmLabel="Clear cart"
        tone="danger"
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
        }}
      />

      <ConfirmModal
        open={confirmPay}
        onClose={() => {
          if (submitting) return;
          setConfirmPay(false);
        }}
        title="Place order and pay?"
        description={
          acceptedOffer
            ? `Pay the accepted offer price for ${checkoutItems.length} item(s) via PayPal.`
            : `Create an order for ${checkoutItems.length} selected item(s) and continue to PayPal.`
        }
        confirmLabel="Pay with PayPal"
        loading={submitting}
        onConfirm={async () => {
          await placeOrder();
          setConfirmPay(false);
        }}
      />
    </div>
  );
}
