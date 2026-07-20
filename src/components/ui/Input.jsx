export default function Input({
  label,
  id,
  hint,
  leftIcon,
  rightIcon,
  className = "",
  containerClassName = "",
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rb-muted">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "w-full rounded-xl border border-rb-border bg-rb-pink/60 px-4 py-3 text-sm text-rb-ink",
            "placeholder:text-rb-muted/70 outline-none transition",
            "focus:border-rb-red focus:bg-white focus:ring-2 focus:ring-rb-red/15",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rb-muted">
            {rightIcon}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-rb-muted">{hint}</p>}
    </div>
  );
}
