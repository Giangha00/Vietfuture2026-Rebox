"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

const CATEGORIES = [
  { id: "buying", label: "Buying", icon: "cart" },
  { id: "selling", label: "Selling", icon: "tag" },
  { id: "shipping", label: "Shipping", icon: "box" },
  { id: "payment", label: "Payment", icon: "lock" },
  { id: "disputes", label: "Disputes", icon: "shield" },
];

const FAQ_GROUPS = [
  {
    id: "buying",
    title: "Buying on ReBox",
    icon: "cart",
    items: [
      {
        q: "How do I buy an item?",
        a: "Open a listing, tap Buy now or Chat with seller, then complete checkout. Escrow holds funds until you confirm receipt.",
      },
      {
        q: "Can I cancel an order?",
        a: "You can cancel before the seller ships or drops the item at a station. After shipping starts, use the dispute flow if needed.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling & fees",
    icon: "tag",
    items: [
      {
        q: "How much is the selling fee on ReBox?",
        a: "Standard listings are free to post. Transaction fees may apply when escrow or station shipping is used — shown before you confirm.",
      },
      {
        q: "How can I sell items faster?",
        a: "Use clear photos, honest condition notes, competitive pricing, and respond quickly to messages.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    icon: "box",
    items: [
      {
        q: "Who pays for shipping?",
        a: "It depends on the listing. Buyers and sellers can agree in chat; station lockers have size-based fees shown at checkout.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    icon: "lock",
    items: [
      {
        q: "Is payment secure?",
        a: "Yes. Escrow holds buyer funds until delivery is confirmed or the protection window ends.",
      },
    ],
  },
  {
    id: "disputes",
    title: "Disputes",
    icon: "shield",
    items: [
      {
        q: "What if my item arrives damaged?",
        a: "Film a continuous unboxing video and open a dispute from your order. Support reviews evidence within 48 hours.",
      },
    ],
  },
];

export default function HelpCenterContent() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("buying");

  const displayGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return FAQ_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      })).filter((group) => group.items.length > 0);
    }
    return FAQ_GROUPS.filter((g) => g.id === activeCat);
  }, [activeCat, query]);

  return (
    <div>
      <section className="border-b border-rb-border bg-white py-14 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-rb-green sm:text-4xl">
            How can we help you?
          </h1>
          <label className="relative mt-8 block">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rb-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your question (e.g. Refund, Shipping)..."
              className="h-14 w-full rounded-2xl border border-rb-border bg-white pl-12 pr-4 text-sm shadow-sm outline-none focus:border-rb-green focus:ring-2 focus:ring-rb-green/15"
            />
          </label>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const on = activeCat === cat.id && !query.trim();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCat(cat.id);
                  setQuery("");
                }}
                className={[
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 transition",
                  on
                    ? "border-rb-green bg-rb-green-soft"
                    : "border-rb-border bg-white hover:border-rb-green/40",
                ].join(" ")}
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-rb-green-soft text-rb-green">
                  <Icon name={cat.icon} className="size-5" />
                </span>
                <span className="text-sm font-semibold text-rb-ink">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-8">
          {displayGroups.map((group) => (
            <section key={group.id}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-rb-ink">
                <Icon name={group.icon} className="size-5 text-rb-green" />
                {group.title}
              </h2>
              <Accordion items={group.items} />
            </section>
          ))}
          {displayGroups.length === 0 ? (
            <p className="text-center text-rb-muted">No matching questions found.</p>
          ) : null}
        </div>

        <div className="mt-14 rounded-2xl bg-rb-green px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold">Still need help?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
            Our support team is available 24/7 to answer your questions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={ROUTES.contact} variant="mint" size="lg">
              <Icon name="message" className="size-5" />
              Chat with us
            </Button>
            <Button href={ROUTES.contact} variant="white-outline" size="lg">
              <Icon name="mail" className="size-5" />
              Send email request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
