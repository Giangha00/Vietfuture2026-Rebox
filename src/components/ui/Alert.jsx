const variants = {
  info: "border-l-rb-red bg-rb-red-soft text-rb-ink",
  note: "border-l-sky-500 bg-sky-50 text-sky-950",
  warning:
    "border border-dashed border-rb-red/50 bg-orange-50 text-rb-ink rounded-xl border-l-0",
};

export default function Alert({
  children,
  title,
  variant = "info",
  icon,
  className = "",
}) {
  return (
    <div
      className={[
        "flex gap-3 rounded-r-xl border-l-4 px-4 py-3 text-sm",
        variants[variant] ?? variants.info,
        className,
      ].join(" ")}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="leading-relaxed text-rb-muted">{children}</div>
      </div>
    </div>
  );
}
