import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="animate-fade-up">
          <Badge tone="soft" className="mb-5 uppercase tracking-[0.12em]">
            Escrow Protected Marketplace
          </Badge>
          <h1 className="font-display text-4xl leading-[1.1] font-bold tracking-tight text-rb-ink sm:text-5xl lg:text-[3.4rem]">
            Silent Shopping – Standardized Box Shipping
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-rb-muted sm:text-lg">
            Trade second-hand goods without the friction. Pack, drop at a ReBox
            Station, and get paid under 48h escrow protection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AuthGateButton href={ROUTES.postItem} reason={LOGIN_REASONS.sell} size="lg">
              Start Selling
            </AuthGateButton>
            <Button href={ROUTES.products} variant="secondary" size="lg">
              Browse Items
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up-delay">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&q=80"
              alt="Person packing a ReBox"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-rb-ink/25 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-rb-ink">Verified Seller</p>
              <p className="text-xs text-rb-muted">Seller identity confirmed</p>
            </div>
            <div className="ml-2 flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="size-7 rounded-full border-2 border-white bg-stone-300"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
