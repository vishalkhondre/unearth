---
name: 04-containers
description: >
  Identifies all independently deployable units within the system
  boundary (C4 containers). For each container: technology stack,
  primary responsibility, deployment target, and entry point count.
  Maps inter-container communication with protocols and patterns.
  Classifies infrastructure as internal or external. Detects
  architecture patterns (BFF, API gateway, shared database, event-driven).
  Use after 03-external-systems when you need to produce the C4
  Container diagram.
---

# Containers

Identifies every independently deployable runtime unit within the system boundary — the C4 "container" level. Maps how containers communicate with each other and with external systems. Detects architecture patterns that emerge from the container topology.

Without this step, the agent cannot distinguish deployable units from code modules, will miss inter-service communication patterns, and will lack the structural foundation needed for component-level analysis in `05-components`.

## Pipeline Position

| Attribute       | Value                                                  |
| --------------- | ------------------------------------------------------ |
| **Stage**       | 2 — Structure                                          |
| **Skill**       | 04-containers                                          |
| **Runs after**  | `03-external-systems`                                  |
| **Runs before** | `05-components`                                        |
| **Required by** | `05-components`, `06-capabilities`, `09-dependencies`, `12-traceability`, `13-documentation` |

## Inputs

### Required
- `outputs/00-recon.md` — Section 4 (Project Organization) for the project list with technologies and roles
- `outputs/01-entry-points.md` — Section 2 (Summary) for entry point counts per project, and all detailed sections for trigger types
- `outputs/02-actors-and-boundaries.md` — Section 4 (System Boundary) for the inside/outside classification
- `outputs/03-external-systems.md` — Section 2 (External Systems Inventory) for infrastructure dependencies and Section 6 (Summary) for classification

### Optional (improves results)
- Stack adapter for the detected technology (provides deployment pattern heuristics)
- CI/CD pipeline configuration (from `00-recon` Section 6) for deployment target evidence

## When to Use

**Use when:**
- You need to produce a C4 Container diagram
- You need to understand the deployment architecture (what runs where)
- You need to map how services communicate before doing component analysis
- You're preparing for `05-components` and need to know which containers to deep-dive into

**Do not use when:**
- `03-external-systems` has not been run (you need the external system inventory)
- The system is a single deployable unit with no inter-service communication (skip to `05-components`)

## Process

### Step 1: Load Upstream Context

Read all four upstream outputs. Extract:
- **From `00-recon.md`:** Project list, technology stack, CI/CD pipeline details
- **From `01-entry-points.md`:** Entry point counts and types per project
- **From `02-actors-and-boundaries.md`:** System boundary (which projects are inside)
- **From `03-external-systems.md`:** External systems inventory with classifications

```
CHECKPOINT: The agent must have the project list, boundary definition,
entry point counts, and external system inventory loaded before
identifying containers.
```

### Step 2: Identify Application Containers

A container (in C4 terms) is an independently deployable runtime unit — a process, application, or data store that executes code or stores data. Each container has its own process space and communicates with other containers over the network.

For each project classified as "inside the boundary," determine if it's a container:

| Signal | Container? | Reasoning |
| --- | --- | --- |
| Has its own deployment target in CI/CD | Yes | Independently deployed = container |
| Has its own entry points (HTTP, triggers, hub) | Yes | Independently addressable = container |
| Has its own `Program.cs` / `main` / startup | Yes | Independent process = container |
| Is a shared library referenced by other projects | No | Shared code, not a runtime unit |
| Is a test project | No | Not deployed to production |
| Is a build tool or dev utility | No | Not a production container |

For multi-project repositories where one repo produces multiple deployable units (e.g., a .NET solution with 5 Function Apps), each deployable unit is a separate container even though they share a repo.

For each container, record:
- **Container ID** — sequential (CON-001, CON-002, etc.)
- **Name** — descriptive name
- **Source project** — which repo/directory it comes from
- **Technology** — framework, language, version
- **Runtime** — what runs it (e.g., .NET 7.0, Node 18, JVM 17)
- **Container type** — Web app, API, Function app, Worker, SPA, Hub
- **Entry point count** — from `01-entry-points` (HTTP + non-HTTP)
- **Primary responsibility** — one-sentence description of what it does
- **Deploy target** — from CI/CD config (e.g., Azure App Service, AWS Lambda, Kubernetes pod)

```
CHECKPOINT: Every project inside the boundary must be classified as
either a container (with CON-ID) or a non-container (library, test,
tool) with justification. The total containers + non-containers must
equal the total inside-boundary projects from S-02.
```

### Step 3: Map Shared Libraries and Cross-Cutting Code

Identify code that is shared across multiple containers but is not independently deployed:

- Shared libraries (e.g., `Services.Common`, `shared/`, `lib/`)
- Shared model/DTO packages
- Shared configuration or middleware

For each shared library, record:
- **Name** and directory
- **Which containers reference it**
- **What it provides** (auth, data access, models, utilities)

Shared libraries are architecturally significant because they create coupling between containers. A change to the shared library can affect all consuming containers.

### Step 4: Map Container-to-Container Communication

For each pair of containers that communicate, determine:

| Attribute | What to Record |
| --- | --- |
| **Source container** | Which container initiates the call |
| **Target container** | Which container receives the call |
| **Protocol** | HTTPS/REST, gRPC, WebSocket, message queue, event stream, shared DB |
| **Direction** | Sync request/response, async fire-and-forget, bidirectional, indirect (via shared store) |
| **Detection method** | The code evidence (HTTP client config, message producer, connection string) |
| **Intermediary** | API gateway, load balancer, service mesh (if applicable) |

**How to find communication:**
- HTTP client configurations pointing to other containers' URLs
- Message producers/consumers on shared queues or topics
- Event Hub / Kafka producers in one container and consumers in another
- Shared database access (multiple containers reading/writing the same store)
- SignalR/WebSocket connections between containers
- Function-to-function calls via function keys or managed identity

Number each communication link (CC-01, CC-02, etc.).

```
CHECKPOINT: Every container must have at least one communication link
(inbound or outbound). A container with zero connections is either
isolated (flag as suspicious) or missing connections (investigate).
```

### Step 5: Map Container-to-External-System Communication

For each container, map which external systems (from `03-external-systems.md`) it communicates with:

| Attribute | What to Record |
| --- | --- |
| **Container** | CON-ID |
| **External system** | ES-ID and name from S-03 |
| **Protocol** | Wire protocol (Gremlin WebSocket, MongoDB wire, HTTPS, AMQP, etc.) |
| **Direction** | READ, WRITE, READ+WRITE |
| **Resilience** | Retry policies, circuit breakers, timeout config (if detectable) |

Cross-reference with the external system inventory from S-03. Every external system should be used by at least one container. If an external system from S-03 has no container connection, investigate — it may be unused or connected indirectly.

### Step 6: Detect Architecture Patterns

Review the container topology and communication map for common patterns:

| Pattern | Detection Signals |
| --- | --- |
| **Backend-for-Frontend (BFF)** | A container that aggregates calls to multiple backend services on behalf of a frontend |
| **API Gateway** | A container or external service that routes, authenticates, and rate-limits requests to backend containers |
| **Shared Database** | Multiple containers accessing the same database instance or schema |
| **Event-Driven / CQRS** | Containers communicating via events or messages with separate read/write paths |
| **Synchronous Chain** | Request flows passing through 3+ containers in sequence |
| **Microservices** | Each container owns its own data store and communicates only via API/events |
| **Monolith** | Single container handling all business domains |
| **Strangler Fig** | New containers wrapping or replacing parts of a legacy container |

For each pattern detected, record:
- **Pattern name**
- **Which containers participate**
- **Evidence** (communication links, shared stores, routing config)
- **Assessment** (well-implemented, partial, or problematic)

### Step 7: Identify Key Findings

Review the container architecture for common risks:

- **Synchronous chains** longer than 3 hops (cascading failure risk)
- **Shared databases** without logical or physical isolation
- **Missing resilience** (no retry/circuit-breaker on critical paths)
- **Single points of failure** (one container that everything depends on)
- **Mixed framework versions** across containers
- **Containers bypassing established patterns** (e.g., frontend calling backend directly, skipping the BFF)
- **Missing health endpoints** on containers that should have them

### Step 8: Compile Containers Output

Assemble all findings into the output file following the Output Format below.

## Output Format

This skill produces a single Markdown file: `outputs/04-containers.md`

### Required Structure

```markdown
# Containers — {System Name}

> **Pipeline stage:** 04-containers
> **Date:** {date}
> **Input:** outputs/00-recon.md, outputs/01-entry-points.md, outputs/02-actors-and-boundaries.md, outputs/03-external-systems.md
> **Scope:** {list of repositories/projects}

---

## 1. Analysis Scope

| Attribute | Value |
| --- | --- |
| **Upstream inputs used** | outputs/00-recon.md, outputs/01-entry-points.md, outputs/02-actors-and-boundaries.md, outputs/03-external-systems.md |
| **Projects inside boundary** | {count, from S-02} |
| **Container identification method** | {CI/CD deployment targets + entry points + process startup} |
| **Stack adapter used** | {name or None} |

---

## 2. Container Inventory

| ID | Name | Source Project | Technology | Type | Entry Points | Primary Responsibility | Deploy Target |
| --- | --- | --- | --- | --- | ---:| --- | --- |
| CON-001 | {name} | {project} | {tech + version} | {Web app / API / Function / Worker / SPA / Hub} | {count} | {one sentence} | {target} |

---

## 3. Non-Container Projects

| Project | Classification | Justification |
| --- | --- | --- |
| {name} | {shared library / test / tooling} | {why it's not a container} |

---

## 4. Shared Libraries

| Library | Directory | Referenced By | Provides |
| --- | --- | --- | --- |
| {name} | {path} | {CON-IDs} | {what it provides} |

---

## 5. Container-to-Container Communication

| # | Source | → Target | Protocol | Direction | Detection Method | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| CC-01 | {CON-ID (name)} | {CON-ID (name)} | {protocol} | {sync/async/bidirectional} | {code evidence} | {notes} |

---

## 6. Container-to-External-System Communication

| # | Container | → External System | Protocol | Direction | Resilience |
| --- | --- | --- | --- | --- | --- |
| CE-01 | {CON-ID} | {ES-ID}: {name} | {protocol} | {READ/WRITE/READ+WRITE} | {retry/circuit-breaker or none} |

---

## 7. Architecture Patterns

| Pattern | Containers Involved | Evidence | Assessment |
| --- | --- | --- | --- |
| {pattern name} | {CON-IDs} | {communication links, shared stores} | {well-implemented / partial / problematic} |

---

## 8. Key Request Flows

Describe the 3-5 most important end-to-end request flows through
the container topology:

### Flow 1: {Name}
{description with container chain: CON-001 → CON-002 → ... → response}

---

## 9. Communication Topology Diagram

```
{ASCII diagram showing containers and their connections}
```

---

## 10. Key Findings

| # | Risk | Containers Affected | Evidence | Severity |
| --- | --- | --- | --- | --- |
| 1 | {description} | {CON-IDs} | {link IDs or observations} | {HIGH / MEDIUM / LOW} |

---

## 11. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Identify Containers):** Adapter provides deployment pattern heuristics. The `.NET` adapter knows that each `.csproj` with `<AzureFunctionsVersion>` is a separate Function App container, that `<OutputType>Exe</OutputType>` indicates a standalone process, and that `.sln` files enumerate all projects. The `java-spring` adapter knows that each Spring Boot module with `@SpringBootApplication` is a container.
- **Step 4 (Communication):** Adapter provides HTTP client patterns. The `.NET` adapter knows `IHttpClientFactory` named registrations and `ServiceClients:*` configuration. The `java-spring` adapter knows `@FeignClient` and `RestTemplate` bean definitions.
- **Step 6 (Architecture Patterns):** Adapter provides framework-specific pattern detection. The `.NET` adapter can distinguish Azure Functions (serverless) from ASP.NET Core (long-running) containers and detect BFF patterns from controller-to-service-client chains.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Project is a container | Deployment config (CI/CD pipeline target) + own entry points + own process startup |
| Project is NOT a container | No deployment target + referenced as library by other projects + no entry points |
| Communication link exists | HTTP client config, message producer/consumer code, shared connection string — with file paths |
| Protocol determination | Wire protocol from SDK/client library type (e.g., Gremlin.Net = Gremlin WebSocket) |
| Architecture pattern | Minimum 2 communication links or 2 containers demonstrating the pattern |
| Resilience present | Polly policy, retry config, circuit breaker — with file path and policy details |
| Resilience absent | Searched for retry/circuit-breaker patterns in the relevant code paths and found none |
| Risk identified | Specific communication links or topology characteristics that create the risk |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Each repo is one container" | Multi-project repos often contain multiple independently deployed containers. A .NET solution with 5 Function Apps is 5 containers, not 1. Check CI/CD pipelines for actual deployment targets. |
| "Shared libraries are containers too" | Shared libraries are compiled into other containers — they don't run independently. They're architecturally important (coupling!) but not C4 containers. |
| "I can see the architecture from the project structure" | Project structure shows code organization, not deployment architecture. Two projects in the same repo might deploy to the same server or to different continents. Check CI/CD config for actual deployment targets. |
| "Communication is just HTTP calls, I don't need to map them all" | Async communication (events, messages, change feeds) is often more architecturally significant than HTTP calls. A shared database is implicit communication. Map everything — sync, async, and indirect. |
| "Resilience patterns are implementation details" | Missing retry policies and circuit breakers on inter-container communication are architecture risks that affect reliability. Record presence or absence for every container-to-container and container-to-external link. |

## Red Flags

- Treating shared libraries as containers
- Missing inter-container communication links (every container must talk to something)
- Not detecting shared database patterns when multiple containers access the same store
- Architecture patterns section is empty (every multi-container system has patterns)
- No risks identified (every distributed system has at least one architectural concern)
- Communication map that only shows HTTP and ignores async/event-driven links
- Container inventory that doesn't reconcile with the project list from S-00/S-02
- Missing the ASCII topology diagram (visual communication is critical at this level)

## Verification

Before marking this skill complete, confirm:

- [ ] Every inside-boundary project from S-02 is classified as container or non-container
- [ ] Every container has: ID, name, technology, type, entry point count, responsibility, and deploy target
- [ ] Shared libraries are identified with their consumers listed
- [ ] Every container-to-container communication link is mapped with protocol, direction, and evidence
- [ ] Every container-to-external-system link is mapped with protocol, direction, and resilience status
- [ ] Architecture patterns are detected and assessed
- [ ] Key request flows (3-5) are documented end-to-end
- [ ] ASCII topology diagram is included
- [ ] Key findings are identified with severity ratings
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/04-containers.md`
- [ ] Output file follows the required structure from the Output Format section
