# Architecture Document — {System Name}

> **Pipeline stage:** S-13 (documentation)
> **Date:** {date}
> **Scope:** {list of repositories/projects}
> **Pipeline skills completed:** {list of skill IDs that were run}

## Table of Contents

1. Executive Summary
2. Architecture Overview
3. Capability Map
4. Data Model Summary
5. Pattern Assessment
6. Dependency Landscape
7. Industry Blueprint Comparison
8. Tech Debt Summary
9. Migration Readiness
10. Recommendations
11. Open Questions
12. Pipeline Outputs Index

---

## 1. Executive Summary

**System:** {name} — {one-sentence description}
**Technology:** {primary languages, frameworks, cloud platform}
**Scale:** {repositories, containers, source files, capabilities}
**Architecture:** {primary pattern (e.g., N-tier with BFF, microservices, monolith)}

**Key Strengths:**
- {strength 1}
- {strength 2}
- {strength 3}

**Key Risks:**
- {risk 1 — highest severity finding}
- {risk 2}
- {risk 3}

**Blueprint Coverage:** {n}/{total} ({%})
**Recommended Next Steps:**
1. {action 1 — most impactful}
2. {action 2}
3. {action 3}

---

## 2. Architecture Overview

### 2.1 System Context
{Actors, external systems, boundary — from S-02 and S-03}

### 2.2 Container Architecture
{Container inventory, topology diagram, key flows — from S-04}

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
1. **{ID} — {title}:** {description}

### Mid-Term (6-12 months)
1. **{ID} — {title}:** {description}

### Long-Term (12+ months)
1. **{ID} — {title}:** {description}

---

## 11. Open Questions
{All [NEEDS VERIFICATION] items grouped by theme}

---

## 12. Pipeline Outputs Index

| Skill | Output File | Key Deliverable |
| --- | --- | --- |
| 00-recon | outputs/00-recon.md | Technology stack, project organization |
| 01-entry-points | outputs/01-entry-points.md | Entry point inventory |
| 02-actors-and-boundaries | outputs/02-actors-and-boundaries.md | Actor list, system boundary |
| 03-external-systems | outputs/03-external-systems.md | External system inventory |
| 04-containers | outputs/04-containers.md | Container inventory, communication map |
| 05-components | outputs/05-components-*.md | Component inventories (per container) |
| 06-capabilities | outputs/06-capabilities.md | L1/L2 capability map |
| 07-data-model | outputs/07-data-model.md | Entity inventory, relationships |
| 08-patterns | outputs/08-patterns.md | Pattern and anti-pattern inventory |
| 09-dependencies | outputs/09-dependencies.md | Dependency landscape, risks |
| 10-blueprint | outputs/10-blueprint.md | Industry comparison, gaps |
| 11-tech-debt | outputs/11-tech-debt.md | Prioritized debt register |
| 12-traceability | outputs/12-traceability.md | File-to-capability traceability |
| 13-documentation | outputs/13-documentation.md | This document |
