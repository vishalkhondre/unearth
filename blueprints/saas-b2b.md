# SaaS B2B Platform Blueprint

A reference capability model for multi-tenant B2B SaaS platforms covering tenant management, subscription billing, user management, integration, and platform operations. Use this blueprint with skill `10-blueprint` to assess coverage gaps in any B2B SaaS codebase.

## Domain

Multi-tenant B2B software-as-a-service platforms including horizontal SaaS (CRM, project management, HR), vertical SaaS (industry-specific solutions), and platform products that serve business customers with subscription-based access.

## Sources

This blueprint is derived from common B2B SaaS platform patterns and industry practices:

- **SaaS architecture patterns** from AWS Well-Architected SaaS Lens
- **Azure SaaS development framework** multi-tenancy guidance
- **Stripe Billing / Chargebee / Recurly** subscription management capability models
- **Auth0 / Okta** identity and access management patterns for B2B SaaS
- **LaunchDarkly / Split** feature management frameworks
- **MACH Alliance** composable architecture principles
- Common patterns observed across mature SaaS platforms (Salesforce, HubSpot, Atlassian, Datadog)

## Capabilities

### C1 -- Multi-tenancy and Tenant Management

**Description:** Isolate customer organizations (tenants) with dedicated or shared data, configuration, and runtime boundaries. Manage tenant lifecycle from provisioning through offboarding.

**Sub-capabilities:**
- C1.1 Tenant provisioning and onboarding
- C1.2 Tenant data isolation (silo, pool, or bridge model)
- C1.3 Tenant configuration and customization
- C1.4 Tenant lifecycle (trial, active, suspended, churned, offboarded)
- C1.5 Tenant hierarchy (parent org, business units, teams)
- C1.6 Tenant data export and portability
- C1.7 Tenant deletion and data purge

**Evidence signals:** Tenant entity models, tenant-scoped data access middleware, tenant provisioning services, tenant configuration stores, data isolation patterns (schema-per-tenant, row-level security, separate databases).

---

### C2 -- Subscription and Billing

**Description:** Manage subscription plans, pricing tiers, billing cycles, invoicing, and payment collection. Support usage-based, seat-based, and hybrid pricing models with upgrade/downgrade flows.

**Sub-capabilities:**
- C2.1 Plan and pricing tier definition
- C2.2 Subscription lifecycle (trial, active, past-due, canceled, expired)
- C2.3 Seat-based and per-unit billing
- C2.4 Usage-based metering and billing
- C2.5 Invoice generation and delivery
- C2.6 Payment collection and gateway integration
- C2.7 Proration on plan changes
- C2.8 Dunning and failed payment recovery
- C2.9 Self-service upgrade, downgrade, and cancellation
- C2.10 Revenue recognition (ASC 606 / IFRS 15)

**Evidence signals:** Plan and subscription entities, billing service integrations (Stripe, Chargebee, Recurly), usage metering events, invoice generators, dunning workflows, self-service billing UIs.

---

### C3 -- Entitlements and Feature Gating

**Description:** Control access to platform features based on subscription plan, add-ons, and custom entitlements. Enforce usage limits, feature flags, and plan-specific capabilities at runtime.

**Sub-capabilities:**
- C3.1 Plan-to-feature mapping
- C3.2 Runtime entitlement checks
- C3.3 Usage quota enforcement (API calls, storage, seats)
- C3.4 Add-on and module activation
- C3.5 Feature flag management
- C3.6 Overage handling and soft limits
- C3.7 Entitlement change propagation on plan change

**Evidence signals:** Entitlement models, feature flag services (LaunchDarkly, Split, Unleash), quota enforcement middleware, plan-feature mapping tables, gating decorators or middleware.

---

### C4 -- Identity and Access Management

**Description:** Authenticate users and authorize access to tenant resources. Support SSO, MFA, role-based access control, and organization-level identity federation.

**Sub-capabilities:**
- C4.1 User registration and login
- C4.2 SSO integration (SAML 2.0, OIDC)
- C4.3 Multi-factor authentication
- C4.4 Role-based access control (RBAC)
- C4.5 Custom roles and permission sets
- C4.6 Team and group management within tenants
- C4.7 API key and service account management
- C4.8 Session management and device trust
- C4.9 SCIM provisioning for enterprise directory sync

**Evidence signals:** Auth service implementations, identity provider integrations (Auth0, Okta, Cognito), RBAC models, SCIM endpoints, API key management, session stores.

---

### C5 -- User Management

**Description:** Manage user accounts within tenants including invitations, profiles, preferences, and user lifecycle. Support both admin-managed and self-service user management.

**Sub-capabilities:**
- C5.1 User invitation and onboarding
- C5.2 User profile management
- C5.3 User preference and notification settings
- C5.4 User deactivation and offboarding
- C5.5 User search and directory
- C5.6 Admin user management console

**Evidence signals:** User entity models, invitation services, profile endpoints, preference stores, user search, admin management UIs.

---

### C6 -- Workspace and Collaboration

**Description:** Provide shared workspaces where team members collaborate on domain objects. Support comments, mentions, activity feeds, and real-time collaboration.

**Sub-capabilities:**
- C6.1 Workspace and project organization
- C6.2 Comments and threaded discussions
- C6.3 Mentions and user notifications
- C6.4 Activity feed and audit stream
- C6.5 Real-time collaboration (concurrent editing, presence)
- C6.6 File attachment and sharing

**Evidence signals:** Workspace models, comment entities, activity feed services, WebSocket/SSE implementations, file upload services, mention resolution.

---

### C7 -- Notifications and Communication

**Description:** Deliver notifications across in-app, email, SMS, and push channels. Support notification preferences, digest batching, and event-driven triggering.

**Sub-capabilities:**
- C7.1 In-app notification center
- C7.2 Email notifications (transactional and digest)
- C7.3 Push notifications (mobile and web)
- C7.4 SMS and webhook notifications
- C7.5 Notification preference management
- C7.6 Digest and batching logic
- C7.7 Notification template management

**Evidence signals:** Notification dispatcher services, email provider integrations, notification preference models, in-app notification UIs, template engines, webhook delivery services.

---

### C8 -- API Platform

**Description:** Expose platform capabilities through a well-documented public API. Manage API versioning, authentication, rate limiting, and developer experience.

**Sub-capabilities:**
- C8.1 REST and/or GraphQL public API
- C8.2 API authentication (API keys, OAuth 2.0, JWT)
- C8.3 API rate limiting and throttling per tenant
- C8.4 API versioning and backward compatibility
- C8.5 Webhook event system
- C8.6 Developer documentation and API reference
- C8.7 API usage analytics and monitoring

**Evidence signals:** API route definitions, API key management, rate limiter middleware, API versioning strategies, OpenAPI specs, webhook dispatch services, developer documentation sites.

---

### C9 -- Integration and Marketplace

**Description:** Connect the platform to external systems through pre-built integrations, an integration framework, and a marketplace. Support common patterns: CRM sync, SSO, data import/export.

**Sub-capabilities:**
- C9.1 Pre-built integrations (Salesforce, HubSpot, Slack, Jira)
- C9.2 Integration framework and connector SDK
- C9.3 OAuth-based third-party authorization
- C9.4 App marketplace and listing
- C9.5 Data import and export (CSV, API-based, bulk)
- C9.6 iPaaS connectivity (Zapier, Workato, Tray)

**Evidence signals:** Integration connector implementations, OAuth flow handlers, marketplace models, import/export services, Zapier trigger/action definitions, SDK documentation.

---

### C10 -- Workflow and Automation

**Description:** Enable users to automate business processes through configurable workflows, triggers, and actions. Support conditional logic, approvals, and scheduled automations.

**Sub-capabilities:**
- C10.1 Workflow builder (visual or configuration-based)
- C10.2 Event-based triggers
- C10.3 Conditional branching and logic
- C10.4 Approval workflows
- C10.5 Scheduled and recurring automations
- C10.6 Workflow execution history and debugging

**Evidence signals:** Workflow engine implementations, trigger configuration, condition evaluation logic, approval chain models, scheduler services, execution log stores.

---

### C11 -- Analytics and Reporting

**Description:** Provide insights into platform usage, business performance, and operational metrics through dashboards, reports, and data export.

**Sub-capabilities:**
- C11.1 Built-in dashboards and charts
- C11.2 Custom report builder
- C11.3 Scheduled report delivery
- C11.4 Data export (CSV, API, data warehouse sync)
- C11.5 Usage analytics (feature adoption, engagement)
- C11.6 Admin analytics (tenant health, seat utilization)

**Evidence signals:** Dashboard components, charting libraries, report generation services, data export endpoints, analytics event tracking, admin metrics dashboards.

---

### C12 -- Search

**Description:** Provide fast, relevant search across platform content. Support full-text search, filters, facets, and scoped search within tenant boundaries.

**Sub-capabilities:**
- C12.1 Full-text search across entities
- C12.2 Faceted filtering and sorting
- C12.3 Tenant-scoped search isolation
- C12.4 Search indexing and reindexing
- C12.5 Global search (cross-entity)

**Evidence signals:** Search engine integrations (Elasticsearch, Typesense, Meilisearch), search index builders, tenant-scoped query filters, search API endpoints.

---

### C13 -- Onboarding and Product-led Growth

**Description:** Guide new users and tenants through product onboarding with setup wizards, checklists, interactive tours, and in-app education. Support self-service signup and trial conversion.

**Sub-capabilities:**
- C13.1 Self-service signup flow
- C13.2 Onboarding wizard and setup checklist
- C13.3 Interactive product tours
- C13.4 In-app tooltips and contextual help
- C13.5 Trial management and conversion prompts
- C13.6 Sample data and sandbox environments

**Evidence signals:** Signup flow implementations, onboarding checklist models, tour frameworks, tooltip implementations, trial management logic, seed data generators.

---

### C14 -- Audit Trail and Compliance

**Description:** Track and log all significant user and system actions for compliance, troubleshooting, and security. Support data residency, retention policies, and regulatory compliance.

**Sub-capabilities:**
- C14.1 Action audit trail (who did what, when)
- C14.2 Data change history
- C14.3 Audit log search and export
- C14.4 Data retention and archival policies
- C14.5 Data residency and sovereignty controls
- C14.6 SOC 2 / ISO 27001 compliance controls
- C14.7 GDPR / CCPA data subject request handling

**Evidence signals:** Audit log services, change tracking middleware, log export endpoints, retention policy configuration, data residency routing, DSR handling workflows.

---

### C15 -- Admin and Operations Console

**Description:** Provide internal tools for platform operators to manage tenants, monitor system health, handle support requests, and perform operational tasks.

**Sub-capabilities:**
- C15.1 Tenant management console
- C15.2 User impersonation for support
- C15.3 Feature flag administration
- C15.4 System health and metrics dashboard
- C15.5 Support ticket and escalation integration
- C15.6 Bulk operations and data maintenance

**Evidence signals:** Internal admin UIs, impersonation services, feature flag admin panels, operational dashboards, support tool integrations, bulk operation endpoints.

---

### C16 -- Customization and Extensibility

**Description:** Allow tenants to customize the platform through custom fields, custom objects, page layouts, and scripting hooks without modifying core platform code.

**Sub-capabilities:**
- C16.1 Custom field and metadata extension
- C16.2 Custom object creation (low-code)
- C16.3 Layout and view customization
- C16.4 Scripting and webhook hooks
- C16.5 Custom branding per tenant (white-label)
- C16.6 Locale and language customization

**Evidence signals:** Custom field models, dynamic schema services, layout configuration, webhook hook registrations, branding configuration per tenant, i18n resource management.

---

### C17 -- Data Pipeline and Event Bus

**Description:** Process domain events through an internal event bus for decoupled service communication. Support event sourcing, CDC, and real-time streaming for downstream consumers.

**Sub-capabilities:**
- C17.1 Domain event publishing
- C17.2 Event bus or message broker
- C17.3 Event consumer and handler registration
- C17.4 Dead-letter queue and retry handling
- C17.5 Change data capture (CDC)
- C17.6 Event schema registry and versioning

**Evidence signals:** Event bus implementations (Kafka, RabbitMQ, SQS/SNS, EventBridge), event publisher services, consumer registrations, DLQ configuration, CDC connectors.

---

### C18 -- Platform Observability

**Description:** Monitor platform health, performance, and reliability through logging, metrics, tracing, and alerting. Support multi-tenant observability with tenant-scoped diagnostics.

**Sub-capabilities:**
- C18.1 Structured logging with tenant context
- C18.2 Application metrics (latency, error rate, throughput)
- C18.3 Distributed tracing
- C18.4 Alerting and on-call escalation
- C18.5 Tenant-scoped health monitoring
- C18.6 SLA and uptime tracking

**Evidence signals:** Logging frameworks with tenant correlation, metrics exporters (Prometheus, Datadog, CloudWatch), tracing implementations (OpenTelemetry), alerting rules, status page services.

---

## Using This Blueprint

When running skill `10-blueprint` against a B2B SaaS codebase:

1. Map each discovered L1 capability to the closest blueprint capability (C1--C18).
2. Rate coverage as **Full**, **Partial**, **Gap**, or **N/A**.
3. For partial matches, document what exists versus what is missing.
4. Identify capabilities present in the codebase but absent from this blueprint.
5. Prioritize gaps as **Critical** (blocks multi-tenant operation or revenue) or **Moderate** (limits growth, enterprise readiness, or operational maturity).

### Critical path capabilities

These form the minimum viable B2B SaaS platform. Gaps here block core operations:

C1 (Multi-tenancy), C2 (Billing), C4 (IAM), C5 (Users), C8 (API), C14 (Audit).

### Differentiating capabilities

These separate enterprise-ready platforms from basic multi-tenant apps:

C3 (Entitlements), C9 (Integrations), C10 (Workflows), C13 (PLG), C16 (Extensibility), C17 (Events).
