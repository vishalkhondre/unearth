---
name: dotnet
stack: ".NET / C# / ASP.NET Core / Azure Functions"
languages:
  - C#
frameworks:
  - ASP.NET Core
  - Azure Functions (Isolated Worker)
  - Azure Functions (In-Process)
package_manager: NuGet
---

# .NET Stack Adapter

Pattern detection hints for .NET, C#, ASP.NET Core, and Azure Functions codebases. Load this adapter after `00-recon` detects .NET as the primary technology.

## S-00: Recon Hints

### Project Detection
- Each `.csproj` file is a project. Read the `<Sdk>` attribute to determine type:
  - `Microsoft.NET.Sdk` — class library or console app
  - `Microsoft.NET.Sdk.Web` — ASP.NET Core web app
  - `Microsoft.NET.Sdk.Worker` — background worker service
- `<OutputType>Exe</OutputType>` — standalone executable (container candidate)
- `<OutputType>Library</OutputType>` or no OutputType — shared library (not a container)
- `.sln` file at root lists all projects in the solution

### Framework Version Detection
- `<TargetFramework>net7.0</TargetFramework>` — .NET 7 (EOL May 2024)
- `<TargetFramework>net8.0</TargetFramework>` — .NET 8 LTS (supported until Nov 2026)
- `<TargetFramework>net9.0</TargetFramework>` — .NET 9 STS
- `<AzureFunctionsVersion>v4</AzureFunctionsVersion>` — Azure Functions v4

### Build System
- `Directory.Build.props` — shared build properties across all projects
- `global.json` — SDK version pinning
- `nuget.config` — custom NuGet feed configuration

## S-01: Entry Point Hints

### HTTP Entry Points
- **ASP.NET Core Controllers:** Classes inheriting `ControllerBase` or `Controller` with `[ApiController]`, `[Route]` attributes. Methods have `[HttpGet]`, `[HttpPost]`, etc.
- **ASP.NET Core Minimal APIs:** `app.MapGet(...)`, `app.MapPost(...)` in `Program.cs`
- **Azure Functions HTTP:** Methods with `[Function("name")]` + `HttpRequestData` parameter or `[HttpTrigger]` attribute

### Non-HTTP Entry Points
- **Azure Functions Event Hub:** `[EventHubTrigger("hubName")]` parameter
- **Azure Functions Blob:** `[BlobTrigger("container/{name}")]` parameter
- **Azure Functions Timer:** `[TimerTrigger("cron")]` parameter
- **Azure Functions Cosmos DB Change Feed:** `[CosmosDBTrigger]` parameter
- **Azure Functions Queue:** `[QueueTrigger("queueName")]` parameter
- **Azure Functions Service Bus:** `[ServiceBusTrigger("topic")]` parameter
- **SignalR Hub:** Classes inheriting `Hub` or `Hub<T>` with `[Authorize]` attributes
- **Background services:** Classes inheriting `BackgroundService` or `IHostedService`

### Auth Detection
- `[Authorize]` attribute — requires authentication
- `[Authorize(Policy="...")]` — requires specific policy
- `[AllowAnonymous]` — explicitly unauthenticated
- `AuthorizationLevel.Function` — Azure Functions key auth (not user auth)
- `AuthorizationLevel.Anonymous` — no auth (health probes)

## S-02: Actor Detection Hints

### Auth Patterns
- JWT Bearer: `AddAuthentication().AddJwtBearer()` in `Program.cs` or `Startup.cs`
- Okta: `@okta/*` npm packages (frontend), `Microsoft.AspNetCore.Authentication.JwtBearer` with Okta issuer config
- Azure AD: `AddMicrosoftIdentityWebApi()` or `Azure.Identity` with `ClientSecretCredential`
- Custom middleware: `IAuthorizationHandler` implementations
- SignalR auth: `[Authorize]` on Hub class, JWT token via query string

## S-03: Package-to-System Mapping

| NuGet Package | External System | Classification |
| --- | --- | --- |
| `MongoDB.Driver`, `MongoDB.Bson` | MongoDB / Cosmos DB (MongoDB API) | Data store |
| `Gremlin.Net`, `Gremlin.Net.CosmosDb` | Cosmos DB (Gremlin API) | Data store |
| `Microsoft.Azure.Cosmos` | Cosmos DB (SQL/Core API) | Data store |
| `Microsoft.EntityFrameworkCore.*` | SQL Server / PostgreSQL / SQLite | Data store |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL | Data store |
| `StackExchange.Redis` | Redis Cache | Cache |
| `Microsoft.Azure.StackExchangeRedis` | Azure Redis Cache | Cache |
| `Azure.Messaging.EventHubs` | Azure Event Hub | Messaging |
| `Azure.Messaging.ServiceBus` | Azure Service Bus | Messaging |
| `Microsoft.Azure.Functions.Worker.Extensions.EventHubs` | Azure Event Hub (Functions binding) | Messaging |
| `Microsoft.Azure.Devices`, `Microsoft.Azure.Devices.Client` | Azure IoT Hub | Compute |
| `Azure.Storage.Blobs` | Azure Blob Storage | Data store |
| `Azure.Storage.Queues` | Azure Queue Storage | Messaging |
| `Azure.Security.KeyVault.Secrets` | Azure Key Vault | Identity & security |
| `Azure.Extensions.AspNetCore.Configuration.Secrets` | Azure Key Vault (config) | Identity & security |
| `Microsoft.Extensions.Configuration.AzureAppConfiguration` | Azure App Configuration | Infrastructure |
| `Microsoft.ApplicationInsights.*` | Application Insights | Observability |
| `Azure.Monitor.Query` | Azure Log Analytics | Observability |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | OIDC Identity Provider | Identity & security |
| `Microsoft.Identity.Web` | Azure AD / Entra ID | Identity & security |
| `Microsoft.PowerBI.Api` | Power BI Service | Analytics |
| `Microsoft.AspNetCore.SignalR` | SignalR (internal hub) | Messaging |
| `Polly` | (Resilience library — not an external system) | — |
| `FluentValidation` | (Validation library — not an external system) | — |
| `MediatR` | (Mediator pattern — not an external system) | — |
| `AutoMapper` | (Mapping library — not an external system) | — |

## S-04: Container Detection Hints

### What Makes a Container
- `.csproj` with `<OutputType>Exe</OutputType>` + `<AzureFunctionsVersion>` = Azure Function App container
- `.csproj` with `Microsoft.NET.Sdk.Web` + `Program.cs` with `WebApplication.CreateBuilder` = ASP.NET Core web app container
- `.csproj` with `Microsoft.NET.Sdk.Worker` = background worker container
- Angular/React project with `package.json` + build output = SPA container

### What Is NOT a Container
- `.csproj` with `<OutputType>Library</OutputType>` or no OutputType = shared library
- Test projects (`*.Tests.csproj`, `*.UnitTests.csproj`) = not deployed
- Projects ending in `.Common`, `.Shared`, `.Core` (by convention) = typically shared libraries

### Deployment Target Detection
- CI/CD task `AzureFunctionApp@2` = Azure Function App
- CI/CD task `AzureRmWebAppDeployment@4` = Azure App Service
- `Dockerfile` present = containerized deployment
- `Kubernetes` / `Helm` manifests = Kubernetes deployment

## S-05: Layer Detection Hints

### Standard .NET Layers

| Directory Name | Layer | What It Contains |
| --- | --- | --- |
| `Functions/` | Entry | Azure Functions HTTP/event triggers |
| `Controllers/` | Entry | ASP.NET Core API controllers |
| `Hubs/` | Entry | SignalR hubs |
| `Services/`, `Service/` | Business | Business logic and orchestration |
| `Repositories/`, `Repository/` | Data access | Database access implementations |
| `Models/`, `Model/` | Models / DTOs | Request, response, entity, and config classes |
| `Validators/`, `Validator/` | Validation | FluentValidation rule classes |
| `Config/`, `Options/` | Configuration | Options classes for IOptions pattern |
| `Helpers/`, `Utilities/` | Infrastructure | Utility and helper classes |
| `Policies/` | Infrastructure | Polly resilience policies |
| `Interfaces/`, `Interface/` | Contracts | Interface definitions |
| `Middleware/`, `Middlewares/` | Cross-cutting | HTTP pipeline middleware |
| `Extensions/` | Cross-cutting | Extension methods |

### DI Registration (how to trace dependencies)
- `Program.cs` or `Startup.cs` contains `builder.Services.AddSingleton<T>()`, `.AddScoped<T>()`, `.AddTransient<T>()` — these reveal which implementations are wired to which interfaces
- Constructor parameters show what each class depends on

## S-07: Entity Detection Hints

### MongoDB Entities
- Classes used with `IMongoCollection<T>` — the `T` is the storage entity
- Collection name in config: `MongoDbOptions:CollectionName`
- `[BsonId]`, `[BsonElement]`, `[BsonIgnore]` attributes mark MongoDB-specific fields

### Gremlin Entities
- Vertex/edge labels in Gremlin query strings: `addV('label')`, `addE('label')`
- Property access patterns: `.property('key', value)`
- Schema is implicit in query code, not in model classes

### Entity Framework Entities
- Classes referenced in `DbSet<T>` properties of a `DbContext`
- `[Table]`, `[Key]`, `[ForeignKey]`, `[Column]` attributes
- Migration files in `Migrations/` directory

## S-08: Pattern Detection Hints

### Structural Patterns

| Pattern | .NET Indicators | NOT This Pattern If |
| --- | --- | --- |
| **N-Tier** | Functions → Services → Repositories chain; no `Domain/` project; DI via constructor injection | Has separate Domain, Application, Infrastructure projects |
| **Clean Architecture** | Domain project with zero external references; Application project references only Domain; Infrastructure references both | Domain project references NuGet packages or Infrastructure |
| **CQRS** | `IRequest<T>`, `IRequestHandler<T>`, MediatR; separate Command and Query models | Functions call services directly without mediator |
| **Vertical Slices** | `Features/` directories with self-contained handler + model + validator per feature | Shared service/repository layer across features |
| **Microservices** | Each `.csproj` (Exe) has its own database; no shared `Services.Common` with business logic | Shared database connection string; shared library with domain logic |

### Domain Patterns

| Pattern | .NET Indicators |
| --- | --- |
| **Anemic Domain Model** | Entity classes in `Models/` with only properties (no methods); all logic in Service classes |
| **Rich Domain Model** | Entity classes with behavior methods (`void Cancel()`, `Result MoveTo(parent)`), value objects, domain events |
| **DDD** | `Aggregates/`, `ValueObjects/`, `DomainEvents/`, `Specifications/` directories; aggregate root pattern |

### Anti-Patterns

| Anti-Pattern | .NET Indicators |
| --- | --- |
| **God Class** | `.cs` file >500 lines; controller/function class with >10 endpoints; repository with >20 methods |
| **Fat Controller/Function** | Business logic (validation, conditional branching, data transformation) inline in controller/function methods instead of delegated to services |
| **Missing Abstraction** | Gremlin query strings built directly in service classes; MongoDB filter expressions in business logic |

## S-09: Dependency Risk Hints

### EOL Frameworks

| Framework | EOL Date | Severity |
| --- | --- | --- |
| .NET 5 | May 2022 | CRITICAL |
| .NET 6 | Nov 2024 | CRITICAL |
| .NET 7 | May 2024 | CRITICAL |
| .NET Core 3.1 | Dec 2022 | CRITICAL |
| ASP.NET Core 2.x | Aug 2021 | CRITICAL |

### Resilience Detection
- **Polly present:** Look for `Policy.Handle<>().WaitAndRetryAsync()`, `Policy.Handle<>().CircuitBreakerAsync()`, `Policy.TimeoutAsync()` — with file paths
- **Polly absent:** `HttpClient` or `IHttpClientFactory` calls without any Policy wrapper = missing resilience
- **`new HttpClient()` per request:** Socket exhaustion risk. Should use `IHttpClientFactory`

### Version Conflict Signals
- Same NuGet package with different versions across `.csproj` files in the same solution
- `<PackageReference>` version mismatches between shared library and consuming projects
- `Directory.Packages.props` absent = version management is per-project (higher conflict risk)
