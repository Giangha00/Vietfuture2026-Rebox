"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import Checkbox from "@/components/ui/Checkbox";
import Stepper from "@/components/ui/Stepper";
import ImageDropzone from "@/components/ui/ImageDropzone";
import AddressFields, { EMPTY_ADDRESS } from "@/components/ui/AddressFields";
import Logo from "@/components/layout/Logo";
import {
  formatMoney,
  formatPriceInput,
  sanitizePriceInput,
  validateProductPrice,
} from "@/lib/money";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import {
  emptyAttributesForSlug,
  formatAttributeValue,
  getCategorySchema,
  validateAttributeFields,
} from "@/lib/category-schemas";
import {
  backendAiListingDraft,
  backendCreateProduct,
  backendUploadImages,
  fetchBackendCategories,
} from "@/lib/rebox-backend-api";
import {
  hasFieldErrors,
  validateAddress,
  validateRequiredText,
  validateSelect,
} from "@/lib/validation";
import { MAX_IMAGE_LABEL } from "@/lib/image-upload";
import { FILTER_CONDITIONS } from "@/lib/product-filters";
import { formatAddress } from "@/lib/order-status";
import { useFieldErrors } from "@/hooks/useFieldErrors";

const STEP_META = [
  { id: 1, label: "Photos" },
  { id: 2, label: "AI analysis" },
  { id: 3, label: "Review details" },
  { id: 4, label: "Pickup address" },
  { id: 5, label: "Confirmation" },
];
const PHOTO_SLOTS = 4;
const SUGGESTIONS = ["Full accessories", "Under warranty", "Original owner"];

export default function PostItemForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { token, user, isAuthenticated, handleAuthError } = useAuth();

  const [categories, setCategories] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const {
    fieldErrors,
    setFieldErrors,
    formError,
    setFormError,
    clearField,
  } = useFieldErrors();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [categoryId, setCategoryId] = useState("");
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [attributeValues, setAttributeValues] = useState({});
  const [photos, setPhotos] = useState(() => Array(PHOTO_SLOTS).fill(null));
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [aiMeta, setAiMeta] = useState(null);
  const [aiFlags, setAiFlags] = useState([]);
  const [aiRisk, setAiRisk] = useState("");
  const [pickupAddress, setPickupAddress] = useState(EMPTY_ADDRESS);

  const photosRef = useRef(photos);
  photosRef.current = photos;
  const skipAttrResetRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMetaLoading(true);
      try {
        const cats = await fetchBackendCategories();
        if (!cancelled) {
          setCategories(cats);
          // Category is chosen by AI after photo analysis — do not pre-select.
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
    if (skipAttrResetRef.current) {
      skipAttrResetRef.current = false;
      return;
    }
    setAttributeValues(emptyAttributesForSlug(categorySlug));
  }, [categorySlug]);

  const conditionOptions = useMemo(() => FILTER_CONDITIONS, []);
  const selectedPhotos = useMemo(() => photos.filter(Boolean), [photos]);

  function setAttribute(key, value) {
    setAttributeValues((current) => ({ ...current, [key]: value }));
    clearField(key);
  }

  function handleSlotChange(index, files, errorMessage = "") {
    if (errorMessage && (!files || files.length === 0)) {
      setFieldErrors((prev) => ({ ...prev, photos: errorMessage }));
      return;
    }

    if (files === null) {
      setPhotos((current) => {
        const next = [...current];
        const previous = next[index];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        next[index] = null;
        return next;
      });
      setUploadedUrls([]);
      setAiMeta(null);
      clearField("photos");
      return;
    }

    const accepted = Array.isArray(files) ? files : [files];
    setPhotos((current) => {
      const next = [...current];
      let slot = Math.max(0, Math.min(index, PHOTO_SLOTS - 1));
      for (const file of accepted) {
        while (slot < PHOTO_SLOTS && next[slot] && slot !== index) {
          slot += 1;
        }
        if (slot >= PHOTO_SLOTS) break;
        const previous = next[slot];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        next[slot] = { file, previewUrl: URL.createObjectURL(file) };
        slot += 1;
      }
      return next;
    });
    setUploadedUrls([]);
    setAiMeta(null);
    if (errorMessage) {
      setFieldErrors((prev) => ({ ...prev, photos: errorMessage }));
    } else {
      clearField("photos");
    }
  }

  function appendSuggestion(text) {
    setDescription((current) => {
      if (!current) return text;
      if (current.includes(text)) return current;
      return `${current.trim()} ${text}`;
    });
    clearField("description");
  }

  function applyAiDraft(draft) {
    if (!draft) return;
    skipAttrResetRef.current = true;
    if (draft.categoryId) {
      setCategoryId(String(draft.categoryId));
    } else if (draft.categorySlug) {
      const match = categories.find((c) => c.slug === draft.categorySlug);
      if (match?._id) setCategoryId(String(match._id));
    }
    if (draft.title) setTitle(draft.title);
    if (draft.brand) setBrand(draft.brand);
    if (draft.description) setDescription(draft.description);
    if (draft.condition) setCondition(draft.condition);
    if (draft.suggestedPrice != null && draft.suggestedPrice !== "") {
      setPrice(String(draft.suggestedPrice));
    } else if (draft.categorySlug === "mice") {
      setPrice("25");
    } else if (draft.categorySlug === "keyboards") {
      setPrice("45");
    } else if (draft.categorySlug === "monitors") {
      setPrice("120");
    }
    if (draft.attributes && typeof draft.attributes === "object") {
      const slug = draft.categorySlug || categorySlug;
      setAttributeValues({
        ...emptyAttributesForSlug(slug),
        ...draft.attributes,
      });
    }
    setAiFlags(Array.isArray(draft.flags) ? draft.flags : []);
    setAiRisk(draft.riskScore || "");
  }

  async function runAiAnalysis() {
    if (!token) return;
    setAnalyzing(true);
    setFormError("");
    try {
      let urls = uploadedUrls;
      if (urls.length === 0) {
        urls = await backendUploadImages({
          token,
          files: selectedPhotos.map((p) => p.file),
        });
        setUploadedUrls(urls);
      }
      const { draft, aiMeta: meta } = await backendAiListingDraft({
        token,
        images: urls,
        // Always let AI detect category from photos (no manual hint).
        categorySlug: null,
      });
      setAiMeta(meta);
      applyAiDraft(draft);
    } catch (err) {
      if (handleAuthError(err, { redirect: ROUTES.postItem })) return;
      setFormError(err?.message || "AI analysis failed. You can still fill the form manually.");
    } finally {
      setAnalyzing(false);
    }
  }

  function validateStep(stepIndex) {
    const errors = {};

    if (stepIndex === 0) {
      if (selectedPhotos.length === 0) {
        errors.photos = `Upload at least 1 clear product photo (max ${MAX_IMAGE_LABEL} each).`;
      }
    }

    if (stepIndex === 2) {
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
      if (!condition) {
        errors.condition = "Select a condition grade (Like New, Good, or Fair).";
      }
      const priceError = validateProductPrice(price);
      if (priceError) errors.price = priceError;
      Object.assign(errors, validateAttributeFields(categorySlug, attributeValues).errors);
    }

    if (stepIndex === 3) {
      const addressCheck = validateAddress(pickupAddress, {
        requiredFields: ["line1", "city"],
        labels: {
          line1: "Address line",
          city: "City",
          phone: "Pickup phone",
        },
      });
      Object.assign(errors, addressCheck.errors);
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
          Your listing is waiting for admin approval. AI pre-check notes were attached
          for reviewers. You&apos;ll get a notification when it goes live or if changes
          are needed.
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
        <Link
          href={ROUTES.home}
          className="flex size-9 items-center justify-center rounded-full text-rb-muted hover:bg-rb-surface hover:text-rb-ink"
          aria-label="Close"
        >
          <Icon name="x" className="size-5" />
        </Link>
      </div>

      <Stepper steps={STEP_META} current={step + 1} />

      <div className="rounded-2xl border border-rb-border bg-white p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Product photos</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Click or drag and drop 1–{PHOTO_SLOTS} clear photos of the product
                (max {MAX_IMAGE_LABEL} each). AI will detect the category and fill
                listing details — you can edit everything on the next steps.
              </p>
            </div>
            <ImageDropzone
              mode="slots"
              slots={photos}
              onSlotChange={handleSlotChange}
              capture="environment"
              error={fieldErrors.photos}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">AI analysis</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Local ReBox model pre-checks your photos and drafts listing fields.
                This is not final approval — you edit next, then an admin reviews.
              </p>
            </div>
            {analyzing ? (
              <div className="rounded-2xl border border-rb-border bg-rb-surface p-6 text-center">
                <p className="font-semibold text-rb-ink">Analyzing photos…</p>
                <p className="mt-2 text-sm text-rb-muted">
                  On Mac M1 this can take a while. Please keep this tab open.
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-rb-border bg-rb-surface/60 p-5">
                <p className="text-sm text-rb-ink">
                  <strong>Risk:</strong> {aiRisk || "—"} · <strong>Flags:</strong>{" "}
                  {aiFlags.length ? aiFlags.join(", ") : "none"}
                </p>
                <p className="text-sm text-rb-muted">
                  Draft title: {title || "—"}
                </p>
                <Button type="button" variant="outline" onClick={runAiAnalysis}>
                  Re-run AI analysis
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Review & edit details</h2>
              <p className="mt-2 text-sm text-rb-muted">
                AI filled these fields from your photos. Correct anything before
                continuing.
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
                <p className="text-sm font-semibold text-rb-ink">
                  {selectedCategory?.name} specs
                </p>
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

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
                Condition *
              </p>
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
                      "rounded-2xl border px-4 py-4 text-left transition",
                      condition === opt
                        ? "border-rb-green bg-rb-green-soft"
                        : "border-rb-border hover:border-rb-green/40",
                    ].join(" ")}
                  >
                    <p className="font-semibold text-rb-ink">{opt}</p>
                  </button>
                ))}
              </div>
              {fieldErrors.condition ? (
                <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                  {fieldErrors.condition}
                </p>
              ) : null}
            </div>

            <Input
              label="Price (USD) *"
              inputMode="decimal"
              value={formatPriceInput(price)}
              onChange={(e) => {
                setPrice(sanitizePriceInput(e.target.value));
                clearField("price");
              }}
              error={fieldErrors.price}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
                Product description *
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, 2000));
                  clearField("description");
                }}
                rows={5}
                required
                minLength={10}
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

            <Checkbox
              checked={acceptsOffers}
              onChange={(e) => setAcceptsOffers(e.target.checked)}
              label="Accept offers from buyers"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-rb-green">Pickup address</h2>
              <p className="mt-2 text-sm text-rb-muted">
                Couriers collect from this address after a sale.
              </p>
            </div>
            <AddressFields
              idPrefix="pickup"
              value={pickupAddress}
              onChange={(next) => {
                setPickupAddress((prev) => {
                  for (const key of Object.keys(next)) {
                    if (next[key] !== prev[key]) clearField(key);
                  }
                  return next;
                });
              }}
              fieldErrors={fieldErrors}
              requiredKeys={["line1", "city"]}
              noteLabel="Note for courier"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm text-rb-ink">
            <h2 className="text-2xl font-bold text-rb-green">Confirmation</h2>
            <p>
              <strong>Title:</strong> {title || "—"}
            </p>
            <p>
              <strong>Brand / category:</strong> {brand || "—"} /{" "}
              {selectedCategory?.name || "—"}
            </p>
            <p>
              <strong>Condition:</strong> {condition}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {price ? formatMoney(Number(price)) : "—"}
            </p>
            {categorySchema ? (
              <ul className="list-inside list-disc text-rb-muted">
                {categorySchema.fields.map((field) => (
                  <li key={field.key}>
                    {field.label}:{" "}
                    {formatAttributeValue(field, attributeValues[field.key]) || "—"}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {(uploadedUrls.length
                ? uploadedUrls
                : selectedPhotos.map((p) => p.previewUrl)
              ).map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="size-16 rounded-lg object-cover"
                />
              ))}
            </div>
            <p>
              <strong>Pickup:</strong> {formatAddress(pickupAddress) || "—"}
            </p>
            <p className="text-rb-muted">
              <strong>Description:</strong> {description || "—"}
            </p>
            {aiRisk ? (
              <p className="text-rb-muted">
                AI pre-check risk: {aiRisk}
                {aiFlags.length ? ` (${aiFlags.join(", ")})` : ""}
              </p>
            ) : null}
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
            disabled={analyzing || submitting}
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
              disabled={analyzing || metaLoading || !isAuthenticated}
              onClick={async () => {
                const errors = validateStep(step);
                if (hasFieldErrors(errors)) {
                  setFieldErrors(errors);
                  setFormError("");
                  return;
                }
                setFieldErrors({});
                setFormError("");

                if (step === 0) {
                  setStep(1);
                  await runAiAnalysis();
                  return;
                }

                setStep((s) => s + 1);
              }}
            >
              {step === 0
                ? analyzing
                  ? "Analyzing…"
                  : "Analyze with AI →"
                : step === 1
                  ? analyzing
                    ? "Please wait…"
                    : "Review details →"
                  : "Next →"}
            </Button>
          ) : (
            <Button
              disabled={!isAuthenticated || metaLoading || submitting || analyzing}
              onClick={async () => {
                if (!token) return;
                const allErrors = {
                  ...validateStep(0),
                  ...validateStep(2),
                  ...validateStep(3),
                };
                if (hasFieldErrors(allErrors)) {
                  setFieldErrors(allErrors);
                  setFormError(
                    "Fix the highlighted fields before submitting your listing.",
                  );
                  if (hasFieldErrors(validateStep(0))) setStep(0);
                  else if (hasFieldErrors(validateStep(2))) setStep(2);
                  else setStep(3);
                  return;
                }

                const attrs = validateAttributeFields(
                  categorySlug,
                  attributeValues,
                );
                setSubmitting(true);
                setFormError("");
                try {
                  let imageUrls = uploadedUrls;
                  if (imageUrls.length === 0) {
                    imageUrls = await backendUploadImages({
                      token,
                      files: selectedPhotos.map((p) => p.file),
                    });
                    setUploadedUrls(imageUrls);
                  }
                  await backendCreateProduct({
                    token,
                    title,
                    brand: brand.trim(),
                    description,
                    price: Number(price),
                    condition,
                    images: imageUrls,
                    categoryId,
                    attributes: attrs.payload,
                    acceptsOffers,
                    aiMeta,
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
              {submitting ? "Submitting..." : "Submit for admin review"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
