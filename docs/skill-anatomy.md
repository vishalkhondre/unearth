# Skill Anatomy

This document defines the structure and format of Unearth skill files. Every skill must follow this specification. Use it when creating new skills, reviewing existing ones, or contributing to the project.

## How Skills Differ from Prompts

A prompt is a one-shot instruction. A skill is a **repeatable workflow** — it has defined inputs, a structured process, verification gates, and standardized outputs. An agent following an Unearth skill should produce consistent, evidence-backed results regardless of which codebase it's pointed at.

Unearth skills additionally differ from general-purpose agent skills (like those in [agent-skills](https://github.com/addyosmani/agent-skills)) in one critical way: **they form a pipeline**. Each skill's outputs become inputs for downstream skills. This means every skill must define its interface precisely.

## File Location

Every skill lives in its own directory under `skills/`:

```
skills/
  00-recon/
    SKILL.md              # Required: the skill definition
    supporting-file.md    # Optional: reference material loaded on demand
  01-entry-points/
    SKILL.md
  ...
```

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: 00-recon
description: >
  Scans repository structure to build an initial codebase mental model.
  Detects languages, frameworks, build systems, and project organization.
  Use when starting discovery on a new codebase or re-orienting after
  scope changes.
---
```

**Rules:**

- `name`: Must match the directory name exactly. Format: `NN-kebab-case` where NN is the skill number.
- `description`: Starts with what the skill does (third person), followed by trigger conditions. Include both *what* and *when*. Maximum 1024 characters.

**Why this matters:** Agents discover skills by reading descriptions. The description is injected into the system prompt, so it must tell the agent what the skill provides and when to activate it. Do not summarize the workflow — if the description contains process steps, the agent may follow the summary instead of reading the full skill.

### Standard Sections

Every Unearth SKILL.md must include these sections in this order:

```markdown
# Skill Title

## Overview
What this skill does and why it matters. Two to three sentences maximum.

## Pipeline Position
Where this skill sits in the discovery pipeline.

## Inputs
What this skill requires before it can run.

## When to Use
Triggering conditions and exclusions.

## Process
The step-by-step workflow the agent follows.

## Output Format
The exact structure of what this skill produces.

## Stack Adapter Hooks
Where stack-specific detection applies within this skill.

## Evidence Standards
What counts as valid evidence for claims made during this skill.

## Common Rationalizations
Excuses agents use to skip steps, with rebuttals.

## Red Flags
Signs the skill is being executed poorly.

## Verification
Exit criteria checklist with evidence requirements.
```

---

## Section Specification

### Overview

The elevator pitch. What does this skill do, and why is it necessary? Two to three sentences. Should answer: "If I skip this skill, what goes wrong downstream?"

**Example:**
> Scans the repository structure to build a grounded mental model of the codebase before making any architectural claims. Without this step, the agent risks misidentifying the tech stack, missing entire projects in a monorepo, or making assumptions that compound through every subsequent skill.

### Pipeline Position

A structured block that places the skill in the discovery pipeline:

```markdown
## Pipeline Position

| Attribute     | Value                           |
| ------------- | ------------------------------- |
| **Stage**     | 1 — Reconnaissance              |
| **Skill**     | 00-recon                        |
| **Runs after**| (none — first skill in pipeline)|
| **Runs before**| 01-entry-points                |
| **Required by**| All downstream skills          |
```

This tells the agent (and the human) exactly where the skill fits and what depends on it.

### Inputs

What must exist before this skill can run. Two categories:

```markdown
## Inputs

### Required
- Access to the repository file system (local clone or remote read)

### Optional (improves results)
- Output from `00-recon` (tech stack context)
- Stack adapter for detected technology (e.g., `stack-adapters/dotnet/`)
- Prior knowledge of the system's domain
```

For skills after Stage 1, required inputs will typically include the output files from prior skills. Be explicit about which files and what data the skill reads from them.

### When to Use

Helps agents and humans decide if this skill applies. Include both positive triggers and negative exclusions.

```markdown
## When to Use

**Use when:**
- Starting discovery on a new codebase for the first time
- Re-running after the repository scope has changed (new repos added)
- The tech stack is unknown or assumed but not verified

**Do not use when:**
- You already have a verified recon output and the repo hasn't changed
- You're doing a targeted analysis (e.g., just data model) — start from the appropriate skill instead
```

### Process

The heart of the skill. Step-by-step workflow the agent follows. This must be specific and actionable — not vague advice.

**Rules for writing process steps:**

1. **Number every step.** The agent follows them in order.
2. **Start each step with a verb.** "Scan," "List," "Classify," "Count," "Compare."
3. **Be concrete.** "Look for `*.csproj`, `package.json`, `pom.xml`, `Cargo.toml`, `go.mod`, or `requirements.txt`" — not "find the build files."
4. **Include decision points.** Use ASCII flowcharts or if/then blocks when the process branches.
5. **Reference stack adapters when applicable.** "If a stack adapter is loaded, consult it for framework-specific patterns."
6. **Mark verification checkpoints inline.** After significant steps, add: `CHECKPOINT: Verify [specific thing] before proceeding.`

**Good:** "Scan the root directory for `Dockerfile`, `docker-compose.yml`, `Dockerfile.*`, and `.dockerignore`. Record each file's path and purpose."

**Bad:** "Check if Docker is used."

**Example structure:**

```markdown
## Process

### Step 1: Scan Root Structure
List all top-level files and directories. Classify each as:
- Source code directory
- Configuration file
- Build/CI artifact
- Documentation
- Test directory
- Infrastructure/deployment

CHECKPOINT: The agent should be able to name every top-level directory
and its purpose before proceeding.

### Step 2: Detect Technology Stack
...

### Step 3: Identify Project Organization
Determine if the codebase is:
- **Single project** — one build target, one deployable
- **Multi-project** — multiple build targets in one repo (e.g., .sln with multiple .csproj)
- **Monorepo** — multiple independent services in one repo
- **Polyrepo** — this is one repo of several (look for cross-repo references)

If a stack adapter is loaded, consult its "Project Structure Patterns" section
for framework-specific heuristics.

CHECKPOINT: Project organization type must be determined with evidence
(specific files/directories cited) before proceeding.
```

### Output Format

The exact structure of what this skill produces. Every skill must define its output precisely because downstream skills depend on it.

```markdown
## Output Format

This skill produces a single Markdown file: `outputs/00-recon.md`

### Required Sections

#### Summary Table
| Attribute          | Value                                    |
| ------------------ | ---------------------------------------- |
| Repository         | {repo name or path}                      |
| Languages          | {detected languages with file counts}    |
| Frameworks         | {detected frameworks with versions}      |
| Build system       | {build tool and config file}             |
| Project type       | {single / multi-project / monorepo}      |
| Total source files | {count by language}                      |
| Test files         | {count}                                  |
| CI/CD              | {detected pipeline tool}                 |

#### Detailed Findings
- File inventory by directory and type
- Framework and library detection evidence
- Build configuration analysis
- Items flagged as [NEEDS VERIFICATION]
```

**Rules for output format:**

1. **Every output must be a Markdown file** saved to the `outputs/` directory.
2. **File naming convention:** `outputs/{skill-number}-{skill-name}.md` (e.g., `outputs/00-recon.md`).
3. **Every claim must include evidence.** File paths, line numbers, configuration keys — not just assertions.
4. **Flag uncertainty.** Use `[NEEDS VERIFICATION]` for claims that require human review or additional context.
5. **Include a metadata header** with pipeline stage, date, and input references.

### Stack Adapter Hooks

Identifies where within this skill stack-specific knowledge would improve results. Not every skill needs this section — omit it if the skill is fully stack-agnostic.

```markdown
## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Detect Technology Stack):** Adapter provides framework-specific
  file patterns beyond the generic list (e.g., `.razor` files for Blazor,
  `angular.json` for Angular workspaces).
- **Step 3 (Identify Project Organization):** Adapter provides project
  structure heuristics (e.g., Spring Boot multi-module conventions,
  .NET solution file parsing).

If no stack adapter is loaded, the skill uses generic heuristics from
`stack-adapters/generic/`.
```

### Evidence Standards

Defines what counts as valid evidence for claims made during this skill. This is critical because Unearth's core principle is "evidence over assertion."

```markdown
## Evidence Standards

| Claim Type            | Acceptable Evidence                                          |
| --------------------- | ------------------------------------------------------------ |
| Technology detected   | File path of config/build file (e.g., `package.json` at root)|
| Framework version     | Version string from config file with file path               |
| Architecture pattern  | Minimum 3 files demonstrating the pattern, with paths        |
| Component boundary    | Directory structure + import/reference analysis              |
| External dependency   | Package reference or connection string with file path        |
| NOT FOUND claims      | List of locations searched and what was expected              |
```

### Common Rationalizations

Excuses agents use to skip steps, paired with rebuttals. This is one of the most important sections — it prevents the agent from rationalizing shortcuts.

```markdown
## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can see the tech stack from the file extensions alone" | File extensions miss framework versions, build configurations, and multi-framework setups. A `.cs` file tells you C# but not whether it's ASP.NET Core, Azure Functions, or a console app. Always check config files. |
| "The README already describes the architecture" | READMEs are frequently outdated. The code is the source of truth. Verify every README claim against actual files. |
| "This is a simple project, I can skip the full scan" | "Simple" projects have produced the most surprising findings in practice — hidden dependencies, dead code, misconfigured builds. Run the full process. |
| "I'll come back and verify this later" | Later never comes. Unverified claims compound through the pipeline. Verify now or flag as [NEEDS VERIFICATION]. |
```

### Red Flags

Observable signs that the skill is being executed poorly. Useful for self-monitoring and review.

```markdown
## Red Flags

- Making architecture claims without citing specific files
- Stating a framework is "probably" used without checking config files
- Skipping the file count / inventory step
- Producing output that says "standard N-tier" without evidence
- Not flagging any [NEEDS VERIFICATION] items (every codebase has ambiguity)
- Output file is shorter than expected for the codebase size
```

### Verification

Exit criteria checklist. Every checkbox must be verifiable with evidence. The agent cannot mark the skill as complete until all required items are checked.

```markdown
## Verification

Before marking this skill complete, confirm:

- [ ] Every detected technology has a file path citation
- [ ] Project organization type is determined with evidence
- [ ] File counts are recorded for source, test, and config files
- [ ] Build system is identified with config file path
- [ ] CI/CD pipeline is identified (or explicitly noted as absent)
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/00-recon.md`
- [ ] Output file follows the required format from the Output Format section
```

---

## Writing Principles

These apply to every skill:

1. **Process over knowledge.** Skills are workflows, not reference docs. Steps, not facts.
2. **Specific over general.** "Look for `Dockerfile` in the repo root and in each project subdirectory" beats "check for containerization."
3. **Evidence over assertion.** Every claim must cite a file, path, configuration entry, or pattern.
4. **Anti-rationalization.** Every step that an agent might skip needs a counter-argument in the rationalizations table.
5. **Progressive disclosure.** The SKILL.md is the entry point. Supporting files and references are loaded only when needed.
6. **Token-conscious.** Every section must justify its inclusion. If removing it wouldn't change agent behavior, remove it. Target: under 500 lines per SKILL.md.
7. **Pipeline-aware.** Every skill must be clear about what it reads (inputs) and what it produces (outputs) so the pipeline holds together.

---

## Naming Conventions

- Skill directories: `NN-kebab-case` (e.g., `00-recon`, `06-capabilities`)
- Skill files: `SKILL.md` (always uppercase)
- Output files: `outputs/NN-skill-name.md` (e.g., `outputs/00-recon.md`)
- Supporting files: `lowercase-kebab-case.md` inside the skill directory
- References: stored in `references/` at the project root, not inside skill directories

## Cross-Skill References

Reference other skills by their identifier:

```markdown
This skill requires the output of `00-recon`. If recon has not been run,
execute it first.

If architecture patterns are detected during component analysis, record them
for use by `08-patterns`.
```

Don't duplicate content between skills — reference and link instead. If a concept is needed by multiple skills, put it in `references/`.

## Length Guidelines

- **SKILL.md:** Target 200–400 lines. Maximum 500 lines. If it's longer, extract reference material to supporting files.
- **Supporting files:** No limit, but keep them focused on one topic.
- **Output format section:** Be thorough. Downstream skills depend on the output being predictable.

---

## Checklist for New Skills

Before submitting a new skill, verify:

- [ ] Frontmatter has `name` and `description` fields
- [ ] `name` matches the directory name
- [ ] `description` includes both *what* and *when*, under 1024 characters
- [ ] All standard sections are present in the correct order
- [ ] Pipeline Position table is filled in correctly
- [ ] Inputs section references specific upstream skill outputs
- [ ] Process steps are numbered and start with verbs
- [ ] Process includes at least 2 CHECKPOINTs
- [ ] Output Format defines the exact file structure downstream skills expect
- [ ] Evidence Standards table covers all claim types the skill makes
- [ ] Common Rationalizations table has at least 3 entries
- [ ] Red Flags section has at least 4 items
- [ ] Verification checklist has evidence requirements for every item
- [ ] Skill is under 500 lines
- [ ] No content is duplicated from another skill (use cross-references)
