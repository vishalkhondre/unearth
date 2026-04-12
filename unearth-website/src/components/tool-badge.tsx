import Link from "next/link";

export function ToolBadge({ name, path }: { name: string; path: string }) {
  return (
    <Link
      href={path}
      className="inline-flex items-center px-4 py-2 rounded-lg border border-[var(--color-fd-border)] text-sm font-medium no-underline text-[var(--color-fd-foreground)] hover:border-[var(--color-fd-muted-foreground)]/40 transition-colors"
    >
      {name}
    </Link>
  );
}
