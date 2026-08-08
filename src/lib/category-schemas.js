/** Mirrors backend App\Support\CategorySchemas — keep in sync. */

export const CATEGORY_SCHEMAS = {
  keyboards: {
    fields: [
      {
        key: "layout",
        label: "Layout",
        type: "select",
        required: true,
        options: [
          { value: "60%", label: "60%" },
          { value: "65%", label: "65%" },
          { value: "75%", label: "75%" },
          { value: "TKL", label: "TKL" },
          { value: "Full", label: "Full" },
        ],
      },
      {
        key: "switch",
        label: "Switch",
        type: "select",
        required: true,
        options: [
          { value: "red", label: "Red" },
          { value: "brown", label: "Brown" },
          { value: "blue", label: "Blue" },
          { value: "silent", label: "Silent" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "connectivity",
        label: "Connectivity",
        type: "select",
        required: true,
        options: [
          { value: "wired", label: "Wired" },
          { value: "wireless", label: "Wireless" },
          { value: "tri-mode", label: "Tri-mode" },
        ],
      },
      {
        key: "hot_swap",
        label: "Hot-swap",
        type: "boolean",
        required: false,
      },
    ],
  },
  mice: {
    fields: [
      {
        key: "connectivity",
        label: "Connectivity",
        type: "select",
        required: true,
        options: [
          { value: "wired", label: "Wired" },
          { value: "wireless", label: "Wireless" },
        ],
      },
      {
        key: "has_receiver",
        label: "Receiver included",
        type: "boolean",
        required: true,
      },
      {
        key: "shape",
        label: "Shape",
        type: "select",
        required: false,
        options: [
          { value: "ambi", label: "Ambidextrous" },
          { value: "ergo", label: "Ergonomic" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "weight_g",
        label: "Weight (g)",
        type: "number",
        required: false,
        min: 20,
        max: 200,
      },
    ],
  },
  monitors: {
    fields: [
      {
        key: "size_inch",
        label: "Size (inch)",
        type: "select",
        required: true,
        options: [
          { value: "24", label: "24\"" },
          { value: "27", label: "27\"" },
          { value: "32", label: "32\"" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "refresh_hz",
        label: "Refresh rate",
        type: "select",
        required: true,
        options: [
          { value: "60", label: "60 Hz" },
          { value: "144", label: "144 Hz" },
          { value: "165", label: "165 Hz" },
          { value: "240", label: "240 Hz" },
        ],
      },
      {
        key: "panel",
        label: "Panel",
        type: "select",
        required: true,
        options: [
          { value: "ips", label: "IPS" },
          { value: "va", label: "VA" },
          { value: "oled", label: "OLED" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "resolution",
        label: "Resolution",
        type: "select",
        required: true,
        options: [
          { value: "fhd", label: "Full HD" },
          { value: "qhd", label: "QHD" },
          { value: "4k", label: "4K" },
        ],
      },
    ],
  },
};

export function getCategorySchema(slug) {
  if (!slug) return null;
  return CATEGORY_SCHEMAS[String(slug).toLowerCase()] || null;
}

export function emptyAttributesForSlug(slug) {
  const schema = getCategorySchema(slug);
  if (!schema) return {};
  const next = {};
  for (const field of schema.fields) {
    if (field.type === "boolean") {
      next[field.key] = field.required ? false : "";
    } else {
      next[field.key] = "";
    }
  }
  return next;
}

/**
 * Validate category attribute fields and build API payload.
 * Returns { ok, errors: { [fieldKey]: message }, payload }.
 */
export function validateAttributeFields(slug, values = {}) {
  const schema = getCategorySchema(slug);
  if (!schema) {
    return {
      ok: false,
      errors: { category: "Select a category so we know which specs to check." },
      payload: {},
    };
  }

  const errors = {};
  const payload = {};

  for (const field of schema.fields) {
    const raw = values[field.key];
    const empty = raw === "" || raw === null || raw === undefined;

    if (empty) {
      if (field.required) {
        errors[field.key] =
          field.type === "boolean"
            ? `Choose Yes or No for ${field.label}.`
            : `${field.label} is required for this category.`;
      }
      continue;
    }

    if (field.type === "boolean") {
      payload[field.key] = raw === true || raw === "true" || raw === "1";
    } else if (field.type === "number") {
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        errors[field.key] = `${field.label} must be a valid number.`;
        continue;
      }
      if (field.min != null && n < field.min) {
        errors[field.key] = `${field.label} must be at least ${field.min}.`;
        continue;
      }
      if (field.max != null && n > field.max) {
        errors[field.key] = `${field.label} must be at most ${field.max}.`;
        continue;
      }
      payload[field.key] = Math.round(n);
    } else {
      payload[field.key] = String(raw);
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    payload,
  };
}

/** Build API payload — omit empty optional fields; coerce types. */
export function buildAttributesPayload(slug, values = {}) {
  const result = validateAttributeFields(slug, values);
  if (!result.ok) {
    const first = Object.values(result.errors)[0];
    throw new Error(first || "Invalid product specs.");
  }
  return result.payload;
}

export function attributesComplete(slug, values = {}) {
  const schema = getCategorySchema(slug);
  if (!schema) return false;
  return schema.fields.every((field) => {
    if (!field.required) return true;
    const raw = values[field.key];
    if (field.type === "boolean") {
      return raw === true || raw === false || raw === "true" || raw === "false";
    }
    return raw !== "" && raw != null;
  });
}

export function formatAttributeValue(field, value) {
  if (field?.type === "boolean") {
    return value === true || value === "true" ? "Yes" : "No";
  }
  if (field?.type === "number") return String(value);
  const opt = field?.options?.find((o) => o.value === value);
  return opt?.label || String(value);
}
