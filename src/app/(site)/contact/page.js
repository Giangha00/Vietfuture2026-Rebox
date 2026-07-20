import {
  ContactHero,
  ContactForm,
  ContactSidebar,
  GuaranteeBanner,
  FaqSection,
} from "@/components/contact/ContactSections";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <ContactForm />
        <ContactSidebar />
      </div>
      <GuaranteeBanner />
      <FaqSection />
    </>
  );
}
