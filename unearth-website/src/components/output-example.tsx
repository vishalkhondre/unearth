export function OutputExample({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-fd-border)] overflow-hidden my-6">
      {/* Filename header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-fd-secondary)] border-b border-[var(--color-fd-border)]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-fd-muted-foreground)] shrink-0"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <code className="text-xs font-medium text-[var(--color-fd-muted-foreground)]">
          {filename}
        </code>
        <span className="ml-auto text-[0.625rem] font-medium uppercase tracking-wider text-[var(--color-fd-muted-foreground)] opacity-60">
          Sample output
        </span>
      </div>

      {/* Content */}
      <div className="p-4 text-sm overflow-x-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-sm [&_th]:text-left [&_td]:py-1 [&_th]:py-1">
          {children}
        </div>
      </div>
    </div>
  );
}
