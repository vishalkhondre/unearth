---
name: 13-documentation
description: >
  Compiles all upstream pipeline outputs into a comprehensive architecture
  document. Synthesizes context, containers, components, capabilities,
  data model, patterns, dependencies, blueprint comparison, tech debt,
  and traceability into a single navigable deliverable. Includes C4
  diagrams, capability map, data model summary, findings register, and
  open questions. This is the capstone skill and final deliverable of
  the Unearth pipeline.
---

# Documentation

Compiles all upstream pipeline outputs into a single, comprehensive architecture document. Rather than repeating raw findings, this skill synthesizes, summarizes, and cross-references them into a navigable deliverable that a technical or business stakeholder can read end-to-end or use as a reference.

Without this step, the pipeline produces 12 separate output files that each answer a different question. This skill weaves them into one document that tells the complete story: what the system is, what it does, how it's built, what's good, what's broken, and what to do next.

## Pipeline Position

| Attribute       | Value                                  |
| --------------- | -------------------------------------- |
| **Stage**       | 4 — Assessment                         |
| **Skill**       | 13-documentation                       |
| **Runs after**  | `12-traceability`                      |
| **Runs before** | (none — final skill in the pipeline)   |
| **Required by** | (none — this is the capstone output)   |

## Inputs

### Required
All upstream outputs:
- `outputs/00-recon.md` — Technology stack, project organization
- `outputs/01-entry-points.md` — System surface area
- `outputs/02-actors-and-boundaries.md` — Actors, boundary definition
- `outputs/03-external-systems.md` — External system inventory
- `outputs/04-containers.md` — Container inventory, communication map, architecture patterns
- `outputs/05-components-*.md` — Component inventories (per container analyzed)
- `outputs/06-capabilities.md` — L1/L2 capability map
- `outputs/07-data-model.md` — Entity inventory, relationships, coupling hotspots
- `outputs/08-patterns.md` — Architecture and anti-patterns
- `outputs/09-dependencies.md` — Dependency landscape, coupling points
- `outputs/10-blueprint.md` — Industry comparison, gaps, roadmap
- `outputs/11-tech-debt.md` — Prioritized debt register
- `outputs/12-traceability.md` — File-to-capability traceability, migration readiness

### Optional (improves results)
- Stack adapter used during the pipeline (for technology context)
- Blueprint used for comparison (for reference)

## When to Use

**Use when:**
- The pipeline has been completed (all or most upstream skills have run)
- You need a stakeholder-ready architecture document
- You want to capture the discovery results as a durable artifact

**Do not use when:**
- Fewer than 8 upstream skills have been completed (the document will have too many gaps)
- You only need a specific aspect (use the individual skill output instead)

## Process

### Step 1: Determine Document Scope

Check which upstream outputs are available. The document adapts to what's been produced:

| Minimum (8 skills) | Full (13 skills) |
| --- | --- |
| Sections 1-6 only | All sections including assessment |
| No blueprint comparison | Full gap analysis and roadmap |
| No tech debt register | Prioritized debt with remediation |
| No traceability | Full file-to-capability traceability |

Note which sections can be written with the available inputs and which must be marked as "pending."

### Step 2: Write the Executive Summary

Produce a 1-page executive summary that a non-technical stakeholder can read in 5 minutes:

- **System name** and one-sentence description
- **Technology stack** (languages, frameworks, cloud platform)
- **Scale** (repositories, containers, source files, capabilities)
- **Architecture style** (primary pattern from S-08)
- **Key strengths** (3-5 bullet points — what's working well)
- **Key risks** (3-5 bullet points — highest severity findings)
- **Blueprint coverage** (scorecard percentage from S-10)
- **Recommended next steps** (top 3 actions from S-10/S-11 roadmaps)

The executive summary should be self-contained — a reader who only reads this page should understand the system's current state and what needs attention.

```
CHECKPOINT: The executive summary must be writable from the
upstream outputs without requiring additional codebase access.
If any claim in the summary can't be traced to a specific
upstream output, remove it.
```

### Step 3: Write the Architecture Overview

Compile the structural architecture from S-00 through S-04:

**3a. System Context**
- Actors and their relationships (from S-02)
- External systems summary (from S-03, grouped by classification)
- System boundary (from S-02)
- C4 Context diagram (text description or PlantUML if generated during S-02)

**3b. Container Architecture**
- Container inventory table (from S-04 Section 2)
- Communication topology diagram (from S-04 Section 9)
- Key request flows (from S-04 Section 8)
- Architecture patterns summary (from S-04 Section 7)

**3c. Component Architecture (per container)**
- Layer structure (from S-05 Section 2)
- Business component inventory (from S-05 Section 3 — names and responsibilities only, not full file lists)
- Technical component inventory (from S-05 Section 4)

Keep this section concise — summarize rather than copy. Reference the detailed skill outputs for full information.

### Step 4: Write the Capability Map

Synthesize the capability analysis from S-06:

- L1 capability list with scope summaries (from S-06 Section 5)
- L2 sub-capability inventory (from S-06 Section 6)
- Capability-to-actor matrix (from S-06 Section 7)
- Capability-to-container alignment (which containers implement which capabilities)

This is often the most valuable section for business stakeholders — it translates code structure into business language.

### Step 5: Write the Data Model Summary

Synthesize the data model from S-07:

- Entity inventory summary (storage entities count by technology, projections count)
- Key entity profiles (2-3 most important entities with attributes)
- Entity relationship summary (focus on cross-store references and implied relationships)
- Coupling hotspots (entities shared across 3+ capabilities)

Keep this section high-level — the full entity details are in S-07.

### Step 6: Write the Assessment Sections

Synthesize the assessment findings from S-08 through S-12:

**6a. Pattern Assessment**
- Pattern summary table (from S-08 Section 1)
- Key anti-patterns with severity (from S-08 Section 4)
- Absent patterns (from S-08 Section 7)

**6b. Dependency Landscape**
- Dependency statistics (from S-09 Section 6)
- Critical coupling points (from S-09 Section 5)
- EOL/risk packages (from S-09 Section 3)

**6c. Industry Blueprint Comparison**
- Scorecard (from S-10 Section 6)
- Critical and moderate gaps (from S-10 Section 3)
- Overlap summary (from S-10 Section 4)

**6d. Tech Debt Summary**
- Top 10 debt items by severity (from S-11 Section 1)
- Debt by category chart (from S-11 Section 2)
- Quick wins (from S-11 Section 3)

**6e. Migration Readiness**
- Component extraction difficulty table (from S-12 Section 4)
- Top 3 easiest and hardest extraction targets

### Step 7: Write the Recommendations and Open Questions

**Recommendations:**
Merge the roadmaps from S-10 (blueprint gaps) and S-11 (tech debt) into a unified recommendation list organized by time horizon (near-term, mid-term, long-term). Deduplicate where both roadmaps recommend the same action.

**Open Questions:**
Compile all `[NEEDS VERIFICATION]` items from every upstream output into a single open questions register. Group by theme (architecture, data, security, deployment).

```
CHECKPOINT: Every recommendation must be traceable to a specific
finding in an upstream output. No recommendation should be invented
at the documentation stage — this skill synthesizes, it doesn't
discover.
```

### Step 8: Compile Final Document

Assemble the document following the Output Format below. Add a table of contents and section cross-references.

## Output Format

This skill produces a single Markdown file: `outputs/13-documentation.md`

### Required Structure

```markdown
# Architecture Document — {System Name}

> **Pipeline stage:** 13-documentation
> **Date:** {date}
> **Input:** All upstream pipeline outputs (00-recon through 12-traceability)
> **Scope:** {list of repositories/projects}
> **Pipeline skills completed:** {list of skill IDs that were run}

---

## Table of Contents

1. Executive Summary
2. Architecture Overview
   2.1 System Context
   2.2 Container Architecture
   2.3 Component Architecture
3. Capability Map
4. Data Model Summary
5. Pattern Assessment
6. Dependency Landscape
7. Industry Blueprint Comparison
8. Tech Debt Summary
9. Migration Readiness
10. Recommendations
11. Open Questions
12. Appendix: Pipeline Outputs Index

---

## 1. Executive Summary

{1-page summary: system identity, scale, architecture style,
key strengths, key risks, blueprint coverage, recommended actions}

---

## 2. Architecture Overview

### 2.1 System Context

{Actors, external systems, boundary — from S-02 and S-03}

### 2.2 Container Architecture

{Container table, topology diagram, key flows — from S-04}

### 2.3 Component Architecture

{Per-container component summary — from S-05}

---

## 3. Capability Map

{L1/L2 capabilities, actor matrix — from S-06}

---

## 4. Data Model Summary

{Entity inventory, key entities, relationships, coupling — from S-07}

---

## 5. Pattern Assessment

{Patterns, anti-patterns, absent patterns — from S-08}

---

## 6. Dependency Landscape

{Statistics, coupling points, EOL risks — from S-09}

---

## 7. Industry Blueprint Comparison

{Scorecard, gaps, overlaps — from S-10}

---

## 8. Tech Debt Summary

{Top findings, categories, quick wins — from S-11}

---

## 9. Migration Readiness

{Extraction difficulty, key blockers — from S-12}

---

## 10. Recommendations

### Near-Term (0-6 months)
{Merged roadmap from S-10 and S-11}

### Mid-Term (6-12 months)
{Merged roadmap}

### Long-Term (12+ months)
{Merged roadmap}

---

## 11. Open Questions

{All [NEEDS VERIFICATION] items from all outputs, grouped by theme}

---

## 12. Appendix: Pipeline Outputs Index

| Skill | Output File | Key Deliverable |
| --- | --- | --- |
| 00-recon | outputs/00-recon.md | Technology stack, project organization |
| 01-entry-points | outputs/01-entry-points.md | Entry point inventory |
| ... | ... | ... |
```

## Stack Adapter Hooks

This skill does not have stack adapter hooks. Documentation is a synthesis activity that operates on upstream outputs, not on the codebase directly.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Any claim in the document | Must be traceable to a specific upstream output with section reference |
| Executive summary statistic | Must match the detailed finding in the relevant upstream output |
| Recommendation | Must reference a specific gap (G-ID), debt item (TD-ID), or redundancy (R-ID) from upstream |
| Open question | Must be a `[NEEDS VERIFICATION]` item from an upstream output with the original output identified |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The upstream outputs are the documentation, we don't need a summary" | 12 separate files are a reference library, not a document. A stakeholder won't read 12 files. A synthesized document tells the story, highlights what matters, and provides a single entry point. |
| "I should add my own analysis beyond what the upstream outputs found" | This skill synthesizes — it doesn't discover. Adding new findings at the documentation stage means they weren't verified through the pipeline's evidence standards. If you find something new, go back and update the relevant upstream skill output. |
| "The executive summary should cover everything in detail" | The executive summary is 1 page for a non-technical reader. It has 8 specific elements (system name, stack, scale, style, strengths, risks, coverage, next steps). If it's longer than 1 page, it's not a summary. |
| "I'll just concatenate the upstream outputs" | Concatenation is not synthesis. Each section should summarize and cross-reference, not copy. A 200-page concatenation is worse than 12 separate files because it's unnavigable. |
| "This is just a template, the agent can figure out what to include" | Structure matters enormously for the capstone deliverable. The table of contents is fixed. The section order follows a logical narrative: what it is (2), what it does (3-4), how well it's built (5-8), what to do about it (9-11). Deviation from this structure weakens the document. |

## Red Flags

- Document that's a concatenation of upstream outputs rather than a synthesis
- Executive summary longer than 1 page or containing findings not in upstream outputs
- Missing table of contents or broken section cross-references
- Assessment sections (5-9) included when the upstream skills haven't been run
- Recommendations that can't be traced to a specific finding
- No open questions section (every pipeline run has unresolved items)
- Document that introduces new findings not present in any upstream output
- Pipeline outputs index that's incomplete (missing skills that were run)

## Verification

Before marking this skill complete, confirm:

- [ ] Executive summary fits on 1 page with all 8 required elements
- [ ] Architecture overview covers context, containers, and components from S-00 through S-05
- [ ] Capability map includes L1/L2 list and capability-to-actor matrix from S-06
- [ ] Data model summary covers entity inventory, relationships, and coupling hotspots from S-07
- [ ] Assessment sections only include content from skills that were actually run
- [ ] Recommendations are traceable to specific findings (G-ID, TD-ID, R-ID, P-ID)
- [ ] Open questions compile all [NEEDS VERIFICATION] items from all upstream outputs
- [ ] Pipeline outputs index lists every skill that was run with its output file
- [ ] Table of contents matches actual section structure
- [ ] No new findings are introduced — this skill synthesizes only
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/13-documentation.md`
- [ ] Output file follows the required structure from the Output Format section
