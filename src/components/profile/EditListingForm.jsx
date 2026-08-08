"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import Checkbox from "@/components/ui/Checkbox";
import { useAuth } from "@/context/AuthContext";
import { formatPriceInput, sanitizePriceInput, validateProductPrice } from "@/lib/money";
import { ROUTES } from "@/lib/routes";
import {
  backendUpdateProduct,
  backendUploadImages,
  fetchBackendCategories,
  fetchBackendProductById,
} from "@/lib/rebox-backend-api";
import { normalizeBackendProduct } from "@/lib/normalize-backend";
import {
  hasFieldErrors,
  validateRequiredText,
  validateSelect,
} from "@/lib/validation";

export default function EditListingForm({ productId }) {
  const router = useRouter();
  const { token, isAuthenticated, ready, handleAuthError, requireVerified } =
    useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [listing, setListing] = useState(null);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [categoryId, setCategoryId] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [acceptsOffers, setAcceptsOffers] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated || !token) {
      router.replace(`/login?redirect=${encodeURIComponent(ROUTES.editListing(productId))}`);
      return;
    }

    if (!requireVerified(ROUTES.editListing(productId))) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [raw, cats] = await Promise.all([
          fetchBackendProductById(productId, token),
          fetchBackendCategories(),
        ]);
        const normalized = normalizeBackendProduct(raw);
        if (!normalized) throw new Error("Listing not found.");
        if (!cancelled) {
          setListing(normalized);
          setTitle(normalized.title);
          setDescription(normalized.description);
          setPrice(String(normalized.price || ""));
          setCondition(normalized.condition || "Good");
          setCategoryId(normalized.categoryId || cats[0]?._id || "");
          setExistingImages(normalized.images || []);
          setAcceptsOffers(normalized.acceptsOffers !== false);
          setCategories(cats);
        }
      } catch (err) {
        if (!cancelled) {
          if (
            handleAuthError(err, {
              redirect: ROUTES.editListing(productId),
            })
          ) {
            return;
          }
          setFormError(err?.message || "Could not load listing.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    handleAuthError,
    isAuthenticated,
    productId,
    ready,
    requireVerified,
    router,
    token,
  ]);

  const conditionOptions = useMemo(() => ["Like New", "Good", "Fair"], []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-rb-border bg-white p-8 text-center text-sm text-rb-muted">
        Loading listing...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-2xl border border-rb-border bg-white p-8 text-center">
        <p className="text-rb-ink">{formError || "Listing not found."}</p>
        <Button href={ROUTES.profile} className="mt-4">
          Back to profile
        </Button>
      </div>
    );
  }

  if (listing.moderationStatus === "rejected") {
    return (
      <div className="space-y-4 rounded-2xl border border-rb-border bg-white p-6 sm:p-8">
        <Alert variant="danger">
          This product was rejected and cannot be edited or listed.
          {listing.rejectionReason
            ? ` Reason: ${listing.rejectionReason}`
            : ""}{" "}
          Please create a new listing if you still want to sell.
        </Alert>
        <div className="flex flex-wrap gap-3">
          <Button href={ROUTES.postItem}>Create new listing</Button>
          <Button href={ROUTES.profile} variant="secondary">
            Back to profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-rb-border bg-white p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!token) return;
        setSubmitting(true);
        setFormError("");

        const titleCheck = validateRequiredText(title, {
          field: "Item title",
          min: 3,
          max: 200,
        });
        const descriptionCheck = validateRequiredText(description, {
          field: "Description",
          min: 10,
          max: 5000,
        });
        const categoryCheck = validateSelect(categoryId, { field: "Category" });
        const conditionCheck = validateSelect(condition, { field: "Condition" });
        const priceError = validateProductPrice(price);
        const errors = {};
        if (!titleCheck.ok) errors.title = titleCheck.message;
        if (!descriptionCheck.ok) errors.description = descriptionCheck.message;
        if (!categoryCheck.ok) errors.categoryId = categoryCheck.message;
        if (!conditionCheck.ok) errors.condition = conditionCheck.message;
        if (priceError) errors.price = priceError;

        try {
          let images = existingImages;
          if (newFiles.length > 0) {
            const uploaded = await backendUploadImages({
              token,
              files: newFiles,
            });
            images = [...existingImages, ...uploaded];
          }
          if (images.length === 0) {
            errors.photos = "Keep at least one photo so buyers can see the item.";
          }
          if (hasFieldErrors(errors)) {
            setFieldErrors(errors);
            setSubmitting(false);
            return;
          }
          setFieldErrors({});

          await backendUpdateProduct({
            token,
            id: productId,
            title: titleCheck.value,
            description: descriptionCheck.value,
            price: Number(price),
            condition,
            images,
            categoryId,
            acceptsOffers,
          });
          router.push(ROUTES.profile);
        } catch (err) {
          if (
            handleAuthError(err, {
              redirect: ROUTES.editListing(productId),
            })
          ) {
            return;
          }
          setFormError(err?.message || "Could not update listing.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {listing.moderationStatus === "pending" ? (
        <Alert variant="warning">
          This listing is waiting for admin review. Saving changes will keep it
          in review until approved.
        </Alert>
      ) : (
        <Alert>
          Saving changes will send this listing back to admin review. It will be
          hidden from the marketplace until approved again.
        </Alert>
      )}

        <Input
          label="Item Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((prev) => {
              if (!prev.title) return prev;
              const next = { ...prev };
              delete next.title;
              return next;
            });
          }}
          error={fieldErrors.title}
          required
          minLength={3}
          maxLength={200}
        />
      <Select
        label="Category"
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          setFieldErrors((prev) => {
            if (!prev.categoryId) return prev;
            const next = { ...prev };
            delete next.categoryId;
            return next;
          });
        }}
        options={categories.map((c) => ({ value: c._id, label: c.name }))}
        error={fieldErrors.categoryId}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price (USD)"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 25,99 or 1.000.000"
          value={formatPriceInput(price)}
          onChange={(e) => {
            setPrice(sanitizePriceInput(e.target.value));
            setFieldErrors((prev) => {
              if (!prev.price) return prev;
              const next = { ...prev };
              delete next.price;
              return next;
            });
          }}
          onKeyDown={(e) => {
            if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          error={fieldErrors.price}
          required
          maxLength={18}
          autoComplete="off"
        />
        <Select
          label="Condition"
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value);
            setFieldErrors((prev) => {
              if (!prev.condition) return prev;
              const next = { ...prev };
              delete next.condition;
              return next;
            });
          }}
          options={conditionOptions}
          error={fieldErrors.condition}
          required
        />
      </div>
      <Checkbox
        id="edit-acceptsOffers"
        checked={acceptsOffers}
        onChange={(e) => setAcceptsOffers(e.target.checked)}
        label="Allow buyers to make offers (−5% / −10% / −15%)"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setFieldErrors((prev) => {
              if (!prev.description) return prev;
              const next = { ...prev };
              delete next.description;
              return next;
            });
          }}
          rows={4}
          required
          minLength={10}
          maxLength={5000}
          aria-invalid={fieldErrors.description ? "true" : undefined}
          className={[
            "rounded-xl border bg-rb-surface/60 px-4 py-3 text-sm outline-none focus:bg-white",
            fieldErrors.description
              ? "border-red-400 focus:border-red-500"
              : "border-rb-border focus:border-rb-green",
          ].join(" ")}
        />
        {fieldErrors.description ? (
          <p className="text-xs font-medium text-red-600" role="alert">
            {fieldErrors.description}
          </p>
        ) : null}
      </div>

      {existingImages.length > 0 ? (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em]">
            Current photos
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {existingImages.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-rb-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white"
                  onClick={() => {
                    setExistingImages((current) => current.filter((item) => item !== src));
                    setFieldErrors((prev) => {
                      if (!prev.photos) return prev;
                      const next = { ...prev };
                      delete next.photos;
                      return next;
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
          Add more photos
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setNewFiles(Array.from(e.target.files || []));
            setFieldErrors((prev) => {
              if (!prev.photos) return prev;
              const next = { ...prev };
              delete next.photos;
              return next;
            });
          }}
        />
        {fieldErrors.photos ? (
          <p className="text-xs font-medium text-red-600" role="alert">
            {fieldErrors.photos}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <div className="flex justify-between gap-3 pt-2">
        <Button href={ROUTES.profile} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save & resubmit"}
        </Button>
      </div>
    </form>
  );
}
