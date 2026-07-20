import {
  PolicySidebar,
  PolicyHeader,
  DataPrivacySection,
  EscrowSection,
  ProhibitedSection,
  DisputeSection,
  AcknowledgeSection,
} from "@/components/policy/PolicySections";

export const metadata = {
  title: "Policy & Terms",
};

export default function PolicyPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <PolicySidebar />
      <div>
        <PolicyHeader />
        <DataPrivacySection />
        <EscrowSection />
        <ProhibitedSection />
        <DisputeSection />
        <AcknowledgeSection />
      </div>
    </div>
  );
}
