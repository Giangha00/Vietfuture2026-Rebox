import Link from "next/link";

const variants = {
  primary:
    "bg-rb-red text-white hover:bg-rb-red-dark shadow-sm shadow-rb-red/20",
  secondary:
    "bg-white text-rb-ink border border-rb-border hover:border-rb-red/40 hover:bg-rb-red-soft",
  outline:
    "bg-transparent text-rb-red border border-rb-red hover:bg-rb-red hover:text-white",
  ghost: "bg-transparent text-rb-ink hover:bg-rb-red-soft",
  white: "bg-white text-rb-red hover:bg-rb-red-soft",
  "white-outline":
    "bg-transparent text-white border border-white/70 hover:bg-white/10",
  dark: "bg-rb-brown text-white hover:bg-rb-ink",
  soft: "bg-rb-red-soft text-rb-red hover:bg-rb-border",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  fullWidth = false,
  type = "button",
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-red",
    "disabled:opacity-50 disabled:pointer-events-none",
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
