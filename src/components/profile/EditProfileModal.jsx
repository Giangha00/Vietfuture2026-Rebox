"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ImageDropzone from "@/components/ui/ImageDropzone";
import { useAuth } from "@/context/AuthContext";
import { backendUploadImages } from "@/lib/rebox-backend-api";
import { ROUTES } from "@/lib/routes";
import {
  PHONE_HINT,
  hasFieldErrors,
  normalizePhone,
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/validation";
import { useFieldErrors } from "@/hooks/useFieldErrors";

export default function EditProfileModal({ open, onClose }) {
  const { user, token, updateProfile, redirectToVerifyEmail } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const {
    fieldErrors,
    setFieldErrors,
    formError,
    setFormError,
    clearField,
  } = useFieldErrors();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    setFullName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setBio(user.bio === "Trusted marketplace member" ? "" : user.bio || "");
    setAvatarUrl(user.avatar || "");
    setAvatarPreview(user.avatar || "");
    setAvatarFile(null);
    setFieldErrors({});
    setFormError("");
  }, [open, setFieldErrors, setFormError, user]);

  function handleAvatarChange(file, errorMessage = "") {
    if (errorMessage || !file) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar:
          errorMessage ||
          "Drop an image file only (JPEG, PNG, WebP, or GIF).",
      }));
      return;
    }
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    const preview = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(preview);
    clearField("avatar");
    setFormError("");
  }

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      panelClassName="max-w-lg"
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!token) return;

          setSubmitting(true);
          setFormError("");

          try {
            const nameCheck = validateFullName(fullName);
            const emailCheck = validateEmail(email);
            const phoneCheck = validatePhone(phone, { required: true });
            const errors = {};
            if (!nameCheck.ok) errors.fullName = nameCheck.message;
            if (!emailCheck.ok) errors.email = emailCheck.message;
            if (!phoneCheck.ok) errors.phone = phoneCheck.message;
            if (hasFieldErrors(errors)) {
              setFieldErrors(errors);
              setSubmitting(false);
              return;
            }
            setFieldErrors({});

            let nextAvatarUrl = avatarUrl;
            if (avatarFile) {
              const urls = await backendUploadImages({
                token,
                files: [avatarFile],
              });
              nextAvatarUrl = urls[0] || nextAvatarUrl;
            }

            const previousEmail = user.email;
            const updated = await updateProfile({
              fullName: nameCheck.name,
              email: emailCheck.email,
              phone: phoneCheck.phone,
              bio: bio.trim(),
              avatarUrl: nextAvatarUrl,
            });
            onClose?.();

            const emailChanged =
              emailCheck.email.toLowerCase() !==
              String(previousEmail || "").toLowerCase();
            if (emailChanged && updated && !updated.emailVerified) {
              redirectToVerifyEmail({
                email: updated.email,
                redirect: ROUTES.profile,
              });
            }
          } catch (err) {
            setFormError(err?.message || "Could not update profile.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <ImageDropzone
          mode="single"
          previewUrl={avatarPreview || avatarUrl || "/default-avatar.svg"}
          onFileChange={handleAvatarChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          emptyLabel="Change photo"
          error={fieldErrors.avatar}
        />

        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            clearField("fullName");
          }}
          required
          error={fieldErrors.fullName}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearField("email");
          }}
          required
          error={fieldErrors.email}
        />
        <Input
          label="Phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => {
            setPhone(normalizePhone(e.target.value));
            clearField("phone");
          }}
          placeholder="0901234567"
          required
          maxLength={10}
          error={fieldErrors.phone}
          hint={fieldErrors.phone ? undefined : PHONE_HINT}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={280}
            className="rounded-xl border border-rb-border bg-rb-surface/60 px-4 py-3 text-sm outline-none focus:border-rb-green focus:bg-white"
            placeholder="Tell buyers a bit about yourself..."
          />
          <p className="text-xs text-rb-muted">{bio.length}/280</p>
        </div>

        {formError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
