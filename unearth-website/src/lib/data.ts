export const stageColors = {
  reconnaissance: "#6366f1",
  structure: "#2563eb",
  knowledge: "#059669",
  assessment: "#d97706",
} as const;

export const stageNames = {
  1: "reconnaissance",
  2: "structure",
  3: "knowledge",
  4: "assessment",
} as const;

export type StageName = (typeof stageNames)[keyof typeof stageNames];

export const skills = [
  { id: "00", name: "Recon", stage: 1 as const, slug: "00-recon", desc: "Scan repo structure, detect tech stack, count files" },
  { id: "01", name: "Entry Points", stage: 1 as const, slug: "01-entry-points", desc: "Find every HTTP endpoint, event trigger, job, CLI command" },
  { id: "02", name: "Actors", stage: 1 as const, slug: "02-actors-and-boundaries", desc: "Identify human and system actors, draw the system boundary" },
  { id: "03", name: "External Systems", stage: 2 as const, slug: "03-external-systems", desc: "Map databases, APIs, brokers, identity providers" },
  { id: "04", name: "Containers", stage: 2 as const, slug: "04-containers", desc: "Identify deployable units, map inter-service communication" },
  { id: "05", name: "Components", stage: 2 as const, slug: "05-components", desc: "Deep-dive into a container's layers, god classes, test coverage" },
  { id: "06", name: "Capabilities", stage: 3 as const, slug: "06-capabilities", desc: "Extract L1/L2 business capability hierarchy" },
  { id: "07", name: "Data Model", stage: 3 as const, slug: "07-data-model", desc: "Discover entities, storage, relationships, projections" },
  { id: "08", name: "Patterns", stage: 3 as const, slug: "08-patterns", desc: "Detect architecture patterns and anti-patterns" },
  { id: "09", name: "Dependencies", stage: 3 as const, slug: "09-dependencies", desc: "Map internal coupling and external package risks" },
  { id: "10", name: "Blueprint", stage: 4 as const, slug: "10-blueprint", desc: "Compare capabilities against industry reference architecture" },
  { id: "11", name: "Tech Debt", stage: 4 as const, slug: "11-tech-debt", desc: "Compile prioritized debt register with remediation roadmap" },
  { id: "12", name: "Traceability", stage: 4 as const, slug: "12-traceability", desc: "Map every file to its component, capability, and container" },
  { id: "13", name: "Documentation", stage: 4 as const, slug: "13-documentation", desc: "Synthesize all findings into a complete architecture document" },
];

export const stages = [
  {
    num: 1 as const,
    name: "Reconnaissance",
    slug: "reconnaissance",
    color: stageColors.reconnaissance,
    desc: "Scan the codebase. Map the surface area. Identify who uses it.",
  },
  {
    num: 2 as const,
    name: "Structure",
    slug: "structure",
    color: stageColors.structure,
    desc: "Map external systems, deployable units, and internal components.",
  },
  {
    num: 3 as const,
    name: "Knowledge",
    slug: "knowledge",
    color: stageColors.knowledge,
    desc: "Extract capabilities, data models, patterns, and dependencies.",
  },
  {
    num: 4 as const,
    name: "Assessment",
    slug: "assessment",
    color: stageColors.assessment,
    desc: "Compare against standards. Catalog debt. Build the roadmap.",
  },
];

export const features = [
  {
    title: "14 Discovery Skills",
    desc: "Each skill has defined inputs, outputs, verification gates, and anti-shortcut thinking. An agent following a skill produces consistent results.",
    icon: "search" as const,
  },
  {
    title: "Any AI Coding Tool",
    desc: "Works with Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini CLI, and more. Skills are plain markdown -- no vendor lock-in.",
    icon: "plug" as const,
  },
  {
    title: "Any Language, Any Scale",
    desc: "Stack adapters provide framework-specific hints for .NET, Java/Spring, Python/Django, Node/Express, Ruby/Rails, and a generic fallback.",
    icon: "globe" as const,
  },
  {
    title: "Industry Blueprints",
    desc: "Compare your system against reference architectures for IIoT, E-commerce, Fintech, SaaS B2B, and Healthcare EHR.",
    icon: "clipboard" as const,
  },
  {
    title: "Evidence-Based",
    desc: "Every architectural claim cites specific files, classes, or configurations. No hallucinated architecture diagrams.",
    icon: "filecheck" as const,
  },
  {
    title: "Open Source (MIT)",
    desc: "Free to use, modify, and extend. Contribute skills, adapters, blueprints, and personas back to the community.",
    icon: "opensource" as const,
  },
];

export const tools = [
  { name: "Claude Code", path: "/docs/guides/claude-code-setup" },
  { name: "Cursor", path: "/docs/guides/cursor-setup" },
  { name: "Copilot", path: "/docs/guides/copilot-setup" },
  { name: "Windsurf", path: "/docs/guides/windsurf-setup" },
  { name: "Gemini CLI", path: "/docs/guides/gemini-cli-setup" },
  { name: "Codex", path: "/docs/guides/codex-setup" },
];

export function getSkillPath(skill: (typeof skills)[number]) {
  const stageSlugs: Record<number, string> = {
    1: "reconnaissance",
    2: "structure",
    3: "knowledge",
    4: "assessment",
  };
  return `/docs/skills/${stageSlugs[skill.stage]}/${skill.slug}`;
}
