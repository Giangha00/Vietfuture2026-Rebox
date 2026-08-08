export default function Input({
  label,
  id,
  hint,
  error,
  leftIcon,
  rightIcon,
  className = "",
  containerClassName = "",
  ...props
}) {
  const inputId = id || props.name;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted"
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
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={[
            "w-full rounded-xl border bg-rb-surface px-4 py-3 text-sm text-rb-ink",
            "placeholder:text-rb-muted/70 outline-none transition",
            error
              ? "border-red-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200"
              : "border-rb-border focus:border-rb-green focus:bg-white focus:ring-2 focus:ring-rb-green/15",
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
      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-rb-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
