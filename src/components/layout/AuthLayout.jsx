import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col rb-grain">
      <header className="px-4 py-6 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center px-4 pb-10">
        {children}
      </main>
      <Footer variant="auth" />
    </div>
  );
}
