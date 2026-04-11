---
name: 01-entry-points
description: >
  Finds every entry point into the system -- HTTP endpoints, event and
  message handlers, CLI commands, scheduled jobs, background workers,
  SignalR/WebSocket hubs, and startup hooks. Counts and classifies them
  by project, trigger type, and auth level. Use after 00-recon when you
  need to understand the system's surface area before identifying actors
  and drawing boundaries.
---

# Entry Points

Discovers every way into the system — every HTTP route, event trigger, scheduled job, message handler, WebSocket hub, and background worker. The entry point inventory defines the system's surface area and is the foundation for identifying actors, drawing boundaries, and mapping capabilities.

Without this step, the agent will miss non-obvious entry points (event triggers, blob triggers, change feeds, background workers) that often contain critical business logic invisible from the API surface alone.

## Pipeline Position

| Attribute       | Value                                              |
| --------------- | -------------------------------------------------- |
| **Stage**       | 1 — Reconnaissance                                 |
| **Skill**       | 01-entry-points                                    |
| **Runs after**  | `00-recon`                                         |
| **Runs before** | `02-actors-and-boundaries`                         |
| **Required by** | `02-actors-and-boundaries`, `04-containers`, `05-components`, `06-capabilities` |

## Inputs

### Required
- `outputs/00-recon.md` — specifically the **Project Organization** table (Section 4) which lists every project, its directory, technology, and role

### Optional (improves results)
- Stack adapter for the detected technology (provides framework-specific trigger patterns)
- README or API documentation (treated as claims to verify, not as truth)

## When to Use

**Use when:**
- Completing the reconnaissance stage after `00-recon`
- You need to understand the system's API surface area
- You're preparing to identify actors and draw the system boundary
- You suspect there are non-HTTP entry points (events, jobs, triggers) that aren't documented

**Do not use when:**
- `00-recon` has not been run (you need the project list first)
- You're only interested in business capabilities (skip to `06-capabilities`, though it's better with the full pipeline)

## Process

### Step 1: Load Recon Context

Read `outputs/00-recon.md`. Extract:
- The list of projects/sub-projects with their directories and technologies
- The project organization type (single, multi-project, monorepo, multi-repo)

This determines which directories to scan and which trigger patterns to look for.

```
CHECKPOINT: The agent must have the project list loaded and know which
technology each project uses before scanning for entry points.
```

### Step 2: Scan for HTTP Entry Points

For each project, find all HTTP-accessible endpoints. The detection method depends on the technology:

**Framework-specific patterns (check if stack adapter is loaded for detailed guidance):**

| Technology | Where to Look | What to Find |
| --- | --- | --- |
| ASP.NET Core | `Controllers/` directory, `*.cs` with `[ApiController]`, `[Route]`, `[HttpGet/Post/Put/Delete]` | Controller actions with route attributes |
| ASP.NET Core Minimal API | `Program.cs`, `*.cs` with `app.MapGet/MapPost` | Inline endpoint definitions |
| Azure Functions | `*.cs` with `[Function]` + `[HttpTrigger]` | Function name, method, route, auth level |
| Spring Boot | `*Controller.java` with `@RestController`, `@RequestMapping`, `@GetMapping` | Handler methods with path mappings |
| Django | `urls.py` files, `urlpatterns` list | URL patterns mapped to views |
| Flask / FastAPI | `@app.route`, `@app.get/post`, `@router.get/post` | Decorated endpoint functions |
| Express / NestJS | `router.get/post`, `@Get/@Post` decorators | Route handlers |
| Rails | `config/routes.rb` | `resources`, `get`, `post` declarations |

For each HTTP endpoint, record:
- **File path** where it's defined
- **HTTP method** (GET, POST, PUT, PATCH, DELETE)
- **Route pattern** (e.g., `{tenantId}/assets/{assetId}`)
- **Auth level** (anonymous, API key, JWT, role-based — whatever is detectable from code)
- **Grouping** (which controller, function class, or router file it belongs to)

Group endpoints by functional area (not just alphabetically) and count them.

```
CHECKPOINT: Every project identified in recon must be scanned for HTTP
endpoints. If a project has zero HTTP endpoints, record that explicitly
with the reason (it may be a library, worker, or event-driven service).
```

### Step 3: Scan for Event and Message Triggers

Search for non-HTTP entry points that respond to events, messages, or data changes:

| Trigger Type | Detection Pattern |
| --- | --- |
| **Message queue** | `[ServiceBusTrigger]`, `@JmsListener`, `@RabbitListener`, Celery `@task`, SQS handler |
| **Event stream** | `[EventHubTrigger]`, Kafka consumer, `@KafkaListener`, Kinesis handler |
| **Pub/sub** | `[TopicTrigger]`, Google Pub/Sub subscriber, SNS handler |
| **Change feed / CDC** | `[CosmosDBTrigger]`, Debezium consumer, DynamoDB stream handler |
| **Blob / file trigger** | `[BlobTrigger]`, S3 event, file watcher |
| **Webhook receiver** | Endpoints specifically designed to receive external webhooks |

For each trigger found, record:
- **File path** and function/method name
- **Trigger type** (from the table above)
- **Source** (which queue, topic, event hub, container, or database)
- **Connection/binding reference** (config key or connection string name)

```
CHECKPOINT: If the recon identified event streaming infrastructure
(Event Hub, Kafka, Service Bus, etc.), there MUST be corresponding
triggers found. If not, flag as [NEEDS VERIFICATION].
```

### Step 4: Scan for Scheduled Jobs and Background Workers

Search for time-triggered or continuously running processes:

| Pattern | Detection |
| --- | --- |
| **Timer / cron** | `[TimerTrigger]`, `@Scheduled`, cron expressions, Celery beat, `node-cron` |
| **Background worker** | `IHostedService`, `BackgroundService`, `Thread`, `Task.Run` (long-running), daemon processes |
| **Startup hooks** | `IStartupFilter`, `Configure`, `OnApplicationStarted`, `@PostConstruct` |
| **Shutdown hooks** | `IApplicationLifetime`, `OnApplicationStopping`, `@PreDestroy`, signal handlers |

For each found, record: file path, schedule/trigger, and purpose.

If NO scheduled jobs or background workers are found, state this explicitly. For many systems, the absence of scheduled jobs is architecturally significant (common needs like data cleanup, aggregation, cache warming, and health checks may be unaccounted for).

### Step 5: Scan for WebSocket and Real-Time Endpoints

Search for WebSocket, SignalR, Socket.io, or other real-time communication endpoints:

| Technology | Detection Pattern |
| --- | --- |
| **SignalR** | Classes inheriting `Hub`, `[HubMethodName]`, `MapHub<>` in startup |
| **Socket.io** | `io.on('connection')`, socket event handlers |
| **WebSocket (raw)** | `WebSocketHandler`, `ws.on('message')`, `@OnMessage` |
| **gRPC** | `.proto` files, `@GrpcService`, `MapGrpcService` |
| **GraphQL** | `schema.graphql`, `@Query`, `@Mutation`, `MapGraphQL` |

For each found, record: file path, path/endpoint, authentication method, and key operations (hub methods, subscription topics, etc.).

### Step 6: Scan for CLI and Console Entry Points

Search for command-line interfaces or console applications:

- `Main` methods or `Program.cs` in console projects
- CLI frameworks: `CommandLineParser`, `System.CommandLine`, `click`, `argparse`, `commander`, `thor`
- Management commands: `manage.py` commands (Django), `rake` tasks (Rails), `artisan` commands (Laravel)

Record each with its purpose, invocation pattern, and whether it's a production tool or a dev/ops utility.

### Step 7: Classify Entry Points by Auth Level

Review all discovered entry points and classify their authentication/authorization:

| Auth Classification | Meaning |
| --- | --- |
| **Anonymous** | No authentication required (health probes, public endpoints) |
| **API key / Function key** | Machine-to-machine with static keys |
| **JWT Bearer** | User identity token (Okta, Azure AD, Auth0, etc.) |
| **Role-based (RBAC)** | JWT + role/permission checks |
| **Internal / System** | Server-to-server with shared secrets or managed identity |
| **Mixed / Custom** | Non-standard pattern (document the specifics) |

Add the auth classification to each entry point if not already captured in earlier steps. This classification feeds directly into `02-actors-and-boundaries`.

### Step 8: Compile Summary Statistics

Count and summarize all entry points:

| Metric | How to Count |
| --- | --- |
| Total HTTP endpoints | All REST/API endpoints across all projects |
| Non-HTTP triggers | Event, message, blob, change feed, timer triggers |
| WebSocket / real-time | SignalR hubs, Socket.io handlers, gRPC services |
| CLI / console | Command-line entry points |
| Background workers | Long-running processes, hosted services |
| Health endpoints | Explicitly health/liveness/readiness probes |

Flag notable patterns:
- Projects with zero entry points (may be shared libraries — confirm)
- Projects with unusually high endpoint counts (may be a god-controller problem)
- Missing health endpoints on services that should have them
- Inconsistent auth patterns across similar endpoints

```
CHECKPOINT: The total entry point count must be reconcilable —
the sum of all categories must equal the total. No endpoint should
be uncategorized.
```

### Step 9: Compile Entry Points Output

Assemble all findings into the output file following the Output Format below.

## Output Format

This skill produces a single Markdown file: `outputs/01-entry-points.md`

### Required Structure

```markdown
# Entry Points — {System Name}

> **Pipeline stage:** 01-entry-points
> **Date:** {date}
> **Input:** outputs/00-recon.md
> **Scope:** {list of repositories/projects}

---

## 1. Scan Scope and Approach

| Attribute | Value |
| --- | --- |
| **Projects scanned** | {list from 00-recon Section 4 (Project Organization)} |
| **Trigger types searched** | {HTTP, event, timer, WebSocket, CLI, background worker} |
| **Stack adapter used** | {name or None} |
| **Notes** | {anything that constrained or shaped the scan} |

---

## 2. Summary

| Project | HTTP Endpoints | Non-HTTP Triggers | WebSocket / Real-Time | CLI / Console | Background Workers | Health Probes |
| --- | ---:| ---:| ---:| ---:| ---:| ---:|
| {project} | {n} | {n} | {n} | {n} | {n} | {n} |
| **Total** | **{n}** | **{n}** | **{n}** | **{n}** | **{n}** | **{n}** |

**Total entry points: {grand total}**

---

## 3. HTTP Endpoints

### {Project Name}

| Category | Source File | Count | Route Prefix | Key Routes | Auth |
| --- | --- | ---:| --- | --- | --- |
| {functional group} | {file.ext} | {n} | {prefix} | {notable routes} | {auth level} |

{Repeat per project}

---

## 4. Non-HTTP Triggers

| Project | Trigger Type | Function / Handler | Source / Binding | Connection Config | File Path |
| --- | --- | --- | --- | --- | --- |
| {project} | {EventHub / Blob / Timer / etc.} | {function name} | {source details} | {config key} | {path} |

---

## 5. WebSocket and Real-Time Endpoints

| Project | Technology | Endpoint Path | Auth | Key Operations | File Path |
| --- | --- | --- | --- | --- | --- |
| {project} | {SignalR / Socket.io / gRPC} | {path} | {auth} | {methods} | {path} |

---

## 6. CLI and Console Entry Points

| Project | Tool / Framework | Purpose | Invocation | File Path |
| --- | --- | --- | --- | --- |
| {project} | {tool} | {what it does} | {how to run it} | {path} |

---

## 7. Scheduled Jobs and Background Workers

| Project | Type | Schedule / Trigger | Purpose | File Path |
| --- | --- | --- | --- | --- |
| {project} | {timer / worker / hosted service} | {cron / continuous} | {what it does} | {path} |

{If none found, state explicitly:}
**No scheduled jobs or background workers found in any project.**
This is notable because {reason — e.g., common needs like data cleanup
and aggregation are unaccounted for}.

---

## 8. Auth Pattern Summary

| Auth Level | Endpoint Count | Projects |
| --- | ---:| --- |
| Anonymous | {n} | {which projects} |
| API Key / Function Key | {n} | {which projects} |
| JWT Bearer | {n} | {which projects} |
| Role-based (RBAC) | {n} | {which projects} |
| Internal / System | {n} | {which projects} |

---

## 9. Key Findings

| # | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| 1 | {description} | {file paths / counts} | {why it matters for downstream skills} |

---

## 10. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {what needs checking} | {why it's uncertain} | {what breaks downstream} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (HTTP Entry Points):** Adapter provides framework-specific patterns for finding endpoints. The generic patterns cover the most common frameworks, but adapters can identify non-obvious patterns (e.g., Azure Functions with custom routing, Spring WebFlux reactive endpoints, Django class-based views, Rails concern-based routing).
- **Step 3 (Event Triggers):** Adapter provides trigger attribute patterns specific to the cloud platform or message broker in use.
- **Step 7 (Auth Classification):** Adapter knows how auth is typically configured in the framework (e.g., ASP.NET Core `[Authorize]` attribute vs. Spring Security `@PreAuthorize` vs. Django `@permission_required`).

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| HTTP endpoint exists | File path + route attribute/decorator + HTTP method |
| Endpoint count | Actual count from scanning function/controller files (not estimates) |
| Trigger exists | File path + trigger attribute/decorator + source/binding |
| Auth level | Auth attribute/decorator on endpoint OR auth configuration in startup/config |
| Auth absent | Explicit `Anonymous` or `AllowAnonymous` attribute, OR no auth configuration found with paths searched |
| Scheduled job exists | File path + schedule expression + trigger type |
| No scheduled jobs | List of patterns searched (TimerTrigger, cron, @Scheduled, etc.) and directories scanned |
| Health endpoint | File path + route + anonymous auth confirmation |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I'll just count the HTTP endpoints, that's what matters" | Non-HTTP triggers (event hubs, blob triggers, change feeds, timers) often contain the most critical business logic. A system with 100 HTTP endpoints and 3 event triggers may have its most important processing in those 3 triggers. Count everything. |
| "The API documentation already lists all endpoints" | API docs go stale. Endpoints get added without updating docs. Internal/system endpoints are almost never documented. Scan the code, not the docs. |
| "Auth is a cross-cutting concern, I don't need to classify it per endpoint" | Auth classification per endpoint is what `02-actors-and-boundaries` needs to identify actors. An endpoint with anonymous access and one with RBAC imply different actors. Classify each. |
| "Health endpoints aren't real entry points" | Missing health endpoints on production services is a monitoring gap. Present health endpoints reveal the deployment architecture. Always record them. |
| "This project is just a library, I can skip it" | Shared libraries sometimes contain background workers, startup hooks, or middleware that registers entry points. Verify that a library truly has no entry points before skipping. |
| "I found the controllers, that's all the endpoints" | Controllers are the obvious ones. Event handlers, background workers, SignalR hubs, change feed processors, blob triggers — these are the non-obvious entry points that get missed. Scan all trigger types. |

## Red Flags

- Listing only HTTP endpoints and ignoring event/message triggers
- Endpoint counts that don't match across the summary table and the detailed sections
- Projects listed in recon that aren't scanned for entry points (every project must be accounted for)
- No auth classification on endpoints
- Missing the "no scheduled jobs found" observation when it's architecturally significant
- Health endpoints not recorded (or inconsistent health endpoint coverage not flagged)
- Copy-pasting route patterns from README/docs without verifying against source code
- Entry point counts that look rounded or estimated

## Verification

Before marking this skill complete, confirm:

- [ ] Every project from `outputs/00-recon.md` Section 4 is scanned for entry points
- [ ] Projects with zero entry points are explicitly noted with the reason (library, tooling, etc.)
- [ ] All HTTP endpoints are recorded with file path, method, route, and auth level
- [ ] All non-HTTP triggers are recorded with file path, trigger type, source, and connection config
- [ ] WebSocket/real-time endpoints are recorded (or explicitly absent)
- [ ] CLI/console entry points are recorded (or explicitly absent)
- [ ] Scheduled jobs and background workers are recorded (or explicitly absent with significance noted)
- [ ] Auth levels are classified for all endpoints
- [ ] Summary table totals are reconcilable (categories sum to total)
- [ ] Key findings section identifies at least one pattern or concern
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/01-entry-points.md`
- [ ] Output file follows the required structure from the Output Format section
