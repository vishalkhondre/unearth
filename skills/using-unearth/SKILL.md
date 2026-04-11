---
name: using-unearth
description: >
  Meta-skill that orchestrates the Unearth discovery pipeline. Guides
  the agent through pipeline execution -- selecting scope, choosing
  stack adapters and blueprints, running skills in order, managing
  output files, and handling partial runs. Read this skill first when
  starting discovery on any codebase. Not a discovery skill itself --
  it teaches the agent how to use all other skills.
---

# Using Unearth

This is the entry point for running Unearth on any codebase. It guides you through scoping the discovery, selecting the right stack adapter and blueprint, running skills in the correct order, managing output files, and resuming partial runs. Read this before running any other skill.

This is not a discovery skill — it doesn't produce an output file. It teaches you how to use the 14 discovery skills that do.

## Pipeline Overview

Unearth follows a 4-stage pipeline with 14 skills. Each skill produces a Markdown output file that downstream skills consume. The pipeline accumulates knowledge progressively — each stage builds on what came before.

```
Stage 1: Reconnaissance (understand the codebase)
  00-recon → 01-entry-points → 02-actors-and-boundaries

Stage 2: Structure (map the architecture)
  03-external-systems → 04-containers → 05-components

Stage 3: Knowledge (extract meaning)
  06-capabilities → 07-data-model → 08-patterns → 09-dependencies

Stage 4: Assessment (evaluate and recommend)
  10-blueprint → 11-tech-debt → 12-traceability → 13-documentation
```

## Before You Start

### 1. Determine Scope

Identify which repositories are in scope:

| Scope Type | Description | Example |
| --- | --- | --- |
| **Single repo** | One repository with one or more projects | A .NET solution with 3 projects |
| **Multi-repo** | Multiple repositories that form one system | Frontend repo + backend repo + shared lib repo |
| **Monorepo** | One repository with many independent services | A monorepo with 20 microservices |

List every repository and confirm you have read access to the source code.

### 2. Select a Stack Adapter (Optional)

Stack adapters teach the skills what to look for in specific technology ecosystems. Check the `stack-adapters/` directory for available adapters:

| Adapter | Best For |
| --- | --- |
| `dotnet` | .NET / C# / ASP.NET Core / Azure Functions |
| `java-spring` | Java / Spring Boot / Spring Cloud |
| `python-django` | Python / Django / Flask / FastAPI |
| `node-express` | Node.js / Express / NestJS |
| `ruby-rails` | Ruby / Rails |
| `generic` | Any other language or mixed-stack systems |

If no adapter matches your stack, use `generic` or run without an adapter — the skills work without one, they just won't have framework-specific pattern hints.

You don't need to select an adapter upfront. Skill `00-recon` will detect the technology stack, and you can load the adapter before `01-entry-points`.

### 3. Select a Blueprint (for Stage 4)

Blueprints are needed for skill `10-blueprint` (industry comparison). Check the `blueprints/` directory for available blueprints:

| Blueprint | Domain |
| --- | --- |
| `iiot-saas` | Industrial IoT SaaS platform |
| `e-commerce` | E-commerce platform |
| `fintech-core-banking` | Core banking system |
| `saas-b2b` | Multi-tenant B2B SaaS |
| `healthcare-ehr` | Healthcare / EHR system |

If no blueprint matches your system's domain, you can skip `10-blueprint` or create a custom blueprint (see `docs/advanced/creating-blueprints.md`).

## Running the Full Pipeline

### Step-by-Step Execution

Run each skill in order. After each skill, verify its output before proceeding to the next.

**Stage 1: Reconnaissance**

```
1. Read skills/00-recon/SKILL.md
   Run the skill against the scoped repositories.
   Output: outputs/00-recon.md
   Verify: Technology stack detected? Project list complete?

2. (Optional) Load the stack adapter matching the detected technology.

3. Read skills/01-entry-points/SKILL.md
   Run the skill using outputs/00-recon.md as input.
   Output: outputs/01-entry-points.md
   Verify: Every project scanned? HTTP + non-HTTP triggers found?

4. Read skills/02-actors-and-boundaries/SKILL.md
   Run the skill using outputs/00-recon.md and outputs/01-entry-points.md as input.
   Output: outputs/02-actors-and-boundaries.md
   Verify: Actors identified from auth patterns? Boundary defined?
```

**Stage 2: Structure**

```
5. Read skills/03-external-systems/SKILL.md
   Run the skill. Scans packages, config, and HTTP clients.
   Output: outputs/03-external-systems.md
   Verify: All three sources scanned? Cross-referenced with S-02 boundary?

6. Read skills/04-containers/SKILL.md
   Run the skill. Identifies deployable units and communication.
   Output: outputs/04-containers.md
   Verify: Every inside-boundary project classified? Communication mapped?

7. Read skills/05-components/SKILL.md
   Run the skill for the most critical container(s).
   Output: outputs/05-components-{container-id}.md (one per container)
   Verify: Business components identified? God classes detected? Tests assessed?

   Note: This skill is repeatable. Run it on as many containers as needed.
   Prioritize by: most entry points, most external connections, most risk.
```

**Stage 3: Knowledge**

```
8. Read skills/06-capabilities/SKILL.md
   Run the skill. Seeds candidates, analyzes, confirms L1/L2 hierarchy.
   Output: outputs/06-capabilities.md
   Verify: Coverage >90%? Every candidate has an action?

9. Read skills/07-data-model/SKILL.md
   Run the skill. Discovers entities, relationships, projections.
   Output: outputs/07-data-model.md
   Verify: All storage technologies represented? Coupling hotspots flagged?

10. Read skills/08-patterns/SKILL.md
    Run the skill. Detects patterns and anti-patterns.
    Output: outputs/08-patterns.md
    Verify: Multiple categories covered? Absent patterns documented?

11. Read skills/09-dependencies/SKILL.md
    Run the skill. Maps internal and external dependencies.
    Output: outputs/09-dependencies.md
    Verify: EOL frameworks flagged? Critical coupling points identified?
```

**Stage 4: Assessment**

```
12. Read skills/10-blueprint/SKILL.md
    Run the skill with the selected blueprint.
    Output: outputs/10-blueprint.md
    Verify: Every blueprint capability mapped? Scorecard computed?

13. Read skills/11-tech-debt/SKILL.md
    Run the skill. Harvests findings from all upstream outputs.
    Output: outputs/11-tech-debt.md
    Verify: Items from 4+ upstream outputs? Remediation roadmap built?

14. Read skills/12-traceability/SKILL.md
    Run the skill. Maps files to components to capabilities.
    Output: outputs/12-traceability.md
    Verify: Every file traced? Migration readiness assessed?

15. Read skills/13-documentation/SKILL.md
    Run the skill. Synthesizes everything into final document.
    Output: outputs/13-documentation.md
    Verify: Executive summary present? All sections from completed skills?
```

### Output Directory

All skill outputs are saved to the `outputs/` directory:

```
outputs/
├── 00-recon.md
├── 01-entry-points.md
├── 02-actors-and-boundaries.md
├── 03-external-systems.md
├── 04-containers.md
├── 05-components-con-001.md
├── 05-components-con-003.md    (one per analyzed container)
├── 06-capabilities.md
├── 07-data-model.md
├── 08-patterns.md
├── 09-dependencies.md
├── 10-blueprint.md
├── 11-tech-debt.md
├── 12-traceability.md
└── 13-documentation.md
```

## Running Partial Pipelines

You don't have to run the full pipeline. Common partial runs:

### Quick Recon (skills 00-02, ~30 min)

Answers: "What is this system? What's the tech stack? Who uses it?"

Run `00-recon` → `01-entry-points` → `02-actors-and-boundaries`. Produces enough context for a first conversation with stakeholders.

### Architecture Snapshot (skills 00-05, ~2 hours)

Answers: "How is the system structured? What are the containers and components?"

Run Stage 1 + Stage 2. Produces C4 Context and Container diagrams plus component-level understanding of key containers.

### Capability Discovery (skills 00-06, ~3 hours)

Answers: "What does this system do for its users?"

Run through `06-capabilities`. Produces the L1/L2 capability map — the most valuable single artifact for business stakeholders.

### Full Assessment (skills 00-13, ~6-8 hours)

Answers: "What is this system, what does it do, how well is it built, and what should we do about it?"

Run the complete pipeline. Produces the full architecture document with gap analysis, tech debt register, and prioritized roadmap.

## Resuming a Partial Run

If you need to resume a previously started pipeline:

1. Check the `outputs/` directory for existing output files
2. Identify the last completed skill by the highest-numbered output file
3. Read the SKILL.md for the next skill in sequence
4. The skill's Inputs section tells you which upstream outputs it needs — verify they exist
5. Run the skill normally

Skills are idempotent — you can re-run any skill to refresh its output. Downstream outputs that consumed the old version should also be re-run.

## Choosing Which Containers to Deep-Dive (Step 7)

Skill `05-components` is the only repeatable skill — you choose which containers to analyze. Not every container needs a deep-dive. Prioritize by:

1. **Most entry points** — highest complexity, most business logic
2. **Most external connections** — highest coupling, most integration risk
3. **Most dependencies from other containers** — highest blast radius
4. **Flagged with risks in S-04** — containers with known concerns

For a typical system with 3-8 containers, analyze 1-3 in full. For large systems with 20+ containers, analyze the top 5 by the criteria above.

## Tips for Better Results

**Always read SKILL.md before running.** Each skill has specific evidence standards, checkpoints, and verification criteria. Skipping these produces lower-quality output.

**Load the stack adapter early.** After `00-recon` detects the technology, load the matching adapter before `01-entry-points`. The adapter improves pattern detection for every subsequent skill.

**Don't skip checkpoints.** Every skill has `CHECKPOINT` blocks. These are mandatory verification points. If a checkpoint fails, go back and fix the issue before proceeding.

**Flag uncertainty.** When you're not sure about a finding, mark it as `[NEEDS VERIFICATION]` with the specific question. Certainty about what you don't know is more valuable than false confidence.

**Verify before proceeding.** Each skill has a Verification checklist at the end. Run through it before starting the next skill. A missed finding in `00-recon` will compound through every downstream skill.

**Use evidence, not assertion.** Every claim must cite a file path, class name, configuration entry, or code pattern. "The system uses MongoDB" must be backed by "MongoDB.Driver 2.20.0 in AssetManagement.csproj, connection string in MongoDbOptions, repository implementations in Repositories/."
