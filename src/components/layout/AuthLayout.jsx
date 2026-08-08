import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children, showLogo = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-rb-surface">
      {showLogo ? (
        <header className="flex justify-center px-4 pt-10 sm:px-8">
          <Logo className="text-3xl" />
        </header>
      ) : null}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        {children}
      </main>
      <Footer variant="auth" />
    </div>
  );
}
