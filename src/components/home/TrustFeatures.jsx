import Icon from "@/components/ui/Icon";

const FEATURES = [
  {
    icon: "shield",
    title: "Escrow Protection",
    desc: "Funds held for 48 hours until inspection and confirmation.",
  },
  {
    icon: "user",
    title: "eKYC Verified Sellers",
    desc: "Every lister completes identity verification before going live.",
  },
  {
    icon: "box",
    title: "Verified Goods",
    desc: "AI condition grading plus packing and unboxing evidence.",
  },
];

export default function TrustFeatures() {
  return (
    <section className="bg-rb-navy py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="text-center md:text-left">
            <Icon name={f.icon} className="mx-auto mb-4 size-8 md:mx-0" />
            <h3 className="text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
