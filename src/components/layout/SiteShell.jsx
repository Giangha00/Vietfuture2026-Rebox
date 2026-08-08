"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import VerifyEmailBanner from "@/components/auth/VerifyEmailBanner";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const showFab = pathname.startsWith("/products");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <VerifyEmailBanner />
      <main className="flex-1 bg-rb-surface/40">{children}</main>
      <Footer />
      {showFab && <FloatingActionButton />}
    </div>
  );
}
