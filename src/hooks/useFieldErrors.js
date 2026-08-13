"use client";

import { useCallback, useState } from "react";
import { hasFieldErrors } from "@/lib/validation";

/**
 * Shared field/form error state for auth and listing forms.
 * @param {Record<string, string>} [initial]
 */
export function useFieldErrors(initial = {}) {
  const [fieldErrors, setFieldErrors] = useState(initial);
  const [formError, setFormError] = useState("");

  const clearField = useCallback((name) => {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFieldErrors({});
    setFormError("");
  }, []);

  const setErrors = useCallback((errors = {}) => {
    setFieldErrors(errors);
  }, []);

  return {
    fieldErrors,
    setFieldErrors,
    formError,
    setFormError,
    clearField,
    clearAll,
    setErrors,
    hasErrors: hasFieldErrors(fieldErrors),
  };
}
