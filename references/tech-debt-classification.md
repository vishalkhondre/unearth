# Tech Debt Classification

Reference guide for the tech debt classification system used in skill `11-tech-debt`. Covers categories, severity levels, effort estimation, and common remediation patterns.

## Debt Categories

| Category | Code | What It Covers | Examples |
| --- | --- | --- | --- |
| Code quality | CQ | Structural code problems | God classes, fat controllers, magic strings, dead code, missing abstractions |
| Test coverage | TC | Testing gaps and dead tests | Untested components, dead test fixtures, low test-to-source ratios |
| Architecture | AR | Structural design problems | Anti-patterns, circular dependencies, distributed monolith, absent patterns |
| Resilience | RS | Missing fault tolerance | No retry/circuit-breaker, synchronous chains, missing health endpoints |
| Security | SE | Security weaknesses | Shared secrets without rotation, BFF bypass, EOL frameworks with CVEs |
| Dependency | DP | Package and library risks | EOL frameworks, version conflicts, dead packages, shared library coupling |
| Data model | DM | Data structure problems | Missing constraints, implied references, cross-store references, schema-less risks |
| Redundancy | RD | Unnecessary duplication | DTO duplication, parallel implementations, mock maintenance burden |

## Severity Levels

### CRITICAL

Active risk to security, data integrity, or production reliability. Needs immediate attention.

| Finding Type | Why CRITICAL |
| --- | --- |
| EOL framework in production | Known vulnerabilities, no security patches |
| Container with zero tests that handles auth or payments | Any change risks breaking security with no safety net |
| God class >1000 lines with inline business logic | Untestable, unmaintainable, blocks all refactoring |
| Shared secret with no rotation mechanism | Compromised secret = full system access with no recovery |

### HIGH

Significant maintenance burden, blocks modernization, or compounds other debt.

| Finding Type | Why HIGH |
| --- | --- |
| God class 500-1000 lines | Major complexity hotspot, merge conflict magnet |
| Missing retry/circuit-breaker on inter-container calls | Transient failures cascade to outages |
| Shared library with business logic used by 3+ containers | Any change has blast radius across the system |
| Test project with zero runnable test methods (dead tests) | False confidence — team thinks it's tested |

### MEDIUM

Real but manageable problem. Creates friction without blocking progress.

| Finding Type | Why MEDIUM |
| --- | --- |
| Missing health endpoints on deployable containers | Monitoring blind spots |
| Anemic domain model | Limits expressiveness, scatters business rules |
| DTO duplication across projects | Maintenance burden, drift risk |
| Missing custom exception types | Hinders debugging and error handling |

### LOW

Minor issue. Address opportunistically during related work.

| Finding Type | Why LOW |
| --- | --- |
| Magic strings without constants | Maintenance annoyance, not structural |
| 1 TODO comment in entire codebase | Debt is structural, not documented |
| Unused NuGet/npm packages | Small attack surface increase |

## Effort Estimation

| Effort | Time | Team | Risk | Examples |
| --- | --- | --- | --- | --- |
| **Small** | 1-3 days | 1 developer | Low regression risk | Remove dead packages, add health endpoints, add constants for magic strings |
| **Medium** | 1-2 weeks | 1-2 developers | Some regression risk | Add Polly policies to HTTP calls, write tests for untested component, extract service from fat controller |
| **Large** | 2-4 weeks | 2+ developers | Significant regression risk | Decompose god class (1000+ lines), upgrade EOL framework, package shared library as NuGet |
| **Extra-Large** | 1+ months | Cross-team | High regression risk | Split shared database, redesign data model, replace architecture pattern |

## Remediation Roadmap Phases

### Quick Wins (do first)

High impact + Small effort. Proves progress, builds momentum.

**How to identify:** CRITICAL or HIGH severity AND Small effort. Or anything that removes dead code (zero risk).

**Examples:** Remove dead test fixtures, add missing health endpoints, clean up unused packages, add retry policies to unprotected HTTP calls.

### Planned Work (schedule into sprints)

High impact + Medium effort. Requires planning but not architectural redesign.

**How to identify:** HIGH severity AND Medium effort. Or CRITICAL with Medium effort.

**Examples:** Extract service layer from fat controller, write tests for zero-coverage components, add custom exception types, eliminate DTO duplication.

### Strategic Items (design spike first)

High impact + Large/XL effort. Requires design decisions and phased rollout.

**How to identify:** CRITICAL or HIGH severity AND Large or Extra-Large effort.

**Examples:** Framework upgrade (EOL), shared database decomposition, god class decomposition (1000+ lines), shared library extraction to package.

### Deferred (park explicitly)

Low impact OR blocked by other items.

**How to identify:** LOW severity regardless of effort. Or items that can't start until a prerequisite is resolved.

**Examples:** Magic string cleanup (do during related refactoring), anemic domain model (strategic choice, not always debt), cosmetic code organization.

## Common Remediation Patterns

### God Class Decomposition

1. Identify the distinct responsibilities (usually 3-5 per god class)
2. Extract each responsibility into a new class with a focused interface
3. Have the original class delegate to the new classes (preserves API)
4. Move tests to the new classes
5. Gradually remove the original class

### Adding Resilience

1. Identify all inter-container HTTP calls (from S-04 communication map)
2. Add retry with exponential backoff for transient failures
3. Add circuit breaker for downstream service protection
4. Add timeout for hung connection prevention
5. Add health check endpoints for monitoring

### Shared Library Extraction

1. Identify what's in the shared library (models, utilities, business logic)
2. Models and utilities: package as-is (NuGet, npm, Maven)
3. Business logic: extract to its own service with an API boundary
4. Update all consumers to reference the package or API
5. Remove the shared project reference

### EOL Framework Upgrade

1. Check the official migration guide for the target version
2. Identify breaking changes that affect your codebase
3. Update in a branch, fix compilation errors
4. Run all tests (this is where missing test coverage hurts)
5. Deploy to a non-production environment first
6. Monitor for runtime issues before production rollout
