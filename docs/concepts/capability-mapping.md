# Concept: Capability Mapping

A business capability is what the system does for its users, described in business language rather than technology language. Capability mapping is the process of extracting these capabilities from code and organizing them into a hierarchy.

## Why Capabilities Matter

Code structure tells you how the system is built. Capabilities tell you what the system does. This distinction matters because:

- **Stakeholders think in capabilities.** A product manager asks "can we do asset management?" not "do we have a MongoDB repository for assets?"
- **Migration planning needs capabilities.** You extract and deploy capabilities, not layers or packages.
- **Gap analysis needs capabilities.** Industry blueprints define what a mature platform should do, measured in capabilities.
- **Prioritization needs capabilities.** Business value is tied to capabilities, not code modules.

## What Makes a Good Capability

A well-defined business capability has five characteristics:

| Characteristic | Test | Example |
| --- | --- | --- |
| **Business-named** | Could a product manager understand the name? | "Order Management" not "OrderController" |
| **Cohesive** | Does everything in this capability serve one purpose? | Asset CRUD, search, images, metadata — all about managing assets |
| **Bounded** | Can you draw a clear line around what's in vs. out? | User profiles and roles are in User Management; auth middleware is not |
| **Evidenced** | Can you point to specific code that implements it? | 15 files across Functions, Services, and Repositories directories |
| **Substantial** | Is it big enough to matter? | 10+ files, dedicated entry points, own data entities |

## The Two-Level Hierarchy

Unearth organizes capabilities into L1 (top-level) and L2 (sub-capabilities):

**L1 capabilities** are the big functions — each could theoretically be its own microservice. A typical system has 8-15 L1 capabilities.

**L2 sub-capabilities** are distinct functions within an L1 domain. Each L1 typically has 3-6 L2s. They share the L1's data and infrastructure but serve a distinguishable sub-function.

**Example:**

```
L1-1: Asset Management
  L2-1.1: Asset Hierarchy (CRUD, tree operations, link/unlink)
  L2-1.2: Asset Search & Filtering (queries, faceted search)
  L2-1.3: Asset Media (images, thumbnails, upload/download)
  L2-1.4: Asset Configuration (IP config, parameters, metadata)
```

## How Unearth Extracts Capabilities

Skill `06-capabilities` uses a three-source seeding approach:

1. **Backend components** — project/namespace groupings from S-05
2. **API surface** — controller/function route prefix groups from S-01
3. **UI modules** — feature modules and route-level pages from the frontend

Candidates that appear in 2+ sources are strong. Candidates in only 1 source need investigation.

Each candidate is then analyzed and assigned one of four actions: CONFIRM (becomes L1), MERGE (becomes L2 under a parent), SPLIT (too large, breaks into multiple candidates), or DE-SCOPE (cross-cutting infrastructure, not a capability).

## Common Pitfalls

**Naming by technology:** "MongoDB Service" is not a capability. What business function does it serve?

**Capabilities that are too thin:** If a candidate has 4 files and no UI, it's probably an L2 sub-capability, not an L1.

**Missing the UI perspective:** Backend-only analysis misses capabilities that exist primarily in the frontend (dashboard customization, user preferences, onboarding flows).

**Including infrastructure:** Authentication middleware, logging, health checks, and error handling are not capabilities — they're cross-cutting concerns. De-scope them.

## Further Reading

- `references/capability-mapping-guide.md` — detailed seeding, merge/split/de-scope decision guides
- `templates/capability-map.md` — output template for capability maps
- `skills/06-capabilities/SKILL.md` — the full capability extraction skill
