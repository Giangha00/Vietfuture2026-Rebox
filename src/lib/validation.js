const PHONE_HINT = "Use a 10-digit Vietnamese mobile number, e.g. 0901234567.";
const PASSWORD_HINT =
  "At least 8 characters, with uppercase, lowercase, a number, and a special character.";

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function normalizePhone(value) {
  return digitsOnly(value).slice(0, 10);
}

export function isValidPhone(value, { required = true } = {}) {
  const phone = normalizePhone(value);
  if (!phone) return !required;
  return /^\d{10}$/.test(phone);
}

export function validatePhone(value, { required = true, field = "Phone number" } = {}) {
  const phone = normalizePhone(value);
  if (!phone) {
    if (required) {
      return {
        ok: false,
        message: `${field} is required. Enter a 10-digit mobile number.`,
        phone: "",
      };
    }
    return { ok: true, message: "", phone: "" };
  }
  if (phone.length < 10) {
    return {
      ok: false,
      message: `${field} must be exactly 10 digits (you entered ${phone.length}).`,
      phone,
    };
  }
  if (!/^\d{10}$/.test(phone)) {
    return {
      ok: false,
      message: `${field} can only contain digits. ${PHONE_HINT}`,
      phone,
    };
  }
  return { ok: true, message: "", phone };
}

export function isValidPassword(value) {
  return validatePassword(value).ok;
}

export function validatePassword(value, { field = "Password" } = {}) {
  const password = String(value || "");
  if (!password) {
    return { ok: false, message: `${field} is required.` };
  }
  if (password.length < 8) {
    return {
      ok: false,
      message: `${field} must be at least 8 characters (currently ${password.length}).`,
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      message: `${field} must include at least one uppercase letter (A–Z).`,
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      message: `${field} must include at least one lowercase letter (a–z).`,
    };
  }
  if (!/\d/.test(password)) {
    return {
      ok: false,
      message: `${field} must include at least one number (0–9).`,
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      ok: false,
      message: `${field} must include at least one special character (e.g. ! @ # $ %).`,
    };
  }
  return { ok: true, message: "" };
}

export function validateConfirmPassword(
  password,
  confirm,
  { field = "Confirm password" } = {},
) {
  const value = String(confirm || "");
  if (!value) {
    return { ok: false, message: `${field} is required. Re-enter your password.` };
  }
  if (value !== String(password || "")) {
    return {
      ok: false,
      message: `${field} does not match. Make sure both passwords are identical.`,
    };
  }
  return { ok: true, message: "" };
}

export function isValidEmail(value) {
  const email = String(value || "").trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateEmail(value, { required = true, field = "Email" } = {}) {
  const email = String(value || "").trim();
  if (!email) {
    if (required) {
      return {
        ok: false,
        message: `${field} is required. Example: you@example.com`,
        email: "",
      };
    }
    return { ok: true, message: "", email: "" };
  }
  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: `${field} looks invalid. Use a format like name@domain.com`,
      email,
    };
  }
  return { ok: true, message: "", email };
}

export function validateFullName(value, { required = true, field = "Full name" } = {}) {
  const name = String(value || "").trim();
  if (!name) {
    if (required) {
      return {
        ok: false,
        message: `${field} is required so we know who to contact.`,
        name: "",
      };
    }
    return { ok: true, message: "", name: "" };
  }
  if (name.length < 2) {
    return {
      ok: false,
      message: `${field} must be at least 2 characters.`,
      name,
    };
  }
  return { ok: true, message: "", name };
}

export function validateRequiredText(
  value,
  { required = true, field = "This field", min = 1, max } = {},
) {
  const text = String(value || "").trim();
  if (!text) {
    if (required) {
      return {
        ok: false,
        message: `${field} is required.`,
        value: "",
      };
    }
    return { ok: true, message: "", value: "" };
  }
  if (text.length < min) {
    return {
      ok: false,
      message: `${field} must be at least ${min} characters (currently ${text.length}).`,
      value: text,
    };
  }
  if (max != null && text.length > max) {
    return {
      ok: false,
      message: `${field} must be at most ${max} characters (currently ${text.length}).`,
      value: text,
    };
  }
  return { ok: true, message: "", value: text };
}

export function validateOtp(value, { field = "OTP code", length = 6 } = {}) {
  const otp = digitsOnly(value).slice(0, length);
  if (!otp) {
    return {
      ok: false,
      message: `${field} is required. Enter the ${length}-digit code from your email.`,
      otp: "",
    };
  }
  if (otp.length < length) {
    return {
      ok: false,
      message: `${field} must be ${length} digits (you entered ${otp.length}).`,
      otp,
    };
  }
  return { ok: true, message: "", otp };
}

export function validateSelect(
  value,
  { required = true, field = "This field" } = {},
) {
  const selected = String(value || "").trim();
  if (!selected) {
    if (required) {
      return { ok: false, message: `Please select a ${field.toLowerCase()}.` };
    }
    return { ok: true, message: "", value: "" };
  }
  return { ok: true, message: "", value: selected };
}

/**
 * Validate common address shape used for pickup / delivery.
 * Returns { ok, errors: { fieldKey: message }, address }.
 */
export function validateAddress(
  address = {},
  {
    requiredFields = ["phone", "line1", "city"],
    labels = {},
  } = {},
) {
  const defaults = {
    fullName: "Full name",
    phone: "Phone",
    line1: "Address line",
    line2: "Address line 2",
    district: "District",
    city: "City",
    note: "Note",
  };
  const labelOf = (key) => labels[key] || defaults[key] || key;
  const errors = {};
  const normalized = {
    fullName: String(address.fullName || "").trim(),
    phone: normalizePhone(address.phone),
    line1: String(address.line1 || "").trim(),
    line2: String(address.line2 || "").trim(),
    district: String(address.district || "").trim(),
    city: String(address.city || "").trim(),
    note: String(address.note || "").trim(),
  };

  for (const key of requiredFields) {
    if (key === "phone") {
      const phoneCheck = validatePhone(normalized.phone, {
        required: true,
        field: labelOf("phone"),
      });
      if (!phoneCheck.ok) errors.phone = phoneCheck.message;
      else normalized.phone = phoneCheck.phone;
      continue;
    }
    if (key === "fullName") {
      const nameCheck = validateFullName(normalized.fullName, {
        required: true,
        field: labelOf("fullName"),
      });
      if (!nameCheck.ok) errors.fullName = nameCheck.message;
      else normalized.fullName = nameCheck.name;
      continue;
    }
    const check = validateRequiredText(normalized[key], {
      required: true,
      field: labelOf(key),
      min: 2,
    });
    if (!check.ok) errors[key] = check.message;
    else normalized[key] = check.value;
  }

  // Optional phone still validated if filled
  if (!requiredFields.includes("phone") && normalized.phone) {
    const phoneCheck = validatePhone(normalized.phone, {
      required: false,
      field: labelOf("phone"),
    });
    if (!phoneCheck.ok) errors.phone = phoneCheck.message;
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    address: normalized,
  };
}

/** Merge field errors; keep first message per key. */
export function mergeFieldErrors(...groups) {
  return groups.reduce((acc, group) => {
    if (!group) return acc;
    for (const [key, message] of Object.entries(group)) {
      if (message && !acc[key]) acc[key] = message;
    }
    return acc;
  }, {});
}

export function hasFieldErrors(errors = {}) {
  return Object.keys(errors).some((key) => Boolean(errors[key]));
}

export { PHONE_HINT, PASSWORD_HINT };
