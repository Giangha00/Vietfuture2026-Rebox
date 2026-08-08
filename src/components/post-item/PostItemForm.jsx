"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import Checkbox from "@/components/ui/Checkbox";
import Stepper from "@/components/ui/Stepper";
import Logo from "@/components/layout/Logo";
import { formatMoney, formatPriceInput, sanitizePriceInput, validateProductPrice } from "@/lib/money";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import {
  emptyAttributesForSlug,
  formatAttributeValue,
  getCategorySchema,
  validateAttributeFields,
} from "@/lib/category-schemas";
import {
  backendCreateProduct,
  backendUploadImages,
  fetchBackendCategories,
} from "@/lib/rebox-backend-api";
import {
  hasFieldErrors,
  normalizePhone,
  validateAddress,
  validateRequiredText,
  validateSelect,
} from "@/lib/validation";

const STEP_META = [
  { id: 1, label: "Information" },
  { id: 2, label: "Condition" },
  { id: 3, label: "Images" },
  { id: 4, label: "Price" },
  { id: 5, label: "Pickup address" },
  { id: 6, label: "Confirmation" },
];
const PHOTO_SLOTS = 4;
const SUGGESTIONS = [
  "Full accessories",
  "Under warranty",
  "Original owner",
];

const emptyPickupAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  district: "",
  note: "",
};

function formatPickupSummary(address) {
  if (!address) return "";
  const parts = [
    address.fullName,
    address.phone,
    address.line1,
    address.line2,
    address.district,
    address.city,
  ].filter(Boolean);
  return parts.join(", ");
}

export default function PostItemForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { token, user, isAuthenticated, handleAuthError } = useAuth();

  const [categories, setCategories] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [categoryId, setCategoryId] = useState("");
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [attributeValues, setAttributeValues] = useState({});
  const [photos, setPhotos] = useState(() => Array(PHOTO_SLOTS).fill(null));
  const [pickupAddress, setPickupAddress] = useState(emptyPickupAddress);

  const fileInputRefs = useRef([]);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMetaLoading(true);
      try {
        const cats = await fetchBackendCategories();
        if (!cancelled) {
          setCategories(cats);
          if (cats[0]?._id) setCategoryId((current) => current || cats[0]._id);
        }
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fromUser = user.pickupAddress || {};
    setPickupAddress((prev) => ({
      ...prev,
      fullName: fromUser.fullName || user.name || prev.fullName,
      phone: fromUser.phone || user.phone || prev.phone,
      line1: fromUser.line1 || prev.line1,
      line2: fromUser.line2 || prev.line2,
      city: fromUser.city || prev.city,
      district: fromUser.district || prev.district,
      note: fromUser.note || prev.note,
    }));
  }, [user]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === categoryId) || null,
    [categories, categoryId],
  );

  const categorySlug = selectedCategory?.slug || "";
  const categorySchema = useMemo(
    () => getCategorySchema(categorySlug),
    [categorySlug],
  );

  useEffect(() => {
    if (!categorySlug) return;
    setAttributeValues(emptyAttributesForSlug(categorySlug));
  }, [categorySlug]);

  const conditionOptions = useMemo(() => ["Like New", "Good", "Fair"], []);
  const selectedPhotos = useMemo(() => photos.filter(Boolean), [photos]);

  function setAttribute(key, value) {
    setAttributeValues((current) => ({ ...current, [key]: value }));
    clearField(key);
  }

  function updatePickupField(field, value) {
    setPickupAddress((current) => ({
      ...current,
      [field]: field === "phone" ? normalizePhone(value) : value,
    }));
    clearField(field);
  }

  function clearField(name) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function setPhotoAt(index, file) {
    setPhotos((current) => {
      const next = [...current];
      const previous = next[index];
      if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
      next[index] = file
        ? { file, previewUrl: URL.createObjectURL(file) }
        : null;
      return next;
    });
    clearField("photos");
  }

  function appendSuggestion(text) {
    setDescription((current) => {
      if (!current) return text;
      if (current.includes(text)) return current;
      return `${current.trim()} ${text}`;
    });
    clearField("description");
  }

  function validateStep(stepIndex) {
    const errors = {};

    if (stepIndex === 0) {
      const titleCheck = validateRequiredText(title, {
        field: "Product name",
        min: 3,
        max: 200,
      });
      const brandCheck = validateRequiredText(brand, {
        field: "Brand",
        min: 1,
        max: 80,
      });
      const categoryCheck = validateSelect(categoryId, { field: "Category" });
      const descriptionCheck = validateRequiredText(description, {
        field: "Product description",
        min: 10,
        max: 2000,
      });
      if (!titleCheck.ok) errors.title = titleCheck.message;
      if (!brandCheck.ok) errors.brand = brandCheck.message;
      if (!categoryCheck.ok) errors.categoryId = categoryCheck.message;
      if (!descriptionCheck.ok) errors.description = descriptionCheck.message;

      const attrs = validateAttributeFields(categorySlug, attributeValues);
      Object.assign(errors, attrs.errors);
    }

    if (stepIndex === 1) {
      if (!condition) {
        errors.condition = "Select a condition grade (Like New, Good, or Fair).";
      }
    }

    if (stepIndex === 2) {
      if (selectedPhotos.length === 0) {
        errors.photos = "Upload at least 1 clear product photo (max 5MB each).";
      }
    }

    if (stepIndex === 3) {
      const priceError = validateProductPrice(price);
      if (priceError) errors.price = priceError;
    }

    if (stepIndex === 4) {
      const addressCheck = validateAddress(pickupAddress, {
        requiredFields: ["line1", "city"],
        labels: {
          line1: "Address line",
          city: "City",
          phone: "Pickup phone",
        },
      });
      Object.assign(errors, addressCheck.errors);
      if (pickupAddress.phone) {
        // optional but if filled must be valid — validateAddress already handles when not required
      }
    }

    return errors;
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-rb-border bg-white p-10 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rb-green-soft text-rb-green">
          <Icon name="check" className="size-7" />
        </span>
        <h2 className="text-2xl font-bold text-rb-ink">Submitted for review</h2>
        <p className="mt-2 text-rb-muted">
          Your listing is waiting for admin approval. You&apos;ll get a notification
          when it goes live or if changes are needed. Keep the item at your pickup
          address — a courier will collect it after a sale.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href={ROUTES.profile}>Go to Profile</Button>
          <Button href={ROUTES.products} variant="outline">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-rb-border pb-4">
        <div className="flex items-center gap-3">
          <Logo className="text-xl" />
          <span className="hidden h-6 w-px bg-rb-border sm:block" />
          <p className="text-sm font-semibold text-rb-ink sm:text-base">
            Post a product
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="text-sm font-medium text-rb-muted hover:text-rb-green">
            Save draft
          </button>
          <Link
            href={ROUTES.home}
            className="flex size-9 items-center justify-center rounded-full text-rb-muted hover:bg-rb-surface hover:text-rb-ink"
            aria-label="Close"
          >
            <Icon name="x" className="size-5" />
          </Link>
        </div>
      </div>

      <Stepper steps={STEP_META} current={step + 1} />

      <div className="rounded-2xl border border-rb-border bg-white p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">What are you selling?</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Keyboards, mice, and monitors — add the specs buyers filter by.
              </p>
            </div>
            <Input
              label="Product name *"
              placeholder="e.g. Keychron K2 V2 Brown Switch 75%"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearField("title");
              }}
              hint={
                fieldErrors.title
                  ? undefined
                  : "Include model and standout features. Min 3 characters."
              }
              error={fieldErrors.title}
              required
              minLength={3}
              maxLength={200}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category *"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  clearField("categoryId");
                }}
                options={categories.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                error={fieldErrors.categoryId}
                required
              />
              <Input
                label="Brand *"
                placeholder="e.g. Keychron, Logitech, LG"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  clearField("brand");
                }}
                error={fieldErrors.brand}
                required
                maxLength={80}
              />
            </div>

            {categorySchema ? (
              <div className="space-y-4 rounded-2xl border border-rb-border bg-rb-surface/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-rb-ink">
                    {selectedCategory?.name} specs
                  </p>
                  <p className="mt-1 text-xs text-rb-muted">
                    Required fields help buyers find your listing faster.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {categorySchema.fields.map((field) => {
                    if (field.type === "boolean") {
                      return (
                        <Select
                          key={field.key}
                          label={`${field.label}${field.required ? " *" : ""}`}
                          value={
                            attributeValues[field.key] === true ||
                            attributeValues[field.key] === "true"
                              ? "true"
                              : attributeValues[field.key] === false ||
                                  attributeValues[field.key] === "false"
                                ? "false"
                                : ""
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "") {
                              setAttribute(field.key, "");
                              return;
                            }
                            setAttribute(field.key, v === "true");
                          }}
                          options={[
                            { value: "", label: "Select…" },
                            { value: "true", label: "Yes" },
                            { value: "false", label: "No" },
                          ]}
                          error={fieldErrors[field.key]}
                          required={field.required}
                        />
                      );
                    }

                    if (field.type === "number") {
                      return (
                        <Input
                          key={field.key}
                          label={`${field.label}${field.required ? " *" : ""}`}
                          type="number"
                          inputMode="numeric"
                          placeholder={
                            field.min != null && field.max != null
                              ? `${field.min}–${field.max}`
                              : ""
                          }
                          value={attributeValues[field.key] ?? ""}
                          onChange={(e) => setAttribute(field.key, e.target.value)}
                          error={fieldErrors[field.key]}
                          required={field.required}
                          min={field.min}
                          max={field.max}
                        />
                      );
                    }

                    return (
                      <Select
                        key={field.key}
                        label={`${field.label}${field.required ? " *" : ""}`}
                        value={attributeValues[field.key] ?? ""}
                        onChange={(e) => setAttribute(field.key, e.target.value)}
                        options={[
                          { value: "", label: "Select…" },
                          ...(field.options || []),
                        ]}
                        error={fieldErrors[field.key]}
                        required={field.required}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
                  Product description *
                </label>
                <span className="text-xs text-rb-muted">{description.length} / 2000</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, 2000));
                  clearField("description");
                }}
                rows={5}
                required
                minLength={10}
                aria-invalid={fieldErrors.description ? "true" : undefined}
                className={[
                  "rounded-xl border bg-rb-surface px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2",
                  fieldErrors.description
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-rb-border focus:border-rb-green focus:ring-rb-green/15",
                ].join(" ")}
                placeholder="Condition details, reason for selling, accessories included..."
              />
              {fieldErrors.description ? (
                <p className="text-xs font-medium text-red-600" role="alert">
                  {fieldErrors.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => appendSuggestion(tag)}
                    className="rounded-full border border-rb-border px-3 py-1 text-xs font-medium text-rb-muted hover:border-rb-green hover:text-rb-green"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-rb-surface p-4">
              <div className="flex gap-3">
                <Icon name="shield" className="size-5 shrink-0 text-rb-green" />
                <div>
                  <p className="font-semibold text-rb-ink">Transparency rules</p>
                  <p className="mt-1 text-sm text-rb-muted">
                    Be honest about both pros and cons so buyers can trust the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Item condition</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Choose the grade that best matches your item.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {conditionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setCondition(opt);
                    clearField("condition");
                  }}
                  className={[
                    "rounded-2xl border px-4 py-5 text-left transition",
                    condition === opt
                      ? "border-rb-green bg-rb-green-soft"
                      : fieldErrors.condition
                        ? "border-red-300 hover:border-red-400"
                        : "border-rb-border hover:border-rb-green/40",
                  ].join(" ")}
                >
                  <p className="font-semibold text-rb-ink">{opt}</p>
                </button>
              ))}
            </div>
            {fieldErrors.condition ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                {fieldErrors.condition}
              </p>
            ) : null}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Product images</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Upload at least 1 clear photo (up to {PHOTO_SLOTS}).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setFieldErrors({
                          photos:
                            "Each image must be under 5MB (JPEG, PNG, WebP, or GIF).",
                        });
                        e.target.value = "";
                        return;
                      }
                      setFormError("");
                      setPhotoAt(index, file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-rb-border bg-rb-surface text-rb-muted hover:border-rb-green"
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.previewUrl}
                        alt={`Photo ${index + 1}`}
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <>
                        <Icon name="plus" className="mb-1 size-5" />
                        <span className="text-xs">Photo {index + 1}</span>
                      </>
                    )}
                  </button>
                  {photo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoAt(index, null);
                        if (fileInputRefs.current[index]) {
                          fileInputRefs.current[index].value = "";
                        }
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {fieldErrors.photos ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                {fieldErrors.photos}
              </p>
            ) : null}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Selling price</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Set a fair price for your item.
              </p>
            </div>
            <Input
              label="Price (USD) *"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 25,99 or 1.000.000"
              value={formatPriceInput(price)}
              onChange={(e) => {
                setPrice(sanitizePriceInput(e.target.value));
                clearField("price");
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
            <p className="text-xs text-rb-muted">
              Numbers only, max 11 digits. Thousands use “.” (1.234.567). Use “,”
              for cents (25,99).
            </p>
            <Checkbox
              id="acceptsOffers"
              checked={acceptsOffers}
              onChange={(e) => setAcceptsOffers(e.target.checked)}
              label="Allow buyers to make offers (−5% / −10% / −15%)"
            />
            <p className="text-xs text-rb-muted">
              If enabled, buyers can send fixed discount offers after your listing
              is approved.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Pickup address</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Keep the item at home. After a sale, a courier picks it up here
                and delivers door-to-door to the buyer.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                value={pickupAddress.fullName}
                onChange={(e) => updatePickupField("fullName", e.target.value)}
                error={fieldErrors.fullName}
                maxLength={120}
              />
              <Input
                label="Phone"
                value={pickupAddress.phone}
                onChange={(e) => updatePickupField("phone", e.target.value)}
                inputMode="numeric"
                maxLength={10}
                placeholder="10 digits"
                error={fieldErrors.phone}
              />
              <Input
                label="Address line *"
                value={pickupAddress.line1}
                onChange={(e) => updatePickupField("line1", e.target.value)}
                error={fieldErrors.line1}
                required
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Address line 2"
                value={pickupAddress.line2}
                onChange={(e) => updatePickupField("line2", e.target.value)}
                error={fieldErrors.line2}
                containerClassName="sm:col-span-2"
              />
              <Input
                label="District"
                value={pickupAddress.district}
                onChange={(e) => updatePickupField("district", e.target.value)}
                error={fieldErrors.district}
              />
              <Input
                label="City *"
                value={pickupAddress.city}
                onChange={(e) => updatePickupField("city", e.target.value)}
                error={fieldErrors.city}
                required
              />
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
                  Note for courier
                </label>
                <textarea
                  value={pickupAddress.note}
                  onChange={(e) => updatePickupField("note", e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="rounded-xl border border-rb-border bg-rb-surface px-4 py-3 text-sm outline-none focus:border-rb-green focus:bg-white focus:ring-2 focus:ring-rb-green/15"
                  placeholder="Gate code, preferred pickup window..."
                />
              </div>
            </div>
            <Alert variant="note">
              Your item stays with you until a courier arrives for pickup.
            </Alert>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3 rounded-2xl bg-rb-surface p-5 text-sm">
            <h2 className="mb-4 text-xl font-bold text-rb-green">Confirm listing</h2>
            <p>
              <strong>Title:</strong> {title || "—"}
            </p>
            <p>
              <strong>Brand:</strong> {brand || "—"}
            </p>
            <p>
              <strong>Category:</strong> {selectedCategory?.name || "—"}
            </p>
            {categorySchema?.fields.map((field) => {
              const raw = attributeValues[field.key];
              if (raw === "" || raw == null) return null;
              return (
                <p key={field.key}>
                  <strong>{field.label}:</strong>{" "}
                  {formatAttributeValue(field, raw)}
                </p>
              );
            })}
            <p>
              <strong>Price:</strong>{" "}
              {price ? formatMoney(price) : "—"}
            </p>
            <p>
              <strong>Accept offers:</strong>{" "}
              {acceptsOffers ? "Yes (−5% / −10% / −15%)" : "No"}
            </p>
            <p>
              <strong>Condition:</strong> {condition || "—"}
            </p>
            <div>
              <p className="mb-2">
                <strong>Photos:</strong> {selectedPhotos.length} selected
              </p>
              {selectedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {selectedPhotos.map((photo, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo.previewUrl}
                      src={photo.previewUrl}
                      alt={`Product photo ${index + 1}`}
                      className="aspect-square w-full rounded-xl border border-rb-border object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-rb-muted">No photos selected.</p>
              )}
            </div>
            <p>
              <strong>Pickup address:</strong>{" "}
              {formatPickupSummary(pickupAddress) || "—"}
            </p>
            {pickupAddress.note ? (
              <p>
                <strong>Courier note:</strong> {pickupAddress.note}
              </p>
            ) : null}
            <p className="pt-2 text-rb-muted">
              <strong>Description:</strong> {description || "—"}
            </p>
          </div>
        )}

        {formError ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <div className="mt-8 flex justify-between gap-3">
          <Button
            variant="secondary"
            href={step === 0 ? ROUTES.home : undefined}
            onClick={
              step === 0
                ? undefined
                : () => {
                    setFieldErrors({});
                    setFormError("");
                    setStep((s) => Math.max(0, s - 1));
                  }
            }
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEP_META.length - 1 ? (
            <Button
              onClick={() => {
                const errors = validateStep(step);
                if (hasFieldErrors(errors)) {
                  setFieldErrors(errors);
                  setFormError("");
                  return;
                }
                setFieldErrors({});
                setFormError("");
                setStep((s) => s + 1);
              }}
            >
              Next →
            </Button>
          ) : (
            <Button
              disabled={!isAuthenticated || metaLoading || submitting}
              onClick={async () => {
                if (!token) return;
                const allErrors = {
                  ...validateStep(0),
                  ...validateStep(1),
                  ...validateStep(2),
                  ...validateStep(3),
                  ...validateStep(4),
                };
                if (hasFieldErrors(allErrors)) {
                  setFieldErrors(allErrors);
                  setFormError(
                    "Fix the highlighted fields before submitting your listing.",
                  );
                  const firstBadStep = [0, 1, 2, 3, 4].find((s) =>
                    hasFieldErrors(validateStep(s)),
                  );
                  if (firstBadStep != null) setStep(firstBadStep);
                  return;
                }

                const attrs = validateAttributeFields(
                  categorySlug,
                  attributeValues,
                );
                const attributesPayload = attrs.payload;

                setSubmitting(true);
                setFormError("");
                try {
                  const imageUrls = await backendUploadImages({
                    token,
                    files: selectedPhotos.map((p) => p.file),
                  });
                  await backendCreateProduct({
                    token,
                    title,
                    brand: brand.trim(),
                    description,
                    price: Number(price),
                    condition,
                    images: imageUrls,
                    categoryId,
                    attributes: attributesPayload,
                    acceptsOffers,
                    pickupAddress: {
                      fullName: pickupAddress.fullName.trim(),
                      phone: pickupAddress.phone.trim(),
                      line1: pickupAddress.line1.trim(),
                      line2: pickupAddress.line2.trim(),
                      city: pickupAddress.city.trim(),
                      district: pickupAddress.district.trim(),
                      note: pickupAddress.note.trim(),
                    },
                  });
                  setDone(true);
                } catch (err) {
                  if (handleAuthError(err, { redirect: ROUTES.postItem })) {
                    return;
                  }
                  setFormError(err?.message || "Failed to submit listing.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? "Submitting..." : "Submit listing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
