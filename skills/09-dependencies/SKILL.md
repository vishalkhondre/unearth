---
name: 09-dependencies
description: >
  Maps internal component dependencies (business-to-business,
  business-to-technical), external package dependencies with version
  and risk analysis, and shared library coupling. Identifies critical
  coupling points, EOL frameworks, version conflicts, and dead
  dependencies. Use after 08-patterns to complete the Knowledge stage
  before Assessment.
---

# Dependencies

Maps the full dependency landscape — how components depend on each other internally, what external packages they consume, and where shared libraries create coupling. Identifies version risks, EOL frameworks, dead dependencies, and critical coupling points.

Without this step, the agent understands patterns and structure but not the specific dependency chains that constrain evolution. A god class can't be decomposed if 6 other components depend on it. A framework can't be upgraded if conflicting versions exist across containers. Dependencies determine what's practically possible in modernization.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 3 — Knowledge                                     |
| **Skill**       | 09-dependencies                                    |
| **Runs after**  | `08-patterns`                                      |
| **Runs before** | `10-blueprint`                                     |
| **Required by** | `10-blueprint`, `11-tech-debt`, `12-traceability`, `13-documentation` |

## Inputs

### Required
- `outputs/05-components-*.md` — Section 3 (Business Components) and Section 4 (Technical Components) for intra-container dependencies, Section 7 (Intra-Container Dependencies) for existing dependency maps
- `outputs/03-external-systems.md` — Section 3 (Package-to-System Mapping) for external package inventory
- `outputs/04-containers.md` — Section 4 (Shared Libraries) for cross-container coupling

### Optional (improves results)
- `outputs/08-patterns.md` — Section 4 (Anti-Patterns) for coupling-related anti-patterns already identified
- `outputs/00-recon.md` — Section 6 (Build System and CI/CD) for build dependency evidence
- Stack adapter for the detected technology (provides package risk databases and EOL dates)

## When to Use

**Use when:**
- You need to understand what blocks refactoring or migration of specific components
- You're assessing modernization feasibility (can this be decomposed?)
- You need to identify EOL frameworks or security-vulnerable packages
- You're completing the Knowledge stage before Assessment

**Do not use when:**
- `05-components` has not been run (you need component inventories for internal dependency mapping)
- You only need external system inventory (S-03 covers that)

## Process

### Step 1: Load Upstream Context

Read upstream outputs. Extract:
- **From `05-components-*.md`:** Business and technical component inventories with intra-container dependency maps
- **From `03-external-systems.md`:** Package-to-system mapping table
- **From `04-containers.md`:** Shared libraries and their consumers

```
CHECKPOINT: The agent must have component inventories, package
mappings, and shared library lists loaded before mapping dependencies.
```

### Step 2: Map Business-to-Business Dependencies

Within each analyzed container, trace dependencies between business components:

| Dependency Type | How to Detect |
| --- | --- |
| **Direct call** | Component A's service calls component B's service or repository via constructor injection |
| **Shared repository** | Two components use the same repository class to access the same data |
| **Shared data store** | Two components access the same database collection/table through different repositories |
| **Event coupling** | Component A produces events that Component B consumes |
| **HTTP call** | Component A calls Component B via HTTP (common in inter-container communication) |

For each dependency, record:
- **Source** (BC-ID and name)
- **Target** (BC-ID and name)
- **Dependency type** (from the table above)
- **Coupling mechanism** (specific class, interface, or connection that creates the dependency)
- **Direction** (one-way or bidirectional)

Flag **circular dependencies** — if A depends on B and B depends on A, this is a critical coupling issue.

### Step 3: Map Business-to-Technical Dependencies

Trace which technical components (cross-cutting infrastructure) each business component depends on:

For each business component, list the technical components it uses:
- Authentication/authorization framework
- Data access infrastructure (ORM, database client, graph client)
- Validation framework
- Resilience policies (retry, circuit breaker)
- Logging/telemetry
- HTTP client infrastructure
- Error handling

This reveals which technical components have the highest fan-in (most business components depending on them) — changes to high-fan-in technical components have blast radius across the system.

### Step 4: Map External Package Dependencies

For each project/container, inventory all external packages with version and risk analysis:

**For each package, record:**
- **Package name** and version
- **Package manager** (NuGet, npm, pip, Maven, etc.)
- **Project(s)** that reference it
- **Purpose** (which external system or capability it enables)
- **Risk flags:**

| Risk Flag | Detection |
| --- | --- |
| **EOL / deprecated** | Framework or runtime past end-of-life date |
| **Major version behind** | 2+ major versions behind the current release |
| **Pre-release** | Alpha, beta, RC, or preview version in production |
| **Version conflict** | Same package with different versions across projects |
| **No maintenance** | Package with no updates in 12+ months (check last publish date if detectable) |
| **Known vulnerability** | Security advisory against this version (if detectable from package metadata) |
| **Unused** | Package referenced but no code imports found (from S-03 analysis) |

If a stack adapter is loaded, consult its "Package Risk Database" for framework-specific EOL dates and known issues.

```
CHECKPOINT: Every package referenced in every project must be
inventoried. If the recon found 3 projects with package manifests,
all 3 must be scanned. Do not sample.
```

### Step 5: Analyze Shared Library Coupling

For shared libraries identified in S-04 Section 4, analyze the coupling they create:

For each shared library:
- **What it provides** (list the specific types, interfaces, and services)
- **Which containers consume it** (from S-04)
- **Coupling severity** — how many containers would break if this library changed?
- **Interface stability** — are the shared types stable (data models) or volatile (business logic)?
- **Extraction difficulty** — if containers need to be deployed independently, how hard is it to package this library?

Shared libraries containing business logic (not just models or utilities) are the highest coupling risk — they create hidden dependencies between supposedly independent containers.

### Step 6: Identify Critical Coupling Points

Synthesize findings from Steps 2-5 to identify the most critical coupling points:

**Critical coupling criteria:**
- A component or library with **fan-in > 5** (more than 5 other components depend on it)
- A **circular dependency** between any two components
- A **shared database** accessed by 3+ containers without isolation
- A **shared library** containing business logic used by 3+ containers
- A **package version conflict** across containers in the same system
- An **EOL framework** still in production use

For each critical coupling point, assess:
- **Impact** — what breaks or degrades if this dependency changes?
- **Blast radius** — how many containers, components, or capabilities are affected?
- **Constraint** — what does this coupling prevent? (independent deployment, framework upgrade, service extraction)

### Step 7: Produce Dependency Statistics

Compile summary statistics:

| Metric | Value |
| --- | --- |
| Business-to-business dependencies | {count} |
| Business-to-technical dependencies | {count} |
| External packages (total) | {count} |
| Packages with risk flags | {count} |
| EOL frameworks | {count} |
| Version conflicts | {count} |
| Dead/unused packages | {count} |
| Shared libraries | {count} |
| Critical coupling points | {count} |
| Circular dependencies | {count} |

### Step 8: Compile Dependencies Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/09-dependencies.md`

### Required Structure

```markdown
# Dependencies — {System Name}

> **Pipeline stage:** 09-dependencies
> **Date:** {date}
> **Input:** outputs/03-external-systems.md, outputs/04-containers.md, outputs/05-components-*.md
> **Scope:** {list of repositories/projects}

---

## 1. Business-to-Business Dependencies

| # | Source (BC) | Target (BC) | Type | Coupling Mechanism | Direction |
| --- | --- | --- | --- | --- | --- |
| BB-01 | {BC-ID}: {name} | {BC-ID}: {name} | {direct call/shared repo/shared store/event/HTTP} | {class or interface} | {one-way/bidirectional} |

### Circular Dependencies

{List any circular dependencies, or state "None found"}

---

## 2. Business-to-Technical Dependencies

| Business Component | Technical Components Used |
| --- | --- |
| {BC-ID}: {name} | {TC-IDs with names} |

### Highest Fan-In Technical Components

| Technical Component | Fan-In (# business components) | Impact of Change |
| --- | ---:| --- |
| {TC-ID}: {name} | {n} | {what breaks} |

---

## 3. External Package Dependencies

### {Project/Container Name}

| Package | Version | Purpose | Risk Flags |
| --- | --- | --- | --- |
| {name} | {version} | {what it's for} | {EOL/outdated/conflict/unused/none} |

{Repeat per project}

### Version Conflicts

| Package | Project A (version) | Project B (version) | Risk |
| --- | --- | --- | --- |
| {name} | {version in A} | {version in B} | {compatibility concern} |

### EOL / Deprecated Frameworks

| Framework | Current Version | EOL Date | Containers Affected | Upgrade Path |
| --- | --- | --- | --- | --- |
| {name} | {version} | {date} | {CON-IDs} | {target version} |

### Dead / Unused Packages

| Package | Project | Evidence |
| --- | --- | --- |
| {name} | {project} | {referenced but no imports found / no config / no usage} |

---

## 4. Shared Library Coupling

| Library | Provides | Consumers | Coupling Severity | Interface Stability |
| --- | --- | --- | --- | --- |
| {name} | {types, interfaces} | {CON-IDs} | {HIGH/MEDIUM/LOW} | {stable models / volatile logic} |

---

## 5. Critical Coupling Points

| # | Coupling Point | Type | Fan-In / Blast Radius | Impact | Constraint |
| --- | --- | --- | --- | --- | --- |
| 1 | {component/library/package} | {shared repo/shared lib/version conflict/circular dep} | {n components affected} | {what breaks} | {what it prevents} |

---

## 6. Dependency Statistics

| Metric | Value |
| --- | --- |
| Business-to-business dependencies | {n} |
| Business-to-technical dependencies | {n} |
| External packages (total, deduplicated) | {n} |
| Packages with risk flags | {n} |
| EOL frameworks | {n} |
| Version conflicts | {n} |
| Dead/unused packages | {n} |
| Shared libraries | {n} |
| Critical coupling points | {n} |
| Circular dependencies | {n} |

---

## 7. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Business-to-Business):** Adapter provides DI container analysis patterns. The `.NET` adapter knows how to trace constructor injection chains through `Program.cs` / `Startup.cs` to identify which services are injected where. The `java-spring` adapter knows `@Autowired` and Spring context configuration.
- **Step 4 (External Packages):** Adapter provides EOL dates and risk information for the framework ecosystem. The `.NET` adapter knows .NET 7 is EOL, which Azure SDK versions have known issues, etc. The `node-express` adapter knows which Express versions have security advisories.
- **Step 5 (Shared Libraries):** Adapter knows common shared library patterns in the ecosystem (e.g., `.NET` shared projects vs. NuGet packages, Java Maven modules, Python namespace packages).

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Business-to-business dependency | Constructor injection chain, method call, or shared repository — with file paths for both source and target |
| Circular dependency | A depends on B (file path) AND B depends on A (file path) |
| Package version | Version string from package manifest file (`.csproj`, `package.json`, `pom.xml`) with file path |
| EOL framework | Framework name + version + official EOL date from vendor documentation |
| Version conflict | Same package name with different versions in two project manifests — both file paths |
| Dead package | Package in manifest + absence of any import/usage in source code (list files searched) |
| Shared library coupling | Library referenced by multiple containers' project files — with file paths per consumer |
| Critical coupling point | Fan-in count from dependency map + specific components/containers affected |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Internal dependencies are just implementation details" | Internal dependencies determine what can be changed independently. A business component with 6 dependents can't be refactored safely without understanding and testing all 6. Map them. |
| "Package versions are a maintenance concern, not an architecture concern" | EOL frameworks are a security risk. Version conflicts across containers prevent unified upgrades. Dead packages expand the attack surface. These are architectural constraints. |
| "The shared library is just models and utilities, it's fine" | Check what's actually in the shared library. If it contains business logic (auth handlers, database access, validation), it's creating hidden coupling between containers that should be independent. |
| "We can always upgrade frameworks later" | EOL frameworks accumulate risk every day they're in production. The longer the delay, the harder the upgrade (dependency cascades, breaking changes, deprecated APIs). Document the risk now. |
| "Circular dependencies will be fixed eventually" | Circular dependencies are the hardest coupling to break because both sides must change simultaneously. They prevent independent testing, deployment, and evolution. Flag them as critical. |

## Red Flags

- Only mapping external packages without internal component dependencies
- No version risk analysis on packages (just listing names and versions without assessment)
- Shared libraries listed but their contents and coupling severity not analyzed
- No critical coupling points identified (every multi-container system has at least one)
- Circular dependencies not checked for
- EOL frameworks not flagged (especially common in enterprise systems)
- Dead packages not investigated
- Dependency statistics that don't reconcile with the detailed tables

## Verification

Before marking this skill complete, confirm:

- [ ] Business-to-business dependencies are mapped for all analyzed containers
- [ ] Business-to-technical dependencies are mapped with fan-in analysis
- [ ] External packages are inventoried for every project with version and risk flags
- [ ] Version conflicts across projects are identified
- [ ] EOL or deprecated frameworks are flagged with dates and affected containers
- [ ] Dead or unused packages are identified with evidence
- [ ] Shared libraries are analyzed for coupling severity and interface stability
- [ ] Critical coupling points are identified with impact and constraint assessment
- [ ] Circular dependencies are checked for and documented (present or absent)
- [ ] Dependency statistics are compiled and reconcilable with detailed sections
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/09-dependencies.md`
- [ ] Output file follows the required structure from the Output Format section
