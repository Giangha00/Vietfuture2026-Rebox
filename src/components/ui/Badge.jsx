const tones = {
  red: "bg-rb-green text-white",
  soft: "bg-rb-green-soft text-rb-green",
  blue: "bg-rb-blue-soft text-sky-800",
  green: "bg-rb-mint text-rb-green",
  dark: "bg-rb-green text-white",
  gray: "bg-stone-100 text-stone-700",
  outline: "bg-white/90 text-rb-ink border border-white/80 backdrop-blur",
  danger: "bg-rb-danger-soft text-rb-danger",
  orange: "bg-orange-100 text-orange-800",
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
