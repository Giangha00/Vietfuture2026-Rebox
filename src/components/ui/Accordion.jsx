"use client";

import { useState } from "react";

export default function Accordion({ items = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-rb-border border-y border-rb-border bg-white">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left"
            >
              <span className="font-semibold text-rb-ink">{item.q}</span>
              <span
                className={`text-rb-muted transition ${isOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {isOpen && (
              <p className="px-1 pb-4 text-sm leading-relaxed text-rb-muted">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
