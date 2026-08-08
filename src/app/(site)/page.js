import HeroSection from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRails } from "@/components/home/ProductRails";
import { HowItWorks } from "@/components/home/HowItWorks";

export const metadata = {
  title: "Quality second-hand, fair prices",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <ProductRails />
      <HowItWorks />
    </>
  );
}
