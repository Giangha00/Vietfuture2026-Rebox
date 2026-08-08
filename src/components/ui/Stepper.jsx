export default function Stepper({
  steps = [
    { id: 1, label: "Account Info" },
    { id: 2, label: "Confirm" },
  ],
  current = 1,
}) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const active = step.id === current;
        const done = step.id < current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={[
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  active || done
                    ? "bg-rb-green text-white"
                    : "bg-stone-200 text-rb-muted",
                ].join(" ")}
              >
                {step.id}
              </span>
              <span
                className={[
                  "hidden text-sm font-medium sm:inline truncate",
                  active ? "text-rb-ink" : "text-rb-muted",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={[
                  "h-px flex-1 min-w-4",
                  done ? "bg-rb-green" : "bg-stone-200",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
