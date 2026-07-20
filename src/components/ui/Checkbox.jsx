"use client";

export default function Checkbox({
  label,
  checked,
  onChange,
  id,
  className = "",
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2.5 text-sm text-rb-ink ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-rb-border accent-rb-red"
      />
      {label}
    </label>
  );
}
