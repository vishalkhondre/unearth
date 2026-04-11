---
name: 02-actors-and-boundaries
description: >
  Identifies all human and system actors that interact with the system by
  analyzing authentication patterns on entry points. Draws the system
  boundary line -- what is inside vs. outside. Maps actor-to-entry-point
  relationships with protocol and direction. Produces the actor inventory
  and boundary definition needed for the C4 Context diagram. Use after
  01-entry-points when you need to know who uses the system and where
  the system ends.
---

# Actors and Boundaries

Identifies every human and system actor that interacts with the codebase, then draws the line between what's inside the system and what's outside. This produces the actor inventory, the system boundary definition, and the actor-to-system relationship map — the three inputs required for a C4 Context diagram.

Without this step, the agent cannot distinguish internal components from external dependencies, and will conflate users, partners, internal services, and monitoring probes into a single undifferentiated "caller."

## Pipeline Position

| Attribute       | Value                                             |
| --------------- | ------------------------------------------------- |
| **Stage**       | 1 — Reconnaissance                                |
| **Skill**       | 02-actors-and-boundaries                          |
| **Runs after**  | `01-entry-points`                                 |
| **Runs before** | `03-external-systems`                             |
| **Required by** | `03-external-systems`, `04-containers`, `05-components`, `06-capabilities`, `13-documentation` |

## Inputs

### Required
- `outputs/01-entry-points.md` — specifically Section 8 (Auth Pattern Summary) and all endpoint tables with auth classifications
- `outputs/00-recon.md` — specifically Section 4 (Project Organization) for identifying which projects are "inside" the system

### Optional (improves results)
- Stack adapter for the detected technology (provides auth framework patterns)
- Configuration files (auth settings, identity provider config, API gateway config)
- README or architecture docs (treated as claims to verify)

## When to Use

**Use when:**
- Completing the reconnaissance stage after `01-entry-points`
- You need to produce a C4 Context diagram
- You need to understand who the system's users are (human and system)
- You need to determine what's inside vs. outside the system boundary

**Do not use when:**
- `01-entry-points` has not been run (you need the auth pattern data)
- You already have a verified actor inventory and the system hasn't changed

## Process

### Step 1: Load Upstream Context

Read `outputs/01-entry-points.md` and `outputs/00-recon.md`. Extract:
- The auth pattern summary (Section 8 of entry points output)
- All entry point tables with their auth classifications
- The project list with technologies and roles

This data is the raw material for actor identification.

```
CHECKPOINT: The agent must have both upstream outputs loaded before
proceeding. If the auth pattern summary is missing or incomplete,
go back and complete 01-entry-points first.
```

### Step 2: Identify Human Actors from Auth Patterns

Scan all entry points for auth patterns that indicate human users. Group them by distinct role or persona:

| Auth Signal | Actor Inference |
| --- | --- |
| JWT with role-based checks (RBAC) | Named user role — look at role/permission names to distinguish personas |
| JWT with basic `[Authorize]` but no role check | Authenticated user — may be a single user type |
| Session/cookie auth | Web application user |
| OAuth with user consent flow | End-user via third-party integration |
| Frontend route guards with role checks | UI-specific user persona (e.g., admin vs. customer portal) |

For each human actor discovered:
- **Name** — a descriptive role name (e.g., "Customer User," "Admin User," "Read-Only Viewer")
- **Description** — who they are and what they do
- **Auth pattern** — exact auth mechanism with code evidence
- **Entry points** — which endpoints they access (summary, not exhaustive list)
- **Evidence** — specific file paths, attribute names, role constants, guard configurations
- **Confidence** — HIGH (explicit auth), MEDIUM (inferred from patterns), LOW (assumed)

Distinguish actors by their access scope, not just their existence. Two user types that hit the same endpoints with the same permissions are one actor. Two user types with different permissions or different entry points are separate actors.

```
CHECKPOINT: Every human actor must have an explicit auth pattern
citation. "There are probably admin users" is not acceptable —
show the role check or route guard that proves it.
```

### Step 3: Identify System Actors from Auth Patterns

Scan for auth patterns that indicate machine-to-machine or system callers:

| Auth Signal | Actor Inference |
| --- | --- |
| API key / function key (no JWT) | Internal system caller — machine-to-machine |
| Client credentials OAuth flow (`client_id` / `client_secret`) | External system or partner integration |
| Shared secret / proof key header | Internal service-to-service communication |
| Subscription key (e.g., APIM) | External consumer via API gateway |
| Managed identity / service principal | Internal cloud service auth |
| No auth (anonymous) on non-health endpoints | Public access — flag for security review |
| No auth on health endpoints only | Monitoring / load balancer probe |

For each system actor, record the same attributes as human actors: name, description, auth pattern, entry points, evidence, and confidence.

Pay special attention to:
- **Internal system actors** (services calling each other within the platform) — these help define the system boundary
- **External partner actors** (third-party systems consuming your API) — these sit outside the boundary
- **Event/message producers** — systems pushing events into your queues or topics (identified from non-HTTP trigger sources in `01-entry-points`)

### Step 4: Identify Implicit Actors

Some actors aren't visible from auth patterns alone. Look for:

| Implicit Actor Type | How to Detect |
| --- | --- |
| **Event producers** | Non-HTTP triggers (EventHub, Kafka, SQS) where the source is an external system |
| **Scheduled triggers** | Timer/cron entry points imply a scheduling system (even if it's the platform itself) |
| **Blob/file uploaders** | Blob triggers imply something is writing files — who or what? |
| **Database change sources** | Change feed / CDC triggers imply something is writing data — is it always internal? |
| **Email/notification recipients** | If the system sends email or push notifications, the recipients are implicit downstream actors |

Record implicit actors with MEDIUM or LOW confidence and flag them as [NEEDS VERIFICATION].

### Step 5: Draw the System Boundary

The system boundary defines what is "inside" (the system under analysis) vs. "outside" (external systems and actors). Use these rules:

**Inside the boundary** if ALL of these are true:
1. Source code is in scope (one of the repositories being analysed)
2. The team has ownership or can modify it
3. It deploys as part of this system's deployment pipeline

**Outside the boundary** if ANY of these is true:
1. Source code is NOT in the repositories being analysed
2. It's a managed service (database, message broker, identity provider, cloud service)
3. It's owned by a different team or organization
4. It's a third-party SaaS product

**Boundary ambiguity** — flag these situations:
- Services called via HTTP whose source code is not in scope but may be owned by the same team
- Shared databases accessed by both in-scope and out-of-scope services
- Infrastructure services (API gateways, service meshes) that route traffic but don't contain business logic

Record the boundary decision for every component with a brief justification.

```
CHECKPOINT: Every project from 00-recon must be classified as inside
or outside the boundary. Every external service mentioned in entry
point configurations must be classified. Ambiguous cases must be
flagged as [NEEDS VERIFICATION] with the specific question to resolve.
```

### Step 6: Map Actor-to-System Relationships

For each actor (human and system), map their relationship to the system:

| Attribute | What to Record |
| --- | --- |
| **Actor** | The actor name from Steps 2-4 |
| **Entry point** | Which part of the system they interact with (project, controller, endpoint group) |
| **Protocol** | HTTPS, WebSocket, gRPC, event stream, file drop, etc. |
| **Direction** | Inbound, Outbound, or Bidirectional |
| **Description** | What the actor does through this relationship |

Multiple relationships per actor are expected. A user might interact via the web UI (HTTPS) AND receive real-time notifications (WebSocket) — that's two relationships.

### Step 7: Identify Open Questions

Review all findings and identify questions that cannot be answered from the code alone:

- **Boundary questions:** "Is service X inside or outside the boundary? Its source code isn't in scope but it may be team-owned."
- **Actor questions:** "Are Admin User and Super Admin distinct actors or the same role with different permission levels?"
- **Ownership questions:** "Who owns this external API that our system calls?"
- **Missing actor questions:** "Is there an operations team that accesses the system differently from regular users?"

These questions become the open items that an architect or product owner must resolve before the C4 Context diagram can be locked.

### Step 8: Compile Actors and Boundaries Output

Assemble all findings into the output file following the Output Format below.

## Output Format

This skill produces a single Markdown file: `outputs/02-actors-and-boundaries.md`

### Required Structure

```markdown
# Actors and Boundaries — {System Name}

> **Pipeline stage:** 02-actors-and-boundaries
> **Date:** {date}
> **Input:** outputs/00-recon.md, outputs/01-entry-points.md
> **Scope:** {list of repositories/projects}

---

## 1. Actor Classification Method

Brief description of the auth-pattern-to-actor rubric used, with a
summary table:

| Auth Pattern Observed | Actor Type | Confidence Basis |
| --- | --- | --- |
| {pattern} | {actor type} | {why this is HIGH/MEDIUM/LOW confidence} |

---

## 2. Human Actors

### {Actor ID}: {Actor Name}

| Attribute | Value |
| --- | --- |
| **Description** | {who they are} |
| **Auth pattern** | {exact auth mechanism with code reference} |
| **Entry points** | {which endpoints/routes they use} |
| **Evidence** | {file paths, attribute names, role constants} |
| **Confidence** | {HIGH / MEDIUM / LOW} |

{Repeat for each human actor}

---

## 3. System Actors

### {Actor ID}: {Actor Name}

| Attribute | Value |
| --- | --- |
| **Description** | {what it is} |
| **Auth pattern** | {auth mechanism} |
| **Entry points** | {which endpoints/triggers it uses} |
| **Evidence** | {file paths, config keys} |
| **Confidence** | {HIGH / MEDIUM / LOW} |

{Repeat for each system actor}

---

## 4. System Boundary

### Inside the Boundary

| Component | Justification |
| --- | --- |
| {project/service name} | {why it's inside — source in scope, team-owned, etc.} |

### Outside the Boundary

| External System / Actor | Justification |
| --- | --- |
| {name} | {why it's outside — managed service, third-party, source not in scope} |

### Boundary Ambiguities

| # | Item | Question | Impact |
| --- | --- | --- | --- |
| 1 | {component} | {the specific boundary question} | {what changes if the answer differs} |

---

## 5. Actor-to-System Relationships

| # | Actor | Entry Point | Protocol | Direction | Description |
| --- | --- | --- | --- | --- | --- |
| R1 | {actor} | {component/endpoint} | {protocol} | {direction} | {what they do} |

---

## 6. Summary

| Category | Count |
| --- | --- |
| Human actors | {n} |
| System actors | {n} |
| Total actors | {n} |
| Components inside boundary | {n} |
| External systems outside boundary | {n} |
| Boundary ambiguities | {n} |
| Actor-to-system relationships | {n} |

---

## 7. Open Questions

| # | Question | Context | Impact |
| --- | --- | --- | --- |
| 1 | {question} | {why it arose} | {what it affects downstream} |

---

## 8. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Human Actor Identification):** Adapter provides framework-specific auth patterns. For example, the `.NET` adapter knows that `[Authorize(Policy="...")]` maps to specific policy configurations in `Program.cs`, and that Angular route guards like `appRouteGuard` with `RouteSet.Admin` vs. `RouteSet.Customer` distinguish user types. The `Spring` adapter knows `@PreAuthorize` and Spring Security role hierarchies.
- **Step 5 (System Boundary):** Adapter provides cloud-specific boundary heuristics. For example, the `.NET` adapter knows that Azure Functions, Azure App Service, and Azure Cosmos DB are distinct deployment targets with different boundary implications.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Human actor exists | Auth attribute/decorator + role/permission constant + file path |
| System actor exists | Auth mechanism (API key, shared secret, managed identity) + entry point file path |
| Actor has specific role | Role constant or permission string + file where it's checked |
| Boundary decision (inside) | Source code present in scoped repos + deployment config evidence |
| Boundary decision (outside) | Source code NOT in scoped repos, or managed service (NuGet/npm package, connection string) |
| Boundary ambiguity | Evidence for both classifications + the specific question that resolves it |
| Actor relationship | Actor auth pattern matched to specific entry point with protocol |
| Implicit actor | Trigger source (event hub name, blob container, change feed) + absence of internal producer |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "There's just one type of user" | Almost every system has at least two — a regular user and an admin. Look at route guards, role constants, and permission checks. Different permission sets mean different actors even if the auth mechanism is the same. |
| "System-to-system calls are internal details, not actors" | Internal system callers (BFF-to-API, function-to-function) define the internal communication architecture. External system callers (partners, monitoring) define the boundary. Both must be identified. |
| "The system boundary is obvious — it's just these repos" | Boundary decisions require justification. Managed databases are outside. API gateways might be inside or outside. Adjacent microservices with source code not in scope are ambiguous. Make every decision explicit. |
| "I'll figure out actors when I get to capabilities" | Capabilities tell you what the system does. Actors tell you for whom. You need actors first to scope capabilities correctly — a partner API serves different needs than the admin portal even if they access the same data. |
| "Anonymous endpoints don't have actors" | Anonymous endpoints always have actors — health probes have monitoring systems, public pages have anonymous users, open APIs have unknown consumers. "Anonymous" describes the auth, not the absence of an actor. |

## Red Flags

- Listing only human actors and ignoring system actors (BFF, event producers, monitoring probes)
- Actors without auth evidence (asserting "admin users exist" without showing the role check)
- System boundary drawn without justification for each component
- No boundary ambiguities flagged (every real system has at least one uncertain boundary)
- Relationships missing protocol or direction
- Conflating distinct actors because they use the same auth mechanism (e.g., admin and customer both use JWT, but with different roles)
- Missing implicit actors (event producers, notification recipients)
- Actor inventory that doesn't account for every auth pattern found in `01-entry-points`

## Verification

Before marking this skill complete, confirm:

- [ ] Every auth pattern from `outputs/01-entry-points.md` Section 8 is mapped to an actor
- [ ] Every human actor has: name, description, auth pattern with evidence, entry points, and confidence level
- [ ] Every system actor has the same attributes
- [ ] Implicit actors are identified and flagged with appropriate confidence level
- [ ] Every project from `outputs/00-recon.md` is classified as inside or outside the boundary with justification
- [ ] Every external service referenced in entry point configurations is classified
- [ ] Boundary ambiguities are flagged with specific resolution questions
- [ ] Actor-to-system relationships include protocol and direction for every actor
- [ ] Summary counts are reconcilable with the detailed sections
- [ ] Open questions section identifies at least one boundary or actor question
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/02-actors-and-boundaries.md`
- [ ] Output file follows the required structure from the Output Format section
