"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";

export default function ImageGallery({ images = [], title }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge tone="blue">Escrow Protected</Badge>
          <Badge tone="green">Verified Seller</Badge>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            className={[
              "relative size-20 shrink-0 overflow-hidden rounded-xl border-2",
              active === i ? "border-rb-red" : "border-transparent",
            ].join(" ")}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            {i === images.length - 1 && images.length > 3 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-bold text-white">
                +2
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
