import HeroSection from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import NetworkSection from "@/components/home/NetworkSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata = {
  title: "Silent Shopping – Standardized Box Shipping",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <HowItWorks />
      <NetworkSection />
      <TrustFeatures />
      <CtaBanner />
    </>
  );
}
