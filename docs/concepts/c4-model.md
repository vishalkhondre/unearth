# Concept: The C4 Model

The C4 model is a way to describe software architecture at four levels of detail. Unearth uses C4 as its primary structural framework because it's simple, widely understood, and maps naturally to how codebases are organized.

## The Problem C4 Solves

Architecture diagrams tend to fall into two traps: either they're a single box-and-arrow diagram that shows everything at once (unreadable), or they're dozens of detailed diagrams that nobody maintains (stale). C4 solves this by giving you exactly four levels of zoom, each answering a different question.

## The Four Levels

### Level 1: System Context

**Question:** "What is this system and who interacts with it?"

Shows the system as a single box, surrounded by the people who use it and the external systems it connects to. This is the diagram you'd draw on a whiteboard in a 5-minute explanation.

**Unearth skills:** S-02 (actors and boundaries) + S-03 (external systems) produce this level.

### Level 2: Container

**Question:** "What gets deployed and how do the parts talk to each other?"

Zooms into the system box and shows the independently deployable units — web apps, APIs, databases, message brokers, SPAs. Each container has its own technology, its own process, and communicates with other containers over the network.

A container is NOT a Docker container (though it might run in one). It's any runtime unit that could be deployed independently.

**Unearth skill:** S-04 (containers) produces this level.

### Level 3: Component

**Question:** "What's inside this container?"

Zooms into a single container and shows its internal structure — the business components, technical services, and how they're organized. This is where you see the layers, the god classes, the business rules.

**Unearth skill:** S-05 (components) produces this level, one diagram per container.

### Level 4: Code

**Question:** "What are the classes and interfaces?"

Zooms into a single component and shows class-level detail. Unearth doesn't produce this level because code-level diagrams change too frequently to be worth maintaining. Instead, the component inventory in S-05 points you to the exact files.

## How Unearth Uses C4

Unearth's pipeline maps directly to C4 levels:

| Pipeline Stage | C4 Level | Output |
| --- | --- | --- |
| Stage 1: Reconnaissance | Level 1 (Context) | Actors, boundary, external systems |
| Stage 2: Structure | Level 2 (Container) + Level 3 (Component) | Container topology, component inventories |
| Stage 3: Knowledge | Beyond C4 | Capabilities, data model, patterns, dependencies |
| Stage 4: Assessment | Beyond C4 | Blueprint gaps, tech debt, traceability |

C4 gives you the structural skeleton (Stages 1-2). Unearth's capability extraction, pattern detection, and assessment skills (Stages 3-4) add the business and quality layers on top.

## Key Rules

**Every element needs evidence.** In Unearth, a container exists because you can point to its deployment config, its entry points, and its startup code. An actor exists because you can find its authentication pattern. No evidence, no element.

**Containers communicate over the network.** If two pieces of code are in the same process and call each other via function calls, they're components within a single container — not separate containers.

**Components group by business function, not technology layer.** "Asset Management" is a component. "Services" is not. A component includes entry points, services, repositories, and models for one business function.

## Further Reading

- `references/c4-cheat-sheet.md` — notation, PlantUML macros, common mistakes
- `templates/context-diagram.md` — Level 1 output template
- `templates/container-diagram.md` — Level 2 output template
- `templates/component-diagram.md` — Level 3 output template
- [c4model.com](https://c4model.com) — the official C4 model site
