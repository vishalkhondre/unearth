# Ruby / Rails Stack Adapter

Stack-specific pattern detection hints for Ruby codebases using Ruby on Rails and the broader Rails ecosystem. These hints help Unearth skills locate framework-specific structures faster and produce more accurate results.

## Stack Fingerprint

Confirm this adapter applies by checking for at least two of these signals:

| Signal | File / Pattern |
|---|---|
| Package manager | `Gemfile` and `Gemfile.lock` in project root |
| Rails | `rails` gem in Gemfile, `config/application.rb` |
| Directory structure | `app/`, `config/`, `db/`, `lib/` Rails convention |
| Database config | `config/database.yml` |
| Routes | `config/routes.rb` |

---

## Skill Hooks

### 00-recon

**Project detection:**
- Parse `Gemfile` for `gem 'rails'` (version), `gem 'pg'`/`gem 'mysql2'`, framework gems
- Ruby version: `.ruby-version`, `Gemfile` ruby constraint, or `RUBY VERSION` in Gemfile.lock
- Rails version: `gem 'rails', '~> X.Y'` in Gemfile
- Multi-app: check for Rails engines in `engines/` or `components/` directories
- API-only: `config.api_only = true` in `config/application.rb`

**Framework detection signals:**
- `grape` -- Grape API framework (alternative to Rails controllers)
- `sidekiq` -- background job processor
- `devise` -- authentication
- `pundit` or `cancancan` -- authorization
- `active_model_serializers` or `jbuilder` or `blueprinter` -- serialization
- `graphql-ruby` -- GraphQL
- `actioncable` -- WebSocket (built into Rails)
- `turbo-rails` and `stimulus-rails` -- Hotwire (modern Rails frontend)
- `rspec-rails` -- RSpec testing
- `factory_bot_rails` -- test data factories

**Deployment signals:**
- `Dockerfile` with Ruby base image -- container deployment
- `docker-compose.yml` -- local orchestration
- `Procfile` -- Heroku or Foreman
- `config/deploy.rb` -- Capistrano deployment
- `Kamal` or `kamal.yml` -- Kamal (Docker-based deployment)
- `.github/workflows/` or `.circleci/` -- CI/CD
- `config/environments/{production,staging,development}.rb` -- environment configs

---

### 01-entry-points

**HTTP endpoints:**
- Parse `config/routes.rb` for all route definitions
- `resources :users` -- generates standard RESTful CRUD routes
- `get '/path', to: 'controller#action'` -- custom routes
- `namespace :api do ... end` -- namespaced API routes
- `scope '/v1' do ... end` -- versioned routes
- `mount Engine => '/path'` -- mounted engines
- `mount Sidekiq::Web => '/sidekiq'` -- mounted Rack apps
- Run `rails routes` mentally: each route maps to `Controller#action`

**Controller hierarchy:**
- `app/controllers/` -- all controller files
- `ApplicationController` inheritance chain reveals auth/before_action patterns
- `Api::V1::BaseController` -- API versioning via controller namespacing

**Event and message handlers:**
- Sidekiq: classes in `app/workers/` or `app/jobs/` including `Sidekiq::Worker` or `ApplicationJob`
- Active Job: `app/jobs/*_job.rb` classes extending `ApplicationJob`
- Action Mailbox: `app/mailboxes/` -- inbound email processing
- Custom event subscribers: classes responding to `ActiveSupport::Notifications`
- Kafka: `karafka` gem consumers in `app/consumers/`
- RabbitMQ: `bunny` or `sneakers` worker classes

**Scheduled jobs:**
- `config/schedule.rb` -- whenever gem (cron-based scheduling)
- Sidekiq-cron: `config/sidekiq_cron.yml` or `Sidekiq::Cron::Job.load_from_hash`
- Clockwork: `clock.rb` file
- Custom rake tasks invoked via cron: `lib/tasks/*.rake`

**WebSocket endpoints:**
- Action Cable: `app/channels/*_channel.rb` classes extending `ApplicationCable::Channel`
- `config/routes.rb` mounting `ActionCable.server`
- Channel subscriptions and broadcasts

**Startup hooks:**
- `config/initializers/*.rb` -- run on boot in alphabetical order
- `config/application.rb` configuration
- `Rails.application.config.after_initialize` block
- `ActiveSupport.on_load(:active_record)` lazy hooks

---

### 02-actors-and-boundaries

**Authentication patterns:**
- Devise: `devise :database_authenticatable, :registerable, :recoverable` in User model
- Devise strategies: `:jwt_authenticatable`, `:omniauthable` reveal auth methods
- `before_action :authenticate_user!` -- Devise controller filter
- Custom JWT: `jwt` gem with manual token validation
- API token: `has_secure_token` or custom token authentication
- Doorkeeper: `doorkeeper` gem for OAuth2 provider
- Warden: `warden` strategies (underlying Devise)

**Authorization patterns:**
- Pundit: `authorize @record`, policy classes in `app/policies/`
- CanCanCan: `Ability` class in `app/models/ability.rb`, `authorize! :action, @resource`
- Custom: `before_action` callbacks checking roles/permissions
- `current_user` method -- reveals authenticated user context

**API boundary detection:**
- API versioning: `Api::V1` namespace in controllers and routes
- Serialization: `ActiveModelSerializers`, `Jbuilder`, `Blueprinter` -- response format control
- CORS: `rack-cors` gem configuration in `config/initializers/cors.rb`
- API documentation: `rswag` or `apipie-rails` for Swagger/OpenAPI generation

---

### 03-external-systems

**Database connections:**
- `config/database.yml` -- PostgreSQL, MySQL, SQLite configuration
- Multiple database configuration: `connects_to` in models (Rails 6+)
- Redis: `config/redis.yml` or `REDIS_URL` env var
- Elasticsearch: `elasticsearch-rails` or `searchkick` gem

**Cache backends:**
- `config.cache_store` in environment files -- `:redis_cache_store`, `:mem_cache_store`
- `Rails.cache` usage throughout codebase

**Message broker connections:**
- Sidekiq: `config/sidekiq.yml` with Redis connection
- Kafka: `karafka` configuration in `karafka.rb`
- RabbitMQ: `bunny` or `sneakers` connection configuration
- AWS SQS: `shoryuken` gem or `aws-sdk-sqs`

**External HTTP clients:**
- `faraday` -- HTTP client (most common in Rails)
- `httparty` or `http` gem -- HTTP clients
- `rest-client` -- REST API client
- External service wrappers in `app/services/` or `lib/`
- `stripe` gem, `twilio-ruby`, `aws-sdk-*` -- SaaS integrations

---

### 04-containers

**Container identification:**
- The Rails app itself (Puma/Unicorn web server) is one container
- Sidekiq worker process is a separate container
- Action Cable server can be a separate container
- Separate Rails engines mounted as independent services
- API-only Rails apps in a multi-service architecture

**Inter-container communication:**
- Sidekiq jobs: async communication via Redis
- HTTP: `faraday` or `httparty` calls between services
- Shared database: multiple Rails apps connecting to the same database
- Action Cable broadcasts: Redis pub/sub
- Message queues: Kafka/RabbitMQ shared topics

**Shared library detection:**
- Rails engines in `engines/` or `components/` -- shared functionality
- Gems in `lib/` or extracted into private gem servers
- Concerns in `app/models/concerns/` and `app/controllers/concerns/` -- shared behavior

---

### 05-components

**Layer detection patterns (Rails conventions):**
- Controllers: `app/controllers/` -- request handling
- Models: `app/models/` -- domain objects and Active Record
- Views: `app/views/` -- presentation (ERB, Haml, Jbuilder)
- Mailers: `app/mailers/` -- email sending
- Jobs: `app/jobs/` -- background processing
- Channels: `app/channels/` -- WebSocket handling
- Services: `app/services/` -- business logic (convention, not framework)
- Form objects: `app/forms/` -- complex form handling
- Query objects: `app/queries/` -- complex database queries
- Policies: `app/policies/` -- authorization rules (Pundit)
- Serializers: `app/serializers/` -- API response formatting
- Decorators / Presenters: `app/decorators/` or `app/presenters/`

**Business component boundaries:**
- Rails engines: each engine in `engines/` is a self-contained component
- Namespace grouping in `app/models/` and `app/controllers/`
- Domain modules: `app/domains/` or similar (less common)
- `ActiveSupport::Concern` modules grouping related behavior

**God class signals:**
- Models > 500 lines (especially User, Order, or Account models)
- Controllers > 300 lines with many actions
- `ApplicationController` with many `before_action` callbacks
- Concerns included in > 10 models
- Single `routes.rb` > 300 lines without namespace organization

**Test detection:**
- RSpec: `spec/` directory with `*_spec.rb` files
- Minitest: `test/` directory with `*_test.rb` files
- `spec/models/`, `spec/controllers/`, `spec/requests/` -- per-layer tests
- `spec/factories/` -- FactoryBot factory definitions
- `spec/support/` -- shared test helpers and contexts
- Coverage: `simplecov` gem configuration

---

### 06-capabilities

**Capability signals in Rails projects:**
- Rails engines map to major capability boundaries
- Controller namespaces group related endpoints into capability areas
- `resources` declarations in routes.rb reveal domain entities and CRUD capabilities
- ActiveAdmin or Rails Admin resource registrations indicate admin capabilities

---

### 07-data-model

**Entity detection:**
- Active Record: `app/models/*.rb` classes inheriting `ApplicationRecord`
- Attributes: `db/schema.rb` or `db/structure.sql` is the canonical schema definition
- Relationships: `has_many`, `belongs_to`, `has_one`, `has_and_belongs_to_many`
- Polymorphic: `belongs_to :commentable, polymorphic: true`
- STI: `type` column with single table inheritance
- Enums: `enum status: { draft: 0, published: 1 }`
- Validations: `validates :name, presence: true` -- business constraints
- Callbacks: `before_save`, `after_create` -- lifecycle hooks
- Scopes: `scope :active, -> { where(active: true) }` -- named queries
- Migrations: `db/migrate/*.rb` -- schema evolution history

**Data store identification:**
- `config/database.yml` for primary and replica databases
- `connects_to` for multi-database routing (Rails 6+)
- `establish_connection` for models using different databases

---

### 08-patterns

**Common Rails patterns to detect:**
- MVC: core Rails convention (Model-View-Controller)
- Service objects: plain Ruby classes in `app/services/` encapsulating business logic
- Form objects: classes wrapping multi-model form submissions
- Query objects: classes encapsulating complex database queries
- Presenter/Decorator: `draper` gem or custom decorator classes
- Observer: `ActiveSupport::Notifications`, callbacks, and custom observers
- Concerns: shared behavior modules mixed into models and controllers
- State machine: `aasm` or `statesman` gems for state transitions
- Background job pattern: Sidekiq/Active Job for async processing

**Anti-pattern signals:**
- Fat models: model files > 500 lines with mixed business logic
- Fat controllers: actions with complex business logic instead of delegating to services
- Callback hell: long chains of `before_save`, `after_create` with side effects
- N+1 queries: missing `includes()` or `eager_load()` on associations
- Raw SQL scattered in controllers
- Business logic in migrations
- `skip_before_action` overuse suggesting broken inheritance
- Monkeypatching core classes in initializers

---

### 09-dependencies

**Package dependency analysis:**
- Parse `Gemfile` for gem names and version constraints
- Parse `Gemfile.lock` for resolved dependency tree
- Flag EOL: Rails 5.x/6.0 (EOL), Ruby 2.x/3.0 (EOL)
- Security: `bundler-audit` or `brakeman` for vulnerability scanning
- Check for gems with known security issues

**Internal dependency detection:**
- Gemfile `path:` references for local gems
- Rails engines referenced in Gemfile
- Shared concerns and libraries in `lib/`

---

## Common Ruby/Rails File Patterns

| Pattern | Location |
|---|---|
| Application entry | `config.ru`, `config/application.rb` |
| Routes | `config/routes.rb` |
| Controllers | `app/controllers/**/*_controller.rb` |
| Models | `app/models/**/*.rb` |
| Views | `app/views/**/*.{erb,haml,jbuilder}` |
| Services | `app/services/**/*.rb` |
| Jobs | `app/jobs/**/*_job.rb` |
| Mailers | `app/mailers/**/*_mailer.rb` |
| Channels | `app/channels/**/*_channel.rb` |
| Serializers | `app/serializers/**/*_serializer.rb` |
| Policies | `app/policies/**/*_policy.rb` |
| Migrations | `db/migrate/*.rb` |
| Schema | `db/schema.rb` or `db/structure.sql` |
| Seeds | `db/seeds.rb` |
| Initializers | `config/initializers/*.rb` |
| Locales | `config/locales/*.yml` |
| Tests (RSpec) | `spec/**/*_spec.rb` |
| Tests (Minitest) | `test/**/*_test.rb` |
| Factories | `spec/factories/*.rb` |
