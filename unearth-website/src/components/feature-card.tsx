import { Icon, type IconName } from "./icons";

export function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: IconName;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-fd-border)] p-6 transition-colors hover:border-[var(--color-fd-muted-foreground)]/30">
      <div className="mb-3 text-[var(--color-fd-muted-foreground)]">
        <Icon name={icon} size={28} />
      </div>
      <h3 className="text-base font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-fd-muted-foreground)] leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
