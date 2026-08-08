/**
 * Format amounts as USD with "." thousand separators.
 * e.g. 12 → "$12", 1234 → "$1.234", 12.5 → "$12,5", 12.05 → "$12,05"
 */
export const MAX_PRODUCT_PRICE_DIGITS = 11;
export const MAX_PRODUCT_PRICE = 99_999_999_999; // 11 digits

function splitAmount(value) {
  const safe = Number.isFinite(value) ? value : 0;
  const fixed = Math.abs(safe).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  return {
    negative: safe < 0,
    intPart,
    decPart,
  };
}

function formatIntWithDots(intDigits) {
  const digits = String(intDigits || "0").replace(/\D/g, "") || "0";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatMoney(amount) {
  const value = Number(amount);
  const { negative, intPart, decPart } = splitAmount(
    Number.isFinite(value) ? value : 0,
  );
  const intFormatted = formatIntWithDots(intPart);
  const trimmedDec = decPart.replace(/0+$/, "");
  const body = trimmedDec
    ? `${intFormatted},${trimmedDec}`
    : intFormatted;
  return `${negative ? "-" : ""}$${body}`;
}

/**
 * Raw numeric string for storage/API: "1234567" or "1234567.5"
 * Display uses "." for thousands and "," for decimals.
 */
export function formatPriceInput(raw) {
  if (raw === "" || raw == null) return "";
  const text = String(raw);
  const hasDecimal = text.includes(".");
  const [intPart = "", decPart = ""] = text.split(".");
  const intDigits = intPart.replace(/\D/g, "");
  const formattedInt = intDigits
    ? formatIntWithDots(intDigits)
    : hasDecimal
      ? "0"
      : "";

  if (!hasDecimal) return formattedInt;
  return `${formattedInt},${decPart.replace(/\D/g, "").slice(0, 2)}`;
}

/**
 * Parse typed display into raw numeric string; max 11 digits; max 2 decimals.
 * "." separates thousands (1.234.567); "," is decimal (25,99).
 * A single "." with at most 2 digits after it is also treated as decimal (25.99).
 */
export function sanitizePriceInput(raw) {
  const text = String(raw ?? "");
  const cleaned = text.replace(/[^\d.,]/g, "");
  if (!cleaned) return "";

  let intDigits = "";
  let decDigits = "";
  let hasDecimal = false;

  const commaIdx = cleaned.indexOf(",");
  const dotCount = (cleaned.match(/\./g) || []).length;

  if (commaIdx !== -1) {
    hasDecimal = true;
    intDigits = cleaned.slice(0, commaIdx).replace(/\D/g, "");
    decDigits = cleaned
      .slice(commaIdx + 1)
      .replace(/\D/g, "")
      .slice(0, 2);
  } else if (dotCount === 1) {
    const [left = "", right = ""] = cleaned.split(".");
    const leftDigits = left.replace(/\D/g, "");
    const rightDigits = right.replace(/\D/g, "");
    if (rightDigits.length <= 2) {
      hasDecimal = true;
      intDigits = leftDigits;
      decDigits = rightDigits.slice(0, 2);
    } else {
      intDigits = `${leftDigits}${rightDigits}`;
    }
  } else {
    intDigits = cleaned.replace(/\D/g, "");
  }

  const digitBudget = MAX_PRODUCT_PRICE_DIGITS;
  if (intDigits.length > digitBudget) {
    intDigits = intDigits.slice(0, digitBudget);
    decDigits = "";
    hasDecimal = false;
  } else if (intDigits.length + decDigits.length > digitBudget) {
    decDigits = decDigits.slice(0, digitBudget - intDigits.length);
  }

  if (hasDecimal) return `${intDigits}.${decDigits}`;
  return intDigits;
}

/** Returns an error message, or "" if price is valid. */
export function validateProductPrice(price) {
  const raw = String(price ?? "").trim();
  if (!raw) {
    return "Price is required. Enter an amount greater than $0.";
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length > MAX_PRODUCT_PRICE_DIGITS) {
    return `Price can have at most ${MAX_PRODUCT_PRICE_DIGITS} digits (you entered ${digits.length}).`;
  }

  const value = Number(price);
  if (!Number.isFinite(value)) {
    return "Price must be a valid number. Use formats like 25,99 or 1.000.000.";
  }
  if (value <= 0) {
    return "Price must be greater than $0.";
  }
  if (value > MAX_PRODUCT_PRICE) {
    return `Price must be at most ${formatMoney(MAX_PRODUCT_PRICE)}.`;
  }
  return "";
}
