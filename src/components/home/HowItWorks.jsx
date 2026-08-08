import Icon from "@/components/ui/Icon";

const STEPS = [
  {
    icon: "camera",
    title: "List an item",
    desc: "Snap photos, add details, and publish in minutes.",
  },
  {
    icon: "message",
    title: "Chat & agree",
    desc: "Talk with buyers or sellers to confirm the deal.",
  },
  {
    icon: "lock",
    title: "Secure payment",
    desc: "Pay safely with escrow until the item is received.",
  },
  {
    icon: "box",
    title: "Courier delivery",
    desc: "Courier picks up from the seller and delivers to your door.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-rb-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-rb-ink">
            How ReBox works
          </h2>
          <p className="mt-3 text-rb-muted">
            A simple path from listing to delivery.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <article key={step.title} className="text-center sm:text-left">
              <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-rb-green text-white sm:mx-0">
                <Icon name={step.icon} className="size-6" />
              </span>
              <h3 className="text-lg font-bold text-rb-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-rb-muted">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
