# Concept: Evidence-Based Architecture

Unearth's core philosophy is that every architecture claim must be backed by evidence from the codebase. No assumptions, no documentation trust, no tribal knowledge — only what the code proves.

## The Problem with Traditional Architecture Docs

Most architecture documentation has a fatal flaw: it describes what people intended to build, not what was actually built. Over time, the code diverges from the docs. Features are added, shortcuts taken, designs changed — but the architecture diagram stays the same.

The result is architecture documentation that's confidently wrong. Teams make decisions based on diagrams that don't reflect reality, and the gap widens with every sprint.

## What Evidence-Based Means

In Unearth, every claim at every level must have a traceable evidence chain:

| Claim Level | Evidence Required | Example |
| --- | --- | --- |
| "Actor X exists" | Authentication pattern with file path | `[Authorize(Policy="CustomerAccess")]` in `AssetFunctions.cs:47` |
| "External system Y is used" | Package reference + configuration + usage code | `MongoDB.Driver` in `.csproj`, connection string in `appsettings.json`, `IMongoCollection<T>` usage in `AssetRepository.cs` |
| "Container Z is deployable" | Build output type + deployment config + startup code | `OutputType: Exe` + `AzureFunctionApp@2` in pipeline + `Program.cs` host builder |
| "Component A has responsibility B" | Business logic in component's files | Validation rules in `AssetRequestValidator.cs`, state transitions in `AssetService.cs` |
| "Capability C exists" | Entry points + service layer + data entities | 15 files across 3 layers with dedicated routes and database collections |

## The [NEEDS VERIFICATION] Standard

When the agent can't find sufficient evidence for a claim, Unearth requires marking it as `[NEEDS VERIFICATION]` with the specific question that needs answering. This is a core part of the methodology, not a failure.

Good verification flags:
- `[NEEDS VERIFICATION] Is this collection actively used? No writes found in code.`
- `[NEEDS VERIFICATION] Deploy target unclear — no CI/CD pipeline config found.`
- `[NEEDS VERIFICATION] Auth level appears to be Anonymous but controller has [Authorize] — check middleware order.`

Bad verification flags:
- `[NEEDS VERIFICATION] Need to check.` (too vague)
- `[NEEDS VERIFICATION] Probably correct.` (not a question)

## Why This Matters

Evidence-based architecture produces outputs that are:

**Trustworthy.** Every statement can be verified by opening the cited file. Stakeholders don't have to take anyone's word for it.

**Current.** The analysis reflects the code as it exists right now, not as it was designed 3 years ago.

**Actionable.** When you know exactly which files implement a capability, you can estimate migration effort, identify test gaps, and plan refactoring with precision.

**Honest.** `[NEEDS VERIFICATION]` flags are a feature, not a bug. They tell you exactly where the team's understanding has gaps — which is often the most valuable discovery of all.

## How Unearth Enforces This

Every Unearth skill has built-in mechanisms to enforce evidence standards:

- **CHECKPOINTs** stop the agent at critical junctures and require verification before proceeding
- **Red Flags** list signs that the agent is making unsupported claims
- **Common Rationalizations** preempt excuses for skipping evidence ("it's obvious" → no, find the file)
- **Verification checklists** at the end of each skill include "all uncertain findings flagged as [NEEDS VERIFICATION]" as a mandatory check
- **Output formats** require specific evidence columns (file paths, class names, configuration entries) in every table

## The Anti-Patterns

Things evidence-based architecture is NOT:

- **It's not documentation archaeology.** Don't read the wiki and trust it. Read the code and verify.
- **It's not exhaustive.** You don't need to read every file. Focused scanning with evidence-backed claims is better than comprehensive guessing.
- **It's not rigid.** If the agent discovers something unexpected that doesn't fit the template, document it. The evidence matters more than the format.
- **It's not slow.** An AI agent following Unearth skills can produce an evidence-based architecture document in hours, not weeks.

## Further Reading

- `AGENTS.md` Section "Evidence Standards" — the specific evidence rules for all agents
- Any SKILL.md "Evidence Standards" section — per-skill evidence requirements
- `references/c4-cheat-sheet.md` "Evidence Requirements per Level" — what proof each C4 level needs
