export default function Stepper({
  steps = [
    { id: 1, label: "Account Info" },
    { id: 2, label: "eKYC" },
  ],
  current = 1,
}) {
  return (
    <ol className="mb-8 flex items-center gap-3">
      {steps.map((step, index) => {
        const active = step.id === current;
        const done = step.id < current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={[
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                  active || done
                    ? "bg-rb-red text-white"
                    : "bg-stone-200 text-rb-muted",
                ].join(" ")}
              >
                {step.id}
              </span>
              <span
                className={[
                  "text-sm font-medium",
                  active ? "text-rb-ink" : "text-rb-muted",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={[
                  "h-px flex-1",
                  done ? "bg-rb-red" : "bg-stone-200",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
