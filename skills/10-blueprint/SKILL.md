---
name: 10-blueprint
description: >
  Compares the discovered L1 capabilities against an industry reference
  architecture (blueprint) to identify full matches, partial coverage,
  critical gaps, and moderate gaps. Analyzes overlaps and redundancies
  across projects. Produces a coverage scorecard and prioritized roadmap
  with near-term, mid-term, and long-term recommendations. Use after
  09-dependencies when you need to assess how the system compares to
  industry standards.
---

# Blueprint Comparison

Compares the system's discovered capabilities against an industry reference architecture to answer: "How complete is this system compared to what a mature platform in this domain should have?" Produces a structured gap analysis with coverage scoring, overlap detection, and a prioritized remediation roadmap.

Without this step, the agent can describe what the system does but cannot assess what it's missing. Gap analysis against an industry blueprint reveals blind spots that internal teams may not see because they've normalized the absence.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 4 — Assessment                                    |
| **Skill**       | 10-blueprint                                       |
| **Runs after**  | `09-dependencies`                                  |
| **Runs before** | `11-tech-debt`                                     |
| **Required by** | `11-tech-debt`, `13-documentation`                 |

## Inputs

### Required
- `outputs/06-capabilities.md` — Section 5 (L1 Capability Definitions) and Section 6 (L2 Sub-Capability Inventory) for the system's capability map
- A blueprint file from `blueprints/` matching the system's domain (e.g., `blueprints/iiot-saas.md`, `blueprints/e-commerce.md`, `blueprints/saas-b2b.md`)

### Optional (improves results)
- `outputs/07-data-model.md` — Section 5 (Capability Alignment) for data-level gap evidence
- `outputs/08-patterns.md` — Section 7 (Absent Patterns) for architectural gaps that correlate with capability gaps
- `outputs/04-containers.md` — Section 7 (Architecture Patterns) for overlap analysis context
- `outputs/09-dependencies.md` — Section 3 (External Packages) for technology maturity context

## When to Use

**Use when:**
- You need to assess the system's completeness against industry standards
- You're building a modernization roadmap and need to identify what's missing
- Stakeholders want to understand competitive gaps
- You need to prioritize new capability investments

**Do not use when:**
- `06-capabilities` has not been run (you need the capability map first)
- No appropriate blueprint exists for the system's domain (consider creating one first, or use a generic SaaS blueprint)
- The system is highly bespoke with no industry comparables (the comparison may not be meaningful)

## Process

### Step 1: Select the Blueprint

Choose the industry blueprint that best matches the system's domain from the `blueprints/` directory. If no exact match exists:

1. Use the closest available blueprint
2. Note which blueprint capabilities don't apply to this system's domain
3. Consider creating a custom blueprint (see `docs/advanced/creating-blueprints.md`)

If the system spans multiple domains (e.g., an e-commerce platform with IoT features), select the primary domain blueprint and note cross-domain capabilities.

```
CHECKPOINT: The blueprint must be selected and loaded before
mapping begins. The agent must understand every blueprint
capability well enough to assess whether the system covers it.
```

### Step 2: Map Capabilities to Blueprint

For each capability in the blueprint, determine the coverage level:

| Coverage Level | Criteria |
| --- | --- |
| **Full** | A confirmed L1 (or combination of L1s) covers all major aspects of the blueprint capability |
| **Partial** | An L1 exists but is missing significant sub-capabilities or features described in the blueprint |
| **Gap** | No L1 capability addresses this blueprint capability at all |
| **Not Applicable** | This blueprint capability doesn't apply to the system's specific context |

For each mapping, record:
- **Blueprint capability** (ID and name)
- **System capability** (L1 ID and name, or "none")
- **Coverage level** (Full / Partial / Gap / N/A)
- **Assessment** (specific evidence for the coverage determination)

For Partial coverage, be specific about what exists and what's missing. "Partial" without detail is not useful.

### Step 3: Classify Gaps

For each Gap or Partial coverage finding, classify its business impact:

| Classification | Criteria |
| --- | --- |
| **Critical Gap** | High business impact; commonly expected in this type of platform; absence creates risk or competitive disadvantage |
| **Moderate Gap** | Nice-to-have; differentiating but not essential; absence limits future growth |
| **Partial Coverage** | Capability exists but is incomplete; specific sub-features are missing |

For each gap, document:
- **What's missing** (specific capability or feature)
- **Impact** (business consequence of the gap)
- **Recommendation** (how to address it, at what priority)

```
CHECKPOINT: Every blueprint capability must have a coverage level
assigned (Full, Partial, Gap, or N/A) before proceeding to overlap
analysis. If any blueprint capability is unclassified, resolve it now.
```

### Step 4: Analyze Overlaps

In multi-project systems (especially those with BFF patterns), capabilities often span multiple projects. Analyze where this creates problems:

| Overlap Type | What to Look For |
| --- | --- |
| **Pass-through** | BFF/gateway simply proxies requests to backend — acceptable, minimal risk |
| **DTO reshaping** | BFF transforms data shapes for the frontend — acceptable, but creates maintenance surface |
| **Split logic** | Business logic for one capability exists in two or more projects — problematic, creates drift |
| **Duplicated logic** | Same business rule implemented independently in multiple places — high risk of inconsistency |

For each overlap found:
- **Capability** affected
- **Overlap type** (from the table above)
- **Evidence** (specific files or logic in each project)
- **Severity** (Low / Medium / High)

### Step 5: Identify Redundancies

Look for places where the system has more than it needs or where duplication creates maintenance burden:

- **Model/DTO duplication** across projects (same entity defined in multiple places with diverging fields)
- **Mock implementations** mirroring live implementations (dual maintenance)
- **Dead features** (capabilities present in code but disabled or unreachable from the UI)
- **Parallel implementations** (two components serving the same purpose)

### Step 6: Produce Scorecard

Compile a summary scorecard:

| Dimension | How to Calculate |
| --- | --- |
| **Blueprint Coverage** | Count of Full + Partial vs. total applicable blueprint capabilities |
| **Critical Gaps** | Count of gaps classified as critical |
| **Moderate Gaps** | Count of gaps classified as moderate |
| **Partial Capabilities** | Count of partially covered capabilities |
| **Overlaps (medium+)** | Count of medium or high severity overlaps |
| **Redundancies** | Count of identified redundancies |

### Step 7: Build Prioritized Roadmap

Organize recommendations into time horizons:

**Near-Term (0-6 months):**
- Redundancy elimination (reduces maintenance burden immediately)
- Critical overlap fixes (reduces drift risk)
- Foundation for critical gaps (start the highest-impact new capabilities)

**Mid-Term (6-12 months):**
- Address partial coverage items (complete what's started)
- Build first critical gap capabilities
- Protocol or integration expansion

**Long-Term (12+ months):**
- Address moderate gaps
- Advanced capabilities (ML, digital twin, edge computing)
- Platform maturity features (billing, geospatial)

Each recommendation should reference a specific gap, overlap, or redundancy ID and have a clear deliverable.

### Step 8: Compile Blueprint Comparison Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/10-blueprint.md`

### Required Structure

```markdown
# Blueprint Comparison — {System Name}

> **Pipeline stage:** 10-blueprint
> **Date:** {date}
> **Input:** outputs/06-capabilities.md, blueprints/{blueprint-name}.md
> **Scope:** {list of repositories/projects}
> **Blueprint:** {blueprint name and version}

---

## 1. Reference Blueprint

**Blueprint:** {name}
**Domain:** {industry domain}
**Source frameworks:** {frameworks the blueprint is based on}

| # | Blueprint Capability | Description |
| --- | --- | --- |
| B1 | {name} | {brief description} |

---

## 2. Capability-to-Blueprint Mapping

| Blueprint | System L1 | Coverage | Assessment |
| --- | --- | --- | --- |
| B1: {name} | L1-{n}: {name} | {Full/Partial/Gap/N/A} | {specific evidence} |

---

## 3. Gap Analysis

### Critical Gaps

| # | Missing Capability | Impact | Recommendation |
| --- | --- | --- | --- |
| G1 | {name} | {business consequence} | {how to address} |

### Moderate Gaps

| # | Missing Capability | Impact | Recommendation |
| --- | --- | --- | --- |
| G{n} | {name} | {consequence} | {recommendation} |

### Partial Coverage

| # | Capability | What Exists | What's Missing |
| --- | --- | --- | --- |
| P1 | {name} | {what the system has} | {what's absent} |

---

## 4. Overlap Analysis

| L1 Capability | Overlap Type | Evidence | Severity |
| --- | --- | --- | --- |
| {capability} | {pass-through/DTO reshaping/split logic/duplicated logic} | {files in each project} | {Low/Medium/High} |

---

## 5. Redundancies

| # | Redundancy | Description | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| R1 | {name} | {what's duplicated or redundant} | {maintenance consequence} | {how to fix} |

---

## 6. Scorecard

| Dimension | Score | Notes |
| --- | --- | --- |
| Blueprint Coverage | {n}/{total} ({%}) | {full + partial count breakdown} |
| Critical Gaps | {n} | {brief list} |
| Moderate Gaps | {n} | {brief list} |
| Partial Capabilities | {n} | {brief list} |
| Overlaps (medium+) | {n} | {brief list} |
| Redundancies | {n} | {brief list} |

---

## 7. Prioritized Roadmap

### Near-Term (0-6 months)

1. **{ID} — {title}:** {description and deliverable}

### Mid-Term (6-12 months)

1. **{ID} — {title}:** {description and deliverable}

### Long-Term (12+ months)

1. **{ID} — {title}:** {description and deliverable}

---

## 8. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill does not have stack adapter hooks. Blueprint comparison operates at the capability level, which is technology-agnostic. The blueprint itself provides the domain-specific reference point.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Full coverage | L1 capability definition (from S-06) covers all major aspects of blueprint capability — cite specific L2 sub-capabilities that match |
| Partial coverage | L1 exists but specific blueprint features are absent — cite what's present (L2s) AND what's missing |
| Gap | No L1 maps to this blueprint capability — confirm by reviewing the full L1 list and the blueprint capability description |
| Not applicable | Blueprint capability doesn't fit the system's context — explain why (e.g., "billing not needed for internal platform") |
| Overlap severity | Code evidence from both projects showing duplicated logic with specific file paths |
| Redundancy | Two implementations of the same thing with evidence from both — or unused implementation with evidence of non-use |
| Roadmap priority | Gap severity (critical > moderate) + implementation effort assessment + dependency on other roadmap items |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This system is unique, industry blueprints don't apply" | Every system has domain peers. Even unique systems benefit from knowing which standard capabilities they've omitted — it may be intentional (good) or an oversight (bad). The comparison reveals which. |
| "We'll address gaps when customers ask for them" | Critical gaps in audit, security, or data export may never be "requested" by customers — they're expected by default. Customers don't request audit logging; regulators require it. |
| "Partial coverage is fine, we have the basics" | "Partial" often means the most visible part was built but the most valuable part was skipped. A rules engine with CRUD but no complex event processing covers the easy half. |
| "The overlap is just the BFF pattern, it's normal" | Pass-through BFF overlap is normal. Split business logic across BFF and backend is not. Distinguish between architectural pattern (acceptable) and duplicated logic (problematic). |
| "We don't need a roadmap, we know what to build" | Prioritization without structured gap analysis is intuition, not strategy. The roadmap forces sequencing decisions: what comes first, what depends on what, what can wait. |

## Red Flags

- Mapping that shows all "Full" coverage with no gaps (no real system fully covers an industry blueprint)
- Gap analysis with no impact assessment (gaps without business consequences don't drive action)
- No overlap analysis for multi-project systems (BFF + backend always has overlap to assess)
- Roadmap that lists gaps without prioritization (everything is "do now")
- Scorecard percentages that don't match the detailed mapping table
- Missing the "Not Applicable" category (not every blueprint capability fits every system)
- Recommendations that are vague ("improve notifications" instead of "add webhook outbound for customer integrations")
- No reference to the specific blueprint used (results are meaningless without the comparison baseline)

## Verification

Before marking this skill complete, confirm:

- [ ] Blueprint is selected and identified by name in the output header
- [ ] Every blueprint capability is mapped to a system L1 (or marked as Gap/N/A)
- [ ] Coverage levels (Full/Partial/Gap/N/A) have specific evidence or assessment text
- [ ] Gaps are classified as Critical or Moderate with impact and recommendation
- [ ] Partial coverage items specify what exists AND what's missing
- [ ] Overlap analysis covers all L1 capabilities that span multiple projects
- [ ] Redundancies are identified with maintenance impact
- [ ] Scorecard totals reconcile with the detailed mapping
- [ ] Prioritized roadmap has near-term, mid-term, and long-term sections
- [ ] Each roadmap item references a specific gap, overlap, or redundancy ID
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/10-blueprint.md`
- [ ] Output file follows the required structure from the Output Format section
