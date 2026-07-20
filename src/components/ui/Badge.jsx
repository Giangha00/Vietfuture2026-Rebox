const tones = {
  red: "bg-rb-red text-white",
  soft: "bg-rb-red-soft text-rb-red",
  blue: "bg-rb-blue-soft text-sky-800",
  green: "bg-emerald-100 text-emerald-800",
  dark: "bg-rb-navy text-white",
  gray: "bg-stone-100 text-stone-700",
  outline: "bg-white/90 text-rb-ink border border-white/80 backdrop-blur",
};

export default function Badge({
  children,
  tone = "soft",
  className = "",
  icon,
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone] ?? tones.soft,
        className,
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}
