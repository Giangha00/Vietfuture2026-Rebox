import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Logo({ className = "", light = false }) {
  return (
    <Link
      href={ROUTES.home}
      className={`inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight ${
        light ? "text-white" : "text-rb-red"
      } ${className}`}
    >
      <span
        className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-bold ${
          light ? "bg-white text-rb-red" : "bg-rb-red text-white"
        }`}
      >
        R
      </span>
      ReBox
    </Link>
  );
}
