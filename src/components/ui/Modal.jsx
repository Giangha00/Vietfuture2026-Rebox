"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icon";

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
  panelClassName = "",
}) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-rb-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={[
          "relative z-10 w-full max-w-md rounded-3xl border border-rb-border bg-white p-6 shadow-2xl outline-none animate-fade-up",
          panelClassName,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          {title ? (
            <h2 id={titleId} className="font-sans text-xl font-bold text-rb-ink">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-rb-muted transition hover:bg-rb-surface hover:text-rb-ink"
            aria-label="Close"
          >
            <Icon name="x" className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
