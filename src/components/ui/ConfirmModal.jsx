"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  tone = "default",
  loading = false,
  reasonLabel = "",
  reasonPlaceholder = "Optional note…",
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  async function handleConfirm() {
    if (loading) return;
    await onConfirm?.(reasonLabel ? reason.trim() : undefined);
  }

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      {description ? (
        <p className="text-sm leading-relaxed text-rb-muted">{description}</p>
      ) : null}

      {reasonLabel ? (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted">
            {reasonLabel}
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder={reasonPlaceholder}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-rb-border bg-rb-surface px-4 py-3 text-sm text-rb-ink outline-none transition placeholder:text-rb-muted/70 focus:border-rb-green focus:bg-white focus:ring-2 focus:ring-rb-green/15 disabled:opacity-60"
          />
        </label>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={loading}
          onClick={handleClose}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="md"
          variant={tone === "danger" ? "outline" : "primary"}
          className={
            tone === "danger"
              ? "border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50 hover:text-red-800"
              : ""
          }
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? "Please wait…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
