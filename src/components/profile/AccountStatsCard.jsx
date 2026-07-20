import Icon from "@/components/ui/Icon";

export default function AccountStatsCard({ user }) {
  return (
    <div className="rounded-2xl bg-rb-pink p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-rb-ink">
        Account Stats
      </h3>
      <ul className="space-y-3">
        {user.stats.map((stat) => (
          <li key={stat.label} className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-rb-red shadow-sm">
              <Icon name={stat.icon} className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs text-rb-muted">{stat.label}</p>
              <p className="font-bold text-rb-ink">{stat.value}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-rb-border/70 pt-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-rb-ink">Level {user.level}</span>
          <span className="text-rb-muted">{user.levelProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-rb-red"
            style={{ width: `${user.levelProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function SecurityBadgesCard({ badges }) {
  return (
    <div className="rounded-2xl bg-rb-teal p-5 text-white">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">
        Security
      </h3>
      <ul className="space-y-4">
        {badges.map((b) => (
          <li key={b.title} className="flex gap-3">
            <Icon name="shield" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">{b.title}</p>
              <p className="text-xs text-white/70">{b.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
