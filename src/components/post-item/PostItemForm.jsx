"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";
import {
  backendCreateProduct,
  backendUploadImages,
  fetchBackendCategories,
  fetchBackendStations,
} from "@/lib/rebox-backend-api";

const STEPS = ["Details", "Photos", "Station", "Review"];
const PHOTO_SLOTS = 4;

export default function PostItemForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState([]);
  const [stations, setStations] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [categoryId, setCategoryId] = useState("");
  const [stationId, setStationId] = useState("");
  const [reboxSize, setReboxSize] = useState("M");
  const [photos, setPhotos] = useState(() => Array(PHOTO_SLOTS).fill(null));

  const fileInputRefs = useRef([]);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMetaLoading(true);
      try {
        const [cats, sts] = await Promise.all([
          fetchBackendCategories(),
          fetchBackendStations(),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setStations(sts);
          // Select shows the first option visually, but controlled state stays ""
          // unless we seed defaults — otherwise Review shows "—".
          if (cats[0]?._id) setCategoryId((current) => current || cats[0]._id);
          if (sts[0]?._id) setStationId((current) => current || sts[0]._id);
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

  const selectedStation = useMemo(
    () => stations.find((s) => s._id === stationId) || null,
    [stations, stationId],
  );

  const stationLabel = useMemo(() => {
    if (!selectedStation) return "";
    const parts = [];
    if (selectedStation.partnerName) parts.push(selectedStation.partnerName);
    if (selectedStation.city) parts.push(selectedStation.city);
    const head = parts.join(" — ");
    return `${head} — Locker ${selectedStation.lockerCode}`;
  }, [selectedStation]);

  const conditionOptions = useMemo(() => ["Like New", "Good", "Fair"], []);
  const selectedPhotos = useMemo(
    () => photos.filter(Boolean),
    [photos],
  );

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
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-rb-border bg-white p-10 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Icon name="check" className="size-7" />
        </span>
        <h2 className="text-2xl font-bold text-rb-ink">Listing submitted</h2>
        <p className="mt-2 text-rb-muted">
          AI condition grading starts shortly. You&apos;ll get a notification when
          it goes live.
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
    <div className="rounded-2xl border border-rb-border bg-white p-6 sm:p-8">
      <div className="mb-8 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`mb-2 h-1.5 rounded-full ${
                i <= step ? "bg-rb-red" : "bg-stone-200"
              }`}
            />
            <p
              className={`text-xs font-semibold ${
                i <= step ? "text-rb-red" : "text-rb-muted"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Input
            label="Item Title"
            placeholder="e.g. Sony A7 III Body"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({
              value: c._id,
              label: c.name,
            }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (USD)"
              type="number"
              placeholder="495"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Select
              label="Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              options={conditionOptions}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-xl border border-rb-border bg-rb-pink/60 px-4 py-3 text-sm outline-none focus:border-rb-red focus:bg-white"
              placeholder="Include accessories, defects, and purchase year..."
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Alert icon={<Icon name="camera" className="size-4 text-rb-red" />}>
            Upload at least 1 clear photo (up to {PHOTO_SLOTS}). AI grading uses
            these for condition scores.
          </Alert>
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
                      setError("Each image must be under 5MB.");
                      e.target.value = "";
                      return;
                    }
                    setError("");
                    setPhotoAt(index, file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-rb-border bg-rb-pink/40 text-rb-muted hover:border-rb-red"
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
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Select
            label="Drop-off Station"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            options={stations.map((s) => ({
              value: s._id,
              label: `${s.partnerName} — ${s.city} — Locker ${s.lockerCode}`,
            }))}
          />
          <Select
            label="Required ReBox Size"
            value={reboxSize}
            onChange={(e) => setReboxSize(e.target.value)}
            options={["S", "M", "L"]}
          />
          <Alert variant="note">
            Packing proof video is required before you can drop the item.
          </Alert>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 rounded-2xl bg-rb-pink/50 p-5 text-sm">
          <p>
            <strong>Title:</strong> {title || "—"}
          </p>
          <p>
            <strong>Category:</strong> {selectedCategory?.name || "—"}
          </p>
          <p>
            <strong>Price:</strong> {price ? `$${price}` : "—"}
          </p>
          <p>
            <strong>Condition:</strong> {condition || "—"}
          </p>
          <p>
            <strong>Photos:</strong> {selectedPhotos.length} selected
          </p>
          <p>
            <strong>Station:</strong> {stationLabel || "—"}
          </p>
          <p>
            <strong>ReBox size:</strong> {reboxSize || "—"}
          </p>
          <Alert className="mt-4">
            Submitting starts AI condition grading. Listings go live after
            automated checks.
          </Alert>
        </div>
      )}

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (step === 1 && selectedPhotos.length === 0) {
                setError("Please upload at least one photo.");
                return;
              }
              setError("");
              setStep((s) => s + 1);
            }}
          >
            Continue
          </Button>
        ) : (
          <Button
            disabled={!isAuthenticated || metaLoading || submitting}
            onClick={async () => {
              if (!token) return;
              if (!title || !description || !price || !categoryId || !stationId) {
                setError("Please fill in all required listing details.");
                return;
              }
              if (selectedPhotos.length === 0) {
                setError("Please upload at least one photo.");
                return;
              }

              setSubmitting(true);
              setError("");
              try {
                const imageUrls = await backendUploadImages({
                  token,
                  files: selectedPhotos.map((p) => p.file),
                });
                await backendCreateProduct({
                  token,
                  title,
                  description,
                  price: Number(price),
                  condition,
                  images: imageUrls,
                  categoryId,
                  stationId,
                });
                setDone(true);
              } catch (err) {
                setError(err?.message || "Failed to submit listing.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? "Submitting..." : "Submit Listing"}
          </Button>
        )}
      </div>
    </div>
  );
}
