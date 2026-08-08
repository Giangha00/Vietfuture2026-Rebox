import Image from "next/image";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f3ee]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
        <div className="animate-fade-up">
          <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-rb-ink sm:text-5xl lg:text-[3.25rem]">
            Quality second-hand, fair prices, a new{" "}
            <span className="text-rb-green">life cycle</span>.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-rb-muted sm:text-lg">
            A transparent marketplace for sustainable shopping — buy and sell
            with clarity, trust, and less waste.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={ROUTES.products} size="lg">
              Shop now
            </Button>
            <Button href={ROUTES.about} variant="secondary" size="lg">
              Learn more
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up-delay">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80"
              alt="Curated second-hand lifestyle products"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
