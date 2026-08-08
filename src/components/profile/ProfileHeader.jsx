"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES, verifyEmailWithParams } from "@/lib/routes";

export default function ProfileHeader({ user, listingCount = 0 }) {
  const [editOpen, setEditOpen] = useState(false);
  const joinedYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-rb-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md sm:size-28">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-rb-ink sm:text-3xl">
                  {user.name}
                </h1>
                {user.emailVerified ? (
                  <Badge tone="soft" icon={<Icon name="check" className="size-3" />}>
                    Verified
                  </Badge>
                ) : (
                  <Badge tone="orange">Unverified</Badge>
                )}
              </div>
              {!user.emailVerified ? (
                <p className="mt-2 text-sm text-amber-800">
                  Email not verified.{" "}
                  <a
                    href={verifyEmailWithParams({
                      email: user.email,
                      redirect: ROUTES.profile,
                    })}
                    className="font-semibold underline-offset-2 hover:underline"
                  >
                    Enter verification code
                  </a>
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-rb-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="star" className="size-4 text-amber-400" />
                  {user.rating || "—"} rating
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="box" className="size-4" />
                  {listingCount} listed
                </span>
                {joinedYear ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" className="size-4" />
                    Joined {joinedYear}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setEditOpen(true)}>
                  Edit profile
                </Button>
                <AuthGateButton
                  href={ROUTES.postItem}
                  reason={LOGIN_REASONS.sell}
                  size="sm"
                  variant="outline"
                >
                  Post item
                </AuthGateButton>
                <Button size="sm" variant="secondary" aria-label="Share">
                  <Icon name="arrow" className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl bg-rb-surface p-4 lg:max-w-sm">
            <p className="text-sm leading-relaxed text-rb-muted">
              {user.bio || "Trusted marketplace member on ReBox."}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rb-green-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rb-green">
              <Icon name="mapPin" className="size-3.5" />
              Trusted seller
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </section>
  );
}
