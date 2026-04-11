# Capability Mapping Guide

Reference guide for the capability extraction methodology used in skill `06-capabilities`. Covers candidate seeding, analysis, actions, L1/L2 hierarchy, and coverage verification.

## What Is a Business Capability?

A business capability is a distinct function the system performs for its users. It's named in business language, not technology language.

| Good Capability Name | Bad Capability Name | Why |
| --- | --- | --- |
| Asset Management | MongoDB CRUD | Describes business function, not technology |
| User & Role Management | AuthController | Describes what users get, not how it's implemented |
| Command Services | IoT Hub Integration | Describes the business action, not the infrastructure |
| Notification & Alerting | SignalR Hub | Describes user-facing function, not the protocol |

## Three-Source Candidate Seeding

Always seed candidates from at least 2 of 3 sources:

| Source | What to Scan | Signal Strength |
| --- | --- | --- |
| **Backend packages** | Project/namespace names, business component groups from S-05, distinct data stores | Strong — each distinct data store usually maps to a capability |
| **API surface** | Controller/function classes, route prefix groups, functional endpoint clusters | Medium — BFF controllers may proxy without owning the capability |
| **UI modules** | Feature modules, route-level pages, admin vs. customer sections | Medium — UI reflects user-facing capabilities but may split one capability across views |

**Rule:** A candidate appearing in only one source is suspicious. Investigate whether it's a real capability or infrastructure.

## The Four Actions

| Action | Criteria | Result |
| --- | --- | --- |
| **CONFIRM** | Cohesive, distinct purpose, meaningful size (10+ files), clear boundaries, appears in 2+ sources | Becomes an L1 capability |
| **MERGE** | Too small (<10 files), tightly coupled to a larger candidate, no independent UI or API surface, shared data store | Absorbed into parent as L2 sub-capability |
| **SPLIT** | Too large, contains 2+ distinct business functions with separate user audiences or data stores | Split into multiple candidates, re-analyze each |
| **DE-SCOPE** | Cross-cutting infrastructure (auth, logging, error handling), no domain data, used by all capabilities | Excluded from capability map, documented as accounted for |

## Merge Decision Guide

| Signal | Action |
| --- | --- |
| Candidate has <10 files AND no dedicated controller/UI | MERGE into parent |
| Candidate shares the same data store AND same directory as another candidate | MERGE |
| Candidate has its own API surface but <5 endpoints and no dedicated UI | Consider MERGE — it may be a thin sub-feature |
| Candidate appears in all 3 sources with 20+ files | CONFIRM — it's substantial enough for L1 |

## De-Scope Decision Guide

| Candidate Type | Action | Rationale |
| --- | --- | --- |
| Authentication/authorization framework | DE-SCOPE | Infrastructure — RBAC entities belong in User Management |
| Global search/aggregation | DE-SCOPE | Cross-cutting UX — no domain data |
| Secrets management | DE-SCOPE | Infrastructure plumbing |
| Logging/monitoring | DE-SCOPE | Observability infrastructure |
| Health check endpoints | DE-SCOPE | Operational infrastructure |

## L1 vs. L2 Hierarchy

**L1 (top-level capability):**
- Has its own dedicated API surface or entry points
- Manages its own data entities
- Serves a distinct user need
- Could theoretically be its own microservice
- Naming: `L1-{number} {Capability Name}`

**L2 (sub-capability within an L1):**
- A distinct function within an L1 domain
- May or may not have its own entry points
- Uses the parent L1's data store or shared data
- Naming: `L2-{L1}.{L2}: {Sub-Capability Name}`

**Typical ratio:** 1 L1 has 3-6 L2s. If an L1 has only 1 L2, the L2 is probably the L1. If an L1 has 10+ L2s, consider splitting the L1.

## Coverage Verification

**Target:** >90% of functional modules mapped to L1 capabilities.

**How to verify:**
1. List every functional module in every project (from S-00 and S-05)
2. Map each to a confirmed L1 capability
3. Identify orphans (unmapped modules)
4. Resolve orphans: assign to L1, classify as de-scoped, or investigate for missing capability

**What counts as "accounted for":** Mapped to an L1 OR explicitly de-scoped with rationale.

**What counts as a gap:** An orphan module that suggests a business capability not in the L1 list.
