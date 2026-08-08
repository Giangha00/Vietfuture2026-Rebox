import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Logo({ className = "", light = false }) {
  return (
    <Link
      href={ROUTES.home}
      className={`inline-flex items-center gap-2 text-2xl font-bold tracking-tight ${
        light ? "text-white" : "text-rb-green"
      } ${className}`}
    >
      <span
        className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-bold ${
          light ? "bg-white text-rb-green" : "bg-rb-green text-white"
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M7 7h10v10H7z" />
          <path d="M9 3v4M15 3v4M9 17v4M15 17v4" strokeLinecap="round" />
        </svg>
      </span>
      ReBox
    </Link>
  );
}
