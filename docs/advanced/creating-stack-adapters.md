# Creating Stack Adapters

A guide to creating new stack adapters for Unearth. Stack adapters provide technology-specific pattern detection hints that help skills produce better results for a given ecosystem.

## What a Stack Adapter Does

Skills are technology-agnostic — they describe what to find (entry points, containers, entities) not where to find it. Stack adapters bridge the gap by telling the agent exactly where to look in a specific ecosystem.

Without an adapter, the agent relies on general heuristics and filename conventions. With an adapter, it knows that `@RestController` means HTTP entry point (Java Spring), that `DbSet<T>` means entity (EF Core), or that `@EventHubTrigger` means event handler (Azure Functions).

## Adapter Structure

Every adapter lives in `stack-adapters/{name}/ADAPTER.md` and follows this structure:

```markdown
---
name: {identifier}
stack: "{Human-readable stack name}"
languages:
  - {language}
frameworks:
  - {framework 1}
  - {framework 2}
package_manager: {NuGet / Maven / pip / npm / gem}
---

# {Stack Name} Stack Adapter

{One paragraph describing what this adapter covers.}

## S-00: Recon Hints
{Project detection, framework version detection, build system specifics}

## S-01: Entry Point Hints
{HTTP entry points, non-HTTP triggers, auth detection patterns}

## S-02: Actor Detection Hints
{Auth patterns specific to this stack}

## S-03: Package-to-System Mapping
{Table mapping package names to external systems}

## S-04: Container Detection Hints
{What makes a container vs. a library in this stack}

## S-05: Layer Detection Hints
{Standard directory conventions, DI registration patterns}

## S-07: Entity Detection Hints
{How to find storage entities, ORM patterns, schema definitions}

## S-08: Pattern Detection Hints
{Stack-specific structural and domain pattern indicators}

## S-09: Dependency Risk Hints
{EOL framework dates, resilience detection, version conflict signals}
```

## How to Write Each Section

### S-00: Recon Hints

Tell the agent how to identify projects and frameworks:

- **Project detection:** What file identifies a project? (`.csproj`, `pom.xml`, `package.json`, `Gemfile`)
- **Framework version:** Where is the framework version declared? How to read it.
- **Build system:** What files indicate build configuration? (`Directory.Build.props`, `gradle.properties`, `webpack.config.js`)

### S-01: Entry Point Hints

Two subsections:

**HTTP entry points:** What annotations, decorators, or conventions indicate an HTTP handler?
- Java Spring: `@RestController`, `@GetMapping`, `@PostMapping`
- Python Django: `urlpatterns` in `urls.py`, `@api_view` decorator
- Node Express: `app.get()`, `app.post()`, `router.get()`

**Non-HTTP entry points:** What indicates event handlers, cron jobs, queue processors?
- Java Spring: `@KafkaListener`, `@Scheduled`, `@RabbitListener`
- Python Celery: `@app.task`, `@shared_task`
- Node: `@EventPattern()` (NestJS), `Bull` job processors

### S-03: Package-to-System Mapping

This is the most impactful section. Create a table mapping popular packages to external systems:

```markdown
| Package | External System | Classification |
| --- | --- | --- |
| spring-boot-starter-data-mongodb | MongoDB | Data store |
| spring-kafka | Apache Kafka | Messaging |
| spring-boot-starter-oauth2-client | OAuth2 Provider | Identity |
```

**Include 20-30 common packages** for the ecosystem. Include popular databases, message brokers, cloud services, identity providers, and observability tools.

Also note packages that are NOT external systems (validation libraries, utility frameworks, test dependencies) to prevent false positives.

### S-09: Dependency Risk Hints

Include an EOL table for the ecosystem's framework versions:

```markdown
| Framework | EOL Date | Severity |
| --- | --- | --- |
| Spring Boot 2.x | Nov 2023 | CRITICAL |
| Java 11 | Sep 2023 (Oracle) | HIGH |
```

## Quality Checklist

Before submitting a new adapter:

- [ ] YAML frontmatter parses correctly with `name`, `stack`, `languages`, `frameworks`
- [ ] All 9 skill sections present (S-00, S-01, S-02, S-03, S-04, S-05, S-07, S-08, S-09)
- [ ] Package-to-system mapping has 20+ entries
- [ ] EOL framework dates are accurate and sourced
- [ ] Tested against at least one real codebase in the target ecosystem
- [ ] Detection patterns are specific ("look for `@Entity`") not vague ("check for entities")
- [ ] False positive notes included (packages that are NOT external systems)

## Existing Adapters for Reference

- `stack-adapters/dotnet/ADAPTER.md` — the reference implementation (211 lines, 26 package mappings)

Study this adapter before writing a new one. It demonstrates the expected level of detail and specificity.

## File Location

Save your adapter to: `stack-adapters/{name}/ADAPTER.md`

Use lowercase names matching the technology: `java-spring`, `python-django`, `node-express`, `ruby-rails`, `go-standard`, `rust-axum`.
