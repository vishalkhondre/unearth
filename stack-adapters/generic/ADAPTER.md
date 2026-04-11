# Generic Stack Adapter

Stack-agnostic pattern detection hints for codebases that do not match any specific stack adapter. Use this adapter when the codebase uses a less common framework, a custom stack, multiple languages, or when no other adapter's fingerprint matches. These hints rely on universal software patterns rather than framework-specific conventions.

## When to Use

Apply this adapter when:

- No other stack adapter's fingerprint matches (fewer than two signals confirmed)
- The codebase mixes multiple languages or frameworks without a dominant stack
- The framework is uncommon or custom-built (e.g., Elixir/Phoenix, Go/Gin, Rust/Actix, Scala/Play)
- The codebase is primarily scripts, CLIs, or libraries rather than a web application
- You are unsure which adapter to use -- start here and switch if a better match emerges

---

## Skill Hooks

### 00-recon

**Project detection (language-agnostic):**
- Build files: `Makefile`, `CMakeLists.txt`, `build.sh`, `justfile`, `Taskfile.yml`
- Package managers: `go.mod` (Go), `Cargo.toml` (Rust), `mix.exs` (Elixir), `build.sbt` (Scala), `composer.json` (PHP), `Package.swift` (Swift)
- Monorepo markers: `Makefile` at root with directory targets, `Earthfile`, `Bazel` BUILD files, `pants.toml`
- Language detection: scan file extensions -- `.go`, `.rs`, `.ex`, `.scala`, `.php`, `.swift`, `.kt`, `.dart`
- CI/CD: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `bitbucket-pipelines.yml`
- Containerization: `Dockerfile`, `docker-compose.yml`, `Containerfile`
- Infrastructure-as-code: `terraform/`, `pulumi/`, `cdk/`, `cloudformation/`, `ansible/`

**Framework detection (by language):**
- Go: `gin`, `echo`, `chi`, `fiber`, `net/http` in imports
- Rust: `actix-web`, `axum`, `rocket`, `warp` in Cargo.toml
- Elixir: `phoenix` in mix.exs
- Scala: `play-server`, `akka-http`, `http4s` in build.sbt
- PHP: `laravel/framework`, `symfony/framework-bundle` in composer.json
- Kotlin: `ktor`, `spring-boot` in build.gradle.kts
- Dart/Flutter: `pubspec.yaml` with `flutter` SDK

**Deployment signals (universal):**
- `Dockerfile` -- containerized deployment
- `kubernetes/`, `k8s/`, `helm/` -- Kubernetes manifests
- `serverless.yml`, `sam-template.yml`, `template.yaml` -- serverless (any language)
- `fly.toml` -- Fly.io deployment
- `render.yaml` -- Render deployment
- `railway.json` -- Railway deployment
- `nixpacks.toml` -- Nixpacks build configuration
- `.platform/` -- Platform.sh configuration

---

### 01-entry-points

**HTTP endpoints (universal detection):**
- Search for route registration patterns: function calls that bind HTTP methods to paths
- Look for common path patterns: `/api/`, `/v1/`, `/health`, `/webhook`
- Search for HTTP method keywords: `GET`, `POST`, `PUT`, `DELETE`, `PATCH` in route definitions
- Check for OpenAPI/Swagger specification files: `openapi.yaml`, `swagger.json`
- Look for API gateway configuration: `kong.yml`, `tyk.json`, API Gateway CloudFormation

**Language-specific route patterns:**
- Go: `r.GET("/path", handler)` (gin), `e.GET("/path", handler)` (echo), `http.HandleFunc` (stdlib)
- Rust: `web::get().to(handler)` (actix), `.route("/path", get(handler))` (axum)
- Elixir: `get "/path", Controller, :action` in router.ex (Phoenix)
- PHP: Route definitions in `routes/web.php` or `routes/api.php` (Laravel), `config/routes.yaml` (Symfony)
- Kotlin: `get("/path") { ... }` (Ktor), `@GetMapping` (Spring)
- Scala: `GET /path controllers.Controller.action` in conf/routes (Play)

**Event and message handlers (universal):**
- Search for message consumer patterns: subscribe, consume, listen, handle, process
- Queue worker entry points: worker commands, consumer scripts
- Pub/sub subscriber registrations
- Webhook receiver endpoints (usually POST routes)
- File watchers and directory monitors

**Scheduled jobs (universal):**
- Cron expressions in configuration files
- Scheduler configuration: `crontab`, scheduler libraries, cloud scheduler configs
- Periodic task definitions
- Timer-based execution patterns

**CLI commands (universal):**
- Entry points with argument parsing: `argparse`, `cobra`, `clap`, `OptionParser`
- `bin/` directory with executable scripts
- Package.json `bin` field, `console_commands`, management commands

---

### 02-actors-and-boundaries

**Authentication patterns (universal):**
- JWT: look for token verification, `Authorization: Bearer` header parsing, JWT library imports
- API key: header or query parameter key validation middleware
- OAuth2: authorization code flow, token exchange, refresh token handling
- Session: cookie-based session management, session store configuration
- mTLS: client certificate validation configuration
- Basic auth: `Authorization: Basic` header handling

**Authorization patterns (universal):**
- Role checks: comparisons against role names or enums
- Permission checks: bitfield operations, permission string matching
- Policy objects or guard functions
- Middleware that rejects requests based on user attributes
- Admin/superuser bypass patterns

**API boundary indicators:**
- CORS configuration (any framework)
- Rate limiting middleware or configuration
- API versioning (URL, header, or content-type based)
- Authentication middleware applied to route groups
- Public vs. authenticated route separation

---

### 03-external-systems

**Database connections (universal):**
- Connection strings: look for `DATABASE_URL`, `DB_HOST`, `POSTGRES_*`, `MYSQL_*` env vars
- ORM configuration files with host/port/database settings
- Driver imports: `pg`, `mysql`, `sqlite`, `mongodb`, `redis` library names
- Connection pool configuration: pool size, timeout, idle connections

**Message broker connections (universal):**
- Connection URLs: `amqp://`, `kafka://`, `redis://`, `nats://` patterns
- Broker client library imports
- Topic/queue name definitions
- Consumer group configurations

**External HTTP clients (universal):**
- HTTP client library imports with base URL configuration
- Environment variables with `_URL`, `_ENDPOINT`, `_API_KEY` suffixes
- SDK imports for external services (cloud providers, SaaS APIs)
- Webhook sender implementations

**Cloud service integrations (universal):**
- AWS: `AWS_*` env vars, `aws-sdk` imports (any language variant)
- GCP: `GOOGLE_*` env vars, `google-cloud` imports
- Azure: `AZURE_*` env vars, `azure-` imports
- Generic: S3-compatible (MinIO), SMTP configuration, external OAuth providers

---

### 04-containers

**Container identification (universal):**
- Each `Dockerfile` or service in `docker-compose.yml` is typically one container
- Separate processes with their own entry points (web server vs worker vs scheduler)
- Kubernetes Deployment manifests define container boundaries
- Separate build outputs or binaries

**Inter-container communication (universal):**
- HTTP calls between services (look for internal service URLs)
- Shared message queues and topics
- gRPC service definitions (`.proto` files)
- Shared databases (same connection strings across services)
- Service mesh configuration (Istio, Linkerd)
- DNS-based service discovery patterns

**Shared library detection (universal):**
- Directories without their own entry point or Dockerfile
- Internal package references in dependency files
- Common/shared/lib directories imported by multiple services
- Compiled libraries or packages published to internal registries

---

### 05-components

**Layer detection (universal):**
- Handlers / Controllers / Routes: request handling, input validation, response formatting
- Services / Use Cases / Commands: business logic orchestration
- Repositories / DAOs / Stores: data persistence abstraction
- Models / Entities / Domain: domain objects and business rules
- Middleware / Interceptors / Filters: cross-cutting concerns
- Infrastructure / Adapters: external system integration code
- DTOs / Schemas / Types: data transfer and validation structures

**Component boundary detection (universal):**
- Directory structure: feature-based (`features/billing/`) or layer-based (`services/`, `controllers/`)
- Namespace or module declarations
- Interface or trait definitions that create seams
- Dependency injection container registrations
- Module or plugin registration patterns

**God class signals (universal):**
- Source files > 500 lines
- Classes/modules with > 15 public methods
- Functions > 100 lines
- Files importing > 15 internal modules
- Deeply nested directory structures with single files handling many concerns

**Test detection (universal):**
- Test directories: `test/`, `tests/`, `spec/`, `__tests__/`
- Test file naming: `*_test.*`, `*_spec.*`, `test_*.*`, `*.test.*`
- Test framework configuration files
- Fixture/factory directories
- CI configuration with test commands

---

### 06-capabilities

**Capability signals (universal):**
- Feature directories or modules often map to capabilities
- Route groupings by URL prefix
- README or documentation describing product features
- API documentation tag groupings
- Database table groupings by naming prefix

---

### 07-data-model

**Entity detection (universal):**
- ORM model definitions (any ORM)
- Database migration files showing schema evolution
- SQL DDL files (`CREATE TABLE` statements)
- Schema files: `schema.prisma`, `db/schema.rb`, OpenAPI schema definitions
- Protobuf `.proto` files define message structures
- GraphQL schema `.graphql` files define types and relationships

**Relationship detection (universal):**
- Foreign key definitions in migrations or models
- Naming conventions: `*_id` columns suggest relationships
- Join table names: `users_roles`, `order_items` suggest many-to-many
- Nested object structures in API responses suggest composition
- Reference fields in document databases

---

### 08-patterns

**Universal patterns to detect:**
- Repository pattern: data access abstraction with defined interfaces
- Service layer: business logic separated from request handling
- CQRS: separate read and write paths
- Event sourcing: event store with event replay capability
- Pub/sub: event publishing and subscription
- Saga/Process manager: multi-step distributed transactions
- Strategy: swappable implementations behind a common interface
- Factory: object creation encapsulation
- Observer: event notification chains
- Middleware/Pipeline: chained request/response processing
- Circuit breaker: fault tolerance with fallback behavior

**Universal anti-patterns to detect:**
- God class: single file or class doing too many things
- Distributed monolith: microservice structure with tight coupling
- Anemic domain model: entities with no behavior (only getters/setters)
- Circular dependencies: modules that import each other
- Configuration in code: hardcoded URLs, credentials, or magic numbers
- Missing error handling: unhandled exceptions, ignored errors
- Inconsistent patterns: different architectural styles across similar components
- Copy-paste code: duplicated logic across files

---

### 09-dependencies

**Dependency analysis (universal):**
- Parse the language-specific dependency file for all declared dependencies
- Check for lock files to identify resolved versions
- Flag known deprecated or EOL packages
- Identify internal vs external dependencies
- Look for dependency scanning tools in CI configuration (`snyk`, `dependabot`, `renovate`)

**Version risk assessment (universal):**
- Check language/runtime version against EOL dates
- Check framework version against EOL dates
- Look for major version gaps between current and latest stable
- Identify packages with no releases in > 2 years (potentially abandoned)

---

## Detection Strategy

Since this adapter cannot rely on framework-specific conventions, use this approach:

1. **Start with the build system.** The package manager and build tool reveal the language and initial dependency set.
2. **Scan dependency lists.** Framework libraries in the dependency file narrow down the architecture style.
3. **Read the entry point.** The `main` function, `Dockerfile CMD`, or startup script reveals the application structure.
4. **Follow the route registration.** Find where HTTP routes are defined and trace inward to understand layering.
5. **Map the directory tree.** The top-level directory structure reveals whether the codebase uses feature-based or layer-based organization.
6. **Check for configuration files.** Database, cache, queue, and external service configuration reveals the infrastructure topology.

If, during this process, you identify a dominant framework that matches a specific stack adapter (e.g., you find `@SpringBootApplication` suggesting Java/Spring), switch to that adapter for more precise hints.
