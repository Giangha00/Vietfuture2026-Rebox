export const LOGIN_REASONS = {
  sell: "sell",
  buy: "buy",
  contact: "contact",
  default: "default",
};

export const AUTH_STORAGE_KEY = "rebox_auth_user";

/** Backend 403 body when email is not verified yet. */
export function isNeedsVerificationError(error) {
  return Boolean(
    error?.needsVerification ||
      error?.data?.needsVerification ||
      (error?.status === 403 &&
        /verify your email/i.test(String(error?.message || ""))),
  );
}

export function getVerificationEmailFromError(error, fallback = "") {
  return (
    error?.email ||
    error?.data?.email ||
    fallback ||
    ""
  );
}
