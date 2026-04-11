---
name: 11-tech-debt
description: >
  Compiles a prioritized tech debt register by harvesting findings from
  all upstream pipeline outputs. Classifies each item by category (code
  quality, test coverage, architecture, resilience, security, dependency,
  data model). Assigns severity, estimated effort, and blast radius.
  Produces a remediation roadmap with quick wins, planned work, and
  strategic items. Use after 10-blueprint when you need a consolidated
  view of everything that needs fixing.
---

# Tech Debt

Compiles a single, prioritized tech debt register by harvesting findings from every upstream skill output. Rather than discovering new issues, this skill synthesizes and classifies the god classes, test gaps, EOL frameworks, missing resilience, coupling hotspots, and anti-patterns already identified across the pipeline into a structured register with severity, effort, and remediation guidance.

Without this step, tech debt findings are scattered across 10 upstream outputs. Stakeholders see individual problems but can't prioritize across them. This skill consolidates everything into one register that answers: "What should we fix first, and why?"

## Pipeline Position

| Attribute       | Value                                  |
| --------------- | -------------------------------------- |
| **Stage**       | 4 — Assessment                         |
| **Skill**       | 11-tech-debt                           |
| **Runs after**  | `10-blueprint`                         |
| **Runs before** | `12-traceability`                      |
| **Required by** | `13-documentation`                     |

## Inputs

### Required
- `outputs/05-components-*.md` — Section 5 (God Classes), Section 6 (Test Coverage) for code quality and test debt
- `outputs/08-patterns.md` — Section 4 (Anti-Patterns) for structural debt
- `outputs/09-dependencies.md` — Section 3 (External Packages: EOL, version conflicts, dead packages), Section 5 (Critical Coupling Points) for dependency debt
- `outputs/10-blueprint.md` — Section 5 (Redundancies) for duplication debt

### Optional (improves results)
- `outputs/04-containers.md` — Section 10 (Key Findings) for infrastructure-level debt
- `outputs/07-data-model.md` — Section 6 (Data Model Findings) for schema and data integrity debt
- All other upstream outputs — any `[NEEDS VERIFICATION]` items across the pipeline represent potential debt

## When to Use

**Use when:**
- You need a single prioritized list of everything that needs fixing
- You're planning a modernization sprint or technical roadmap
- Stakeholders need to understand the total debt load and its business impact
- You're completing the Assessment stage

**Do not use when:**
- Fewer than 5 upstream skills have been completed (insufficient findings to compile)
- You only need structural architecture without quality assessment

## Process

### Step 1: Harvest Findings from Upstream Outputs

Systematically scan each upstream output for findings that represent tech debt:

| Source Output | What to Harvest |
| --- | --- |
| `05-components-*.md` | God classes (Section 5), test coverage gaps (Section 6), known issues per business component (Section 3) |
| `08-patterns.md` | Anti-patterns (Section 4), absent-but-expected patterns (Section 7) |
| `09-dependencies.md` | EOL frameworks (Section 3), version conflicts (Section 3), dead packages (Section 3), critical coupling points (Section 5) |
| `10-blueprint.md` | Redundancies (Section 5), overlaps with Medium+ severity (Section 4) |
| `04-containers.md` | Key Findings (Section 10) |
| `07-data-model.md` | Missing constraints (Section 6), cross-store references (Section 6), schema risks (Section 6) |
| All outputs | Items flagged as `[NEEDS VERIFICATION]` — unresolved uncertainties are themselves a form of debt |

Record each finding with its source output and section number for traceability.

```
CHECKPOINT: The agent must harvest from at least 4 upstream outputs
before classifying. If fewer than 4 outputs have findings, the
pipeline may not have run far enough to produce a meaningful debt
register.
```

### Step 2: Deduplicate and Consolidate

The same issue often appears in multiple outputs (e.g., a god class is found in S-05 components AND referenced as an anti-pattern in S-08). Deduplicate:

- Merge findings that describe the same underlying issue
- Keep the most specific evidence (file paths, line counts) from whichever output has the best detail
- Note all source outputs that flagged the issue (more sources = higher confidence)

### Step 3: Classify Each Debt Item

For each unique debt item, assign:

**Category:**

| Category | What It Covers |
| --- | --- |
| **Code quality** | God classes, fat controllers, magic strings, dead code, missing abstractions |
| **Test coverage** | Untested components, dead tests, low test-to-source ratios |
| **Architecture** | Anti-patterns (shared database, circular deps, distributed monolith), absent patterns, structural coupling |
| **Resilience** | Missing retry/circuit-breaker policies, synchronous chains without fallbacks, no health endpoints |
| **Security** | Shared secrets without rotation, BFF bypass, missing auth on endpoints, EOL frameworks with CVEs |
| **Dependency** | EOL frameworks, version conflicts, dead packages, shared library coupling, high fan-in components |
| **Data model** | Missing constraints, implied references, cross-store references, high-coupling entities, schema-less risks |
| **Redundancy** | DTO duplication, parallel implementations, mock maintenance burden |

**Severity:**

| Severity | Criteria |
| --- | --- |
| **CRITICAL** | Active security risk, data integrity risk, or production reliability risk. Needs immediate attention. |
| **HIGH** | Significant maintenance burden, blocks modernization, or compounds other debt. Should be in next planning cycle. |
| **MEDIUM** | Real but manageable problem. Creates friction but doesn't block progress. Plan within 6 months. |
| **LOW** | Minor issue. Address opportunistically during related work. |

**Effort estimate:**

| Effort | Criteria |
| --- | --- |
| **Small** | 1-3 days, single developer, low risk of regression |
| **Medium** | 1-2 weeks, may require coordination, some regression risk |
| **Large** | 2-4 weeks, requires design decisions, significant regression risk |
| **Extra-Large** | 1+ months, cross-team coordination, high regression risk, may need phased approach |

**Blast radius:** Which containers, components, or capabilities are affected? (from upstream dependency analysis)

### Step 4: Assign Debt IDs and Group

Assign each item a unique ID: `TD-{category abbreviation}-{number}`

| Category | Abbreviation |
| --- | --- |
| Code quality | CQ |
| Test coverage | TC |
| Architecture | AR |
| Resilience | RS |
| Security | SE |
| Dependency | DP |
| Data model | DM |
| Redundancy | RD |

Example: `TD-CQ-01` (first code quality debt item), `TD-TC-03` (third test coverage item).

### Step 5: Calculate Debt Summary Statistics

Compile summary metrics:

| Metric | How to Calculate |
| --- | --- |
| Total debt items | Count of unique items |
| By severity | Count per severity level |
| By category | Count per category |
| By effort | Count per effort estimate |
| Estimated total effort | Sum of effort estimates (in developer-weeks) |
| Top 5 affected components | Components appearing most frequently across debt items |

### Step 6: Build Remediation Roadmap

Organize debt items into remediation phases:

**Quick Wins (high impact, low effort):**
- Items with HIGH or CRITICAL severity AND Small effort
- Dead code removal, dead package cleanup, missing health endpoints
- These prove progress and build momentum

**Planned Work (high impact, medium effort):**
- Items with HIGH severity AND Medium effort
- God class decomposition, test coverage expansion, resilience policy addition
- Schedule into sprint planning

**Strategic Items (high impact, high effort):**
- Items with CRITICAL or HIGH severity AND Large/Extra-Large effort
- Framework upgrades (EOL), shared database decomposition, architectural pattern changes
- Require design spikes, phased rollout, and dedicated initiatives

**Deferred (low impact or blocked):**
- Items with LOW severity regardless of effort
- Items blocked by other debt items that must be resolved first
- Items that will be automatically resolved by other planned work

For each roadmap item, note:
- **Debt ID(s)** it addresses
- **Prerequisite** debt items that must be resolved first
- **Expected outcome** after remediation

```
CHECKPOINT: Every debt item must appear in exactly one roadmap
phase (Quick Wins, Planned, Strategic, or Deferred). No item
should be unassigned.
```

### Step 7: Compile Tech Debt Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/11-tech-debt.md`

### Required Structure

```markdown
# Tech Debt Register — {System Name}

> **Pipeline stage:** 11-tech-debt
> **Date:** {date}
> **Input:** outputs/05-components-*.md, outputs/08-patterns.md, outputs/09-dependencies.md, outputs/10-blueprint.md
> **Scope:** {list of repositories/projects}

---

## 1. Debt Register

### CRITICAL

| ID | Finding | Category | Source | Components Affected | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| {TD-XX-NN} | {description} | {category} | {S-NN Section N} | {BC/TC/CON IDs} | {S/M/L/XL} | {file paths, line counts, specific details} |

### HIGH

| ID | Finding | Category | Source | Components Affected | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| {TD-XX-NN} | {description} | {category} | {S-NN} | {IDs} | {effort} | {evidence} |

### MEDIUM

| ID | Finding | Category | Source | Components Affected | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| {TD-XX-NN} | {description} | {category} | {S-NN} | {IDs} | {effort} | {evidence} |

### LOW

| ID | Finding | Category | Source | Components Affected | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| {TD-XX-NN} | {description} | {category} | {S-NN} | {IDs} | {effort} | {evidence} |

---

## 2. Summary Statistics

| Metric | Value |
| --- | --- |
| Total debt items | {n} |
| Critical | {n} |
| High | {n} |
| Medium | {n} |
| Low | {n} |

### By Category

| Category | Count | % of Total |
| --- | ---:| --- |
| Code quality | {n} | {%} |
| Test coverage | {n} | {%} |
| Architecture | {n} | {%} |
| Resilience | {n} | {%} |
| Security | {n} | {%} |
| Dependency | {n} | {%} |
| Data model | {n} | {%} |
| Redundancy | {n} | {%} |

### By Effort

| Effort | Count | Estimated Dev-Weeks |
| --- | ---:| ---: |
| Small (1-3 days) | {n} | {weeks} |
| Medium (1-2 weeks) | {n} | {weeks} |
| Large (2-4 weeks) | {n} | {weeks} |
| Extra-Large (1+ months) | {n} | {weeks} |
| **Total** | **{n}** | **{weeks}** |

### Most Affected Components

| Component | Debt Items | Most Severe |
| --- | ---:| --- |
| {BC/TC/CON ID}: {name} | {count} | {highest severity item} |

---

## 3. Remediation Roadmap

### Quick Wins (high impact, low effort)

| Priority | Debt ID(s) | Action | Prerequisite | Expected Outcome |
| --- | --- | --- | --- | --- |
| 1 | {TD-XX-NN} | {what to do} | {none or TD-XX-NN} | {result} |

### Planned Work (high impact, medium effort)

| Priority | Debt ID(s) | Action | Prerequisite | Expected Outcome |
| --- | --- | --- | --- | --- |
| 1 | {TD-XX-NN} | {what to do} | {prerequisite} | {result} |

### Strategic Items (high impact, high effort)

| Priority | Debt ID(s) | Action | Prerequisite | Expected Outcome |
| --- | --- | --- | --- | --- |
| 1 | {TD-XX-NN} | {what to do} | {prerequisite} | {result} |

### Deferred (low impact or blocked)

| Debt ID(s) | Reason for Deferral |
| --- | --- |
| {TD-XX-NN} | {why it's deferred} |

---

## 4. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 3 (Classification):** Adapter provides framework-specific severity calibration. The `.NET` adapter knows that .NET 7 EOL is a CRITICAL security issue, that missing Polly policies on `HttpClient` calls is HIGH resilience debt, and that 500-line controllers are common in older ASP.NET projects (calibrate severity accordingly). The `java-spring` adapter knows Spring Boot version compatibility constraints.
- **Step 3 (Effort Estimation):** Adapter provides effort heuristics for common debt items in the framework. The `.NET` adapter knows that extracting a service layer from a god Function class is Medium effort, that adding Polly policies is Small effort, and that upgrading from .NET 7 to .NET 8 is Large effort for Azure Functions.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Debt item exists | Specific finding from an upstream output with section reference |
| Severity assignment | Impact description (what breaks or degrades) + scope (how many components affected) |
| Effort estimate | Based on item scope (file count, dependency count) and complexity (new design needed vs. mechanical change) |
| Blast radius | Component and container IDs from upstream dependency and component analysis |
| Remediation action | Specific, actionable step (not "improve code quality" but "extract AssetService from AssetFunctions.cs") |
| Prerequisite chain | Specific debt ID that must be resolved first, with reason (e.g., "shared library must be packaged before containers can be independently deployed") |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "We already know about these issues, we don't need a register" | Knowing about issues is not the same as prioritizing them. A register with severity, effort, and blast radius enables data-driven trade-off conversations instead of "we should fix that someday." |
| "Everything is HIGH priority" | If everything is HIGH, nothing is. The severity and effort classification forces differentiation. A CRITICAL item with Small effort (quick win) should be fixed before a HIGH item with Extra-Large effort. |
| "Effort estimates are unreliable without detailed design" | True, but order-of-magnitude estimates (days vs. weeks vs. months) are sufficient for prioritization. The goal is relative ranking, not sprint-level story pointing. |
| "Tech debt is the team's responsibility, not an architecture artifact" | The debt register bridges architecture assessment and team planning. Architecture identifies the debt; the team plans the remediation. Without the register, teams work from gut feel. |
| "We should just rewrite the whole thing" | Rewrites rarely succeed. A structured debt register enables incremental improvement — fix the top 5 quick wins this month, tackle 3 planned items this quarter, plan 1 strategic initiative this half. Progress without risk. |

## Red Flags

- Debt register with fewer than 10 items for a system with 100+ source files (likely missed findings)
- All items at the same severity level (insufficient differentiation)
- No effort estimates (register is descriptive but not actionable for planning)
- Missing source traceability (can't verify where a finding came from)
- Remediation roadmap that doesn't reference specific debt IDs
- No deduplication (same god class listed under both code quality and architecture)
- Quick wins section is empty (there are always quick wins)
- No "most affected components" analysis (hides where debt concentrates)

## Verification

Before marking this skill complete, confirm:

- [ ] Findings are harvested from at least 4 upstream outputs
- [ ] Items are deduplicated (no finding appears twice in the register)
- [ ] Each item has: ID, description, category, source, affected components, effort, and evidence
- [ ] Severity levels are differentiated (not all HIGH)
- [ ] Effort estimates are assigned to every item
- [ ] Summary statistics reconcile with the detailed register
- [ ] Most affected components are identified
- [ ] Remediation roadmap covers all items (quick wins + planned + strategic + deferred = total)
- [ ] Each roadmap item has prerequisites identified (or explicitly "none")
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/11-tech-debt.md`
- [ ] Output file follows the required structure from the Output Format section
