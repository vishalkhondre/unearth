# C4 Model Cheat Sheet

Quick reference for the C4 model as used in Unearth discovery skills. For the full C4 specification, see [c4model.com](https://c4model.com).

## The Four Levels

| Level | What It Shows | Unearth Skill | Key Question |
| --- | --- | --- | --- |
| **1. Context** | The system as a black box, its actors, and external systems | S-02, S-03 | "What is this system and who/what interacts with it?" |
| **2. Container** | Independently deployable units within the system | S-04 | "What gets deployed and how do the parts communicate?" |
| **3. Component** | Internal structure of a single container | S-05 | "What's inside this container and how is it organized?" |
| **4. Code** | Classes, interfaces, and relationships | (Not covered) | Unearth stops at Level 3 — code-level diagrams are too volatile |

## Level 1: System Context

**Elements:**
- **Person** — a human actor (user role, not individual)
- **Software System** — the system under analysis (one box)
- **External System** — systems outside the boundary that the system interacts with

**Relationships:** Labeled arrows showing what flows between elements (protocol and purpose).

**Common mistakes:**
- Including internal containers in the context diagram (keep it as one box)
- Missing actors (check S-02 for all auth patterns)
- Showing infrastructure (load balancers, DNS) at this level — those are invisible at context level

## Level 2: Container Diagram

**Elements:**
- **Container** — an independently deployable runtime unit (web app, API, database, message broker, SPA)
- **External System** — same as Level 1
- **Person** — same as Level 1

**What counts as a container:**
- Has its own process space (runs independently)
- Communicates with other containers over the network
- Has its own deployment lifecycle (can be updated independently)

**What is NOT a container:**
- Shared libraries (compiled into other containers)
- Test projects (not deployed)
- Build tools (not runtime)

**Common mistakes:**
- Treating shared libraries as containers
- Missing async communication (events, messages) — only showing HTTP
- Not showing the API gateway or BFF as a distinct container when it exists
- Forgetting data stores (databases, caches, blob storage are containers too)

## Level 3: Component Diagram

**Elements:**
- **Component** — a grouping of related functionality within a container (business component or technical component)
- **External System** — systems this container directly communicates with

**How to identify components:**
- Group by business function, not technology layer
- Each component should have a clear responsibility (one sentence)
- Components span layers (entry point + service + repository for one domain = one component)

**Common mistakes:**
- Creating components per technology layer (a "Services component" and a "Repositories component") instead of per business function
- Too many components (30+ in one container means the granularity is too fine)
- Too few components (2-3 in a container with 200 files means they're too coarse)

## Notation Quick Reference

| Element | PlantUML Macro | When to Use |
| --- | --- | --- |
| Person | `Person(id, name, desc)` | Human actors |
| System | `System(id, name, desc)` | The system under analysis |
| External system | `System_Ext(id, name, desc)` | Systems outside the boundary |
| Container | `Container(id, name, tech, desc)` | Deployable units |
| Database | `ContainerDb(id, name, tech, desc)` | Data stores |
| External database | `ContainerDb_Ext(id, name, tech, desc)` | External data stores |
| Component | `Component(id, name, tech, desc)` | Internal modules |
| Boundary | `System_Boundary(id, name)` | Groups related elements |
| Relationship | `Rel(from, to, desc, protocol)` | Communication link |

## Evidence Requirements per Level

| Level | Claim | Required Evidence |
| --- | --- | --- |
| Context | Actor exists | Auth pattern from S-01/S-02 with file path |
| Context | External system exists | Package + config + code usage from S-03 |
| Container | Project is a container | Deployment target (CI/CD) + own entry points + own process startup |
| Container | Communication link | HTTP client config or message producer/consumer with file path |
| Component | Component identified | Entry points + service/repository chain with file paths |
| Component | Component responsibility | Business rules or domain logic in the component's files |
