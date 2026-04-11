---
name: 06-capabilities
description: >
  Extracts business capabilities from component inventories across all
  analyzed containers. Seeds candidates from package structure, entry
  points, and UI modules. Analyzes each for cohesion, coupling, and
  boundaries. Merges, de-scopes, and confirms to produce a final L1
  capability list with L2 sub-capabilities. Verifies coverage against
  the codebase. Use after 05-components when you need to answer what
  the system does for its users.
---

# Capabilities

Extracts what the system does for its users as a structured capability map. Seeds candidates from code structure, analyzes each for cohesion and boundaries, merges related candidates, verifies coverage against the codebase, and organizes the result into an L1/L2 hierarchy.

Without this step, the agent can describe the system's structure (containers, components, data stores) but cannot articulate its business purpose — what value it delivers, to whom, and through which functions. This is the step that bridges architecture to business meaning.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 3 — Knowledge                                     |
| **Skill**       | 06-capabilities                                    |
| **Runs after**  | `05-components`                                    |
| **Runs before** | `07-data-model`                                    |
| **Required by** | `07-data-model`, `10-blueprint`, `12-traceability`, `13-documentation` |

## Inputs

### Required
- `outputs/05-components-*.md` — Business component inventories from all analyzed containers (Section 3: Business Components)
- `outputs/00-recon.md` — Section 4 (Project Organization) for the full project list
- `outputs/01-entry-points.md` — Section 3 (HTTP Endpoints) for functional groupings per project

### Optional (improves results)
- `outputs/02-actors-and-boundaries.md` — Section 2-3 (Actors) for understanding who each capability serves
- `outputs/04-containers.md` — Section 2 (Container Inventory) for container-to-capability alignment
- UI route structure (Angular modules, React routes, page directories) for frontend capability signals
- Stack adapter for UI framework conventions

## When to Use

**Use when:**
- You need to answer "what does this system do for its users?"
- You're preparing for industry blueprint comparison (`10-blueprint`)
- You need a capability map for modernization planning or stakeholder communication
- You want to verify that the codebase is fully accounted for by identified capabilities

**Do not use when:**
- `05-components` has not been run on at least the most critical containers
- You only need structural architecture (containers, deployment) without business meaning

## Process

### Step 1: Load Upstream Context

Read the upstream outputs. Extract:
- **From `05-components-*.md`:** All business component inventories (BC-IDs, names, responsibilities, files by layer) across every analyzed container
- **From `00-recon.md`:** Full project list for coverage verification
- **From `01-entry-points.md`:** HTTP endpoint groupings by functional area
- **From UI routes (if available):** Angular feature modules, React route definitions, or page directory structure

This data provides three independent signals for capability identification: backend components, API surface, and UI modules.

```
CHECKPOINT: The agent must have business component inventories from
at least the most complex containers loaded. If no containers have
been analyzed with 05-components, go back and run it first.
```

### Step 2: Seed Capability Candidates

Generate an initial list of capability candidates from three sources:

**Source A — Backend packages and components:**
For each project/container, identify distinct business domains from:
- Package/namespace structure (e.g., `AssetManagement`, `CommandServices`, `UserManagement`)
- Business component groups from S-05 (BC-IDs with similar domain names)
- Distinct data stores or entity groups (one store per domain often indicates a capability)

**Source B — API surface and controllers:**
From the entry points output, group endpoints by:
- Controller or function class (each controller often represents a capability)
- Route prefix patterns (e.g., all `/assets/*` routes = one capability, all `/users/*` = another)
- Functional area (CRUD operations on the same entity type)

**Source C — UI modules and routes:**
From the frontend codebase structure:
- Feature modules (Angular: lazy-loaded route modules; React: route-level page directories)
- Admin vs. customer portal divisions (different user types often map to different capability surfaces)
- Distinct UI sections with their own navigation entries

Assign each candidate a sequential number and record:
- **Candidate #** and name
- **Source** (which of the three sources identified it)
- **Projects present in** (which repos/projects have code for this candidate)
- **Key files** (representative files from each project)

Cast a wide net — it's better to have 25 candidates that get merged down to 13 than to start with 10 and miss something.

```
CHECKPOINT: Candidates should come from at least two of the three
sources (backend, API, UI). If a candidate appears in only one source,
it may be an infrastructure concern rather than a business capability.
Flag single-source candidates for closer analysis.
```

### Step 3: Analyze Each Candidate

For each capability candidate, perform a structured analysis:

**Cohesion assessment:**
- Does this candidate have a clear, singular business purpose?
- Are the files that belong to it closely related (change together, reference each other)?
- Could you explain what it does in one sentence to a business stakeholder?

**Coupling assessment:**
- How tightly is this candidate bound to other candidates?
- Does it share repositories, data stores, or models with other candidates?
- Could it be deployed, modified, or replaced independently?

**Boundary assessment:**
- Is the candidate cleanly separated in the code (own package, own directory, own controller)?
- Or is it physically interleaved with another candidate (same class, same controller)?
- Which projects does it span? (core API only, or core + BFF + UI?)

**Size assessment:**
- How many files belong to this candidate?
- Is it too large (may need to split into multiple capabilities)?
- Is it too small (may need to merge into a parent capability)?

### Step 4: Determine Action for Each Candidate

Based on the analysis, assign one of four actions:

| Action | When to Use | Result |
| --- | --- | --- |
| **CONFIRM** | Cohesive, distinct purpose, meaningful size, clear boundaries | Becomes an L1 capability |
| **MERGE** | Too small, tightly coupled to a larger candidate, no independent lifecycle | Absorbed into a parent candidate as an L2 sub-capability |
| **SPLIT** | Too large, contains multiple distinct business functions | Split into multiple L1 candidates, re-analyze each |
| **DE-SCOPE** | Cross-cutting infrastructure, not a business capability, no domain data | Excluded from capability map (but documented as accounted for) |

For each MERGE, record which parent absorbs it and why.
For each DE-SCOPE, record the justification and confirm it doesn't contain business logic that should be elsewhere.

```
CHECKPOINT: Every candidate must have an action (CONFIRM, MERGE,
SPLIT, DE-SCOPE) with a documented rationale. No candidate should
be left unresolved.
```

### Step 5: Verify Coverage

Check that the confirmed capabilities cover the entire codebase:

1. **List every functional module** in every project (from S-00 project list and S-05 component inventories)
2. **Map each module** to a confirmed L1 capability
3. **Identify orphans** — modules not assigned to any capability
4. **Classify orphans** as: (a) assignable to an existing capability, (b) cross-cutting infrastructure (de-scoped), or (c) evidence of a missing capability

**Coverage target:** >90% of functional modules mapped to L1 capabilities. Remaining modules must be explicitly accounted for (de-scoped or cross-cutting).

If orphans suggest a missing capability, go back to Step 3 and analyze.

### Step 6: Define L2 Sub-Capabilities

For each confirmed L1 capability, break it into L2 sub-capabilities:

- Each L2 should represent a distinct function within the L1 (e.g., L1 "Asset Management" has L2s: "Hierarchy CRUD," "Images & Media," "Tag Management," "Metadata")
- L2s from merged candidates become sub-capabilities of the absorbing L1
- Each L2 should have: name, description (one sentence), and the projects it spans

**Naming convention:**
- L1: `L1-{number} {Capability Name}` (e.g., L1-1 Asset Management)
- L2: `L2-{L1 number}.{L2 number}: {Sub-Capability Name}` (e.g., L2-1.1: Hierarchy CRUD)

### Step 7: Map Capabilities to Actors

Cross-reference capabilities with the actor inventory from S-02:
- Which actors use each capability?
- Are there capabilities that serve only one actor type? (may indicate a partner-facing or admin-only feature)
- Are there actors that have no dedicated capabilities? (may indicate a gap)

### Step 8: Compile Capabilities Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/06-capabilities.md`

### Required Structure

```markdown
# Capabilities — {System Name}

> **Pipeline stage:** 06-capabilities
> **Date:** {date}
> **Input:** outputs/00-recon.md, outputs/01-entry-points.md, outputs/05-components-*.md
> **Scope:** {list of repositories/projects}

---

## 1. Seed Candidates

| # | Candidate | Source | Projects | Key Files |
| --- | --- | --- | --- | --- |
| 1 | {name} | {backend / API / UI / multiple} | {projects} | {representative files} |

Total seed candidates: {n}

---

## 2. Analysis and Action Determination

### Candidate {#}: {Name}

**Cohesion:** {HIGH / MEDIUM / LOW} — {brief assessment}
**Coupling:** {assessment of coupling to other candidates}
**Boundaries:** {where it lives in the code}
**Action:** {CONFIRM / MERGE -> parent / SPLIT / DE-SCOPE} — {rationale}

{Repeat for each candidate}

---

## 3. Action Summary

### Confirmed L1 Capabilities ({n})

| # | L1 Capability | Absorbed Candidates |
| --- | --- | --- |
| 1 | {name} | {merged candidates or "none"} |

### Merged ({n} candidates -> absorbed into L1s)

| Candidate | Merged Into | Rationale |
| --- | --- | --- |
| {name} | {L1 parent} | {why} |

### De-Scoped ({n} candidates)

| Candidate | Rationale |
| --- | --- |
| {name} | {why it's not a business capability} |

---

## 4. Coverage Verification

| Project | Total Functional Modules | Covered by L1 | De-scoped | Coverage % |
| --- | ---:| ---:| ---:| --- |
| {project} | {n} | {n} | {n} | {%} |
| **Total** | **{n}** | **{n}** | **{n}** | **{%}** |

### Orphans

| Module | Assignment |
| --- | --- |
| {module name} | {assigned to L1-X / de-scoped as cross-cutting / new finding} |

---

## 5. L1 Capability Definitions

### L1-{n}: {Capability Name}

**Projects:** {which projects contain code for this capability}
**Scope:** {what's included and what's excluded}
**Actors:** {which actors use this capability}
**L2 Sub-Capabilities:**
- L2-{n}.1: {name} — {one sentence description}
- L2-{n}.2: {name} — {one sentence description}

{Repeat for each L1 capability}

---

## 6. L2 Sub-Capability Inventory

| L1 | L2 | Name | Projects | Description |
| --- | --- | --- | --- | --- |
| L1-1 | L2-1.1 | {name} | {projects} | {one sentence} |

Total: {n} L1 capabilities, {n} L2 sub-capabilities

---

## 7. Capability-to-Actor Matrix

| Capability | Customer User | Admin User | Partner | System / Internal |
| --- | --- | --- | --- | --- |
| L1-1: {name} | {yes/no} | {yes/no} | {yes/no} | {yes/no} |

---

## 8. Key Findings

| # | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| 1 | {description} | {L1/L2 IDs, file counts, or coverage stats} | {why it matters for downstream skills} |

---

## 9. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Seed Candidates — Source C):** Adapter provides UI framework conventions for identifying feature modules. The `Angular` adapter knows that lazy-loaded route modules in `app-routing.module.ts` represent distinct features. The `React` adapter knows that `pages/` or `routes/` directories map to capability surfaces.
- **Step 3 (Analyze Candidates):** Adapter provides heuristics for what constitutes a "package" in the framework. The `.NET` adapter knows `.csproj` boundaries. The `java-spring` adapter knows `@SpringBootApplication` module boundaries.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Capability candidate exists | Files from at least 2 of 3 sources (backend, API, UI) with file paths |
| Capability is confirmed L1 | Cohesion assessment + boundary evidence + meaningful file count (not 2-3 files) |
| Candidate should merge | Shared package/directory + shared data store + no independent UI surface + small file count |
| Candidate should de-scope | No domain data + cross-cutting usage pattern + infrastructure-only purpose |
| Coverage percentage | Actual module count per project with explicit mapping to L1 capabilities |
| L2 sub-capability | Distinct function within L1 with its own entry points or UI section |
| Orphan resolution | Specific assignment to L1 or specific justification for de-scope |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Each controller is a capability" | Controllers reflect API design, not business capabilities. A BFF might have 24 controllers that map to only 13 capabilities because it proxies and reshapes requests. Trace through to the business logic, not the API surface. |
| "I can see the capabilities from the project names" | Project names are a starting signal but not the answer. A project called `AssetManagement` might contain 6 distinct sub-domains (assets, images, tags, metadata, events, published API). Always analyze what's inside. |
| "Small candidates should just be their own L1" | A candidate with 4 files and no dedicated UI is almost certainly an L2 sub-capability of a larger domain. L1 capabilities should be substantial enough to justify independent analysis, tracking, and potential service extraction. |
| "Cross-cutting concerns are capabilities too" | Authentication, logging, configuration, and error handling serve all capabilities but aren't capabilities themselves. They have no domain data, no dedicated business rules, and no user-facing function. De-scope them and document why. |
| "Coverage verification is optional if I'm confident" | Confidence without verification is assumption. The Perceptiv discovery found 12 orphan modules during coverage verification that needed assignment — and confirmed zero missing capabilities. Always verify. |

## Red Flags

- Capabilities identified only from project names without analyzing contents
- No merged or de-scoped candidates (every real system has candidates that should merge or de-scope)
- Coverage verification skipped or showing exactly 100% without orphan analysis
- L1 capabilities with only 2-3 files (too thin — probably should be L2)
- L2 sub-capabilities that are just "CRUD" repeated for every L1 (too generic — be specific about what's managed)
- Capability map that doesn't account for every project in the recon output
- No capability-to-actor mapping (capabilities exist for users — which users?)
- Single-source candidates confirmed as L1 without investigation

## Verification

Before marking this skill complete, confirm:

- [ ] Candidates were seeded from at least two sources (backend + API, or backend + UI)
- [ ] Every candidate has a structured analysis (cohesion, coupling, boundaries, size)
- [ ] Every candidate has an action (CONFIRM, MERGE, SPLIT, DE-SCOPE) with rationale
- [ ] Coverage verification achieves >90% with all modules accounted for
- [ ] Orphan modules are resolved (assigned to L1 or de-scoped with justification)
- [ ] Each L1 capability has: name, projects, scope, actors, and L2 sub-capabilities
- [ ] L2 sub-capabilities have: name, projects, and one-sentence description
- [ ] Capability-to-actor matrix is populated
- [ ] Key findings section captures the most important observations
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/06-capabilities.md`
- [ ] Output file follows the required structure from the Output Format section
