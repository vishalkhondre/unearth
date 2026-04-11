# Unearth

**AI agent skills for architecture and capability discovery.**

*Turn legacy code into living knowledge.*

---

Unearth is a structured set of AI agent skills that guide systematic codebase discovery — extracting architecture, capabilities, data models, and domain knowledge from any codebase, in any language, at any scale.

These aren't generic "explain this repo" prompts. Each skill encodes a specific phase of architectural discovery with defined inputs, outputs, verification gates, and the kind of structured reasoning that separates a senior architect's analysis from a surface-level code skim.

**What Unearth is not:** It's not a static analysis tool, a migration tool, a code quality scanner, or a SaaS product. Unearth produces *knowledge* — architecture documentation, capability maps, data models, gap analysis — grounded in evidence from the code.

## Why Unearth?

Legacy codebases are knowledge vaults locked by time. The people who built them have moved on. The documentation, if it ever existed, is stale. The code is the only source of truth — but understanding code at scale requires a mental model that takes months to build manually.

**Unearth changes the timeline from months to hours.**


| Problem                         | Without Unearth                                      | With Unearth                                          |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| **"What does this system do?"** | Weeks of reading code, Slack-stalking former devs    | Structured capability map in hours                    |
| **"How is it architected?"**    | Tribal knowledge, outdated wiki pages                | C4 diagrams generated from actual code evidence       |
| **"What's the data model?"**    | Reverse-engineering from ORM configs and SQL scripts | Complete entity inventory with storage classification |
| **"Where are the risks?"**      | Discovered in production, painfully                  | Tech debt register with file-level traceability       |
| **"Are we missing anything?"**  | Unknown unknowns                                     | Industry blueprint comparison with gap analysis       |


## Who Is This For?

- **Enterprise architects** planning modernization roadmaps who need to understand the current state before designing the future state.
- **Engineering teams** inheriting unfamiliar codebases — new hires, acquisitions, or the team that just got handed "the old system."
- **Consulting firms** doing legacy assessments, M&A technical due diligence, or modernization advisory.
- **Platform teams** documenting systems that were never documented, or whose documentation drifted years ago.

## Quick Start

### Claude Code (Recommended)

```bash
# Clone and reference in your project
git clone https://github.com/user/unearth.git

# Add to your project's CLAUDE.md:
# Import skills from /path/to/unearth/skills/
```

Once configured, skills are available via slash commands:

```bash
/recon         → Scan repo structure, tech stack, file inventory
/entry-points  → Find all APIs, triggers, UIs, jobs, event handlers
/actors        → Identify who and what interacts with the system
/containers    → Map deployable units (C4 container level)
/components    → Deep-dive into a container's internals
/capabilities  → Extract business capabilities from the code
/data-model    → Discover entities, storage, and relationships
/blueprint     → Compare against industry reference architectures
/discover      → Run the full pipeline end-to-end
```

### Cursor

Copy any `SKILL.md` into your `.cursor/rules/` directory. See [docs/guides/cursor-setup.md](docs/guides/cursor-setup.md).

### Windsurf / Other Agents

Skills are plain Markdown — they work with any agent that accepts system prompts or instruction files. See [docs/getting-started.md](docs/getting-started.md).

---

Skills encode the workflows, verification gates, and structured reasoning that senior architects use when analyzing unfamiliar codebases. These are packaged so AI agents follow them consistently across every phase of discovery.

```
  RECONNAISSANCE         STRUCTURE            KNOWLEDGE            ASSESSMENT
  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
  │  Scan       │      │  Map        │      │  Extract    │      │  Compare    │
  │  Orient     │ ───► │  Decompose  │ ───► │  Classify   │ ───► │  Assess     │
  │  Boundary   │      │  Deep-dive  │      │  Model      │      │  Document   │
  └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
   /recon                /containers          /capabilities        /blueprint
   /entry-points         /components          /data-model          /discover
   /actors                                    /patterns
```

### Commands

9 slash commands that map to the discovery pipeline. Each one activates the right skills automatically.


| What you're doing                  | Command         | Key principle                            |
| ---------------------------------- | --------------- | ---------------------------------------- |
| Scan the codebase                  | `/recon`        | Orient before you analyze                |
| Find all entry points              | `/entry-points` | Know every door into the system          |
| Identify actors and boundaries     | `/actors`       | Draw the line between inside and outside |
| Map deployable units               | `/containers`   | Understand what gets deployed            |
| Analyze container internals        | `/components`   | See inside each moving part              |
| Extract business capabilities      | `/capabilities` | Map what the system does for users       |
| Discover the data model            | `/data-model`   | Find every entity and relationship       |
| Compare against industry standards | `/blueprint`    | Know what's missing                      |
| Run the full pipeline              | `/discover`     | End-to-end discovery in one command      |


Skills also activate contextually based on the stage — running `/containers` will load the appropriate stack adapter for the detected technology, and `/blueprint` will suggest the best-matching industry blueprint for the system's domain.

---

## The Discovery Pipeline

Unearth follows a staged pipeline. Each stage builds on the outputs of previous stages, accumulating knowledge progressively — the same way a senior architect would work through an unfamiliar codebase. You can run individual skills or the full pipeline.

### Stage 1: Reconnaissance


| Skill                                                        | What It Does                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [00-recon](skills/00-recon/)                                 | Scan repo structure, detect tech stack, count files, identify build systems, spot frameworks                 |
| [01-entry-points](skills/01-entry-points/)                   | Find every way into the system — HTTP routes, event triggers, CLI commands, scheduled jobs, message handlers |
| [02-actors-and-boundaries](skills/02-actors-and-boundaries/) | Identify all human and system actors, map the system boundary                                                |


**Output:** A grounded understanding of what the codebase is, how it's entered, and who uses it.

### Stage 2: Structure


| Skill                                              | What It Does                                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [03-external-systems](skills/03-external-systems/) | Map every external dependency — databases, APIs, message brokers, identity providers, cloud services       |
| [04-containers](skills/04-containers/)             | Identify independently deployable units, classify infrastructure, map container-to-container communication |
| [05-components](skills/05-components/)             | Deep-dive into a container's internals — layers, packages, classes, patterns, god-classes, dead code       |


**Output:** C4 Context and Container diagrams with full evidence trails. Component-level understanding of each deployable unit.

### Stage 3: Knowledge


| Skill                                      | What It Does                                                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| [06-capabilities](skills/06-capabilities/) | Extract business capabilities — what the system does for its users, organized into L1/L2 hierarchy                                     |
| [07-data-model](skills/07-data-model/)     | Discover all entities, their storage mechanisms, relationships, and projections across the stack                                       |
| [08-patterns](skills/08-patterns/)         | Detect architecture patterns (N-tier, CQRS, event-driven, microservices) and anti-patterns (god classes, anemic models, circular deps) |
| [09-dependencies](skills/09-dependencies/) | Map internal component dependencies and external package dependencies with version/risk analysis                                       |


**Output:** Capability map, domain model, data model, pattern inventory, and dependency graph.

### Stage 4: Assessment


| Skill                                        | What It Does                                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [10-blueprint](skills/10-blueprint/)         | Compare discovered capabilities against an industry reference architecture to find gaps and overlaps |
| [11-tech-debt](skills/11-tech-debt/)         | Compile tech debt register with severity, evidence, and remediation guidance                         |
| [12-traceability](skills/12-traceability/)   | Build file-level traceability matrix mapping every source file to its business component             |
| [13-documentation](skills/13-documentation/) | Synthesize all findings into a complete architecture knowledge base                                  |


**Output:** Gap analysis, tech debt register, traceability matrix, and the final architecture document.

---

## What You Get

After running the full pipeline, Unearth produces:

```
outputs/
├── context-diagram.md             # C4 Level 1 — system in its environment
├── container-diagram.md           # C4 Level 2 — deployable units
├── component-diagrams/            # C4 Level 3 — internals per container
├── capability-map.md              # L1 and L2 business capabilities
├── domain-model.md                # Domain model with relationships
├── data-model.md                  # All entities, storage, projections
├── pattern-inventory.md           # Architecture patterns detected
├── dependency-graph.md            # Internal and external dependencies
├── blueprint-comparison.md        # Industry blueprint gap analysis
├── tech-debt-register.md          # Prioritized tech debt findings
├── traceability-matrix.md         # File → component → capability mapping
└── architecture-knowledge-base.md # Complete synthesized document
```

Every claim in every document is traceable to specific files, classes, or configuration entries in the codebase. No hallucinated architecture.

---

## Example: What Discovery Looks Like

Unearth has been validated on a real-world multi-repo industrial platform (3 repositories, ~67 functional modules, .NET + Angular + Azure). Here's what the pipeline produced:

**Capability extraction:**

- 23 initial candidates identified from code scan
- Analyzed, merged, and de-scoped down to 13 confirmed L1 capabilities
- 52 L2 sub-capabilities mapped beneath them
- 100% of functional modules across all 3 repos covered by the capability map

**Architecture discovery:**

- 8 application containers identified with technology stacks and deployment targets
- 20 external systems classified (data stores, identity, messaging, observability)
- C4 Context, Container, and Component diagrams generated with PlantUML
- Architecture patterns detected: N-tier layered, anemic domain model, BFF pattern

**Gap analysis:**

- Compared against a 22-capability industry blueprint for the platform's domain
- 8 full matches, 4 partial matches, 4 critical gaps, 4 moderate gaps
- 5 cross-project redundancies identified
- Prioritized roadmap produced (near-term, mid-term, long-term)

The full analysis — from first scan to final architecture document — was produced by an AI agent following Unearth skills.

---

## Design Principles

**1. Evidence over assertion.** Every architectural claim must cite the file, line, or pattern that proves it. The agent says "I found X in `path/to/file.cs`" — never "the system probably does X."

**2. Progressive depth.** Start with the 30,000-foot view (context diagram), drill into containers, then components. Each stage builds on what came before.

**3. Pipeline, not prompt.** Each skill is a discrete stage with defined inputs, outputs, and quality gates. Outputs from one stage become inputs to the next.

**4. Stack-aware, not stack-locked.** Core methodology works on any language or framework. Stack adapters add pattern-recognition hints for specific ecosystems.

**5. Blueprint-driven gap analysis.** Don't just describe what exists — compare it against what *should* exist for this type of system.

**6. Opinionated outputs.** Standardized on C4 for structure, capability maps for function, domain models for data. Not "generate whatever" — generate *this specific deliverable, this specific way*.

---

## Stack Adapters

Stack adapters teach the agent what to look for in specific technology ecosystems. They don't change the methodology — they add pattern-recognition hints.


| Adapter         | Covers                                     | Patterns Detected                                                               |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| `dotnet`        | .NET / C# / ASP.NET Core / Azure Functions | N-tier, MediatR/CQRS, EF Core, Minimal APIs, Function Apps, Azure services      |
| `java-spring`   | Java / Spring Boot / Spring Cloud          | Layered, hexagonal, Spring Data, Spring Security, microservice chassis          |
| `python-django` | Python / Django / Flask / FastAPI          | MTV, DRF serializers, Celery workers, SQLAlchemy, Alembic migrations            |
| `node-express`  | Node.js / Express / NestJS                 | Middleware chains, Prisma/Sequelize, event-driven, serverless functions         |
| `ruby-rails`    | Ruby / Rails                               | Convention over configuration, ActiveRecord, concerns, engines                  |
| `generic`       | Any language                               | Language-agnostic heuristics: file naming, directory structure, config patterns |


Community contributions for additional stacks are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Industry Blueprints

Blueprints are reference capability models for common platform types. They provide the "what should exist" baseline for gap analysis.


| Blueprint              | Domain                | Based On                                           |
| ---------------------- | --------------------- | -------------------------------------------------- |
| `iiot-saas`            | Industrial IoT SaaS   | IIC IIRA, ISA-95, Azure IoT, AWS IoT SiteWise      |
| `e-commerce`           | E-commerce platform   | Industry-standard commerce reference architectures |
| `fintech-core-banking` | Core banking          | BIAN service landscape                             |
| `saas-b2b`             | Multi-tenant B2B SaaS | Multi-tenant SaaS best practices                   |
| `healthcare-ehr`       | Healthcare / EHR      | HL7 FHIR, HIPAA requirements                       |


Blueprints are community-extensible. See [docs/advanced/creating-blueprints.md](docs/advanced/creating-blueprints.md).

---

## Project Structure

```
unearth/
├── README.md                          # This file
├── CLAUDE.md                          # Claude Code configuration
├── AGENTS.md                          # Agent persona guidance
├── CONTRIBUTING.md                    # How to contribute
├── LICENSE                            # MIT License
│
├── skills/                            # Core discovery skills (one SKILL.md per directory)
│   ├── 00-recon/
│   ├── 01-entry-points/
│   ├── 02-actors-and-boundaries/
│   ├── 03-external-systems/
│   ├── 04-containers/
│   ├── 05-components/
│   ├── 06-capabilities/
│   ├── 07-data-model/
│   ├── 08-patterns/
│   ├── 09-dependencies/
│   ├── 10-blueprint/
│   ├── 11-tech-debt/
│   ├── 12-traceability/
│   └── 13-documentation/
│
├── agents/                            # Pre-configured agent personas
│   ├── architecture-archaeologist.md
│   ├── domain-analyst.md
│   ├── tech-debt-auditor.md
│   └── migration-advisor.md
│
├── blueprints/                        # Industry reference architectures
├── stack-adapters/                    # Stack-specific pattern detection hints
├── templates/                         # Output document templates
├── docs/                              # Documentation (getting started, tutorials, how-tos, concepts)
└── .claude/commands/                  # Slash commands for Claude Code
```

See [docs/getting-started.md](docs/getting-started.md) for detailed setup instructions.

---

## Comparison with Existing Tools


| Tool                       | What It Does                          | How Unearth Differs                                                       |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| **SonarQube**              | Static analysis, code quality metrics | Unearth extracts *architecture* and *capabilities*, not quality scores    |
| **Structure101 / NDepend** | Dependency visualization              | Unearth maps business meaning, not just coupling graphs                   |
| **Repomix**                | Packs repo into AI-friendly format    | Unearth doesn't just pack — it *analyzes* with a structured methodology   |
| **GitHub Copilot Explore** | Ad-hoc codebase Q&A                   | Unearth follows a systematic pipeline producing standardized deliverables |


Unearth is not a replacement for human architectural judgment. It's a force multiplier — it does the systematic scanning, classifying, and cataloging so architects can focus on decisions and trade-offs.

---

## Philosophy

This project exists because the biggest barrier to software modernization isn't technology — it's understanding. Organizations can't plan where they're going if they don't know where they are.

AI agents can read code at a scale and speed humans cannot. But raw code comprehension without structure produces inconsistent, incomplete results. **Unearth provides the structure** — the same methodology a seasoned architect would follow, encoded as repeatable skills that any AI agent can execute.

The skills draw from established architecture frameworks (C4 Model, capability mapping, domain-driven design), industry reference architectures (IIC IIRA, BIAN, HL7 FHIR), and lessons from real-world codebase discovery projects.

> *"You can't modernize what you don't understand."*

---

## Contributing

We welcome contributions across all areas — new stack adapters, new blueprints, skill improvements, case studies, and documentation.

Skills should be:

- **Specific**: Concrete steps with defined inputs and outputs, not vague advice
- **Verifiable**: Clear quality gates with evidence requirements
- **Evidence-based**: Every claim must trace to a file, class, or configuration
- **Composable**: Each skill works independently and as part of the pipeline

See [CONTRIBUTING.md](CONTRIBUTING.md) for the detailed guide and skill format specification.

---

## License

MIT — use these skills freely in your projects, teams, and tools.

---

## Acknowledgements

Unearth builds on the shoulders of:

- **Simon Brown** and the [C4 Model](https://c4model.com/) for software architecture visualization
- **Addy Osmani** and [Agent Skills](https://github.com/addyosmani/agent-skills) for pioneering the AI agent skills pattern
- **Adam Tornhill** and [CodeScene](https://codescene.com/) for behavioral code analysis concepts
- **Eric Evans** and Domain-Driven Design for capability and bounded context thinking

---

*Built with the belief that every codebase has a story worth telling — you just need to know how to listen.*