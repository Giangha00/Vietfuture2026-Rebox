import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function ProfileHeader({ user }) {
  return (
    <section className="border-b border-rb-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="relative size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-rb-ink">
              {user.name}
            </h1>
            <Badge tone="soft" className="mt-2" icon={<Icon name="star" className="size-3" />}>
              Trust Rating {user.rating}
            </Badge>
            <p className="mt-2 text-sm text-rb-muted">{user.bio}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <AuthGateButton href={ROUTES.postItem} reason={LOGIN_REASONS.sell}>
            Quick List Item
          </AuthGateButton>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>
    </section>
  );
}
