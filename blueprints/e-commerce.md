# E-commerce Platform Blueprint

A reference capability model for e-commerce platforms covering storefront, catalog, ordering, fulfillment, and customer engagement domains. Use this blueprint with skill `10-blueprint` to assess coverage gaps in any e-commerce codebase.

## Domain

Online retail and digital commerce platforms, including B2C storefronts, B2B wholesale portals, marketplace platforms, and omnichannel commerce systems.

## Sources

This blueprint is derived from industry-standard e-commerce reference architectures and capability models:

- **MACH Alliance** composable commerce principles (Microservices, API-first, Cloud-native, Headless)
- **commercetools** capability domains (catalog, cart, order, customer, payment, shipping)
- **Adobe Commerce / Magento** module architecture (catalog, checkout, sales, customer, inventory)
- **Shopify** platform capabilities (products, orders, customers, marketing, analytics)
- **OMG Cloud Customer Architecture for E-Commerce** reference model
- **ArchiMate-based e-commerce reference architecture** (Adapted from Hadaya & Cassivi, service-oriented e-commerce models)
- **Retail-H reference model** (retail process framework from academic literature)

## Capabilities

### C1 — Product Catalog Management

**Description:** Create, organize, and maintain product information including attributes, variants, categories, pricing, and media assets. Supports product types (simple, configurable, bundled, virtual, downloadable), category hierarchies, and attribute sets.

**Sub-capabilities:**
- C1.1 Product CRUD and lifecycle (draft, active, archived)
- C1.2 Variant and option management (size, color, material)
- C1.3 Category hierarchy and navigation taxonomy
- C1.4 Attribute and metadata schema management
- C1.5 Product media (images, video, 3D, documents)
- C1.6 Product relationships (cross-sell, up-sell, related, bundled)

**Evidence signals:** Product entity models, category tree structures, attribute set configurations, PIM integrations, variant generation logic.

---

### C2 — Pricing and Promotions

**Description:** Define and manage pricing strategies including base prices, tiered pricing, customer-group pricing, volume discounts, promotional rules, coupon codes, and flash sales. Supports multi-currency pricing.

**Sub-capabilities:**
- C2.1 Base price and price list management
- C2.2 Tiered and volume pricing
- C2.3 Customer-group and contract pricing (B2B)
- C2.4 Promotional rules engine (buy-X-get-Y, percentage off, free shipping)
- C2.5 Coupon and voucher code management
- C2.6 Multi-currency and regional pricing
- C2.7 Dynamic pricing and A/B price testing

**Evidence signals:** Pricing rule engines, discount calculators, coupon validation logic, price list entities, currency conversion services.

---

### C3 — Product Search and Discovery

**Description:** Enable customers to find products through full-text search, faceted filtering, autocomplete, and personalized recommendations. Includes search indexing, relevance tuning, and synonym management.

**Sub-capabilities:**
- C3.1 Full-text search with relevance ranking
- C3.2 Faceted navigation and filtering
- C3.3 Autocomplete and search suggestions
- C3.4 Search analytics and zero-result tracking
- C3.5 Synonym and redirect management

**Evidence signals:** Search engine integrations (Elasticsearch, Algolia, Solr), search index builders, facet configuration, query analyzers.

---

### C4 — Shopping Cart and Session

**Description:** Manage the transient shopping state including cart item management, price calculations, shipping estimates, and tax previews. Supports guest and authenticated carts, cart persistence, and cart merging.

**Sub-capabilities:**
- C4.1 Cart item add, update, remove
- C4.2 Cart price calculation (subtotal, tax, shipping, discounts)
- C4.3 Guest cart and authenticated cart merge
- C4.4 Cart persistence and expiration
- C4.5 Multi-cart and wishlist support
- C4.6 Cart-level promotion application

**Evidence signals:** Cart entity models, price aggregation services, session management, cart serialization, cart event tracking.

---

### C5 — Checkout and Order Placement

**Description:** Guide customers through the purchase completion flow including address collection, shipping method selection, payment method selection, order review, and order submission. Supports single-page and multi-step checkout.

**Sub-capabilities:**
- C5.1 Address collection and validation
- C5.2 Shipping method selection and rate calculation
- C5.3 Payment method selection
- C5.4 Order review and confirmation
- C5.5 Order placement and payment capture
- C5.6 Guest checkout flow

**Evidence signals:** Checkout controllers, step orchestration, address validators, order creation services, payment gateway calls.

---

### C6 — Payment Processing

**Description:** Integrate with payment gateways to authorize, capture, void, and refund payments. Supports credit/debit cards, digital wallets, bank transfers, buy-now-pay-later, and stored payment methods. PCI DSS compliance boundary.

**Sub-capabilities:**
- C6.1 Payment gateway integration (Stripe, Adyen, PayPal, Braintree)
- C6.2 Authorization, capture, void, and refund lifecycle
- C6.3 Stored payment methods and tokenization
- C6.4 Multi-payment and split-payment support
- C6.5 Fraud detection and risk scoring
- C6.6 PCI DSS compliance and secure handling
- C6.7 Buy-now-pay-later and installment plans

**Evidence signals:** Payment gateway adapters, transaction state machines, webhook handlers for payment events, tokenization services, fraud rule engines.

---

### C7 — Order Management

**Description:** Track orders from placement through fulfillment and completion. Manage order status transitions, order editing, cancellation, splitting, and order notes.

**Sub-capabilities:**
- C7.1 Order lifecycle and status management
- C7.2 Order editing and cancellation
- C7.3 Order splitting and partial fulfillment
- C7.4 Order notes and internal communication
- C7.5 Order search and filtering (admin)
- C7.6 Order history and customer-facing status

**Evidence signals:** Order entity models, state machine definitions, order event handlers, order search indexes, admin order management UIs.

---

### C8 — Inventory Management

**Description:** Track stock levels across warehouses, stores, and fulfillment centers. Manage reservations, backorders, stock transfers, and low-stock alerts. Support multi-location inventory.

**Sub-capabilities:**
- C8.1 Stock quantity tracking per SKU per location
- C8.2 Inventory reservation on cart or order
- C8.3 Multi-warehouse and multi-location support
- C8.4 Backorder and preorder handling
- C8.5 Low-stock alerts and reorder point notifications
- C8.6 Stock adjustment and audit trail
- C8.7 Inventory synchronization with ERP/WMS

**Evidence signals:** Inventory entities, reservation services, stock movement records, warehouse location models, ERP sync jobs.

---

### C9 — Fulfillment and Shipping

**Description:** Manage the physical fulfillment process including pick/pack/ship workflows, shipping label generation, carrier integration, shipment tracking, and delivery confirmation.

**Sub-capabilities:**
- C9.1 Fulfillment workflow (pick, pack, ship)
- C9.2 Carrier rate shopping and selection
- C9.3 Shipping label generation
- C9.4 Shipment tracking and status updates
- C9.5 Delivery confirmation and proof of delivery
- C9.6 Ship-from-store and dropship support
- C9.7 Shipping rules (free shipping thresholds, zone-based rates)

**Evidence signals:** Fulfillment state machines, carrier API integrations (FedEx, UPS, DHL), label generation services, tracking webhook consumers, shipping rule engines.

---

### C10 — Returns and Refunds

**Description:** Process customer returns including return authorization, return shipping, item inspection, refund processing, and exchange management. Supports return policies and restocking rules.

**Sub-capabilities:**
- C10.1 Return merchandise authorization (RMA) creation
- C10.2 Return shipping label generation
- C10.3 Return receipt and item inspection
- C10.4 Refund processing (original method, store credit)
- C10.5 Exchange and replacement order creation
- C10.6 Return policy enforcement and restocking fees

**Evidence signals:** RMA entities, return workflow services, refund processors, return policy configuration, exchange order generators.

---

### C11 — Customer Account Management

**Description:** Manage customer registration, authentication, profiles, address books, and account preferences. Support customer segmentation and groups.

**Sub-capabilities:**
- C11.1 Registration and login (email, social, SSO)
- C11.2 Profile and preference management
- C11.3 Address book management
- C11.4 Customer groups and segments
- C11.5 Account deactivation and data export (GDPR)
- C11.6 Customer merge and deduplication

**Evidence signals:** Customer entity models, authentication providers, profile services, segment builders, GDPR data export endpoints.

---

### C12 — Customer Communication

**Description:** Send transactional and marketing communications including order confirmations, shipping notifications, abandoned cart reminders, and promotional emails. Supports email, SMS, and push channels.

**Sub-capabilities:**
- C12.1 Transactional email (order confirmation, shipping, refund)
- C12.2 SMS notifications
- C12.3 Push notifications (mobile, web)
- C12.4 Abandoned cart recovery messaging
- C12.5 Email template management
- C12.6 Communication preference and opt-out management

**Evidence signals:** Email service integrations (SendGrid, SES, Mailchimp), notification dispatchers, template engines, preference centers, event-triggered messaging.

---

### C13 — Content Management

**Description:** Manage storefront content including landing pages, banners, blog posts, FAQ pages, and CMS blocks. Supports WYSIWYG editing, content scheduling, and A/B testing.

**Sub-capabilities:**
- C13.1 CMS page and block management
- C13.2 Banner and hero image management
- C13.3 Blog and editorial content
- C13.4 Content scheduling and versioning
- C13.5 Navigation and menu management
- C13.6 URL routing and SEO metadata

**Evidence signals:** CMS entity models, WYSIWYG editors, content APIs, page builder components, URL rewrite rules, sitemap generators.

---

### C14 — Storefront and Presentation

**Description:** Render the customer-facing shopping experience including product listing pages, product detail pages, category pages, and responsive layouts. Supports headless and server-rendered approaches.

**Sub-capabilities:**
- C14.1 Product listing and category pages
- C14.2 Product detail page rendering
- C14.3 Theme and template management
- C14.4 Responsive and mobile-optimized layouts
- C14.5 Localization and internationalization (i18n)
- C14.6 Accessibility compliance (WCAG)

**Evidence signals:** Frontend frameworks, theme configurations, template engines, storefront API consumers, i18n resource bundles, accessibility audit configurations.

---

### C15 — Tax Calculation

**Description:** Calculate sales tax, VAT, GST, and other applicable taxes based on product type, customer location, and tax rules. Supports tax-exempt customers and tax reporting.

**Sub-capabilities:**
- C15.1 Tax rate configuration by jurisdiction
- C15.2 Product tax class assignment
- C15.3 Tax-exempt customer handling
- C15.4 Tax calculation engine (built-in or Avalara/TaxJar/Vertex)
- C15.5 Tax reporting and export

**Evidence signals:** Tax rate tables, tax calculation services, tax provider integrations, tax-exempt flags on customer records, tax line items on orders.

---

### C16 — Multi-store and Multi-channel

**Description:** Operate multiple storefronts from a single platform instance. Support different brands, regions, or B2B/B2C segments with distinct catalogs, pricing, themes, and configurations.

**Sub-capabilities:**
- C16.1 Multi-store configuration and isolation
- C16.2 Channel-specific catalog and pricing
- C16.3 Marketplace and third-party channel syndication
- C16.4 Social commerce integration
- C16.5 Point-of-sale (POS) integration

**Evidence signals:** Store/channel entity models, store-scoped configuration, marketplace feed generators, social commerce plugins, POS API integrations.

---

### C17 — Reviews and Ratings

**Description:** Collect and display customer product reviews and ratings. Supports review moderation, verified purchaser flags, review helpfulness voting, and Q&A.

**Sub-capabilities:**
- C17.1 Review and rating submission
- C17.2 Review moderation and approval workflow
- C17.3 Verified purchaser validation
- C17.4 Review aggregation and summary statistics
- C17.5 Product Q&A

**Evidence signals:** Review entity models, moderation queues, review display components, rating aggregation services, Q&A endpoints.

---

### C18 — Marketing and SEO

**Description:** Support marketing efforts including SEO optimization, URL management, social sharing, affiliate tracking, and marketing automation integration.

**Sub-capabilities:**
- C18.1 SEO metadata management (title, description, canonical)
- C18.2 URL rewrites and redirects
- C18.3 Sitemap generation
- C18.4 Social sharing and Open Graph tags
- C18.5 Affiliate and referral tracking
- C18.6 Marketing automation integration (HubSpot, Klaviyo, Braze)
- C18.7 Product feed generation (Google Shopping, Meta)

**Evidence signals:** SEO configuration models, sitemap generators, redirect tables, tracking pixel implementations, affiliate attribution services, product feed builders.

---

### C19 — Analytics and Reporting

**Description:** Track and report on sales performance, customer behavior, product performance, and operational metrics. Supports dashboards, scheduled reports, and data export.

**Sub-capabilities:**
- C19.1 Sales and revenue reporting
- C19.2 Customer behavior analytics (conversion funnel, cohorts)
- C19.3 Product performance reporting
- C19.4 Inventory and fulfillment reporting
- C19.5 Dashboard and KPI visualization
- C19.6 Data export and warehouse integration

**Evidence signals:** Reporting services, analytics event tracking, dashboard components, data warehouse ETL jobs, BI tool integrations (Looker, Tableau, Power BI).

---

### C20 — Personalization and Recommendations

**Description:** Deliver personalized shopping experiences through product recommendations, personalized search results, targeted content, and customer journey optimization.

**Sub-capabilities:**
- C20.1 Product recommendation engine (collaborative filtering, content-based)
- C20.2 Personalized search result ranking
- C20.3 Targeted content and banner personalization
- C20.4 Customer journey and behavior tracking
- C20.5 A/B testing and experimentation

**Evidence signals:** Recommendation engine integrations, personalization APIs, behavior tracking events, experiment configuration, customer segment targeting.

---

### C21 — User and Access Management

**Description:** Manage admin users, roles, and permissions for the back-office. Control access to catalog management, order processing, customer data, and system configuration.

**Sub-capabilities:**
- C21.1 Admin user management and authentication
- C21.2 Role-based access control (RBAC)
- C21.3 Permission granularity (resource-level, action-level)
- C21.4 SSO and multi-factor authentication
- C21.5 Audit trail for admin actions

**Evidence signals:** Admin user models, role and permission entities, auth middleware, MFA configuration, admin action logs.

---

### C22 — API and Integration Layer

**Description:** Expose platform capabilities through APIs for headless frontends, mobile apps, third-party integrations, and marketplace connections. Includes API gateway, rate limiting, and developer documentation.

**Sub-capabilities:**
- C22.1 REST and/or GraphQL API surface
- C22.2 Webhook event system
- C22.3 API authentication and key management
- C22.4 Rate limiting and throttling
- C22.5 API versioning and deprecation
- C22.6 Developer portal and documentation

**Evidence signals:** API route definitions, webhook dispatchers, API key management, rate limiter middleware, OpenAPI/GraphQL schema definitions, developer documentation sites.

---

### C23 — Subscription and Recurring Orders

**Description:** Support subscription-based purchasing including recurring order scheduling, subscription management, payment retry logic, and subscription analytics.

**Sub-capabilities:**
- C23.1 Subscription plan definition and management
- C23.2 Recurring order scheduling and processing
- C23.3 Subscription pause, skip, and cancel
- C23.4 Payment retry and dunning management
- C23.5 Subscription lifecycle notifications

**Evidence signals:** Subscription entities, recurring order schedulers, dunning retry logic, subscription management UIs, subscription event handlers.

---

### C24 — Loyalty and Rewards

**Description:** Manage customer loyalty programs including point accrual, tier management, reward redemption, and program analytics.

**Sub-capabilities:**
- C24.1 Points accrual on purchases
- C24.2 Tier and status management
- C24.3 Reward catalog and redemption
- C24.4 Referral programs
- C24.5 Loyalty program analytics

**Evidence signals:** Loyalty point ledgers, tier calculation services, reward redemption handlers, referral tracking, loyalty program configuration.

---

### C25 — B2B Commerce

**Description:** Support business-to-business purchasing including company accounts, buyer roles, purchase approval workflows, quote requests, and custom catalogs.

**Sub-capabilities:**
- C25.1 Company account and buyer hierarchy
- C25.2 Purchase approval workflows
- C25.3 Quote request and negotiation
- C25.4 Custom catalogs and contract pricing
- C25.5 Bulk ordering and quick order forms
- C25.6 Purchase order payment

**Evidence signals:** Company account models, approval workflow engines, quote entities, contract pricing logic, bulk order interfaces, PO payment methods.

---

## Using This Blueprint

When running skill `10-blueprint` against an e-commerce codebase:

1. Map each discovered L1 capability to the closest blueprint capability (C1--C25).
2. Rate coverage as **Full**, **Partial**, **Gap**, or **N/A**.
3. For partial matches, document what exists and what is missing.
4. Identify capabilities present in the codebase but absent from this blueprint (extensions beyond the reference model).
5. Prioritize gaps as **Critical** (blocks core commerce flow) or **Moderate** (limits growth or differentiation).

### Critical path capabilities

These capabilities form the minimum viable e-commerce platform. Gaps here represent fundamental blockers:

C1 (Catalog), C4 (Cart), C5 (Checkout), C6 (Payment), C7 (Orders), C8 (Inventory), C11 (Customers).

### Differentiating capabilities

These capabilities separate mature platforms from basic implementations:

C3 (Search), C9 (Fulfillment), C15 (Tax), C16 (Multi-store), C20 (Personalization), C23 (Subscriptions), C25 (B2B).
