---
name: 05-components
description: >
  Deep-dives into a single container's internals to identify business
  components, technical components, internal layers, god classes, test
  coverage gaps, and business rules. Maps intra-container dependencies
  and component-to-external-system connections. This skill is repeatable
  -- run it once per container selected for analysis. Use after
  04-containers when you need to understand what's inside a specific
  deployable unit before extracting capabilities.
---

# Components

Deep-dives into a single container to map its internal structure at the C4 component level. Identifies business components (domain logic units), technical components (cross-cutting infrastructure), internal layers, god classes, test coverage, and business rules.

Without this step, the agent sees containers as black boxes — it can describe what they do at a high level but cannot identify internal coupling, god classes, untested code paths, or business rule locations that are critical for capability extraction and tech debt assessment.

## Pipeline Position

| Attribute       | Value                                               |
| --------------- | --------------------------------------------------- |
| **Stage**       | 2 — Structure                                       |
| **Skill**       | 05-components                                       |
| **Runs after**  | `04-containers`                                     |
| **Runs before** | `06-capabilities`, `07-data-model`, `08-patterns`   |
| **Required by** | `06-capabilities`, `07-data-model`, `08-patterns`, `09-dependencies`, `11-tech-debt`, `12-traceability`, `13-documentation` |
| **Repeatable**  | Yes — run once per container selected for analysis  |

## Inputs

### Required
- `outputs/04-containers.md` — Section 2 (Container Inventory) for selecting which container to analyze, and Section 6 (Container-to-External) for external connections
- Access to the container's source directory

### Optional (improves results)
- `outputs/00-recon.md` — Section 5 (File Inventory) for file counts
- `outputs/01-entry-points.md` — detailed entry point tables for this container
- `outputs/03-external-systems.md` — Section 2 (External Systems Inventory) for package-to-system context
- Stack adapter for the detected technology (provides layer detection and pattern heuristics)

## When to Use

**Use when:**
- You need to understand what's inside a specific container
- You're preparing for capability extraction (`06-capabilities`)
- You need to assess code quality, test coverage, or tech debt for a container
- You're evaluating migration or decomposition options for a container

**Do not use when:**
- `04-containers` has not been run (you need the container inventory first)
- The container is a simple proxy or static file server with no business logic (document this decision and skip)

**Which containers to analyze:**
Not every container needs a full component analysis. Prioritize by:
1. Containers with the most entry points (highest complexity)
2. Containers with the most external system connections (highest coupling)
3. Containers that multiple other containers depend on (highest risk)
4. Containers flagged with risks in `04-containers`

## Process

### Step 1: Select and Scope the Container

From `outputs/04-containers.md`, select the container to analyze. Record:

| Attribute | Value |
| --- | --- |
| **Container ID** | {CON-ID from S-04} |
| **Container name** | {name} |
| **Source directory** | {path} |
| **Technology** | {framework + version} |
| **Entry point count** | {from S-04} |
| **External connections** | {count from S-04 Section 6} |

If the container's source directory contains multiple sub-projects (e.g., a .NET solution with Function Apps + shared library), note which sub-projects belong to this container and which are shared libraries already documented in S-04 Section 4.

```
CHECKPOINT: The agent must know exactly which directories and files
belong to the container under analysis before scanning. Shared
libraries referenced by this container should be noted but analyzed
only for their interface, not their internals (unless they're only
used by this container).
```

### Step 2: Map Internal Layer Structure

Identify the architectural layers within the container. Scan the directory structure and file organization for layer patterns:

| Layer | Common Indicators |
| --- | --- |
| **Entry / Presentation** | Controllers, Functions, Handlers, Endpoints, Pages, Views |
| **Business / Application** | Services, Managers, Processors, Orchestrators, UseCases |
| **Domain** | Entities, ValueObjects, Aggregates, DomainEvents, Specifications |
| **Data Access** | Repositories, DAOs, DbContext, DataServices, Queries |
| **Models / DTOs** | Models, DTOs, ViewModels, Requests, Responses, Contracts |
| **Validation** | Validators, Rules, Specifications |
| **Configuration** | Config, Options, Settings, Startup, Program |
| **Infrastructure** | Clients, Adapters, Wrappers, Providers, Helpers |
| **Cross-cutting** | Middleware, Filters, Interceptors, Extensions, Policies |

For each layer found, record:
- **Layer name** and directory path
- **File count** in that layer
- **Key files** (most important or most complex)

If a stack adapter is loaded, consult its "Layer Detection" section for framework-specific patterns.

```
CHECKPOINT: Every source file in the container must be assignable to
a layer. If files don't fit any recognized layer, create an
"Unclassified" category and flag for investigation.
```

### Step 3: Identify Business Components

Business components are cohesive groups of files that serve a distinct business function within the container. They typically span multiple layers (entry point + service + repository + models for one domain concept).

**How to identify business components:**
1. Start from entry points — group endpoints by functional area (asset CRUD, image management, user roles, etc.)
2. Trace each group downward through the layers — which services, repositories, and models does it use?
3. Look for natural boundaries — files that are always used together and never used by other groups
4. Name each component by its business function, not its technology

For each business component, record:
- **Component ID** — sequential (BC-01, BC-02, etc.)
- **Name** — business function name
- **Responsibilities** — what it does (2-3 sentences)
- **Files by layer** — which files belong to this component at each layer
- **Business rules** — specific validation rules, constraints, calculations (see Step 5)
- **Technology stack** — which data stores, external systems it directly accesses
- **Known issues** — god classes, missing tests, coupling problems

### Step 4: Identify Technical Components

Technical components are cross-cutting infrastructure used by multiple business components. They're not business logic — they're the plumbing.

| Technical Component Type | Examples |
| --- | --- |
| **Authentication** | JWT validation, token handling, auth middleware |
| **Authorization** | Permission checking, role-based access control, policy evaluation |
| **Data access infrastructure** | Generic database clients, connection management, retry policies |
| **Validation infrastructure** | Validation framework setup, custom validators base classes |
| **Error handling** | Exception middleware, error response formatting |
| **Logging / telemetry** | Structured logging, Application Insights integration |
| **Configuration** | Options binding, feature flags, secret resolution |
| **HTTP client infrastructure** | Named HTTP clients, service client base, auth token forwarding |

For each technical component:
- **ID** — sequential (TC-01, TC-02, etc.)
- **Name** — what it provides
- **Files** — which files implement it
- **Used by** — which business components depend on it

### Step 5: Catalog Business Rules

For each business component, extract concrete business rules — the specific validations, constraints, calculations, and state transitions encoded in the code:

| What to Look For | Where to Find It |
| --- | --- |
| Validation rules | Validator classes, FluentValidation rules, data annotations |
| Value constraints | Range checks, regex patterns, enum restrictions, required fields |
| State transitions | Status field changes, lifecycle methods, workflow logic |
| Calculations | Formulas, aggregations, derived values |
| Authorization rules | Permission checks, role requirements, scope restrictions |
| Domain invariants | Checks that prevent invalid state (e.g., "parent asset must exist before child") |

Record each rule with: description, where it's enforced (class/method), and how (validation framework, inline check, etc.).

### Step 6: Detect God Classes and Complexity Hotspots

Scan for files that are disproportionately large or complex:

- **God classes** — files over 500 lines (record exact line count)
- **Wide classes** — files with more than 10 public methods
- **Deep nesting** — methods with more than 3 levels of nesting
- **High coupling** — classes that import/depend on more than 10 other classes in the container

For each hotspot found:
- **File path** and line count
- **Layer** it belongs to
- **Why it's a problem** (merge conflicts, hard to test, single point of failure)
- **Severity** — HIGH (>1000 lines), MEDIUM (500-1000 lines), LOW (structural concern without size)

### Step 7: Assess Test Coverage

Map the test landscape for this container:

| Metric | How to Measure |
| --- | --- |
| **Test file count** | Count files in test directories |
| **Test method count** | Count test methods (attributes: `[Test]`, `[Fact]`, `[Theory]`, `@Test`, `def test_`, `it(...)`) |
| **Test-to-source ratio** | Test methods / production source files |
| **Framework** | xUnit, NUnit, MSTest, JUnit, pytest, Jest, RSpec, etc. |
| **Coverage gaps** | Components or layers with zero or minimal tests |
| **Dead tests** | Test files that exist but have no runnable test methods |

For each business component, note whether it has tests and what's covered vs. missing.

```
CHECKPOINT: Every business component must have a test coverage
assessment. "Not checked" is not acceptable — state explicitly
whether tests exist and what's covered.
```

### Step 8: Map Intra-Container Dependencies

Map how components within the container depend on each other:

- **Business → Technical** — which business components use which technical components (e.g., BC-01 uses TC-01 JWT + TC-03 MongoDB)
- **Business → Business** — any cross-dependencies between business components within the same container (e.g., BC-03 Tags depends on BC-01 Asset repository)
- **Business → External** — which business components connect directly to external systems (from S-03/S-04)

Record each dependency with: source, target, coupling mechanism (constructor injection, direct reference, shared interface).

### Step 9: Compile Components Output

Assemble all findings into the output file.

## Output Format

This skill produces one Markdown file per container analyzed: `outputs/05-components-{container-id}.md` (e.g., `outputs/05-components-con-003.md`)

### Required Structure

```markdown
# Components — {Container Name} ({Container ID})

> **Pipeline stage:** 05-components
> **Date:** {date}
> **Input:** outputs/04-containers.md
> **Scope:** {container ID, name, source directory}

---

## 1. Container Under Analysis

| Attribute | Value |
| --- | --- |
| **Container** | {CON-ID}: {name} |
| **Technology** | {framework + version} |
| **Source directory** | {path} |
| **Source files** | {count} |
| **Test files** | {count} |
| **Entry points** | {count from S-01/S-04} |

---

## 2. Layer Structure

| Layer | Directory | Files | Key Files |
| --- | --- | ---:| --- |
| Entry / Presentation | {path} | {n} | {notable files} |
| Business / Services | {path} | {n} | {notable files} |
| Data Access | {path} | {n} | {notable files} |
| Models / DTOs | {path} | {n} | {notable files} |
| Validation | {path} | {n} | {notable files} |
| Configuration | {path} | {n} | {notable files} |

---

## 3. Business Components

### {BC-ID}: {Component Name}

**Responsibilities:** {2-3 sentences}

**Files:**

| Layer | Files |
| --- | --- |
| Entry | {file list} |
| Service | {file list} |
| Repository | {file list} |
| Models | {file list} |
| Validators | {file list} |
| Tests | {file list} |

**Business Rules:**

| Rule | Enforced In | Method |
| --- | --- | --- |
| {rule description} | {class/method} | {validation framework / inline check} |

**Technology Stack:** {data stores, external systems accessed}

**Known Issues:**

| ID | Type | Severity | Description |
| --- | --- | --- | --- |
| {id} | {GOD/TEST/COUPLING} | {HIGH/MEDIUM/LOW} | {description} |

{Repeat for each business component}

---

## 4. Technical Components

| ID | Name | Files | Used By |
| --- | --- | --- | --- |
| TC-01 | {name} | {files} | {BC-IDs} |

---

## 5. God Classes and Complexity Hotspots

| File | Lines | Layer | Component | Severity | Issue |
| --- | ---:| --- | --- | --- | --- |
| {file path} | {n} | {layer} | {BC-ID} | {HIGH/MEDIUM/LOW} | {why it's a problem} |

---

## 6. Test Coverage

### Summary

| Metric | Value |
| --- | --- |
| Test files | {n} |
| Test methods | {n} |
| Test framework | {name} |
| Test:source ratio | {ratio} |

### Per-Component Coverage

| Component | Has Tests? | Test Files | Test Methods | Gaps |
| --- | --- | ---:| ---:| --- |
| {BC-ID}: {name} | {Yes/No/Partial} | {n} | {n} | {what's not tested} |

---

## 7. Intra-Container Dependencies

### Business → Technical

| Business Component | Technical Components Used |
| --- | --- |
| {BC-ID} | {TC-IDs} |

### Business → Business (Cross-Dependencies)

| Source | → Target | Coupling Mechanism |
| --- | --- | --- |
| {BC-ID} | {BC-ID} | {how they're coupled} |

### Business → External Systems

| Component | → External System | Protocol |
| --- | --- | --- |
| {BC-ID} | {ES-ID}: {name} | {protocol} |

---

## 8. Key Findings

| Finding | Severity | Detail |
| --- | --- | --- |
| {finding} | {HIGH/MEDIUM/LOW/INFO} | {evidence and impact} |

---

## 9. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Layer Structure):** Adapter provides framework-specific layer conventions. The `.NET` adapter knows that Azure Functions use `Functions/` (not `Controllers/`), that `Services.Common` is typically a shared library, and that `Repositories/` indicates data access. The `java-spring` adapter knows `@Service`, `@Repository`, `@Controller` stereotypes.
- **Step 3 (Business Components):** Adapter knows how to trace entry-point-to-service-to-repository chains specific to the framework's DI patterns.
- **Step 6 (God Classes):** Adapter provides framework-specific line count thresholds (e.g., a 500-line controller is more concerning than a 500-line configuration file).
- **Step 7 (Test Coverage):** Adapter knows the test framework conventions for the technology (xUnit attributes, JUnit annotations, pytest naming).

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Layer exists | Directory path + file examples with layer-appropriate content |
| Business component identified | Entry point(s) + downstream service/repository chain, all with file paths |
| Business rule exists | Validator class or inline check with file path, class name, and rule description |
| God class identified | File path + exact line count + layer classification |
| Test coverage gap | Specific component or layer with zero tests + list of what's untested |
| Dead test | Test file path + evidence tests aren't runnable (missing attributes, broken fixtures) |
| Cross-component dependency | Import/reference from one component's files to another's, with file paths |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The container is too large to analyze fully, I'll just list the main modules" | Large containers are where the most important findings hide. God classes, untested code, and hidden coupling are concentrated in the largest containers. Analyze systematically, layer by layer. |
| "I don't need to count lines — I can see the classes are reasonable" | Line counts are objective evidence. A class you think is "reasonable" might be 800 lines, which is a god class by any standard. Count everything. |
| "Business rules are obvious from the code, I don't need to catalog them" | Business rules scattered across code without documentation are the #1 source of bugs during refactoring. Cataloging them now saves the next team months of discovery. |
| "Test coverage is good enough — there are test files" | Test files with zero runnable test methods are dead code, not coverage. Count actual test methods and check they execute. In practice, we've found test projects with hundreds of test fixtures but zero `[Test]` attributes. |
| "Cross-component dependencies are just normal architecture" | Some cross-dependencies are fine. Others (like BC-03 Tags directly calling BC-01 Asset's repository) create hidden coupling that prevents independent deployment. Record them all and let the assessment skills judge severity. |

## Red Flags

- Layer analysis that misses an entire directory of source files
- Business components identified by technology layer instead of business function
- No business rules cataloged (every component has at least validation rules)
- God class section is empty for a container with 100+ source files
- Test coverage assessment missing or marked as "not checked"
- Zero cross-component dependencies identified (even simple containers have technical component dependencies)
- Output that doesn't reconcile file counts with the recon (S-00) inventory
- Analyzing shared libraries as if they were standalone containers

## Verification

Before marking this skill complete (per container), confirm:

- [ ] Container is correctly scoped (right directories, right files)
- [ ] Every source file is assigned to a layer
- [ ] Business components are identified by business function, not technology
- [ ] Each business component has: responsibilities, files by layer, business rules, technology stack, and known issues
- [ ] Technical components are identified with their consumers listed
- [ ] God classes are detected with exact line counts and severity
- [ ] Test coverage is assessed per component with specific gaps identified
- [ ] Intra-container dependencies are mapped (business→technical, business→business, business→external)
- [ ] Key findings section captures the most important observations
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/05-components-{container-id}.md`
- [ ] Output file follows the required structure from the Output Format section
