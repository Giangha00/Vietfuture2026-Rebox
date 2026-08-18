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
        allowOther: true,
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
        type: "text",
        required: true,
        max: 80,
        placeholder: "e.g. USB-C wired, 2.4GHz wireless, Bluetooth",
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
        allowOther: true,
        options: [
          { value: "wired", label: "Wired" },
          { value: "wireless", label: "Wireless" },
          { value: "bluetooth", label: "Bluetooth" },
          { value: "2.4ghz", label: "2.4GHz wireless" },
          { value: "tri-mode", label: "Tri-mode" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "shape",
        label: "Shape",
        type: "select",
        required: true,
        allowOther: true,
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
        required: true,
        min: 20,
        max: 250,
      },
      {
        key: "max_dpi",
        label: "Max DPI",
        type: "number",
        required: true,
        min: 400,
        max: 50000,
      },
      {
        key: "polling_hz",
        label: "Polling Rate (Hz)",
        type: "select",
        required: true,
        allowOther: true,
        options: [
          { value: "125", label: "125 Hz" },
          { value: "250", label: "250 Hz" },
          { value: "500", label: "500 Hz" },
          { value: "1000", label: "1000 Hz" },
          { value: "2000", label: "2000 Hz" },
          { value: "4000", label: "4000 Hz" },
          { value: "8000", label: "8000 Hz" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "buttons",
        label: "Number of Buttons",
        type: "number",
        required: true,
        min: 2,
        max: 20,
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
        allowOther: true,
        options: [
          { value: "15.6", label: "15.6\"" },
          { value: "16", label: "16\"" },
          { value: "17.3", label: "17.3\"" },
          { value: "18.5", label: "18.5\"" },
          { value: "19", label: "19\"" },
          { value: "20", label: "20\"" },
          { value: "21.5", label: "21.5\"" },
          { value: "22", label: "22\"" },
          { value: "23", label: "23\"" },
          { value: "23.8", label: "23.8\"" },
          { value: "24", label: "24\"" },
          { value: "24.5", label: "24.5\"" },
          { value: "25", label: "25\"" },
          { value: "27", label: "27\"" },
          { value: "28", label: "28\"" },
          { value: "29", label: "29\"" },
          { value: "31.5", label: "31.5\"" },
          { value: "32", label: "32\"" },
          { value: "34", label: "34\"" },
          { value: "38", label: "38\"" },
          { value: "40", label: "40\"" },
          { value: "42", label: "42\"" },
          { value: "43", label: "43\"" },
          { value: "45", label: "45\"" },
          { value: "49", label: "49\" Super Ultrawide" },
          { value: "55", label: "55\"" },
          { value: "57", label: "57\"" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "refresh_hz",
        label: "Refresh rate",
        type: "select",
        required: true,
        allowOther: true,
        options: [
          { value: "60", label: "60 Hz" },
          { value: "75", label: "75 Hz" },
          { value: "90", label: "90 Hz" },
          { value: "100", label: "100 Hz" },
          { value: "120", label: "120 Hz" },
          { value: "144", label: "144 Hz" },
          { value: "165", label: "165 Hz" },
          { value: "170", label: "170 Hz" },
          { value: "180", label: "180 Hz" },
          { value: "200", label: "200 Hz" },
          { value: "240", label: "240 Hz" },
          { value: "250", label: "250 Hz" },
          { value: "260", label: "260 Hz" },
          { value: "280", label: "280 Hz" },
          { value: "300", label: "300 Hz" },
          { value: "360", label: "360 Hz" },
          { value: "400", label: "400 Hz" },
          { value: "480", label: "480 Hz" },
          { value: "500", label: "500 Hz" },
          { value: "540", label: "540 Hz" },
          { value: "600", label: "600 Hz" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "panel",
        label: "Panel / technology",
        type: "select",
        required: true,
        allowOther: true,
        options: [
          { value: "ips", label: "IPS" },
          { value: "fast_ips", label: "Fast IPS" },
          { value: "nano_ips", label: "Nano IPS" },
          { value: "ips_black", label: "IPS Black" },
          { value: "va", label: "VA" },
          { value: "fast_va", label: "Fast VA / Rapid VA" },
          { value: "tn", label: "TN" },
          { value: "oled", label: "OLED" },
          { value: "woled", label: "WOLED" },
          { value: "qd_oled", label: "QD-OLED" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "resolution",
        label: "Resolution",
        type: "select",
        required: true,
        allowOther: true,
        options: [
          { value: "hd_720", label: "1280 x 720 — HD / 720p" },
          { value: "hd_1366", label: "1366 x 768 — HD" },
          { value: "hd_plus", label: "1600 x 900 — HD+" },
          { value: "fhd", label: "1920 x 1080 — Full HD / FHD" },
          { value: "wuxga", label: "1920 x 1200 — WUXGA" },
          { value: "uw_fhd", label: "2560 x 1080 — UW-FHD" },
          { value: "qhd", label: "2560 x 1440 — QHD / WQHD / 1440p" },
          { value: "wqxga", label: "2560 x 1600 — WQXGA" },
          { value: "uwqhd", label: "3440 x 1440 — UWQHD" },
          { value: "dfhd", label: "3840 x 1080 — DFHD" },
          { value: "uwqhd_plus", label: "3840 x 1600 — UWQHD+" },
          { value: "4k", label: "3840 x 2160 — 4K UHD" },
          { value: "dqhd", label: "5120 x 1440 — DQHD" },
          { value: "5k2k", label: "5120 x 2160 — 5K2K / WUHD" },
          { value: "5k", label: "5120 x 2880 — 5K" },
          { value: "6k", label: "6016 x 3384 — 6K" },
          { value: "duhd", label: "7680 x 2160 — DUHD" },
          { value: "8k", label: "7680 x 4320 — 8K UHD" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
};

export function fieldAllowsOther(field) {
  if (!field) return false;
  if (field.allowOther) return true;
  return (field.options || []).some((o) => o.value === "other");
}

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
    } else if (field.type === "text") {
      const text = String(raw).trim();
      if (field.required && !text) {
        errors[field.key] = `${field.label} is required for this category.`;
        continue;
      }
      const max = field.max ?? 80;
      if (text.length > max) {
        errors[field.key] = `${field.label} must be at most ${max} characters.`;
        continue;
      }
      payload[field.key] = text;
    } else {
      const text = String(raw).trim();
      const optionValues = (field.options || []).map((o) => o.value);
      const allowsOther = fieldAllowsOther(field);
      if (allowsOther && (text === "other" || text === "Other")) {
        errors[field.key] = `Enter the ${field.label.toLowerCase()} (Other is selected).`;
        continue;
      }
      if (!allowsOther && optionValues.length > 0 && !optionValues.includes(text)) {
        errors[field.key] = `Choose a valid ${field.label.toLowerCase()}.`;
        continue;
      }
      if (allowsOther && text.length > (field.max ?? 80)) {
        errors[field.key] = `${field.label} must be at most ${field.max ?? 80} characters.`;
        continue;
      }
      payload[field.key] = text;
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
    if (fieldAllowsOther(field) && (raw === "other" || raw === "Other")) return false;
    return raw !== "" && raw != null;
  });
}

export function formatAttributeValue(field, value) {
  if (value === "" || value == null) return "";
  if (field?.type === "boolean") {
    return value === true || value === "true" ? "Yes" : "No";
  }
  if (field?.type === "number" || field?.type === "text") return String(value);
  const opt = field?.options?.find((o) => o.value === value);
  return opt?.label || String(value);
}

export function selectControlValue(field, stored) {
  if (stored === "" || stored == null) return "";
  const values = (field?.options || []).map((o) => o.value);
  if (values.includes(stored)) return stored;
  return fieldAllowsOther(field) ? "other" : stored;
}

export function selectCustomValue(field, stored) {
  if (!fieldAllowsOther(field) || stored === "" || stored == null) return "";
  const values = (field.options || []).map((o) => o.value);
  if (values.includes(stored) && stored !== "other") return "";
  return stored === "other" ? "" : String(stored);
}
