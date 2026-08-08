import Button from "@/components/ui/Button";
import AuthGateButton from "@/components/auth/AuthGateButton";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-rb-green px-6 py-12 text-center text-white sm:px-12">
        <h2 className="font-sans text-3xl font-bold sm:text-4xl">
          Ready to clean out your closet?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/85">
          Join 40,000+ traders buying and selling with door-to-door courier delivery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AuthGateButton href={ROUTES.postItem} reason={LOGIN_REASONS.sell} variant="white" size="lg">
            List Your Item Now
          </AuthGateButton>
          <Button href={ROUTES.about} variant="white-outline" size="lg">
            How it works
          </Button>
        </div>
      </div>
    </section>
  );
}
