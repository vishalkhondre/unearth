# Fintech Core Banking Blueprint

A reference capability model for core banking and fintech platforms covering accounts, payments, lending, compliance, and customer management domains. Use this blueprint with skill `10-blueprint` to assess coverage gaps in any banking or fintech codebase.

## Domain

Core banking systems, neobank platforms, banking-as-a-service (BaaS) providers, digital banking layers, and fintech platforms that manage accounts, payments, lending, or financial products.

## Sources

This blueprint is derived from industry-standard banking reference architectures and regulatory frameworks:

- **BIAN (Banking Industry Architecture Network)** service landscape v12 -- the industry-standard banking capability decomposition
- **Thought Machine Vault** core banking capability model (ledger, products, payments, customers)
- **Mambu** composable banking platform domains (deposits, lending, accounting)
- **Temenos Transact** banking module architecture
- **10x Banking** core modernization capability framework
- **PSD2 / Open Banking** API requirements (account information, payment initiation)
- **Basel III / IV** risk and capital framework (compliance implications)
- **ISO 20022** financial messaging standard

## Capabilities

### C1 -- Account Management

**Description:** Create, manage, and close customer accounts across product types (current, savings, fixed deposit, wallet). Manage account lifecycle, status transitions, balances, and account hierarchies.

**Sub-capabilities:**
- C1.1 Account opening and onboarding
- C1.2 Account lifecycle (active, dormant, frozen, closed)
- C1.3 Balance management (available, ledger, hold)
- C1.4 Account hierarchy and sub-accounts
- C1.5 Interest accrual and posting
- C1.6 Account statements and history
- C1.7 Multi-currency account support

**Evidence signals:** Account entity models, balance calculation services, interest engines, account status state machines, statement generators.

---

### C2 -- General Ledger and Accounting

**Description:** Maintain the double-entry general ledger as the system of record for all financial positions. Support chart of accounts, journal entries, reconciliation, and financial reporting.

**Sub-capabilities:**
- C2.1 Chart of accounts management
- C2.2 Double-entry journal posting
- C2.3 Sub-ledger management (customer, internal, suspense)
- C2.4 End-of-day and end-of-month processing
- C2.5 Inter-entity and inter-branch accounting
- C2.6 Reconciliation and exception management
- C2.7 Financial reporting (balance sheet, P&L, trial balance)

**Evidence signals:** Ledger entities, journal entry services, posting rules, reconciliation jobs, chart of accounts configuration, financial report generators.

---

### C3 -- Payment Processing

**Description:** Initiate, route, validate, and settle payments across schemes and rails. Supports domestic and cross-border transfers, real-time payments, batch payments, and standing orders.

**Sub-capabilities:**
- C3.1 Payment initiation and validation
- C3.2 Payment routing and scheme selection
- C3.3 Real-time payment processing (Faster Payments, UPI, FedNow, SEPA Instant)
- C3.4 Batch payment processing (ACH, BACS, SEPA)
- C3.5 Cross-border and SWIFT payments
- C3.6 Standing orders and scheduled payments
- C3.7 Payment status tracking and notification
- C3.8 Payment reversal and recall

**Evidence signals:** Payment entity models, routing engines, scheme adapters, clearing file generators, payment state machines, ISO 20022 message builders.

---

### C4 -- Card Issuing and Management

**Description:** Issue and manage payment cards (debit, credit, prepaid, virtual). Control card lifecycle, spending limits, PIN management, and card-present/card-not-present transaction authorization.

**Sub-capabilities:**
- C4.1 Card issuance (physical, virtual, tokenized)
- C4.2 Card lifecycle (activate, block, replace, cancel)
- C4.3 PIN management and card controls
- C4.4 Spending limits and merchant category restrictions
- C4.5 Transaction authorization and decisioning
- C4.6 3D Secure and strong customer authentication
- C4.7 Card-on-file and tokenization

**Evidence signals:** Card entity models, card processor integrations (Marqeta, GPS, Visa DPS), authorization decision engines, 3DS servers, card control APIs.

---

### C5 -- Lending and Credit

**Description:** Originate, manage, and service loan products including personal loans, lines of credit, overdrafts, and mortgages. Covers credit decisioning, disbursement, repayment scheduling, collections, and provisioning.

**Sub-capabilities:**
- C5.1 Loan product configuration
- C5.2 Loan application and origination
- C5.3 Credit assessment and decisioning
- C5.4 Disbursement and drawdown
- C5.5 Repayment scheduling and amortization
- C5.6 Interest and fee calculation
- C5.7 Collections and arrears management
- C5.8 Loan restructuring and write-off
- C5.9 Provisioning (IFRS 9 / CECL)

**Evidence signals:** Loan entity models, credit scoring integrations, amortization calculators, repayment schedule generators, collection workflow engines, provisioning models.

---

### C6 -- Customer Identity and KYC

**Description:** Onboard customers with identity verification, know-your-customer (KYC) checks, and ongoing due diligence. Manage customer risk ratings and periodic reviews.

**Sub-capabilities:**
- C6.1 Customer registration and identity capture
- C6.2 Document verification (ID, proof of address)
- C6.3 Biometric verification (face match, liveness)
- C6.4 KYC risk assessment and scoring
- C6.5 Enhanced due diligence (EDD) for high-risk customers
- C6.6 Periodic KYC review and refresh
- C6.7 PEP and sanctions screening
- C6.8 Beneficial ownership identification

**Evidence signals:** KYC entity models, identity provider integrations (Onfido, Jumio, Sumsub), screening service clients, risk scoring engines, document storage services.

---

### C7 -- Anti-Money Laundering and Fraud

**Description:** Detect and prevent financial crime through transaction monitoring, suspicious activity reporting, sanctions screening, and fraud detection. Supports rule-based and ML-based detection.

**Sub-capabilities:**
- C7.1 Transaction monitoring rules and scenarios
- C7.2 Suspicious activity report (SAR) generation
- C7.3 Real-time sanctions and watchlist screening
- C7.4 Fraud detection (rule-based and ML models)
- C7.5 Case management and investigation workflow
- C7.6 Alert triage and disposition
- C7.7 Currency transaction reporting (CTR)

**Evidence signals:** Monitoring rule engines, alert entity models, case management services, SAR generation, screening service integrations, ML model scoring endpoints.

---

### C8 -- Customer Management (CRM)

**Description:** Maintain customer profiles, contact details, preferences, and relationship data. Support customer segmentation, communication history, and relationship management.

**Sub-capabilities:**
- C8.1 Customer profile management (individual, corporate)
- C8.2 Contact and address management
- C8.3 Customer segmentation and tagging
- C8.4 Communication history and interaction log
- C8.5 Relationship mapping (joint accounts, authorized signatories)
- C8.6 Customer consent and preference management

**Evidence signals:** Customer entity models, contact services, segment builders, interaction log services, consent management endpoints.

---

### C9 -- Product Factory

**Description:** Define, configure, and manage financial products (deposit, lending, card) through parameterized product templates rather than custom code. Supports rapid product creation and lifecycle management.

**Sub-capabilities:**
- C9.1 Product template definition and parameterization
- C9.2 Fee and charge schedule configuration
- C9.3 Interest rate configuration (fixed, variable, tiered)
- C9.4 Product eligibility rules
- C9.5 Product lifecycle (draft, active, sunset, closed-to-new)
- C9.6 Product bundling and packaging

**Evidence signals:** Product configuration entities, smart contract or rule definitions, fee schedule models, rate configuration, product catalog APIs.

---

### C10 -- Notifications and Messaging

**Description:** Send transactional and promotional communications across channels including push notifications, SMS, email, and in-app messages. Support event-driven notifications with customer preference management.

**Sub-capabilities:**
- C10.1 Event-triggered transactional notifications
- C10.2 Multi-channel delivery (push, SMS, email, in-app)
- C10.3 Notification template management
- C10.4 Customer channel preference management
- C10.5 Delivery tracking and retry logic
- C10.6 Regulatory and compliance notifications

**Evidence signals:** Notification dispatcher services, channel provider integrations (Twilio, SES, FCM), template engines, preference stores, delivery status tracking.

---

### C11 -- Digital Channels

**Description:** Provide customer-facing interfaces through mobile apps, web banking, and conversational interfaces. Support consistent experiences across channels with shared APIs.

**Sub-capabilities:**
- C11.1 Mobile banking application
- C11.2 Web banking portal
- C11.3 Chatbot and conversational banking
- C11.4 API-driven experience layer (BFF pattern)
- C11.5 In-app feature flagging and configuration
- C11.6 Accessibility compliance

**Evidence signals:** Mobile app projects, web frontend projects, BFF API layers, chatbot integrations, feature flag services, accessibility configurations.

---

### C12 -- Authentication and Security

**Description:** Authenticate customers and staff through multi-factor authentication, biometrics, and session management. Implement strong customer authentication (SCA) per PSD2 requirements.

**Sub-capabilities:**
- C12.1 Multi-factor authentication (SMS OTP, TOTP, push)
- C12.2 Biometric authentication (fingerprint, face)
- C12.3 Session management and device binding
- C12.4 Strong customer authentication (SCA / PSD2)
- C12.5 Step-up authentication for sensitive operations
- C12.6 Login anomaly detection

**Evidence signals:** Auth service implementations, MFA provider integrations, session token management, device fingerprinting, SCA flow orchestration.

---

### C13 -- Open Banking and API Gateway

**Description:** Expose account and payment APIs per open banking regulations (PSD2, Open Banking UK, Open Finance). Manage third-party provider (TPP) access, consent, and API traffic.

**Sub-capabilities:**
- C13.1 Account information service (AIS) API
- C13.2 Payment initiation service (PIS) API
- C13.3 TPP registration and credential management
- C13.4 Customer consent management
- C13.5 API gateway (rate limiting, authentication, monitoring)
- C13.6 Developer portal and sandbox

**Evidence signals:** Open banking API implementations, consent entity models, TPP registry, API gateway configuration, sandbox environments, PSD2-compliant auth flows.

---

### C14 -- Regulatory Reporting

**Description:** Generate and submit regulatory reports to central banks and supervisory authorities. Covers capital adequacy, liquidity, large exposures, statistical reporting, and tax reporting.

**Sub-capabilities:**
- C14.1 Capital adequacy reporting (Basel III/IV)
- C14.2 Liquidity coverage ratio (LCR) and net stable funding ratio (NSFR)
- C14.3 Large exposure reporting
- C14.4 Statistical reporting (central bank)
- C14.5 Tax withholding and reporting
- C14.6 Report generation and submission automation

**Evidence signals:** Regulatory report generators, data aggregation jobs, submission service integrations, report template configurations, regulatory calendar management.

---

### C15 -- Audit and Compliance

**Description:** Maintain comprehensive audit trails for all financial and administrative operations. Support data retention policies, compliance evidence, and regulatory examination readiness.

**Sub-capabilities:**
- C15.1 Comprehensive audit trail (who, what, when, where)
- C15.2 Data retention and archival policies
- C15.3 Compliance evidence management
- C15.4 Regulatory examination support
- C15.5 Policy enforcement and control monitoring
- C15.6 Data privacy and GDPR/CCPA compliance

**Evidence signals:** Audit log services, retention policy configuration, compliance dashboards, data masking services, privacy consent management, examination report generators.

---

### C16 -- Foreign Exchange

**Description:** Provide currency conversion for payments, accounts, and treasury operations. Manage FX rates, mark-ups, hedging, and multi-currency positions.

**Sub-capabilities:**
- C16.1 FX rate sourcing and management
- C16.2 Spot and forward rate pricing
- C16.3 Customer FX conversion execution
- C16.4 FX mark-up and margin configuration
- C16.5 Multi-currency position management

**Evidence signals:** FX rate feed consumers, rate calculation services, conversion execution engines, mark-up configuration, position tracking.

---

### C17 -- Wallet and Stored Value

**Description:** Manage digital wallets and stored-value accounts for holding, sending, and receiving funds. Supports e-money wallets, loyalty wallets, and multi-currency wallets.

**Sub-capabilities:**
- C17.1 Wallet creation and management
- C17.2 Wallet top-up and withdrawal
- C17.3 Peer-to-peer transfers
- C17.4 Wallet transaction history
- C17.5 Multi-currency wallet support
- C17.6 Wallet limits and controls

**Evidence signals:** Wallet entity models, top-up services, P2P transfer handlers, transaction history APIs, limit enforcement services.

---

### C18 -- Direct Debit and Mandate Management

**Description:** Manage direct debit mandates for recurring collections. Support mandate creation, amendment, cancellation, and payment collection against mandates.

**Sub-capabilities:**
- C18.1 Mandate creation and authorization
- C18.2 Mandate amendment and cancellation
- C18.3 Collection scheduling and execution
- C18.4 Failed collection handling and retry
- C18.5 Indemnity claim processing

**Evidence signals:** Mandate entity models, collection scheduling services, scheme-specific file generators (BACS, SEPA DD), failure handling workflows.

---

### C19 -- User and Access Management (Staff)

**Description:** Manage internal users, roles, and permissions for bank staff. Control access to customer data, transaction processing, and system administration functions.

**Sub-capabilities:**
- C19.1 Staff user management
- C19.2 Role-based access control with maker-checker
- C19.3 Branch and department-scoped access
- C19.4 Privileged access management
- C19.5 Staff activity audit trail

**Evidence signals:** Staff user models, RBAC configuration, maker-checker workflow engines, access scope entities, staff audit logs.

---

### C20 -- Multi-tenancy and White-label

**Description:** Support multiple tenants (bank brands, partner programs, BaaS clients) on a shared platform with data isolation, configuration isolation, and brand customization.

**Sub-capabilities:**
- C20.1 Tenant provisioning and configuration
- C20.2 Data isolation per tenant
- C20.3 Branding and theming per tenant
- C20.4 Tenant-scoped product configuration
- C20.5 Tenant billing and usage metering

**Evidence signals:** Tenant entity models, tenant-scoped data access patterns, branding configuration, tenant provisioning services, usage metering.

---

## Using This Blueprint

When running skill `10-blueprint` against a banking or fintech codebase:

1. Map each discovered L1 capability to the closest blueprint capability (C1--C20).
2. Rate coverage as **Full**, **Partial**, **Gap**, or **N/A**.
3. For partial matches, document what exists versus what is missing.
4. Identify capabilities present in the codebase but absent from this blueprint.
5. Prioritize gaps as **Critical** (regulatory or operational blocker) or **Moderate** (limits product expansion or efficiency).

### Critical path capabilities

These form the minimum viable banking platform. Gaps here represent regulatory or operational blockers:

C1 (Accounts), C2 (Ledger), C3 (Payments), C6 (KYC), C7 (AML/Fraud), C12 (Authentication), C15 (Audit).

### Differentiating capabilities

These separate modern platforms from legacy systems:

C4 (Cards), C9 (Product Factory), C13 (Open Banking), C16 (FX), C17 (Wallets), C20 (Multi-tenancy).
