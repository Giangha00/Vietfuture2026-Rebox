import {
  AboutHero,
  PhilosophySection,
  ProcessSection,
  MissionVisionGrid,
  AboutNetworkSection,
} from "@/components/about/AboutSections";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <PhilosophySection />
      <ProcessSection />
      <MissionVisionGrid />
      <AboutNetworkSection />
    </>
  );
}
