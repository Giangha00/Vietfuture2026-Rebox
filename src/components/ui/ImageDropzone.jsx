"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import {
  MAX_IMAGE_LABEL,
  imageFilesFromList,
  validateImageFile,
} from "@/lib/image-upload";

/**
 * Click + drag-and-drop image picker.
 *
 * Modes:
 * - `slots`: fixed grid of photo slots (post-item)
 * - `multiple`: multi-file dropzone (edit listing)
 * - `single`: one file, optional circular preview (avatar)
 */
export default function ImageDropzone({
  mode = "multiple",
  slots = null,
  onSlotChange,
  files = [],
  onFilesChange,
  previewUrl = "",
  onFileChange,
  accept = "image/*",
  capture,
  maxLabel = MAX_IMAGE_LABEL,
  error = "",
  className = "",
  emptyLabel = "Add photo",
  dropLabel = "Drop photo",
  hint = "",
}) {
  const inputRefs = useRef([]);
  const singleInputRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function rejectNonImages() {
    return "Drop image files only (JPEG, PNG, WebP, or GIF).";
  }

  function validateList(fileList, { field = "Photo" } = {}) {
    const images = imageFilesFromList(fileList);
    if (images.length === 0) {
      return { ok: false, message: rejectNonImages(), files: [] };
    }
    const accepted = [];
    for (const file of images) {
      const check = validateImageFile(file, { field });
      if (!check.ok) {
        return {
          ok: accepted.length > 0,
          message: check.message,
          files: accepted,
        };
      }
      accepted.push(file);
    }
    return { ok: true, message: "", files: accepted };
  }

  if (mode === "slots" && Array.isArray(slots)) {
    return (
      <div className={className}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slots.map((photo, index) => (
            <div
              key={index}
              className="relative"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragOverIndex !== index) setDragOverIndex(index);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragOverIndex === index) setDragOverIndex(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverIndex(null);
                const result = validateList(e.dataTransfer?.files);
                if (!result.ok && result.files.length === 0) {
                  onSlotChange?.(index, null, result.message);
                  return;
                }
                onSlotChange?.(index, result.files, result.message || "");
              }}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="file"
                accept={accept}
                capture={capture}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const check = validateImageFile(file, { field: "Photo" });
                    if (!check.ok) {
                      onSlotChange?.(index, null, check.message);
                    } else {
                      onSlotChange?.(index, [file], "");
                    }
                  }
                  e.target.value = "";
                }}
              />
              {photo ? (
                <div
                  className={[
                    "relative aspect-square overflow-hidden rounded-2xl border border-rb-border",
                    dragOverIndex === index ? "ring-2 ring-rb-green" : "",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={`Product ${index + 1}`}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rb-ink"
                    onClick={() => onSlotChange?.(index, null, "")}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRefs.current[index]?.click()}
                  className={[
                    "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-rb-surface text-sm hover:border-rb-green hover:text-rb-green",
                    dragOverIndex === index
                      ? "border-rb-green text-rb-green ring-2 ring-rb-green/30"
                      : "border-rb-border text-rb-muted",
                  ].join(" ")}
                >
                  <Icon name="camera" className="size-6" />
                  {dragOverIndex === index ? dropLabel : emptyLabel}
                </button>
              )}
            </div>
          ))}
        </div>
        {error ? (
          <p className="mt-3 text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (mode === "single") {
    return (
      <div
        className={[
          "flex items-center gap-4 rounded-2xl border border-dashed p-3 transition-colors",
          dragOver ? "border-rb-green bg-rb-green/5" : "border-transparent",
          className,
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          const result = validateList(e.dataTransfer?.files, {
            field: "Avatar image",
          });
          if (!result.ok || result.files.length === 0) {
            onFileChange?.(null, result.message || rejectNonImages());
            return;
          }
          onFileChange?.(result.files[0], "");
        }}
      >
        <div className="relative size-20 overflow-hidden rounded-full border border-rb-border bg-rb-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl || "/default-avatar.svg"}
            alt="Avatar"
            className="size-full object-cover"
          />
        </div>
        <div>
          <input
            ref={singleInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const check = validateImageFile(file, { field: "Avatar image" });
              if (!check.ok) {
                onFileChange?.(null, `${check.message} Use JPEG, PNG, WebP, or GIF.`);
              } else {
                onFileChange?.(file, "");
              }
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => singleInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-rb-border bg-white px-3 py-2 text-sm font-semibold text-rb-ink hover:border-rb-green hover:text-rb-green"
          >
            <Icon name="camera" className="size-4" />
            {dragOver ? dropLabel : emptyLabel}
          </button>
          <p className="mt-1.5 text-xs text-rb-muted">
            {hint || `Click or drag and drop · max ${maxLabel}`}
          </p>
          {error ? (
            <p className="mt-2 text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // multiple
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <input
        ref={singleInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          const result = validateList(e.target.files);
          if (!result.ok && result.files.length === 0) {
            onFilesChange?.([], result.message);
          } else {
            onFilesChange?.(result.files, result.message || "");
          }
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => singleInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          const result = validateList(e.dataTransfer?.files);
          if (!result.ok && result.files.length === 0) {
            onFilesChange?.([], result.message);
          } else {
            onFilesChange?.(result.files, result.message || "");
          }
        }}
        className={[
          "flex min-h-30 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-sm transition-colors",
          dragOver
            ? "border-rb-green bg-rb-green/5 text-rb-green"
            : "border-rb-border bg-rb-surface text-rb-muted hover:border-rb-green hover:text-rb-green",
        ].join(" ")}
      >
        <Icon name="camera" className="size-6" />
        <span className="font-medium">
          {dragOver ? "Drop photos here" : emptyLabel || "Click or drag and drop photos"}
        </span>
        <span className="text-xs">
          {hint || `Max ${maxLabel} each`}
          {files.length > 0
            ? ` · ${files.length} file${files.length === 1 ? "" : "s"} selected`
            : ""}
        </span>
      </button>
      {error ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
