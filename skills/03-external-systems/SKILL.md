---
name: 03-external-systems
description: >
  Maps every external system the codebase communicates with -- databases,
  third-party APIs, cloud services, identity providers, message brokers,
  caches, and observability platforms. Uses package references, connection
  strings, configuration files, and HTTP client patterns as evidence.
  Classifies each by type and access direction. Use after
  02-actors-and-boundaries when you need to complete the C4 Context
  diagram and prepare for container analysis.
---

# External Systems

Maps every external dependency the system communicates with by scanning package references, connection strings, configuration files, and HTTP service client patterns. Each external system is classified by type, access direction, and which projects use it.

Without this step, the C4 Context diagram will be incomplete (missing external systems the platform depends on), and the Container diagram will lack the data stores, message brokers, and identity providers that containers connect to.

## Pipeline Position

| Attribute       | Value                                                   |
| --------------- | ------------------------------------------------------- |
| **Stage**       | 2 — Structure                                           |
| **Skill**       | 03-external-systems                                     |
| **Runs after**  | `02-actors-and-boundaries`                              |
| **Runs before** | `04-containers`                                         |
| **Required by** | `04-containers`, `05-components`, `07-data-model`, `09-dependencies`, `13-documentation` |

## Inputs

### Required
- `outputs/00-recon.md` — Section 3 (Technology Stack) for knowing which package managers to scan, and Section 4 (Project Organization) for the project list
- `outputs/02-actors-and-boundaries.md` — Section 4 (System Boundary), specifically the "Outside the Boundary" table as a starting point for external systems

### Optional (improves results)
- `outputs/01-entry-points.md` — Section 4 (Non-HTTP Triggers) for event/message source references
- Stack adapter for the detected technology (provides package-to-system mapping)
- Configuration files (appsettings, environment configs, .env files)

## When to Use

**Use when:**
- Starting the Structure stage after completing Reconnaissance
- You need to complete the C4 Context diagram (which shows external systems)
- You need to understand what infrastructure the system depends on
- You're preparing for container analysis and need to know which stores/services containers connect to

**Do not use when:**
- `02-actors-and-boundaries` has not been run (you need the boundary definition)
- You're only interested in internal architecture (though external dependencies shape internal design)

## Process

### Step 1: Load Upstream Context

Read the upstream outputs. Extract:
- **From `00-recon.md`:** Technology stack (to know which package managers to scan), project list with directories
- **From `02-actors-and-boundaries.md`:** The "Outside the Boundary" table as a seed list of already-identified external systems
- **From `01-entry-points.md` (if available):** Non-HTTP trigger sources (event hubs, blob containers, change feeds) which imply external systems

```
CHECKPOINT: The agent must have the project list, tech stack, and
boundary definition loaded before scanning for external systems.
```

### Step 2: Scan Package References

For each project, scan the dependency manifest for packages that indicate external system communication:

| Package Manager | File to Scan | What to Look For |
| --- | --- | --- |
| NuGet (.NET) | `*.csproj` files | `<PackageReference Include="..." Version="..." />` |
| npm (Node.js) | `package.json` | `dependencies` and `devDependencies` objects |
| pip (Python) | `requirements.txt`, `pyproject.toml`, `Pipfile` | Package names with versions |
| Maven (Java) | `pom.xml` | `<dependency>` elements with `groupId` and `artifactId` |
| Gradle (Java/Kotlin) | `build.gradle`, `build.gradle.kts` | `implementation`, `api`, `compileOnly` declarations |
| Bundler (Ruby) | `Gemfile` | `gem` declarations |
| Cargo (Rust) | `Cargo.toml` | `[dependencies]` section |

For each package found, determine if it maps to an external system. Focus on:
- **Database drivers:** MongoDB, PostgreSQL, MySQL, Redis, Cosmos DB, DynamoDB, Elasticsearch
- **Message broker clients:** EventHubs, Kafka, RabbitMQ, Service Bus, SQS, SNS
- **Cloud service SDKs:** Azure SDK, AWS SDK, Google Cloud SDK packages
- **Identity providers:** OAuth libraries, JWT libraries, OIDC packages, Okta/Auth0/Azure AD SDKs
- **Observability:** Application Insights, OpenTelemetry, Datadog, New Relic, Sentry
- **External API clients:** HTTP client wrappers for specific services (Power BI, Stripe, Twilio, SendGrid)

Record: package name, version, project that references it, and the external system it maps to.

If a stack adapter is loaded, consult its "Package-to-System Mapping" section for framework-specific mappings.

### Step 3: Scan Configuration Files

Search for connection strings, service endpoints, and API keys in configuration files:

| Technology | Where to Look |
| --- | --- |
| .NET | `appsettings.json`, `appsettings.*.json`, `local.settings.json`, `launchSettings.json` |
| Node.js | `.env`, `.env.*`, `config/`, environment-specific configs |
| Python | `.env`, `settings.py`, `config.py`, `config/*.yaml` |
| Java / Spring | `application.properties`, `application.yml`, `application-*.yml` |
| Rails | `config/database.yml`, `config/credentials.yml.enc` |

For each configuration entry, look for:
- **Connection strings** (database hosts, ports, credentials)
- **Service endpoint URLs** (base URIs for external APIs)
- **API keys and subscription keys** (headers for external services)
- **Queue/topic/hub names** (message broker bindings)
- **Storage account references** (blob, file, queue storage)

Cross-reference with the packages found in Step 2 — a package without a connection string is suspicious (may be unused), and a connection string without a package is also suspicious (may indicate a direct HTTP client).

```
CHECKPOINT: Every database driver package must have a corresponding
connection string or config reference. If not, flag as [NEEDS
VERIFICATION] — the dependency may be unused or configured at
runtime via secret injection.
```

### Step 4: Scan for HTTP Service Clients

Many external systems are accessed via plain HTTP without a dedicated SDK. Search for:

| Pattern | What It Indicates |
| --- | --- |
| `HttpClient` / `IHttpClientFactory` with named clients | External API calls configured via DI |
| Base URI configuration (e.g., `ServiceClients:*` sections) | Multiple external service endpoints |
| REST client libraries (`RestSharp`, `Refit`, `axios`, `requests`, `fetch`) | HTTP-based integrations |
| gRPC channel configuration | gRPC service connections |
| SOAP/WCF client proxies | Legacy service integrations |

For each HTTP service client found:
- **Endpoint URL or config key** where the URL is defined
- **Which project** uses it
- **What it calls** (infer from route patterns, method names, or config key names)
- **Authentication** (API key header, bearer token, basic auth, none)

These are often the hardest external systems to find because they don't show up in package scans.

```
CHECKPOINT: If the system has a BFF or API gateway pattern, there
will be outbound HTTP calls to downstream services. Every outbound
service client must be mapped to an external system. If the BFF
has 10 service client configurations but you only found 5 external
systems, the other 5 are missing.
```

### Step 5: Classify External Systems

For each external system identified, classify it:

| Classification | Examples |
| --- | --- |
| **Data store** | SQL databases, NoSQL databases, graph databases, blob storage, file storage |
| **Cache** | Redis, Memcached, CDN |
| **Messaging** | Event Hub, Kafka, RabbitMQ, Service Bus, SQS, SNS |
| **Identity & security** | Okta, Azure AD, Auth0, Key Vault, certificate authorities |
| **API gateway** | APIM, Kong, AWS API Gateway, Nginx (as gateway) |
| **Observability** | Application Insights, Log Analytics, Datadog, Prometheus, Grafana |
| **Compute** | External serverless functions, third-party webhooks, partner APIs |
| **Analytics** | Power BI, Tableau, Looker |
| **Infrastructure** | DNS, CDN, load balancers, traffic managers |
| **Adjacent service** | Microservices with source code NOT in scope but owned by the same organization |

For each, also record the **access direction:**
- **READ** — the system only reads from this external system
- **WRITE** — the system only writes to this external system
- **READ+WRITE** — bidirectional

### Step 6: Cross-Reference with Boundary Definition

Compare the external systems found here with the "Outside the Boundary" table from `outputs/02-actors-and-boundaries.md`:

- **Systems in both:** Good — confirm and enrich with package/config details
- **Systems in S-02 but not found here:** Investigate — were they missed in the scan, or were they incorrectly classified as external?
- **Systems found here but not in S-02:** These are new discoveries — add them and note they weren't caught during boundary analysis

Flag any discrepancies.

### Step 7: Build Package-to-System Mapping

Create a summary table that maps every relevant package to its external system. This becomes a reusable reference for downstream skills (especially `09-dependencies`).

### Step 8: Compile External Systems Output

Assemble all findings into the output file following the Output Format below.

## Output Format

This skill produces a single Markdown file: `outputs/03-external-systems.md`

### Required Structure

```markdown
# External Systems — {System Name}

> **Pipeline stage:** 03-external-systems
> **Date:** {date}
> **Input:** outputs/00-recon.md, outputs/01-entry-points.md, outputs/02-actors-and-boundaries.md
> **Scope:** {list of repositories/projects}

---

## 1. Extraction Method

Brief description of the scanning approach: which package managers, config
files, and code patterns were used.

---

## 2. External Systems Inventory

### {ES-ID}: {System Name}

| Attribute | Value |
| --- | --- |
| **Purpose** | {what this external system does for the platform} |
| **Classification** | {data store / cache / messaging / identity / gateway / observability / compute / analytics / adjacent service} |
| **Packages** | {package names with versions} |
| **Projects** | {which projects reference it} |
| **Config keys** | {connection string names, endpoint config keys} |
| **Access direction** | {READ / WRITE / READ+WRITE} |
| **Evidence** | {specific file paths, class names, method calls that prove usage} |

{Repeat for each external system, numbered ES-01, ES-02, etc.}

---

## 3. Package-to-System Mapping

| Package / Library | Version | → External System |
| --- | --- | --- |
| {package name} | {version} | {ES-ID}: {system name} |

---

## 4. Configuration-to-System Mapping

| Config Key / Section | File Path | → External System |
| --- | --- | --- |
| {key name} | {config file path} | {ES-ID}: {system name} |

---

## 5. Cross-Reference with Boundary Definition

| External System | In S-02 Boundary? | In S-03 Scan? | Status |
| --- | --- | --- | --- |
| {name} | {yes/no} | {yes/no} | {confirmed / new discovery / discrepancy} |

---

## 6. Summary

| Classification | Count | Systems |
| --- | --- | --- |
| Data store | {n} | {list} |
| Cache | {n} | {list} |
| Messaging | {n} | {list} |
| Identity & security | {n} | {list} |
| API gateway | {n} | {list} |
| Observability | {n} | {list} |
| Compute / adjacent service | {n} | {list} |
| Analytics | {n} | {list} |
| **Total** | **{n}** | |

---

## 7. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {finding} | {uncertainty reason} | {downstream consequence} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 2 (Package References):** Adapter provides a pre-built package-to-system mapping table specific to the ecosystem. For example, the `.NET` adapter maps `Gremlin.Net` → Cosmos DB (Gremlin API), `Microsoft.Azure.Devices` → Azure IoT Hub, `StackExchange.Redis` → Redis Cache. The `java-spring` adapter maps `spring-boot-starter-data-mongodb` → MongoDB, `spring-kafka` → Kafka.
- **Step 3 (Configuration Files):** Adapter knows the configuration conventions for the framework. For example, the `.NET` adapter knows that `local.settings.json` is Azure Functions-specific and that `AppConfigs:*` sections often map to Azure App Configuration sources.
- **Step 4 (HTTP Service Clients):** Adapter knows common HTTP client patterns. For example, the `.NET` adapter looks for `IHttpClientFactory` named registrations and `ServiceClients:*` configuration sections.

## Evidence Standards

| Claim Type | Acceptable Evidence |
| --- | --- |
| External system exists | Package reference + config entry + code usage (file path for each) |
| System classification | Based on the service type (database driver = data store, etc.) |
| Access direction | Code-level evidence: read methods (GET, query, fetch) vs. write methods (POST, send, insert, upsert) |
| System is unused | Package present but no config entry AND no code usage found (list where you searched) |
| Adjacent service | HTTP client configuration with base URI + absence of source code in scoped repositories |
| Package-to-system mapping | Package documentation or SDK name that directly identifies the service |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can see the databases from the connection strings, that's enough" | Connection strings reveal databases but miss HTTP-based services (partner APIs, adjacent microservices, analytics platforms) that don't have connection strings. Scan all three sources: packages, config, and HTTP clients. |
| "Adjacent services are internal, not external" | If their source code isn't in the scoped repositories, they're external for the purposes of this analysis. You can't analyze what you can't read. Classify them as "adjacent service" and flag for boundary clarification. |
| "DevDependencies / test packages don't matter" | Usually correct, but some test packages reveal external dependencies (test containers, mock servers for specific services). Scan them but separate production from test dependencies in the output. |
| "The config file has placeholder values, I can't tell what service it connects to" | Placeholder values still indicate an external dependency exists. Record the config key, note the placeholder, and flag as [NEEDS VERIFICATION]. The dependency is real even if the endpoint is unknown. |
| "This package is probably unused, I'll skip it" | Never assume a package is unused without evidence. Check for code imports/usage. If truly unused, record it as a finding — dead dependencies are tech debt worth documenting. |

## Red Flags

- External systems identified only from packages, with no config or code evidence
- Missing the HTTP service client scan (Step 4) — this is where "hidden" external systems live
- No cross-reference with S-02's boundary definition (Step 6)
- Adjacent services not identified (microservices called via HTTP that aren't in the scoped repos)
- Classification missing or generic ("external service" instead of specific type)
- Access direction not determined for each system
- Config keys listed without the file path where they were found
- Package scan that only covers one project in a multi-project repo

## Verification

Before marking this skill complete, confirm:

- [ ] Every project from `outputs/00-recon.md` Section 4 has been scanned for package references
- [ ] Every relevant package is mapped to an external system
- [ ] Configuration files have been scanned for connection strings and service endpoints
- [ ] HTTP service clients have been identified and mapped to external systems
- [ ] Every external system has: ID, purpose, classification, packages, projects, config keys, access direction, and evidence
- [ ] Package-to-system mapping table is complete
- [ ] Configuration-to-system mapping table is complete
- [ ] Cross-reference with S-02 boundary definition is done and discrepancies flagged
- [ ] Summary table counts match the detailed inventory
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/03-external-systems.md`
- [ ] Output file follows the required structure from the Output Format section
