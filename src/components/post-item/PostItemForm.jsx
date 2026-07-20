"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import { ROUTES } from "@/lib/routes";

const STEPS = ["Details", "Photos", "Station", "Review"];

export default function PostItemForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

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
          <Input label="Item Title" placeholder="e.g. Sony A7 III Body" />
          <Select
            label="Category"
            options={["Electronics", "Apparel", "Photography", "Gaming", "Other"]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Price (USD)" type="number" placeholder="495" />
            <Select
              label="Condition"
              options={["Like New", "Good", "Fair"]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.08em]">
              Description
            </label>
            <textarea
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
            Upload at least 4 clear photos. AI grading uses these for condition
            scores.
          </Alert>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-rb-border bg-rb-pink/40 text-rb-muted hover:border-rb-red"
              >
                <Icon name="plus" className="mb-1 size-5" />
                <span className="text-xs">Photo {n}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Select
            label="Drop-off Station"
            options={[
              "Circle K Nguyễn Huệ — Locker A12",
              "GS25 Lê Lợi — Locker B04",
              "Circle K Thảo Điền — Locker C08",
            ]}
          />
          <Select label="Required ReBox Size" options={["S", "M", "L"]} />
          <Alert variant="note">
            Packing proof video is required before you can drop the item.
          </Alert>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 rounded-2xl bg-rb-pink/50 p-5 text-sm">
          <p>
            <strong>Title:</strong> Ready for review
          </p>
          <p>
            <strong>Escrow:</strong> Premium Escrow eligible after eKYC
          </p>
          <p>
            <strong>Station:</strong> Selected on previous step
          </p>
          <Alert className="mt-4">
            Submitting starts AI condition grading. Listings go live after
            automated checks.
          </Alert>
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button onClick={() => setDone(true)}>Submit Listing</Button>
        )}
      </div>
    </div>
  );
}
