"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

export default function ImageGallery({ images = [], title, verified }) {
  const list = images.length ? images : ["/default-avatar.svg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
        <Image
          src={list[active]}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {verified ? (
          <div className="absolute left-4 top-4">
            <Badge tone="soft" icon={<Icon name="check" className="size-3" />}>
              Inspected
            </Badge>
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {list.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            className={[
              "relative size-20 shrink-0 overflow-hidden rounded-xl border-2",
              active === i ? "border-rb-green" : "border-transparent opacity-80",
            ].join(" ")}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
