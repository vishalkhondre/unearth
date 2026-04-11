# Common Architecture Patterns

Reference catalog of architecture patterns and anti-patterns detected by skill `08-patterns`. Each entry includes detection signals, evidence requirements, and assessment guidance.

## Structural Patterns

### N-Tier / Layered

**What it is:** Code organized into horizontal layers (presentation, business, data access) with dependencies flowing downward.

**Detection signals:** Controllers/Functions → Services → Repositories → Database chain. No separate Domain project. DI via constructor injection through the layers.

**Evidence:** Trace 3+ request flows and confirm all follow the same layer sequence.

**Assessment:** Well-implemented if layers are consistent. Problematic if layers are bypassed (controllers calling repositories directly).

### Clean Architecture

**What it is:** Concentric circles with domain at the center. Dependencies point inward. Domain has zero external references.

**Detection signals:** Separate Domain/Application/Infrastructure projects. Domain project references no NuGet/Maven packages. Ports (interfaces) in domain, adapters (implementations) in infrastructure.

**Evidence:** Check project references — domain must NOT reference infrastructure or external packages.

### CQRS (Command Query Responsibility Segregation)

**What it is:** Separate models and paths for commands (writes) and queries (reads).

**Detection signals:** `ICommandHandler<T>`, `IQueryHandler<T>`, MediatR or similar mediator. Separate command and query DTOs.

**Evidence:** Find command/query separation in both code structure and data access paths.

### Microservices

**What it is:** Each service owns its data, communicates via API or events, and deploys independently.

**Detection signals:** Each container has its own database. No shared data store. Communication only via HTTP/gRPC or events.

**Evidence:** Verify from container-to-external mapping — if the database is shared, it's not true microservices.

### Backend-for-Frontend (BFF)

**What it is:** A dedicated API layer that aggregates and transforms backend calls for a specific frontend.

**Detection signals:** A container that calls multiple backend services and reshapes responses. No domain logic — only aggregation, transformation, and session enrichment.

**Evidence:** BFF controller methods that call 1+ backend services and combine results. No direct database access from BFF.

### Event-Driven

**What it is:** Components communicate via events/messages rather than direct calls. Producers don't know about consumers.

**Detection signals:** Event Hub/Kafka/RabbitMQ producers in one container, consumers in another. `[EventHubTrigger]`, `@KafkaListener`, message handler registrations.

**Evidence:** Event producer and consumer code in different containers with no direct HTTP call between them.

## Domain Patterns

### Anemic Domain Model

**What it is:** Entity classes are pure property bags. All business logic lives in service classes.

**Detection signals:** Model classes with only properties (getters/setters). No methods like `entity.DoSomething()`. Business rules in service/function classes.

**Evidence:** Check 3+ entity classes for behavior methods. If none have any, the model is anemic.

### Rich Domain Model

**What it is:** Entities contain business methods, enforce invariants, and raise domain events.

**Detection signals:** Entity classes with behavior methods (`order.Cancel()`, `asset.MoveTo(parent)`). Value objects. Domain events.

**Evidence:** Entity methods that enforce business rules or change state.

## Anti-Patterns

### God Class

**What it is:** A class that does too much — too many lines, too many responsibilities, too many methods.

**Thresholds:** >500 lines = god class. >1000 lines = critical. >10 public methods = wide class.

**Impact:** Merge conflicts, untestable, high cognitive load, single point of failure.

### Shared Database

**What it is:** Multiple independently deployed containers accessing the same database instance.

**Detection signals:** Same connection string in multiple container configs. Same collection/table names accessed by different containers.

**Impact:** Noisy neighbor (throughput contention), schema coupling, prevents independent evolution.

### Distributed Monolith

**What it is:** Microservice topology but tightly coupled — shared models, synchronous chains, shared database.

**Detection signals:** Multiple containers that share a database, share model libraries with business logic, and form synchronous call chains of 3+ hops.

**Impact:** Has the operational complexity of microservices with none of the benefits.

### Synchronous Chain

**What it is:** Request flows through 3+ containers in sequence, each waiting for the next.

**Detection signals:** Request path with 3+ synchronous hops (e.g., browser → SPA → BFF → gateway → service → database).

**Impact:** Cascading failure risk. Latency compounds. No circuit breaker = total outage from one failure.

### Missing Resilience

**What it is:** Inter-service calls with no retry, timeout, or circuit breaker.

**Detection signals:** `HttpClient` calls without Polly/Resilience4j/tenacity policies. No timeout configuration.

**Impact:** Transient failures become permanent. Downstream slowdowns cascade upstream.
