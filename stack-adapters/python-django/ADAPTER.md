# Python / Django Stack Adapter

Stack-specific pattern detection hints for Python codebases using Django, Django REST Framework (DRF), and the broader Django ecosystem. These hints help Unearth skills locate framework-specific structures faster and produce more accurate results.

## Stack Fingerprint

Confirm this adapter applies by checking for at least two of these signals:

| Signal | File / Pattern |
|---|---|
| Package manager | `requirements.txt`, `Pipfile`, `pyproject.toml`, or `setup.py` |
| Django | `django` in dependencies, `manage.py` in project root |
| Settings | `settings.py` or `settings/` directory with `base.py`, `dev.py`, `prod.py` |
| URL config | `urls.py` with `urlpatterns` |
| WSGI/ASGI | `wsgi.py` or `asgi.py` entry points |

---

## Skill Hooks

### 00-recon

**Project detection:**
- Parse `requirements.txt`, `Pipfile`, or `pyproject.toml` for `django`, `djangorestframework`, `celery`, etc.
- Django version: `Django==X.Y.Z` in requirements
- Python version: `.python-version`, `runtime.txt` (Heroku), or `python_requires` in pyproject.toml
- Multi-app structure: look for multiple directories containing `apps.py`

**Framework detection signals:**
- `djangorestframework` -- REST API
- `django-channels` -- WebSocket / async
- `celery` -- async task queue
- `django-allauth` or `dj-rest-auth` -- authentication
- `django-filter` -- queryset filtering
- `django-cors-headers` -- CORS handling
- `graphene-django` -- GraphQL
- `django-storages` -- cloud storage (S3, GCS, Azure)
- `django-redis` -- Redis cache/session backend
- `django-elasticsearch-dsl` -- Elasticsearch integration

**Deployment signals:**
- `Dockerfile` with `gunicorn` or `uvicorn` -- container deployment
- `docker-compose.yml` -- local orchestration
- `Procfile` -- Heroku
- `zappa_settings.json` -- AWS Lambda (Zappa)
- `serverless.yml` with Python runtime -- Serverless Framework
- `.ebextensions/` -- AWS Elastic Beanstalk
- `nginx.conf` with `proxy_pass` -- reverse proxy

---

### 01-entry-points

**HTTP endpoints:**
- URL patterns: parse `urls.py` files for `path()`, `re_path()`, `url()` entries
- Follow `include()` calls to app-level `urls.py`
- DRF: `router.register()` calls in `urls.py` create standard CRUD endpoints
- DRF ViewSets: `ModelViewSet`, `GenericViewSet` with mixin classes
- DRF APIViews: `@api_view(['GET', 'POST'])` decorators
- Function-based views: functions referenced in `urlpatterns`
- Class-based views: classes extending `View`, `TemplateView`, `ListView`, `CreateView`

**Event and message handlers:**
- Celery tasks: `@shared_task`, `@app.task`, or functions in `tasks.py`
- Django signals: `@receiver(post_save, sender=Model)` in `signals.py`
- Channels consumers: classes extending `WebsocketConsumer`, `AsyncWebsocketConsumer`, `JsonWebsocketConsumer`
- Custom management commands: `management/commands/*.py` with `BaseCommand`
- Django-Q or Huey: `@task` decorators for alternative task queues

**Scheduled jobs:**
- Celery Beat: `CELERY_BEAT_SCHEDULE` in settings or `celery.py`
- `django-crontab` or `django-celery-beat` entries
- Custom management commands invoked via cron

**Startup hooks:**
- `AppConfig.ready()` method in `apps.py` -- app initialization
- `settings.py` middleware list -- request/response processing chain
- Signal connections in `apps.py` `ready()` method

---

### 02-actors-and-boundaries

**Authentication patterns:**
- `REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES` in settings -- DRF auth
- `SessionAuthentication`, `TokenAuthentication`, `JWTAuthentication` -- auth backends
- `AUTHENTICATION_BACKENDS` in settings -- Django auth backends
- `@permission_classes([IsAuthenticated])` -- view-level auth
- `IsAdminUser`, `AllowAny`, custom permission classes -- role/permission hints
- `@login_required` decorator -- Django view auth
- `django-allauth` configuration -- social auth, OAuth
- `django-oauth-toolkit` -- OAuth2 provider

**API boundary detection:**
- DRF: `DEFAULT_RENDERER_CLASSES`, `DEFAULT_PARSER_CLASSES` in settings
- API versioning: `DEFAULT_VERSIONING_CLASS` (URL, namespace, header-based)
- Swagger/OpenAPI: `drf-spectacular` or `drf-yasg` configuration
- CORS: `CORS_ALLOWED_ORIGINS` in `django-cors-headers` settings

---

### 03-external-systems

**Database connections:**
- `DATABASES` dict in settings -- PostgreSQL, MySQL, SQLite, Oracle
- Multiple database entries indicate multi-DB architecture
- `DATABASE_ROUTERS` -- database routing for read replicas or per-app databases
- MongoDB: `djongo` or `mongoengine` connections

**Cache and session backends:**
- `CACHES` dict in settings -- Redis, Memcached, database cache
- `SESSION_ENGINE` -- session storage backend

**Message broker connections:**
- `CELERY_BROKER_URL` -- RabbitMQ (`amqp://`) or Redis (`redis://`)
- `CHANNEL_LAYERS` in settings -- Django Channels backend (Redis, In-memory)
- Kafka: `confluent-kafka` or `kafka-python` in dependencies

**External HTTP clients:**
- `requests` library usage with base URLs
- `httpx` async client usage
- External API wrapper classes or SDK imports (Stripe, Twilio, AWS boto3)

**Cloud service integrations:**
- `boto3` -- AWS services (S3, SQS, SNS, DynamoDB, SES)
- `google-cloud-*` -- GCP services
- `azure-*` -- Azure services
- `django-storages` `DEFAULT_FILE_STORAGE` -- cloud file storage

---

### 04-containers

**Container identification:**
- Each Django project with its own `manage.py` and `settings.py` is a container
- Celery workers running `celery -A project worker` are separate containers
- Celery Beat schedulers are separate containers
- Channels ASGI workers are separate containers

**Inter-container communication:**
- Celery tasks called across projects via shared broker
- REST API calls between Django services
- Shared database access (same `DATABASES` config)
- Django Channels layer (Redis pub/sub)

**Shared library detection:**
- Python packages without `manage.py` (utility libraries)
- Internal packages referenced in `requirements.txt` via `-e ./packages/common`
- Packages in a `libs/` or `packages/` directory

---

### 05-components

**Layer detection patterns:**
- Views / ViewSets: `views.py`, `viewsets.py` -- presentation layer
- Serializers: `serializers.py` -- data transformation layer
- Models: `models.py` -- domain model / data access
- Services: `services.py` -- business logic (if present; Django projects often lack this)
- Forms: `forms.py` -- form validation
- Admin: `admin.py` -- admin interface registration
- Managers: custom `Manager` classes in `models.py` -- query abstraction
- Middleware: `middleware.py` -- cross-cutting concerns
- Filters: `filters.py` -- queryset filtering (DRF)
- Permissions: `permissions.py` -- authorization logic
- Signals: `signals.py` -- event handlers

**Business component boundaries:**
- Each Django app (directory with `apps.py`) is typically a component
- `INSTALLED_APPS` in settings lists all app components
- App dependencies visible through model ForeignKey cross-references and signal connections

**God class signals:**
- `models.py` files > 500 lines with many model classes
- `views.py` files > 400 lines with many view functions or classes
- ViewSets with > 10 custom actions
- `serializers.py` with deeply nested serializers and custom validation
- `admin.py` with complex inline and custom action definitions

**Test detection:**
- `tests.py` or `tests/` directory per app
- `APITestCase` (DRF), `TestCase`, `TransactionTestCase` (Django)
- `pytest-django` with `conftest.py` fixtures
- `factory_boy` factories in `factories.py` -- test data builders
- `coverage` configuration in `setup.cfg` or `pyproject.toml`

---

### 06-capabilities

**Capability signals in Django projects:**
- Django apps often map directly to capabilities
- `INSTALLED_APPS` provides a capability inventory
- URL namespace groupings in root `urls.py` reveal capability areas
- DRF router registrations group related endpoints

---

### 07-data-model

**Entity detection:**
- Django ORM: `models.Model` subclasses with `CharField`, `IntegerField`, `ForeignKey`, etc.
- Relationships: `ForeignKey`, `ManyToManyField`, `OneToOneField` with `related_name`
- Abstract models: `class Meta: abstract = True` -- shared field patterns
- Proxy models: `class Meta: proxy = True` -- behavior variations
- Migrations: `migrations/` directories per app -- schema evolution history
- DTOs: serializer classes in `serializers.py` reveal the external data contract

**Data store identification:**
- `DATABASES` settings map to physical databases
- Model `Meta.db_table` for custom table names
- Model `Meta.app_label` for multi-database routing

---

### 08-patterns

**Common Django patterns to detect:**
- Fat models: business logic in model methods (Django convention, but can become god class)
- Service layer: dedicated `services.py` (less common, signals architectural maturity)
- Repository pattern: custom `Manager` classes abstracting queries
- CQRS: separate read serializers and write serializers
- Command pattern: Celery tasks as discrete commands
- Observer: Django signals (`post_save`, `pre_delete`, custom signals)
- Middleware chain: request/response processing pipeline
- Mixin-heavy views: deep mixin inheritance in CBVs

**Anti-pattern signals:**
- Business logic in views (views.py doing DB queries, calculations, and side effects)
- Logic in serializer `validate()` or `create()` that belongs in services
- Circular model imports requiring string-based ForeignKey references
- `signals.py` with complex business orchestration (signals as workflow engine)
- N+1 queries: missing `select_related()` / `prefetch_related()` on querysets
- Raw SQL in views instead of ORM queries

---

### 09-dependencies

**Package dependency analysis:**
- Parse `requirements.txt` (pinned versions), `Pipfile.lock`, or `pyproject.toml` `[project.dependencies]`
- Check for unpinned dependencies (`django>=4.0` vs `django==4.2.7`)
- Flag EOL or deprecated packages: Django 2.x/3.x, Python 3.7/3.8
- Security: `safety` or `pip-audit` configuration for vulnerability scanning

**Internal dependency detection:**
- Cross-app model imports reveal inter-app coupling
- Shared apps in `INSTALLED_APPS` used across multiple projects
- Internal packages installed via `-e ./path` in requirements

---

## Common Python/Django File Patterns

| Pattern | Location |
|---|---|
| Project entry | `manage.py`, `wsgi.py`, `asgi.py` |
| Settings | `settings.py` or `settings/{base,dev,prod}.py` |
| URL routing | `urls.py` (project-level and per-app) |
| Views / endpoints | `views.py` or `viewsets.py` per app |
| Serializers | `serializers.py` per app |
| Models | `models.py` or `models/` per app |
| Admin | `admin.py` per app |
| Signals | `signals.py` per app |
| Celery tasks | `tasks.py` per app |
| Management commands | `management/commands/*.py` |
| Migrations | `migrations/*.py` per app |
| Tests | `tests.py` or `tests/*.py` per app |
| Fixtures | `fixtures/*.json` or `fixtures/*.yaml` |
| Static files | `static/` per app |
| Templates | `templates/` per app |
