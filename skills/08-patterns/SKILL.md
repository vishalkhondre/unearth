---
name: 08-patterns
description: >
  Detects architecture patterns and anti-patterns from structural and
  knowledge outputs. Covers structural patterns (N-tier, clean architecture,
  CQRS, microservices, BFF, event-driven), domain patterns (anemic model,
  rich model, DDD), and anti-patterns (god classes, circular dependencies,
  shared databases, missing abstractions). Each detection requires evidence
  from at least two upstream outputs. Use after 07-data-model when you need
  to characterize the architectural style and identify structural risks.
---

# Patterns

Detects the architecture patterns and anti-patterns present in the codebase by synthesizing evidence from structural analysis (containers, components) and knowledge extraction (capabilities, data model). Each pattern is classified with evidence, scope, and an assessment of whether it's well-implemented, partial, or problematic.

Without this step, the agent can describe what the system does and how it's structured, but cannot characterize *how well* it's structured. Pattern detection reveals intentional design decisions, accidental complexity, and structural risks that directly inform tech debt assessment and modernization planning.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 3 — Knowledge                                      |
| **Skill**       | 08-patterns                                        |
| **Runs after**  | `07-data-model`                                    |
| **Runs before** | `09-dependencies`                                  |
| **Required by** | `09-dependencies`, `11-tech-debt`, `13-documentation` |

## Inputs

### Required
- `outputs/04-containers.md` — Section 7 (Architecture Patterns) for container-level patterns already detected, and Section 5 (Container-to-Container Communication) for communication topology
- `outputs/05-components-*.md` — Section 2 (Layer Structure), Section 5 (God Classes), Section 7 (Intra-Container Dependencies) for component-level patterns
- `outputs/07-data-model.md` — Section 2 (Entity Attribute Details) for domain model patterns, Section 5 (Capability Alignment) for data ownership patterns

### Optional (improves results)
- `outputs/06-capabilities.md` — Section 5 (L1 Definitions) for capability-to-architecture alignment
- `outputs/01-entry-points.md` — Section 8 (Auth Pattern Summary) for security patterns
- Stack adapter for the detected technology (provides framework-specific pattern detection)

## When to Use

**Use when:**
- You need to characterize the system's architectural style
- You're assessing modernization readiness (which patterns help, which hinder)
- You need to identify anti-patterns for the tech debt register
- You're preparing for blueprint comparison (patterns inform architectural maturity)

**Do not use when:**
- `07-data-model` has not been run (domain model patterns require entity analysis)
- You only need a high-level architecture description (S-04 container patterns may suffice)

## Process

### Step 1: Load Upstream Context

Read upstream outputs. Extract:
- **From `04-containers.md`:** Architecture patterns already detected at container level, communication topology, shared database findings
- **From `05-components-*.md`:** Layer structures, god classes, intra-container dependencies
- **From `07-data-model.md`:** Entity classification (storage vs. projection), entity attribute details, capability alignment, coupling hotspots

This skill synthesizes patterns across multiple levels — container, component, and data — rather than detecting them from scratch.

```
CHECKPOINT: The agent must have container topology, component layers,
and data model findings loaded. Pattern detection without these three
inputs will miss cross-cutting patterns.
```

### Step 2: Detect Structural Patterns

Scan for architecture structure patterns. For each, check the specific evidence signals:

| Pattern | Evidence Signals | How to Confirm |
| --- | --- | --- |
| **Layered N-Tier** | Entry → Service → Repository → DB chain; no domain layer; controllers/functions inject services which inject repositories | Trace 3+ request flows through the layers; confirm all follow the same chain |
| **Clean Architecture** | Domain/Application/Infrastructure project separation; dependency inversion (domain has no external references); ports and adapters | Check project references — domain project must NOT reference infrastructure |
| **Hexagonal (Ports & Adapters)** | `Ports/` and `Adapters/` directories; interfaces in core, implementations in infrastructure | Check that core defines interfaces, infrastructure implements them |
| **CQRS** | Separate command and query models; `ICommandHandler<T>`, `IQueryHandler<T>`; MediatR or similar | Find command/query separation in both code structure and data paths |
| **Vertical Slices** | `Features/` directories; each feature contains its own controller, handler, model, validator | Check that cross-feature references are minimal |
| **Microservices** | Each container owns its data store; containers communicate only via API/events; no shared database | Verify from S-04 container-to-external mapping — is the database shared? |
| **Modular Monolith** | Single deployable with strong internal module boundaries; modules communicate via interfaces, not direct references | Check that module-to-module dependencies go through defined interfaces |
| **BFF (Backend-for-Frontend)** | A container that aggregates calls to multiple backend services for a specific frontend | Check that BFF doesn't contain domain logic — only aggregation and transformation |
| **API Gateway** | A container or external service routing requests to backend containers; enforces auth, rate limiting | Check from S-04 communication map — all requests flow through one entry point |
| **Event-Driven** | Containers communicating via events/messages; event producers and consumers decoupled | Check from S-01 non-HTTP triggers and S-04 async communication links |
| **Serverless** | Functions-as-a-Service; stateless; event-triggered; auto-scaling | Check deployment targets — Azure Functions, AWS Lambda, Google Cloud Functions |

For each pattern detected, record: pattern name, which containers/components exhibit it, specific evidence, and assessment (well-implemented / partial / problematic).

**Negative detection is equally important.** If a common pattern is NOT present but would be expected for this type of system, note its absence. For example: "No CQRS despite separate read and write paths" or "No event-driven communication despite using Event Hub."

### Step 3: Detect Domain Model Patterns

Scan for patterns in how the domain is modeled:

| Pattern | Evidence Signals |
| --- | --- |
| **Anemic Domain Model** | Entity classes are pure property bags with no behavior methods; all business logic in service classes; entities have only getters/setters |
| **Rich Domain Model** | Entities contain business methods (e.g., `order.Cancel()`, `asset.MoveTo(parent)`); value objects; domain events |
| **Domain-Driven Design** | Bounded contexts, aggregates, repositories per aggregate, domain events, value objects, specifications |
| **Active Record** | Entity classes inherit from base that provides persistence methods (e.g., `save()`, `delete()`, `find()`) |
| **Data Mapper** | Separate mapper layer transforms between domain objects and persistence objects |
| **Entity-per-table** | 1:1 mapping between entity classes and database tables/collections with no abstraction layer |

Evidence comes primarily from `07-data-model.md` entity attribute details and `05-components-*.md` business component files.

### Step 4: Detect Anti-Patterns

Scan for patterns that indicate structural problems:

| Anti-Pattern | Evidence Signals | Severity Guidance |
| --- | --- | --- |
| **God Class** | Files >500 lines with multiple responsibilities (from S-05 Section 5) | HIGH if >1000 lines; MEDIUM if 500-1000 |
| **Fat Controller/Function** | Entry-point classes containing business logic instead of delegating to services | HIGH if business logic is inline; MEDIUM if mixed |
| **Circular Dependencies** | Component A depends on B, B depends on A (from S-05 Section 7 intra-container deps) | HIGH — prevents independent testing and deployment |
| **Shared Database** | Multiple containers accessing the same database without isolation (from S-04 Section 7) | MEDIUM if logically separated collections; HIGH if shared tables |
| **Distributed Monolith** | Microservice topology but tightly coupled (shared models, synchronous chains, shared DB) | HIGH — has the complexity of microservices without the benefits |
| **Missing Abstraction** | Business logic directly using infrastructure (e.g., Gremlin queries in service classes) | MEDIUM — hinders testing and portability |
| **Leaky Abstraction** | Infrastructure details exposed through domain interfaces (e.g., MongoDB-specific types in domain models) | MEDIUM — couples domain to infrastructure |
| **No Error Taxonomy** | All exceptions caught as generic `Exception`; no domain-specific error types | LOW to MEDIUM — hinders debugging and error handling |
| **Magic Strings** | Configuration keys, route patterns, or constants as string literals without constants | LOW — maintenance risk but not structural |
| **Dead Code** | Test files with no runnable tests; packages referenced but never imported; routes defined but unreachable | MEDIUM — maintenance burden and false confidence |

### Step 5: Detect Communication Patterns

Scan for patterns in how containers and components communicate:

| Pattern | Evidence Signals |
| --- | --- |
| **Synchronous Chain** | Request flows through 3+ containers sequentially (from S-04 Section 8 key flows) |
| **Async Decoupling** | Event/message-based communication between containers (from S-04 Section 5) |
| **Shared State** | Containers coordinating through a shared database rather than APIs/events |
| **Saga / Choreography** | Multi-step workflows coordinated through events across containers |
| **Orchestration** | A central coordinator managing multi-step workflows via direct calls |
| **Circuit Breaker** | Resilience patterns on inter-container calls (from S-04 Section 6 resilience column) |
| **Retry Without Backoff** | Retry policies without exponential backoff or jitter |
| **No Resilience** | Inter-container calls with no retry, timeout, or circuit-breaker policy |

### Step 6: Detect Security Patterns

Scan for patterns in authentication and authorization:

| Pattern | Evidence Signals |
| --- | --- |
| **Centralized Auth** | All containers validate tokens through a shared middleware or library |
| **Auth at the Gateway** | API gateway handles auth; backend containers trust authenticated requests |
| **Per-Service Auth** | Each container independently validates tokens |
| **RBAC** | Role-based access control with defined roles and permissions |
| **Shared Secret (Internal)** | Service-to-service auth using shared keys or proof tokens |
| **No Auth on Internal** | Internal endpoints accessible without authentication |

### Step 7: Compile Pattern Assessment

For each detected pattern (structural, domain, communication, security) and anti-pattern, produce a structured assessment:

- **Pattern name**
- **Category** (structural / domain / anti-pattern / communication / security)
- **Scope** (which containers, components, or entity groups)
- **Evidence** (specific file paths, communication links, or data model findings with upstream output references)
- **Assessment** (well-implemented / partial / problematic / absent-but-expected)
- **Impact** (what this pattern means for maintenance, evolution, and modernization)

```
CHECKPOINT: Every pattern claim must have evidence from at least
two upstream outputs. A pattern detected from only one source
(e.g., only layer structure but no data flow confirmation) should
be flagged as [NEEDS VERIFICATION].
```

### Step 8: Compile Patterns Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/08-patterns.md`

### Required Structure

```markdown
# Patterns — {System Name}

> **Pipeline stage:** 08-patterns
> **Date:** {date}
> **Input:** outputs/04-containers.md, outputs/05-components-*.md, outputs/07-data-model.md
> **Scope:** {list of repositories/projects}

---

## 1. Pattern Summary

| # | Pattern | Category | Scope | Assessment |
| --- | --- | --- | --- | --- |
| P-01 | {name} | {structural/domain/communication/security} | {containers or components} | {well-implemented/partial/problematic} |
| AP-01 | {name} | anti-pattern | {scope} | {severity} |

---

## 2. Structural Patterns

### P-{n}: {Pattern Name}

**Category:** Structural
**Scope:** {which containers/components}
**Evidence:**
- {evidence point 1 with file path or upstream reference}
- {evidence point 2}
**Assessment:** {well-implemented / partial / problematic}
**Impact:** {what this means for the system}

{Repeat for each structural pattern}

---

## 3. Domain Model Patterns

### P-{n}: {Pattern Name}

**Category:** Domain
**Scope:** {which entities/components}
**Evidence:**
- {evidence from data model and component analysis}
**Assessment:** {assessment}
**Impact:** {impact}

---

## 4. Anti-Patterns

### AP-{n}: {Anti-Pattern Name}

**Category:** Anti-pattern
**Scope:** {affected containers/components}
**Severity:** {HIGH / MEDIUM / LOW}
**Evidence:**
- {specific files, line counts, or structural issues}
**Impact:** {what problems this causes}
**Remediation:** {brief guidance on how to address}

{Repeat for each anti-pattern}

---

## 5. Communication Patterns

### P-{n}: {Pattern Name}

**Category:** Communication
**Scope:** {which communication links}
**Evidence:**
- {from S-04 communication map}
**Assessment:** {assessment}
**Impact:** {impact}

---

## 6. Security Patterns

### P-{n}: {Pattern Name}

**Category:** Security
**Scope:** {which containers/endpoints}
**Evidence:**
- {from S-01 auth patterns and S-02 actors}
**Assessment:** {assessment}

---

## 7. Absent Patterns (Expected but Not Found)

| # | Expected Pattern | Why Expected | Why Absent | Impact |
| --- | --- | --- | --- | --- |
| 1 | {pattern} | {why a system like this would typically have it} | {possible reason for absence} | {consequence} |

---

## 8. Pattern Interaction Analysis

Describe how detected patterns interact with each other:
- Complementary patterns (e.g., BFF + API Gateway work well together)
- Conflicting patterns (e.g., shared database undermines microservices boundary)
- Patterns that amplify anti-patterns (e.g., synchronous chain + no resilience = cascading failure)

---

## 9. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Structural Patterns):** Adapter provides framework-specific pattern indicators. The `.NET` adapter knows that MediatR indicates CQRS, that `Features/` directories indicate vertical slices, and that Azure Functions with isolated worker indicate serverless. The `java-spring` adapter knows that `@EnableDiscoveryClient` indicates microservices, that `spring-cloud-gateway` indicates API gateway.
- **Step 3 (Domain Patterns):** Adapter knows the ORM conventions that distinguish anemic from rich domain models in the framework.
- **Step 5 (Communication Patterns):** Adapter knows resilience library patterns (Polly for .NET, Resilience4j for Java, tenacity for Python).

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Structural pattern detected | Layer structure from S-05 + communication topology from S-04 (both required) |
| Domain pattern detected | Entity attribute details from S-07 + component business rules from S-05 |
| Anti-pattern detected | Specific file paths with line counts, or specific communication links that demonstrate the issue |
| Communication pattern | Communication map entries from S-04 with protocol and direction |
| Security pattern | Auth classification from S-01/S-02 + implementation evidence from S-05 |
| Pattern is absent | List of indicators searched for and not found, with directories/files scanned |
| Pattern assessment | At least 3 evidence points for "well-implemented"; at least 1 counter-evidence for "partial" or "problematic" |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The architecture doesn't follow any named pattern" | Every codebase has patterns — they may be unnamed, inconsistent, or accidental, but they exist. N-tier with anemic domain is still a pattern. Identify what IS there, not what you wish was there. |
| "God classes are just large files, not a pattern issue" | God classes are the most common anti-pattern and have compounding effects: merge conflicts, testing difficulty, cognitive load, and coupling. They're architectural, not cosmetic. |
| "The shared database isn't a problem because each service uses different collections" | Logical separation doesn't eliminate the coupling. Shared connection strings, shared throughput limits, shared migration risk, and the temptation to cross-query are all real. Document the pattern with the specific isolation level. |
| "Anti-patterns are just tech debt, I'll cover them in S-11" | Anti-patterns are structural — they describe HOW the system is built. Tech debt in S-11 describes the CONSEQUENCES. Detecting patterns here feeds S-11 with structured findings rather than ad-hoc observations. |
| "Security patterns are covered in S-02 actors" | S-02 classifies auth per actor. This skill characterizes the auth ARCHITECTURE — centralized vs. per-service, gateway-level vs. application-level. Different level of analysis. |

## Red Flags

- Pattern inventory with only one pattern detected (every multi-container system has multiple patterns)
- Anti-patterns section is empty (every real system has at least god classes or missing abstractions)
- Patterns detected without evidence from at least two upstream outputs
- No "absent patterns" section (what's missing is as important as what's present)
- No communication pattern analysis (how containers talk is a pattern)
- Pattern assessment that's always "well-implemented" (no system gets everything right)
- Anti-patterns without severity ratings
- Missing the interaction analysis (patterns don't exist in isolation)

## Verification

Before marking this skill complete, confirm:

- [ ] Structural patterns are detected with evidence from S-04 (containers) and S-05 (components)
- [ ] Domain model patterns are detected with evidence from S-07 (data model) and S-05 (components)
- [ ] Anti-patterns are cataloged with file-level evidence and severity ratings
- [ ] Communication patterns are detected from S-04 communication topology
- [ ] Security patterns are detected from S-01/S-02 auth analysis
- [ ] Each pattern has: name, category, scope, evidence, assessment, and impact
- [ ] Absent-but-expected patterns are documented
- [ ] Pattern interactions are analyzed (complementary, conflicting, amplifying)
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/08-patterns.md`
- [ ] Output file follows the required structure from the Output Format section
