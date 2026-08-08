export default function Select({
  label,
  id,
  options = [],
  error,
  hint,
  className = "",
  containerClassName = "",
  ...props
}) {
  const selectId = id || props.name;
  const describedBy = error
    ? `${selectId}-error`
    : hint
      ? `${selectId}-hint`
      : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-muted"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={[
          "w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-rb-ink",
          "outline-none transition",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-rb-border focus:border-rb-green focus:ring-2 focus:ring-rb-green/15",
          className,
        ].join(" ")}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="text-xs text-rb-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
