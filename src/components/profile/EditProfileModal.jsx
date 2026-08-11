"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
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
import {
  MAX_IMAGE_LABEL,
  imageFilesFromList,
  validateImageFile,
} from "@/lib/image-upload";

export default function EditProfileModal({ open, onClose }) {
  const { user, token, updateProfile, redirectToVerifyEmail } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [avatarDragOver, setAvatarDragOver] = useState(false);

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
    setAvatarDragOver(false);
  }, [open, user]);

  function clearField(name) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function applyAvatarFile(file) {
    if (!file) return;
    const check = validateImageFile(file, { field: "Avatar image" });
    if (!check.ok) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar: `${check.message} Use JPEG, PNG, WebP, or GIF.`,
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
        <div
          className={[
            "flex items-center gap-4 rounded-2xl border border-dashed p-3 transition-colors",
            avatarDragOver
              ? "border-rb-green bg-rb-green/5"
              : "border-transparent",
          ].join(" ")}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAvatarDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAvatarDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAvatarDragOver(false);
            const [file] = imageFilesFromList(e.dataTransfer?.files);
            if (!file) {
              setFieldErrors((prev) => ({
                ...prev,
                avatar: "Drop an image file only (JPEG, PNG, WebP, or GIF).",
              }));
              return;
            }
            applyAvatarFile(file);
          }}
        >
          <div className="relative size-20 overflow-hidden rounded-full border border-rb-border bg-rb-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPreview || avatarUrl || "/default-avatar.svg"}
              alt={fullName || "Avatar"}
              className="size-full object-cover"
            />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) applyAvatarFile(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="camera" className="size-4" />
              {avatarDragOver ? "Drop photo" : "Change photo"}
            </Button>
            <p className="mt-1.5 text-xs text-rb-muted">
              Click or drag and drop · max {MAX_IMAGE_LABEL}
            </p>
            {fieldErrors.avatar ? (
              <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                {fieldErrors.avatar}
              </p>
            ) : null}
          </div>
        </div>

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
