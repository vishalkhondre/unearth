# Unearth — Agent Guidance

This file provides guidance to AI coding agents working with Unearth discovery skills. It applies to Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Codex, Windsurf, and any other agent that accepts instruction files.

## What Unearth Is

Unearth is a structured set of AI agent skills for codebase architecture and capability discovery. The skills guide you through scanning, analyzing, and documenting unfamiliar codebases — producing C4 diagrams, capability maps, data models, gap analysis, and tech debt registers.

Skills are workflows, not reference docs. Each SKILL.md is a step-by-step process you follow literally, with verification gates that prevent you from skipping steps or making unsupported claims.

## Skill Discovery

Skills live in `skills/`, one directory per skill. Each contains a `SKILL.md` with YAML frontmatter:

```yaml
---
name: skill-identifier
description: >
  What this skill does and when to use it.
---
```

The `description` field tells you when to activate each skill. Read it to determine which skill applies to the current task.

### Available Skills


| Skill                | Directory                          | Trigger                                    |
| -------------------- | ---------------------------------- | ------------------------------------------ |
| Reconnaissance       | `skills/00-recon/`                 | Starting discovery on a new codebase       |
| Entry Points         | `skills/01-entry-points/`          | Need to find every way into the system     |
| Actors & Boundaries  | `skills/02-actors-and-boundaries/` | Need to identify who uses the system       |
| External Systems     | `skills/03-external-systems/`      | Need to map external dependencies          |
| Containers           | `skills/04-containers/`            | Need to identify deployable units          |
| Components           | `skills/05-components/`            | Need to deep-dive into a container         |
| Capabilities         | `skills/06-capabilities/`          | Need to extract what the system does       |
| Data Model           | `skills/07-data-model/`            | Need to discover entities and storage      |
| Patterns             | `skills/08-patterns/`              | Need to detect architecture patterns       |
| Dependencies         | `skills/09-dependencies/`          | Need to map dependency landscape           |
| Blueprint Comparison | `skills/10-blueprint/`             | Need to compare against industry standards |
| Tech Debt            | `skills/11-tech-debt/`             | Need a prioritized debt register           |
| Traceability         | `skills/12-traceability/`          | Need file-to-capability mapping            |
| Documentation        | `skills/13-documentation/`         | Need the final architecture document       |
| Using Unearth        | `skills/using-unearth/`            | First time running the pipeline            |


### Execution Order

Skills run in sequence. Each consumes outputs from upstream skills:

```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13
```

Always start with `00-recon`. See `skills/using-unearth/SKILL.md` for partial run options.

## How to Execute a Skill

1. **Read the full SKILL.md** before starting. Do not skim.
2. **Check inputs.** The Inputs section lists which upstream output files are required. Verify they exist in `outputs/`.
3. **Follow the process steps in order.** Each step has specific instructions and evidence requirements.
4. **Stop at CHECKPOINTs.** These are verification gates. If the checkpoint condition isn't met, go back and fix it.
5. **Produce the output file** following the exact Output Format template in the skill.
6. **Run the verification checklist** at the end of the skill before proceeding.
7. **Save the output** to `outputs/{skill-id}.md` (e.g., `outputs/00-recon.md`).

### Rules That Apply to Every Skill

- Every claim must cite evidence: a file path, class name, config entry, or code pattern.
- Mark anything uncertain as `[NEEDS VERIFICATION]` with the specific question.
- Never invent findings. If you can't find evidence for something, say so.
- Do not skip steps because they seem unnecessary. The rationalizations section in each skill lists common excuses — resist them.
- Output files must follow the exact structure in the skill's Output Format section.

## Agent Personas

The `agents/` directory contains pre-configured personas for specialized discovery tasks. Load a persona when you need focused analysis.


| Persona                    | File                                   | Focus                                                                      |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| Architecture Archaeologist | `agents/architecture-archaeologist.md` | Full pipeline execution, structural discovery, C4 diagram production       |
| Domain Analyst             | `agents/domain-analyst.md`             | Capability extraction, business rule cataloging, stakeholder communication |
| Tech Debt Auditor          | `agents/tech-debt-auditor.md`          | Code quality assessment, anti-pattern detection, remediation planning      |
| Migration Advisor          | `agents/migration-advisor.md`          | Extraction feasibility, dependency analysis, migration roadmap             |


### How to Use a Persona

Load the persona file into your agent's context, then run the relevant skills. The persona provides:

- **Focus area** — which skills and findings to prioritize
- **Approach** — how to frame the analysis (e.g., auditor vs. advisor)
- **Output emphasis** — which sections of the output to expand vs. summarize

Personas are optional. The skills work without them — personas add a lens, not a requirement.

## Stack Adapters

Stack adapters in `stack-adapters/` provide technology-specific pattern hints. Load the matching adapter after `00-recon` detects the technology stack.

Adapters are supplementary. Skills work without them but produce better results with them — especially for entry point detection (S-01), component layer identification (S-05), and pattern detection (S-08).

## Blueprints

Industry reference architectures in `blueprints/` are used by `10-blueprint` for gap analysis. Select the blueprint matching the system's domain before running that skill.

## Tool-Specific Setup

### Claude Code

Skills are loaded automatically when Unearth is configured as a skill directory:

```bash
# In your target project's CLAUDE.md:
# Import Unearth skills from /path/to/unearth/skills/
```

Slash commands in `.claude/commands/` provide pipeline shortcuts.

### Cursor

Copy relevant SKILL.md files into `.cursor/rules/`:

```bash
cp /path/to/unearth/skills/00-recon/SKILL.md .cursor/rules/00-recon.md
```

Or reference the full skills directory in your Cursor configuration.

### GitHub Copilot

Copy agent definitions for Copilot personas:

```bash
cp /path/to/unearth/agents/*.md .github/agents/
```

Reference skill content in `.github/copilot-instructions.md` or paste into Copilot Chat.

### Gemini CLI

Install as native skills for auto-discovery:

```bash
gemini skills install /path/to/unearth/skills/
```

Or add to `GEMINI.md` for persistent context.

### Other Agents (Windsurf, OpenCode, Codex)

Skills are plain Markdown. Load SKILL.md content into your agent's system prompt, rules file, or conversation context. The workflow is agent-agnostic — any tool that follows Markdown instructions can execute Unearth skills.

## Skill Authoring Guidelines

When creating or modifying skills, follow these standards:

### Format

- Follow the anatomy in `docs/skill-anatomy.md` (10 standard sections)
- YAML frontmatter with `name` and `description` fields
- No em dashes (`—`) in YAML frontmatter (use `--`); em dashes are fine in the body
- Validate frontmatter parses with `yaml.safe_load`
- Stay under 500 lines

### Content

- Process steps must be specific and actionable ("scan every `.csproj` for `PackageReference`" not "check the dependencies")
- At least 2 CHECKPOINTs (mandatory verification gates)
- At least 3 Common Rationalizations (excuses to resist)
- At least 4 Red Flags (signs the output is incomplete)
- Verification checklist with `- [ ]` checkboxes
- Last verification item: "All uncertain findings are flagged as [NEEDS VERIFICATION]"

### Conventions

- American English spelling throughout
- Output title: `# {Skill Name} — {System Name}` (em dash in body)
- Output header: Pipeline stage, Date, Input, Scope (all 4 fields)
- Scope wording: `{list of repositories/projects}`
- Overview: two paragraphs — description, then "Without this step..."
- Process steps: `### Step N: Verb Phrase`
- Evidence standards table: `| Claim Type | Acceptable Evidence |`
- Rationalizations table: `| Rationalization | Reality |`

### Testing

Test every new or modified skill against at least one real codebase before submitting. A skill that produces inconsistent results across runs needs tighter instructions.