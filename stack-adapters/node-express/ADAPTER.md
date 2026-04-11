# Node / Express Stack Adapter

Stack-specific pattern detection hints for Node.js codebases using Express, Fastify, NestJS, and the broader Node ecosystem. These hints help Unearth skills locate framework-specific structures faster and produce more accurate results.

## Stack Fingerprint

Confirm this adapter applies by checking for at least two of these signals:

| Signal | File / Pattern |
|---|---|
| Package manager | `package.json` in project root |
| Node runtime | `node_modules/`, `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` |
| Express | `express` in dependencies |
| NestJS | `@nestjs/core` in dependencies |
| Fastify | `fastify` in dependencies |
| TypeScript | `tsconfig.json`, `.ts` source files |

---

## Skill Hooks

### 00-recon

**Project detection:**
- Parse `package.json` for `dependencies`, `devDependencies`, `scripts`, and `engines`
- Node version: `engines.node` in package.json or `.nvmrc` / `.node-version`
- Monorepo: look for `workspaces` in package.json, `lerna.json`, `turbo.json`, `nx.json`, or `pnpm-workspace.yaml`
- TypeScript: `tsconfig.json` presence, `typescript` in devDependencies
- Entry point: `main` or `scripts.start` in package.json

**Framework detection signals:**
- `express` -- Express.js web framework
- `@nestjs/core` -- NestJS framework (opinionated, decorator-based)
- `fastify` -- Fastify high-performance framework
- `koa` -- Koa.js minimal framework
- `@hapi/hapi` -- Hapi.js framework
- `socket.io` -- WebSocket support
- `graphql`, `apollo-server-express`, `@nestjs/graphql` -- GraphQL
- `prisma`, `@prisma/client` -- Prisma ORM
- `typeorm` -- TypeORM
- `sequelize` -- Sequelize ORM
- `mongoose` -- MongoDB ODM
- `bullmq` or `bull` -- job queue
- `passport` -- authentication middleware

**Deployment signals:**
- `Dockerfile` with `node` base image -- container deployment
- `serverless.yml` or `serverless.ts` -- Serverless Framework (Lambda)
- `vercel.json` -- Vercel deployment
- `Procfile` with `web: node` -- Heroku
- `app.yaml` -- Google App Engine
- `pm2.config.js` or `ecosystem.config.js` -- PM2 process manager

---

### 01-entry-points

**HTTP endpoints (Express):**
- `app.get()`, `app.post()`, `app.put()`, `app.delete()`, `app.patch()` calls
- `router.get()`, `router.post()`, etc. on `express.Router()` instances
- `app.use('/prefix', router)` for route mounting
- Middleware chains: `app.use(middleware)` registration order

**HTTP endpoints (NestJS):**
- `@Controller('path')` with `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`
- `@ApiTags()` from Swagger for endpoint grouping
- Module registration in `app.module.ts` via `@Module({ controllers: [...] })`
- Guards: `@UseGuards()` decorator

**HTTP endpoints (Fastify):**
- `fastify.get()`, `fastify.post()` route registrations
- Plugin-based routes: `fastify.register(plugin, { prefix: '/api' })`
- Schema-based validation in route options

**Event and message handlers:**
- `bullmq` / `bull`: `Worker` class or `queue.process()` -- job processor
- Kafka: `kafkajs` `consumer.run({ eachMessage })` -- Kafka consumer
- RabbitMQ: `amqplib` `channel.consume()` -- AMQP consumer
- AWS SQS: `@aws-sdk/client-sqs` `ReceiveMessageCommand` or Lambda SQS trigger
- NestJS: `@EventPattern()`, `@MessagePattern()` -- microservice event handlers
- Redis pub/sub: `subscriber.on('message')` -- Redis subscription
- EventEmitter patterns: `emitter.on('event')` for internal events

**Scheduled jobs:**
- `node-cron` or `cron`: `cron.schedule('* * * * *', handler)`
- `bull` / `bullmq` repeatable jobs: `queue.add('job', data, { repeat: { cron } })`
- NestJS: `@Cron()` decorator from `@nestjs/schedule`
- `setInterval()` for simple polling (flag as anti-pattern)

**WebSocket endpoints:**
- `socket.io`: `io.on('connection', socket => { socket.on('event') })`
- `ws`: `wss.on('connection', ws => { ws.on('message') })`
- NestJS: `@WebSocketGateway()` with `@SubscribeMessage()`
- Express-ws: `app.ws('/path', handler)`

**Startup hooks:**
- `app.listen()` -- server start
- NestJS: `OnModuleInit`, `OnApplicationBootstrap` lifecycle hooks
- Express: middleware registration order in `app.js` or `server.js`

---

### 02-actors-and-boundaries

**Authentication patterns:**
- `passport` strategies: `passport-jwt`, `passport-local`, `passport-oauth2`
- `jsonwebtoken` (`jwt.verify()`, `jwt.sign()`) -- manual JWT handling
- `express-session` -- session-based auth
- NestJS: `@UseGuards(AuthGuard('jwt'))`, custom guard implementations
- API key: custom middleware checking `x-api-key` header
- Auth0 / Okta / Cognito SDK integrations
- `helmet` -- security headers middleware

**API boundary detection:**
- OpenAPI: `swagger-jsdoc`, `@nestjs/swagger`, `fastify-swagger`
- API versioning: URL prefix (`/api/v1`), header-based, or NestJS versioning config
- CORS: `cors` middleware configuration or NestJS `app.enableCors()`
- Rate limiting: `express-rate-limit` or `@nestjs/throttler`

---

### 03-external-systems

**Database connections:**
- PostgreSQL / MySQL: connection strings in env vars, `pg`, `mysql2`, `knex`, Prisma, TypeORM, Sequelize config
- MongoDB: `mongoose.connect()`, `MONGODB_URI` env var, `@nestjs/mongoose`
- Redis: `ioredis` or `redis` client creation, `REDIS_URL` env var
- Elasticsearch: `@elastic/elasticsearch` client

**Message broker connections:**
- `kafkajs` -- Kafka (look for `brokers` config)
- `amqplib` -- RabbitMQ (look for `amqp://` connection string)
- `@aws-sdk/client-sqs` / `@aws-sdk/client-sns` -- AWS SQS/SNS
- `bullmq` / `bull` -- Redis-backed job queue

**External HTTP clients:**
- `axios` with base URL configuration
- `node-fetch` or built-in `fetch` with URL constants
- `got`, `superagent`, or `undici` HTTP clients
- NestJS `HttpService` (wraps axios)
- SDK packages for external services (Stripe, Twilio, SendGrid)

**Cloud service integrations:**
- `@aws-sdk/*` -- AWS services
- `@google-cloud/*` -- GCP services
- `@azure/*` -- Azure services
- Firebase: `firebase-admin` SDK

---

### 04-containers

**Container identification:**
- Each `package.json` with a `start` script in a monorepo workspace is a potential container
- NestJS microservices: apps in `apps/` directory (Nx/monorepo)
- Worker processes: packages with `bullmq` Worker or Kafka consumer as entry point
- Shared libraries: packages in `packages/` or `libs/` without server entry points

**Inter-container communication:**
- HTTP: `axios` / `fetch` calls between services
- NestJS microservices: `ClientProxy` with TCP, Redis, Kafka, or gRPC transport
- Message queues: shared Bull/Kafka/RabbitMQ topics
- gRPC: `@grpc/grpc-js` or `@nestjs/microservices` gRPC transport
- Event bus: shared Redis pub/sub or EventEmitter-based

**Monorepo patterns:**
- Nx: `nx.json`, `project.json` per app
- Turborepo: `turbo.json` with pipeline definitions
- Lerna: `lerna.json` with packages
- pnpm workspaces: `pnpm-workspace.yaml`
- Yarn workspaces: `workspaces` in root package.json

---

### 05-components

**Layer detection patterns:**
- Controllers / Routes: files in `routes/`, `controllers/`, or NestJS `*.controller.ts`
- Services: files in `services/` or NestJS `*.service.ts`
- Repositories / DAOs: files in `repositories/`, `daos/`, or Prisma/TypeORM repository pattern
- Models / Entities: files in `models/`, `entities/`, Prisma `schema.prisma`, Mongoose schemas
- Middleware: files in `middleware/` or `middlewares/`
- DTOs / Validators: NestJS `*.dto.ts`, `class-validator` decorated classes, Joi/Zod schemas

**Business component boundaries:**
- NestJS modules: each `*.module.ts` with its controllers, services, and providers
- Express: route files or feature directories grouping routes + handlers + models
- Feature folders: `src/features/{feature}/` or `src/modules/{module}/`

**God class signals:**
- Route files > 300 lines with many handlers
- Service files > 500 lines
- Single `index.js` or `app.js` files > 500 lines with mixed responsibilities
- Mongoose models with extensive statics and methods

**Test detection:**
- `*.test.ts`, `*.spec.ts`, `*.test.js`, `*.spec.js` files
- `__tests__/` directories
- NestJS: `*.controller.spec.ts`, `*.service.spec.ts`
- `jest.config.*` or `vitest.config.*` -- test runner configuration
- Supertest: `request(app).get('/...')` -- integration tests
- `@nestjs/testing` `Test.createTestingModule()` -- NestJS unit tests

---

### 06-capabilities

**Capability signals in Node projects:**
- NestJS modules map directly to capability areas
- Express route file groupings reveal capability boundaries
- Feature directory structure (`src/features/`) indicates capability organization
- OpenAPI tag groupings describe capability areas

---

### 07-data-model

**Entity detection:**
- Prisma: `schema.prisma` with `model` declarations (single source of truth for schema)
- TypeORM: `@Entity()` decorated classes with `@Column()`, `@PrimaryGeneratedColumn()`
- Sequelize: `Model.init()` or `sequelize.define()` with attribute definitions
- Mongoose: `new Schema({})` definitions with field types
- Knex: `knex.schema.createTable()` in migration files
- Relationships: Prisma relations, TypeORM `@ManyToOne`, Mongoose `ref` fields

**Migration detection:**
- Prisma: `prisma/migrations/` directory
- TypeORM: `migrations/` directory
- Knex: `migrations/` directory
- Sequelize: `migrations/` directory or Sequelize CLI configuration

---

### 08-patterns

**Common Node patterns to detect:**
- Middleware chain: Express middleware pipeline
- Dependency injection: NestJS `@Injectable()` and module providers
- Repository pattern: Prisma or TypeORM repository abstractions
- CQRS: NestJS `@nestjs/cqrs` with `CommandBus` / `QueryBus`
- Event-driven: EventEmitter, NestJS `EventEmitter2`, or message broker patterns
- Saga/Orchestration: NestJS Saga implementations
- Service layer: distinct service classes between controllers and data access
- Factory pattern: NestJS `useFactory` providers

**Anti-pattern signals:**
- Callback hell: deeply nested callbacks instead of async/await
- Business logic in route handlers (Express routes as fat controllers)
- `require()` of relative paths crossing feature boundaries
- Missing error handling: no `try/catch` in async handlers, no error middleware
- Unhandled promise rejections
- Direct database queries in route handlers (no service layer)
- `process.env` accessed directly throughout codebase (no config module)

---

### 09-dependencies

**Package dependency analysis:**
- Parse `package.json` `dependencies` and `devDependencies`
- Check `package-lock.json` or `yarn.lock` for resolved versions
- Flag known vulnerable or deprecated packages: `npm audit`, `snyk`
- Check Node.js version compatibility with `engines.node`
- Flag outdated major versions: Express 3.x (EOL), Node 14/16 (EOL)

**Internal dependency detection:**
- Monorepo workspace references: `"@company/shared": "workspace:*"`
- Local file references: `"file:../packages/common"`
- Nx dependency graph: `nx graph` output

---

## Common Node/Express File Patterns

| Pattern | Location |
|---|---|
| Application entry | `src/index.ts`, `src/app.ts`, `src/main.ts`, `server.js` |
| Routes (Express) | `src/routes/*.ts` or `routes/*.js` |
| Controllers (NestJS) | `src/**/*.controller.ts` |
| Services | `src/**/*.service.ts` or `src/services/*.ts` |
| Models / Entities | `src/models/`, `src/entities/`, `prisma/schema.prisma` |
| Middleware | `src/middleware/` or `src/middlewares/` |
| DTOs / Validators | `src/**/*.dto.ts`, `src/validators/` |
| Config | `src/config/`, `.env`, `.env.example` |
| Database migrations | `prisma/migrations/`, `migrations/`, `src/migrations/` |
| Module definition (NestJS) | `src/**/*.module.ts` |
| Tests | `src/**/*.spec.ts`, `src/**/*.test.ts`, `__tests__/` |
| Package config | `package.json`, `tsconfig.json`, `nest-cli.json` |
