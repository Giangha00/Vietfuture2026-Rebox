"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActionButton from "@/components/layout/FloatingActionButton";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const showFab = pathname.startsWith("/products");
  const compactFooter =
    pathname.startsWith("/policy") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/contact");

  return (
    <div className="flex min-h-screen flex-col rb-grain">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer variant={compactFooter ? "compact" : "default"} />
      {showFab && <FloatingActionButton />}
    </div>
  );
}
