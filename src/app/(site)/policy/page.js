import {
  PolicySidebar,
  TermsSection,
  PrivacySection,
  ShippingSection,
  RefundSection,
} from "@/components/policy/PolicySections";

export const metadata = {
  title: "Policy Center",
};

export default function PolicyPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <PolicySidebar />
      <div>
        <TermsSection />
        <PrivacySection />
        <ShippingSection />
        <RefundSection />
      </div>
    </div>
  );
}
