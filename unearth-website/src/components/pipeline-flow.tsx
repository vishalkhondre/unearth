import Link from "next/link";
import { stages, skills, getSkillPath } from "@/lib/data";
import { ArrowRightIcon, ChevronDownIcon } from "./icons";

export function PipelineFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal with arrows */}
      <div className="hidden md:flex items-start gap-2">
        {stages.map((stage, i) => (
          <div key={stage.num} className="flex items-start flex-1 min-w-0">
            <StageCard stage={stage} compact={compact} />
            {i < stages.length - 1 && (
              <div className="flex items-center self-center pt-8 px-1 shrink-0">
                <ArrowRightIcon
                  className="text-[var(--color-fd-muted-foreground)]"
                  size={20}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical with arrows */}
      <div className="flex flex-col gap-2 md:hidden">
        {stages.map((stage, i) => (
          <div key={stage.num} className="flex flex-col items-center">
            <StageCard stage={stage} compact={compact} />
            {i < stages.length - 1 && (
              <div className="py-1">
                <ChevronDownIcon
                  className="text-[var(--color-fd-muted-foreground)]"
                  size={20}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StageCard({
  stage,
  compact,
}: {
  stage: (typeof stages)[number];
  compact: boolean;
}) {
  const stageSkills = skills.filter((s) => s.stage === stage.num);

  return (
    <div
      className="rounded-xl border border-[var(--color-fd-border)] overflow-hidden flex-1 min-w-0 w-full"
    >
      {/* Color bar */}
      <div className="h-[3px]" style={{ backgroundColor: stage.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: stage.color }}
          >
            {stage.num}
          </span>
          <span className="font-bold text-lg">{stage.name}</span>
        </div>

        {!compact && (
          <p className="text-sm text-[var(--color-fd-muted-foreground)] mb-3">
            {stage.desc}
          </p>
        )}

        {/* Skill links */}
        <div className="flex flex-col gap-1">
          {stageSkills.map((skill) => (
            <Link
              key={skill.id}
              href={getSkillPath(skill)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm no-underline bg-[var(--color-fd-secondary)] text-[var(--color-fd-foreground)] hover:opacity-80 transition-opacity"
            >
              <code
                className="text-[0.6875rem] font-semibold"
                style={{ color: stage.color }}
              >
                {skill.id}
              </code>
              <span>{skill.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
