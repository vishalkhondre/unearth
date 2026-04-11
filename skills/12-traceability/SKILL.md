---
name: 12-traceability
description: >
  Maps every source file to its owning business component, L1 capability,
  container, and test coverage status. Creates a multi-level traceability
  chain from file to component to capability. Enables impact analysis
  (which capabilities are affected if this file changes) and migration
  planning (which files move together when extracting a component).
  Use after 11-tech-debt to complete Assessment before final documentation.
---

# Traceability

Maps every source file through a traceability chain: file to layer to business component to L1 capability to container. Creates a matrix that answers "which files belong to which capability?" and "if I change this file, what's affected?" Also produces migration guides per component by analyzing extraction difficulty.

Without this step, the mapping from code to capabilities exists only in the agent's intermediate reasoning. Making it explicit enables impact analysis, migration planning, and team-level ownership assignment.

## Pipeline Position

| Attribute       | Value                                  |
| --------------- | -------------------------------------- |
| **Stage**       | 4 — Assessment                         |
| **Skill**       | 12-traceability                        |
| **Runs after**  | `11-tech-debt`                         |
| **Runs before** | `13-documentation`                     |
| **Required by** | `13-documentation`                     |

## Inputs

### Required
- `outputs/05-components-*.md` — Section 3 (Business Components: files by layer per component), Section 4 (Technical Components)
- `outputs/06-capabilities.md` — Section 5 (L1 Capability Definitions with L2 sub-capabilities) for the component-to-capability mapping
- `outputs/04-containers.md` — Section 2 (Container Inventory), Section 4 (Shared Libraries)

### Optional (improves results)
- `outputs/09-dependencies.md` — Section 1 (Business-to-Business Dependencies), Section 4 (Shared Library Coupling) for extraction difficulty assessment
- `outputs/11-tech-debt.md` — Section 1 (Debt Register) for annotating traceability matrix with known debt items
- Stack adapter for the detected technology (provides migration heuristics)

## When to Use

**Use when:**
- You need to answer "which files belong to which capability?"
- You're planning a migration or extraction and need to know which files move together
- You need to assign team ownership at the file or capability level
- You're completing the Assessment stage before final documentation

**Do not use when:**
- `05-components` has not been run (you need file-to-component mappings)
- `06-capabilities` has not been run (you need component-to-capability mappings)
- The system is small enough that the mapping is obvious (fewer than 50 source files)

## Process

### Step 1: Load Upstream Context

Read upstream outputs. Extract:
- **From `05-components-*.md`:** File-by-layer tables for each business component and technical component
- **From `06-capabilities.md`:** L1/L2 capability definitions with the business components they contain
- **From `04-containers.md`:** Container inventory and shared libraries

Build the traceability chain: File → Layer → Component (BC/TC) → Capability (L1/L2) → Container (CON)

```
CHECKPOINT: The agent must have component-to-file mappings AND
component-to-capability mappings loaded. Both links in the chain
are required before building the traceability matrix.
```

### Step 2: Build the Traceability Matrix

For each analyzed container, build a matrix that maps every source file:

| Column | Source |
| --- | --- |
| **File path** | From S-05 component files-by-layer tables |
| **Layer** | Entry, service, repository, model, validator, config, infrastructure, test |
| **Business component** | BC-ID from S-05 |
| **Technical component** | TC-ID if the file is cross-cutting infrastructure (from S-05 Section 4) |
| **L1 capability** | From S-06 capability definitions |
| **L2 sub-capability** | From S-06 L2 inventory |
| **Container** | CON-ID from S-04 |
| **Has tests?** | Yes/No/Partial from S-05 Section 6 |
| **Debt items** | TD-IDs from S-11 if any apply to this file |

For files in shared libraries (not in a specific container), map them to their owning container(s) and note the shared nature.

For technical components, map them to all capabilities that use them (from S-05 Section 7 business-to-technical dependencies).

### Step 3: Validate Completeness

Check that the traceability matrix accounts for all source files:

- **Compare file counts:** Total files in the matrix should match file counts from S-00 recon and S-05 component analysis
- **Identify orphans:** Files not assigned to any component or capability
- **Resolve orphans:** Either assign them to an existing component or classify them (test utility, build tooling, configuration, dead code)

```
CHECKPOINT: Every production source file must appear in the
traceability matrix. Test files, build files, and configuration
files should be accounted for but can be grouped rather than
individually mapped.
```

### Step 4: Generate Per-Component Traceability Tables

For each business component, produce a focused traceability table showing all files grouped by layer. This is the "if I need to extract this component, here's every file that moves with it" view.

For each component's table, include:
- All files by layer (entry, service, repository, model, validator, test, etc.)
- Total file count
- Test coverage status (which files have tests, which don't)
- Cross-component dependencies (files in this component that reference files in another component)

### Step 5: Assess Migration Readiness per Component

For each business component, assess how difficult it would be to extract it into an independent service:

| Extraction Difficulty | Criteria |
| --- | --- |
| **Easy** | Already in its own deployable unit (own Function App, own service), few shared dependencies, clean boundaries |
| **Medium** | In a shared deployable unit but logically separated, limited shared repository usage, manageable dependencies |
| **Hard** | Tightly coupled to other components via shared repositories or shared data, god classes that must be decomposed first, high fan-in from other components |

For each component, document:
- **Extraction difficulty** (Easy / Medium / Hard)
- **Key blocker** (the single biggest obstacle to extraction)
- **Dependencies to resolve** (specific shared repositories, libraries, or data stores that create coupling)
- **Files that move** (count and list from the traceability table)
- **Files that stay** (shared infrastructure that remains with the parent container)

### Step 6: Build Impact Analysis Indexes

Create two reverse-lookup indexes:

**Capability Impact Index:** For each L1 capability, list all containers and files that implement it. If a capability requirement changes, these are the files that might need modification.

**File Impact Index:** For high-coupling files (those referenced by multiple components), list all components and capabilities that depend on them. If this file changes, these are the capabilities at risk.

Focus the file impact index on:
- God classes (already identified in S-05)
- Shared repository classes (high fan-in from S-09)
- Shared library classes (used by multiple containers from S-04)
- Core entity models (used across capabilities from S-07)

### Step 7: Compile Traceability Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/12-traceability.md`

### Required Structure

```markdown
# Traceability — {System Name}

> **Pipeline stage:** 12-traceability
> **Date:** {date}
> **Input:** outputs/04-containers.md, outputs/05-components-*.md, outputs/06-capabilities.md
> **Scope:** {list of repositories/projects}

---

## 1. Traceability Chain

```
File → Layer → Component (BC/TC) → Capability (L1/L2) → Container (CON)
```

| Metric | Value |
| --- | --- |
| Total source files traced | {n} |
| Business components | {n} |
| Technical components | {n} |
| L1 capabilities | {n} |
| Containers | {n} |
| Orphan files | {n} (should be 0) |

---

## 2. Per-Component Traceability

### {BC-ID}: {Component Name}

**Capability:** {L1-n}: {name} / {L2-n.n}: {name}
**Container:** {CON-ID}: {name}
**Total files:** {n}

| Layer | Files |
| --- | --- |
| Functions / Entry | {file list} |
| Services | {file list} |
| Repositories | {file list} |
| Models / Entities | {file list} |
| Validators | {file list} |
| Config | {file list} |
| Tests | {file list} |

**Test coverage:** {summary — n files tested, n untested}
**Cross-component dependencies:** {files referencing other BCs}

{Repeat for each business component}

---

## 3. Technical Component Traceability

| TC-ID | Name | Files | Used by Capabilities |
| --- | --- | --- | --- |
| {TC-ID} | {name} | {file list} | {L1 IDs} |

---

## 4. Migration Readiness

| Component | Extraction Difficulty | Key Blocker | Files to Move | Dependencies to Resolve |
| --- | --- | --- | ---:| --- |
| {BC-ID}: {name} | {Easy/Medium/Hard} | {blocker} | {n} | {shared repos, libraries, data stores} |

### Extraction Notes

#### {BC-ID}: {Component Name}

**Difficulty:** {Easy / Medium / Hard}
**Key blocker:** {single biggest obstacle}
**Dependencies to resolve:**
1. {specific dependency and how to address it}
**Files that move:** {count and key files}
**Files that stay:** {shared infrastructure}

{Repeat for key components}

---

## 5. Capability Impact Index

| L1 Capability | Containers | Components | File Count |
| --- | --- | --- | ---: |
| {L1-n}: {name} | {CON-IDs} | {BC-IDs} | {n} |

---

## 6. File Impact Index (High-Coupling Files)

| File | Line Count | Components That Depend | Capabilities Affected | Change Risk |
| --- | ---:| --- | --- | --- |
| {file path} | {n} | {BC-IDs} | {L1-IDs} | {HIGH/MEDIUM/LOW} |

---

## 7. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 5 (Migration Readiness):** Adapter provides migration heuristics for the framework. The `.NET` adapter knows that extracting an Azure Functions project into a separate solution requires packaging `Services.Common` as a NuGet package, that Gremlin client dependencies can be isolated via interface extraction, and that shared `local.settings.json` config needs environment-specific resolution. The `java-spring` adapter knows Spring module extraction patterns.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| File belongs to component | File path listed in S-05 component files-by-layer table |
| Component belongs to capability | Component name/ID mapped to L1 in S-06 capability definitions |
| Extraction difficulty | Based on dependency count (from S-09), shared repository usage (from S-05), god class presence (from S-05), and fan-in count |
| Cross-component dependency | Import or reference from one component's file to another's — with file paths for both source and target |
| File impact (high-coupling) | Fan-in count from S-09 dependency analysis or multiple component references from S-05 |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The component analysis already has file lists, we don't need a separate matrix" | S-05 maps files to components within a single container. Traceability maps files through the full chain: file → component → capability → container. This cross-level mapping enables capability-level impact analysis that S-05 alone cannot. |
| "Migration readiness is too speculative without actually trying it" | True, but order-of-magnitude assessment (Easy/Medium/Hard) based on coupling evidence is valuable for planning. The Perceptiv work accurately predicted extraction difficulty for 14 components using dependency analysis alone. |
| "Every file is traced in the IDE, we don't need a document" | IDE tracing works for individual files. A traceability matrix enables batch analysis: "show me all files for L1-1 Asset Management across all containers" or "which capabilities are affected if Services.Common changes?" These queries need a structured matrix. |
| "The file impact index is just the dependency graph" | The dependency graph shows component-level relationships. The file impact index identifies specific files whose modification has outsized blast radius — the god classes, shared repositories, and core entities that are change magnets. |
| "We'll figure out migration when we get to it" | Migration planning without traceability leads to missed files, broken dependencies, and incomplete extractions. The component traceability tables and extraction notes provide the checklist that prevents "we forgot to move the validators." |

## Red Flags

- Traceability matrix that doesn't account for all source files from S-00 recon
- Components without any files mapped (empty traceability entries)
- No orphan analysis (files not assigned to any component)
- Migration readiness that rates everything as "Easy" (god class components can't be Easy)
- File impact index that's empty (every system has high-coupling files)
- Cross-component dependencies not identified (components don't exist in isolation)
- Technical components missing from traceability (cross-cutting code affects all capabilities)
- No test coverage annotation on the traceability entries

## Verification

Before marking this skill complete, confirm:

- [ ] Every production source file from S-05 appears in the traceability matrix
- [ ] Each file is mapped to: layer, component (BC/TC), capability (L1/L2), and container (CON)
- [ ] Orphan files are identified and resolved (assigned or classified)
- [ ] Per-component traceability tables include all files with test coverage status
- [ ] Migration readiness is assessed for each component (Easy/Medium/Hard with key blocker)
- [ ] Capability impact index maps every L1 to its containers, components, and file count
- [ ] File impact index identifies high-coupling files with their blast radius
- [ ] Cross-component dependencies are noted in per-component tables
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/12-traceability.md`
- [ ] Output file follows the required structure from the Output Format section
