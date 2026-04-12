import { stageColors } from "@/lib/data";

type StageKey = keyof typeof stageColors;

interface SkillRef {
  skill: string;
  section: string;
}

interface OutputRef {
  file: string;
  sections: string[];
}

function stageFromSkillId(id: string): StageKey {
  const num = parseInt(id.split("-")[0], 10);
  if (num <= 2) return "reconnaissance";
  if (num <= 5) return "structure";
  if (num <= 9) return "knowledge";
  return "assessment";
}

export function InputOutput({
  inputs,
  outputs,
  downstream,
}: {
  inputs: SkillRef[];
  outputs: OutputRef[];
  downstream?: string[];
}) {
  return (
    <div className="my-6 rounded-xl border border-[var(--color-fd-border)] overflow-hidden">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0">
        {/* Inputs */}
        <div className="p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fd-muted-foreground)] mb-3">
            Reads from
          </h4>
          {inputs.length === 0 ? (
            <p className="text-sm text-[var(--color-fd-muted-foreground)] italic">
              None -- first skill in the pipeline
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {inputs.map((input, i) => {
                const stage = stageFromSkillId(input.skill);
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: stageColors[stage] }}
                    />
                    <div>
                      <code className="text-xs font-semibold" style={{ color: stageColors[stage] }}>
                        {input.skill}
                      </code>
                      <span className="text-[var(--color-fd-muted-foreground)] ml-1">
                        {input.section}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center px-2 py-3 md:py-0">
          {/* Desktop: right arrow */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden md:block text-[var(--color-fd-muted-foreground)]"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {/* Mobile: down arrow */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block md:hidden text-[var(--color-fd-muted-foreground)]"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        {/* Outputs */}
        <div className="p-4 border-t md:border-t-0 md:border-l border-[var(--color-fd-border)]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fd-muted-foreground)] mb-3">
            Produces
          </h4>
          <div className="flex flex-col gap-2">
            {outputs.map((output, i) => (
              <div key={i}>
                <code className="text-xs font-semibold text-[var(--color-fd-foreground)]">
                  {output.file}
                </code>
                <div className="flex flex-wrap gap-1 mt-1">
                  {output.sections.map((s, j) => (
                    <span
                      key={j}
                      className="inline-block text-[0.625rem] px-1.5 py-0.5 rounded bg-[var(--color-fd-secondary)] text-[var(--color-fd-muted-foreground)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {downstream && downstream.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--color-fd-border)]">
              <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--color-fd-muted-foreground)]">
                Used by:{" "}
              </span>
              {downstream.map((d, i) => (
                <span key={i}>
                  <code className="text-[0.625rem] text-[var(--color-fd-muted-foreground)]">
                    {d}
                  </code>
                  {i < downstream.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
