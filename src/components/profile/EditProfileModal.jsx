"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { backendUploadImages } from "@/lib/rebox-backend-api";

export default function EditProfileModal({ open, onClose }) {
  const { user, token, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
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
    setError("");
  }, [open, user]);

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
          setError("");

          try {
            let nextAvatarUrl = avatarUrl;
            if (avatarFile) {
              const urls = await backendUploadImages({
                token,
                files: [avatarFile],
              });
              nextAvatarUrl = urls[0] || nextAvatarUrl;
            }

            await updateProfile({
              fullName: fullName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              bio: bio.trim(),
              avatarUrl: nextAvatarUrl,
            });
            onClose?.();
          } catch (err) {
            setError(err?.message || "Could not update profile.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative size-20 overflow-hidden rounded-full border border-rb-border bg-rb-pink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPreview || avatarUrl}
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
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  setError("Avatar must be under 5MB.");
                  e.target.value = "";
                  return;
                }
                if (avatarPreview?.startsWith("blob:")) {
                  URL.revokeObjectURL(avatarPreview);
                }
                const preview = URL.createObjectURL(file);
                setAvatarFile(file);
                setAvatarPreview(preview);
                setError("");
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="camera" className="size-4" />
              Change photo
            </Button>
          </div>
        </div>

        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901234567"
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
            className="rounded-xl border border-rb-border bg-rb-pink/60 px-4 py-3 text-sm outline-none focus:border-rb-red focus:bg-white"
            placeholder="Tell buyers a bit about yourself..."
          />
          <p className="text-xs text-rb-muted">{bio.length}/280</p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
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
