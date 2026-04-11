# Unearth

AI agent skills for architecture and capability discovery. Turn legacy code into living knowledge.

## Project Structure

```
skills/                    Core discovery skills (one SKILL.md per directory)
  00-recon/                  Stage 1: Scan repo, detect tech stack
  01-entry-points/           Stage 1: Find every way into the system
  02-actors-and-boundaries/  Stage 1: Identify actors, draw system boundary
  03-external-systems/       Stage 2: Map external dependencies
  04-containers/             Stage 2: Identify deployable units, communication
  05-components/             Stage 2: Deep-dive into container internals
  06-capabilities/           Stage 3: Extract L1/L2 business capabilities
  07-data-model/             Stage 3: Discover entities, storage, relationships
  08-patterns/               Stage 3: Detect architecture and anti-patterns
  09-dependencies/           Stage 3: Map dependency landscape, version risks
  10-blueprint/              Stage 4: Compare against industry reference
  11-tech-debt/              Stage 4: Compile prioritized debt register
  12-traceability/           Stage 4: File-to-capability traceability
  13-documentation/          Stage 4: Synthesize final architecture document
  using-unearth/             Meta-skill: how to run the pipeline

agents/                    Pre-configured agent personas
blueprints/                Industry reference architectures for gap analysis
stack-adapters/            Stack-specific pattern detection hints
  dotnet/                    .NET / C# / ASP.NET Core / Azure Functions
  java-spring/               Java / Spring Boot / Spring Cloud
  python-django/             Python / Django / Flask / FastAPI
  node-express/              Node.js / Express / NestJS
  ruby-rails/                Ruby / Rails
  generic/                   Language-agnostic heuristics

templates/                 Output document templates
references/                Supplementary reference material
hooks/                     Session lifecycle hooks
docs/                      Documentation and guides
  skill-anatomy.md           Skill format specification (12 standard sections)
  guides/                    Setup guides per agent tool
  tutorial/                  Step-by-step tutorials
  concepts/                  Conceptual explanations
  advanced/                  Blueprint and adapter creation
  case-studies/              Real-world discovery examples

.claude/commands/          Slash commands for Claude Code
outputs/                   Generated during pipeline runs (gitignored)
```

## How Skills Work

Each skill is a structured workflow in `SKILL.md` format with:
- YAML frontmatter (`name`, `description`)
- Defined inputs (which upstream outputs to read)
- Numbered process steps with CHECKPOINT verification gates
- Output format template (exact Markdown structure to produce)
- Evidence standards (what counts as proof for each claim type)
- Common rationalizations (shortcuts to resist)
- Red flags (signs the output is incomplete)
- Verification checklist (confirm before marking complete)

**Always read the SKILL.md before executing a skill.** The skill file IS the instructions.

## Pipeline Execution Order

Skills run in strict order. Each consumes upstream outputs:

```
00-recon → 01-entry-points → 02-actors-and-boundaries
  → 03-external-systems → 04-containers → 05-components (repeatable)
    → 06-capabilities → 07-data-model → 08-patterns → 09-dependencies
      → 10-blueprint → 11-tech-debt → 12-traceability → 13-documentation
```

Partial runs are supported. See `skills/using-unearth/SKILL.md` for partial run options and resume guidance.

## Output Convention

All skill outputs go to `outputs/` (gitignored). File naming:

```
outputs/00-recon.md
outputs/01-entry-points.md
outputs/05-components-con-003.md    (per-container for skill 05)
outputs/13-documentation.md
```

Every output file starts with a standard header:

```markdown
# {Skill Name} — {System Name}

> **Pipeline stage:** {skill-id}
> **Date:** {date}
> **Input:** {upstream files consumed}
> **Scope:** {repositories/projects in scope}
```

## Core Principles

1. **Evidence over assertion.** Every claim cites a file path, class name, config entry, or code pattern. Never "the system probably does X."
2. **Progressive depth.** Start broad (context), drill into containers, then components. Each stage builds on what came before.
3. **Pipeline, not prompt.** Each skill has defined inputs, outputs, and quality gates. Outputs accumulate through the pipeline.
4. **Verification gates.** Every skill has CHECKPOINTs and a verification checklist. Don't skip them.
5. **Flag uncertainty.** Mark anything uncertain as `[NEEDS VERIFICATION]` with the specific question.

## Terminology

Use these terms exactly:
- **Skill** — a single discovery activity (not "prompt," "template," or "module")
- **Pipeline** — the full sequence of skills from recon to documentation
- **Stage** — a group of related skills (Reconnaissance, Structure, Knowledge, Assessment)
- **Stack adapter** — stack-specific pattern hints (not "plugin" or "extension")
- **Blueprint** — an industry reference architecture for gap analysis (not "template")
- **Evidence** — a specific file, class, config entry, or pattern cited to support a claim

## Quality Standards for Skills

When creating or modifying a skill, it must:
- Have valid YAML frontmatter with `name` and `description` (parse with `yaml.safe_load`)
- No em dashes in YAML frontmatter (use `--` in frontmatter, `—` in body)
- Follow the anatomy in `docs/skill-anatomy.md` (10 standard sections)
- Have at least 2 CHECKPOINTs, 3 rationalizations, 4 red flags, and a verification checklist
- Stay under 500 lines
- Use American English spelling
- Reference upstream outputs by file path and section number

## Quality Standards for Outputs

When generating a pipeline output, it must:
- Follow the exact output format template from the skill's SKILL.md
- Include the standard 4-field header (Pipeline stage, Date, Input, Scope)
- Cite evidence for every claim (file paths, class names, line counts)
- Mark uncertain findings as `[NEEDS VERIFICATION]`
- Pass the skill's verification checklist before the next skill runs

## For Contributors

- Read `CONTRIBUTING.md` before submitting changes
- Read `docs/skill-anatomy.md` before creating or modifying any skill
- Run YAML frontmatter validation on any changed SKILL.md files
- Skills are workflows, not advice. If an agent can't follow it literally, it's not specific enough.
- Test skills against at least one real codebase before submitting
