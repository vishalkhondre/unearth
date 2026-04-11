---
name: 07-data-model
description: >
  Discovers all persistent entities, their storage mechanisms,
  relationships, and projections across the codebase. Classifies
  entities as storage (persisted), projection (DTO/request/response),
  or view model (API-facing). Maps each entity to its owning
  capability, storage technology, and cross-project usage. Identifies
  schema risks, coupling hotspots, and missing constraints. Use after
  06-capabilities when you need to understand what data the system
  manages and where it lives.
---

# Data Model

Discovers every data entity in the codebase — what gets persisted, where it's stored, how it's shaped for different consumers, and which capabilities own it. Classifies entities by type, maps storage mechanisms, traces cross-project projections, and identifies data model risks.

Without this step, the agent knows what the system does (capabilities) but not what data it manages. Data model understanding is essential for migration planning, database decomposition, and identifying hidden coupling through shared entities.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 3 — Knowledge                                      |
| **Skill**       | 07-data-model                                      |
| **Runs after**  | `06-capabilities`                                  |
| **Runs before** | `08-patterns`                                      |
| **Required by** | `08-patterns`, `10-blueprint`, `11-tech-debt`, `12-traceability`, `13-documentation` |

## Inputs

### Required
- `outputs/05-components-*.md` — Business component inventories (Section 3) for entity file locations and data store references
- `outputs/06-capabilities.md` — L1/L2 capability list (Section 5) for mapping entities to capabilities
- `outputs/03-external-systems.md` — Section 2 (External Systems Inventory) for data store technologies and connection details

### Optional (improves results)
- `outputs/00-recon.md` — Section 3 (Technology Stack) for knowing which ORM/data frameworks to look for
- Stack adapter for the detected technology (provides entity detection patterns)
- Database migration files or schema scripts (if present in the repo)

## When to Use

**Use when:**
- You need to understand what data the system manages
- You're planning a database migration or decomposition
- You need to identify data coupling between capabilities (shared entities)
- You're preparing for blueprint comparison or tech debt assessment

**Do not use when:**
- `06-capabilities` has not been run (you need capability ownership context)
- The system is stateless with no persistent data (rare but possible)

## Process

### Step 1: Load Upstream Context

Read the upstream outputs. Extract:
- **From `05-components-*.md`:** Entity/model file locations, data store references per component
- **From `06-capabilities.md`:** L1 capabilities for ownership mapping
- **From `03-external-systems.md`:** Data store technologies (relational, document, graph, blob, cache)

```
CHECKPOINT: The agent must know which data store technologies are
in use and where entity files are located before scanning.
```

### Step 2: Discover Storage Entities

Scan for entities that are persisted to a database. Detection patterns vary by storage technology:

**Relational (SQL):**
- Entity Framework: classes with `DbSet<T>` references in `DbContext`, `[Table]` attributes, migration files
- JPA/Hibernate: `@Entity`, `@Table` annotations, `persistence.xml`
- Django: classes inheriting `models.Model`
- ActiveRecord: classes inheriting `ApplicationRecord` or `ActiveRecord::Base`
- SQLAlchemy: classes inheriting `Base` or `db.Model`

**Document (NoSQL):**
- MongoDB: classes used with `IMongoCollection<T>`, `[BsonId]` attributes, collection name config
- Cosmos DB: classes with `[CosmosContainer]`, partition key attributes
- DynamoDB: `@DynamoDBTable` annotations

**Graph:**
- Gremlin/Neo4j: vertex/edge definitions, graph traversal queries that reveal schema
- Look for vertex labels, edge labels, and property definitions in query strings

**Blob/File:**
- Classes representing file metadata stored alongside blob references
- Container/bucket name configurations

**Cache:**
- Classes serialized to Redis, Memcached, or in-memory cache

For each storage entity, record:
- **Entity name** and source file path
- **Storage technology** (SQL, MongoDB, Gremlin, Blob, etc.)
- **Collection/table/container name** (from config or attributes)
- **Key fields** (primary key, partition key, unique constraints)
- **Owning project** and business component (from S-05)

If a stack adapter is loaded, consult its "Entity Detection" section for framework-specific patterns.

### Step 3: Discover Projections and DTOs

Scan for data shapes that are not persisted but carry data between layers:

| Type | Purpose | How to Detect |
| --- | --- | --- |
| **Request DTO** | Carries data into an endpoint | Classes in `Models/`, `Requests/`, or `DTOs/` used as endpoint parameters |
| **Response DTO** | Shapes data for API responses | Classes in `Models/`, `Responses/` returned from endpoints |
| **Event payload** | Carries data through event streams | Classes used with event producers/consumers |
| **View model** | Shapes data for UI consumption | Classes in `ViewModels/` used by BFF or frontend |
| **Projection** | Flattened or aggregated view of storage entities | Classes that combine fields from multiple storage entities |

For each projection/DTO:
- **Name** and file path
- **Type** (request, response, event, view model, projection)
- **Owning project**
- **Maps to** (which storage entity or entities it derives from)

### Step 4: Map Entity Attributes

For the most important storage entities (those shared across capabilities or central to the domain), document the full attribute structure:

| Attribute | What to Record |
| --- | --- |
| **Field name** | Property/column name |
| **Data type** | String, int, boolean, date, nested object, array, etc. |
| **Constraints** | Required, unique, indexed, FK reference, range, regex |
| **Business meaning** | What this field represents in business terms |

Focus on entities that are:
- Shared across 3+ capabilities (highest coupling risk)
- Central to the domain (the "core" entity that everything references)
- Complex (50+ fields, nested structures, dynamic properties)

For simpler entities, a summary (field count, key fields, storage) is sufficient.

### Step 5: Map Entity Relationships

Identify how entities relate to each other:

| Relationship Type | How to Detect |
| --- | --- |
| **Foreign key** | FK attributes, navigation properties, `[ForeignKey]`, `@ManyToOne` |
| **Graph edge** | Edge labels in Gremlin/Neo4j queries, relationship types |
| **Embedded document** | Nested objects within a document (MongoDB, Cosmos) |
| **Implied reference** | String ID fields that match another entity's key but have no formal FK |
| **Cross-store reference** | Entity in one database referencing entity in another (e.g., MongoDB doc references Gremlin vertex by ID) |

For systems without formal FK constraints (e.g., MongoDB, Cosmos DB), pay special attention to implied references — string fields whose names suggest they point to another entity but have no database-level enforcement.

```
CHECKPOINT: Every entity should have its relationships mapped —
either explicit (FK, edge) or implied (string ID reference).
Entities with zero relationships are suspicious and should be
investigated (they may be orphaned or their relationships may
be coded in application logic rather than schema).
```

### Step 6: Map Cross-Project Entity Usage

Trace how entities flow across project boundaries:

| Pattern | What It Means |
| --- | --- |
| Same entity class in multiple projects | Shared model library or copy-paste duplication |
| Storage entity in core, view model in BFF | Normal BFF projection pattern |
| Storage entity in core, duplicate DTO in BFF with different fields | Transformation layer — may drift over time |
| Entity only in one project | Well-encapsulated or potentially orphaned |

For each entity, record which projects reference it and in what form (same class, projection, view model).

### Step 7: Align Entities to Capabilities

Map each storage entity to its owning L1 capability (from S-06):

| Attribute | What to Record |
| --- | --- |
| **Entity** | Name and storage type |
| **Owning capability** | The L1 capability that creates/manages this entity |
| **Shared?** | Yes/No — is it referenced by other capabilities? |
| **Referenced by** | Which other capabilities read or reference this entity |

Entities shared across 3+ capabilities are coupling hotspots and should be flagged.

### Step 8: Identify Data Model Risks

Review the complete data model for:

- **Missing primary keys** — entities without explicit PK definitions
- **Implied references without constraints** — string ID fields with no FK enforcement
- **Cross-store references** — entities in different databases referencing each other
- **High-coupling entities** — entities shared by many capabilities
- **Schema-less risks** — entities in document stores with no schema validation
- **Zero test coverage** — entities whose persistence logic is untested
- **Large/complex entities** — entities with 50+ fields or deep nesting

### Step 9: Compile Data Model Output

Assemble all findings into the output file.

## Output Format

This skill produces a single Markdown file: `outputs/07-data-model.md`

### Required Structure

```markdown
# Data Model — {System Name}

> **Pipeline stage:** 07-data-model
> **Date:** {date}
> **Input:** outputs/03-external-systems.md, outputs/05-components-*.md, outputs/06-capabilities.md
> **Scope:** {list of repositories/projects}

---

## 1. Entity Inventory

### Storage Entities

| Entity | Source Project | Storage Technology | Collection/Table | Key Fields | File Path |
| --- | --- | --- | --- | --- | --- |
| {name} | {project} | {tech} | {collection} | {PK, partition} | {path} |

### Projections and DTOs

| Entity | Source Project | Type | Maps To | File Path |
| --- | --- | --- | --- | --- |
| {name} | {project} | {request/response/event/view model} | {storage entity} | {path} |

### Summary

| Category | Count |
| --- | --- |
| Storage entities | {n} |
| Projections / DTOs | {n} |
| View models (BFF) | {n} |
| Total entity types | {n} |

---

## 2. Entity Attribute Details

### {Entity Name} ({Storage Technology})

| Attribute | Data Type | Constraints | Business Meaning |
| --- | --- | --- | --- |
| {field} | {type} | {constraints} | {meaning} |

**Business rules:** {rules governing this entity}

{Repeat for key entities — those shared across capabilities or central to domain}

---

## 3. Entity Relationships

| Source Entity | Relationship | Target Entity | Type | Enforcement |
| --- | --- | --- | --- | --- |
| {source} | {description} | {target} | {FK/edge/embedded/implied} | {DB constraint / app logic / none} |

---

## 4. Cross-Project Entity Usage

| Entity | Core API | BFF / API Gateway | Frontend | Form |
| --- | --- | --- | --- | --- |
| {name} | {storage entity} | {view model / DTO} | {interface / type} | {same class / projection / duplicate} |

---

## 5. Capability Alignment

| Entity | Owning Capability | Shared? | Referenced By |
| --- | --- | --- | --- |
| {name} | {L1 capability} | {Yes/No} | {other L1 capabilities} |

### Coupling Hotspots

| Entity | Capabilities (count) | Risk |
| --- | ---:| --- |
| {name} | {n} | {HIGH/MEDIUM/LOW — why} |

---

## 6. Data Model Findings

### Missing Constraints

| Entity | Issue | Risk |
| --- | --- | --- |
| {name} | {what's missing} | {impact} |

### Cross-Store References

| Source Entity (Store A) | Target Entity (Store B) | Reference Field | Enforcement |
| --- | --- | --- | --- |
| {entity in DB A} | {entity in DB B} | {field name} | {app logic / none} |

### Schema Risks

| # | Finding | Entity | Severity |
| --- | --- | --- | --- |
| 1 | {description} | {entity name} | {HIGH/MEDIUM/LOW} |

---

## 7. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Storage Entities):** Adapter provides ORM/data framework patterns. The `.NET` adapter knows `DbSet<T>`, `IMongoCollection<T>`, Gremlin query patterns, and `[BsonId]`/`[BsonElement]` attributes. The `java-spring` adapter knows `@Entity`, `CrudRepository<T, ID>`, and Spring Data MongoDB annotations.
- **Step 4 (Entity Attributes):** Adapter knows constraint annotation patterns (`[Required]`, `@NotNull`, `@Column(unique=true)`).
- **Step 5 (Relationships):** Adapter knows navigation property and FK patterns specific to the ORM.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| Storage entity exists | Model class file path + repository/DbContext that persists it + collection/table config |
| Entity storage technology | Database driver package (from S-03) + repository implementation + connection config |
| Entity relationship | FK attribute, graph edge query, embedded document structure, or string ID field — with file paths |
| Implied reference | String field name matching another entity's key pattern + absence of FK constraint |
| Capability ownership | Entity managed (CRUD) by a specific business component mapped to an L1 capability in S-06 |
| Coupling hotspot | Entity referenced by 3+ capabilities with specific file evidence per capability |
| Missing constraint | Expected constraint (PK, unique, FK) absent from both schema and application code |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I'll just list the database tables, that's the data model" | Database tables are storage entities — one part of the model. Projections, DTOs, and view models reveal how data flows through the system. Cross-project entity usage reveals coupling. All three perspectives are needed. |
| "The ORM handles relationships, I don't need to map them" | ORMs handle explicit relationships. Implied references (string ID fields without FK) are where the real coupling hides — and where data integrity breaks during migration. Map both. |
| "Document databases don't have schemas, there's nothing to model" | Document databases have implicit schemas defined by the application code. Every model class that maps to a collection IS the schema. The lack of database-level enforcement makes it MORE important to document, not less. |
| "Entity attribute details are too low-level for architecture" | For entities shared across 3+ capabilities, attribute-level understanding is architecture. A field change on a high-coupling entity has blast radius across the system. Key entities need full attribute documentation. |
| "The BFF just passes data through, its view models don't matter" | BFF view models are the contract between backend and frontend. When they diverge from storage entities (and they always do), the transformation logic becomes a maintenance burden and a source of bugs. Document the mapping. |

## Red Flags

- Entity inventory that only covers one project in a multi-project system
- Storage entities without any relationship mapping (every entity relates to something)
- No cross-project usage analysis (missing the BFF projection layer)
- No capability alignment (entities floating without ownership)
- Missing the "implied reference" analysis for document databases
- Entity count that seems low for the system complexity (may have missed model classes)
- No data model risks identified (every system has at least a few)
- Confusing DTOs with storage entities (or vice versa)

## Verification

Before marking this skill complete, confirm:

- [ ] All storage technologies from S-03 are represented in the entity inventory
- [ ] Storage entities are discovered with file paths, storage type, and collection/table names
- [ ] Projections, DTOs, and view models are cataloged separately from storage entities
- [ ] Key entities have attribute-level documentation with constraints and business meaning
- [ ] Entity relationships are mapped (explicit FK/edge AND implied references)
- [ ] Cross-project entity usage is traced (core → BFF → frontend)
- [ ] Every storage entity is aligned to an owning L1 capability from S-06
- [ ] Coupling hotspots (entities shared by 3+ capabilities) are flagged with risk assessment
- [ ] Data model risks are identified (missing PKs, implied references, cross-store refs, schema-less risks)
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/07-data-model.md`
- [ ] Output file follows the required structure from the Output Format section
