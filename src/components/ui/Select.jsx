export default function Select({
  label,
  id,
  options = [],
  className = "",
  ...props
}) {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-bold uppercase tracking-[0.08em] text-rb-ink"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          "w-full appearance-none rounded-xl border border-rb-border bg-white px-4 py-3 text-sm text-rb-ink",
          "outline-none transition focus:border-rb-red focus:ring-2 focus:ring-rb-red/15",
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
    </div>
  );
}
