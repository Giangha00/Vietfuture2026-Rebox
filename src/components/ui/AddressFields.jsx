"use client";

import Input from "@/components/ui/Input";
import { normalizePhone } from "@/lib/validation";

export const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  district: "",
  city: "",
  note: "",
};

const DEFAULT_FIELDS = [
  { key: "fullName", label: "Full name", span: 1 },
  { key: "phone", label: "Phone", span: 1, inputMode: "numeric", maxLength: 10 },
  { key: "line1", label: "Address line", span: 2, required: true },
  { key: "line2", label: "Address line 2", span: 1 },
  { key: "district", label: "District", span: 1 },
  { key: "city", label: "City", span: 1, required: true },
  { key: "note", label: "Note", span: 2 },
];

/**
 * Shared pickup / delivery address fields.
 */
export default function AddressFields({
  value = EMPTY_ADDRESS,
  onChange,
  fieldErrors = {},
  requiredKeys = ["line1", "city"],
  noteLabel = "Note",
  className = "",
  idPrefix = "address",
}) {
  function update(key, nextValue) {
    const normalized =
      key === "phone" ? normalizePhone(nextValue) : nextValue;
    onChange?.({ ...value, [key]: normalized });
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {DEFAULT_FIELDS.map((field) => {
        const required = requiredKeys.includes(field.key);
        const label =
          field.key === "note"
            ? noteLabel
            : `${field.label}${required ? " *" : ""}`;
        return (
          <Input
            key={field.key}
            id={`${idPrefix}-${field.key}`}
            label={label}
            value={value[field.key] || ""}
            onChange={(e) => update(field.key, e.target.value)}
            error={fieldErrors[field.key]}
            required={required}
            inputMode={field.inputMode}
            maxLength={field.maxLength}
            containerClassName={field.span === 2 ? "sm:col-span-2" : undefined}
          />
        );
      })}
    </div>
  );
}
