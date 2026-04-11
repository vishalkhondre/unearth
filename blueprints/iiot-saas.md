---
name: iiot-saas
domain: Industrial IoT SaaS Platform
version: "1.0"
---

# IIoT SaaS Platform Blueprint

A reference capability model for a mature, multi-tenant Industrial IoT SaaS platform covering asset condition management, computerized maintenance management (CMMS), and overall equipment effectiveness (OEE). Use this blueprint with skill `10-blueprint` to assess coverage, identify gaps, and prioritize roadmap items.

## When to Use This Blueprint

Use this blueprint when the system under analysis is an Industrial IoT platform that:
- Manages physical assets (equipment, sensors, gateways) in a hierarchy
- Ingests telemetry data from connected devices
- Provides dashboards, alerting, and analytics on operational data
- Supports multiple tenants or customer organizations
- Includes any combination of: condition monitoring, maintenance management, or production monitoring

Do not use this blueprint for consumer IoT (smart home), automotive IoT, or IoT platforms focused exclusively on logistics/fleet tracking (these have different capability profiles).

## Capability Domains

### Core Asset & Device Management

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B1 | Device & Asset Management | Hierarchical modeling of physical assets. Device registry, commissioning lifecycle, metadata schemas, and asset relationships. | Asset hierarchy CRUD (enterprise/site/area/equipment/unit), asset search and filtering, asset metadata schemas, device registry, commissioning workflow, asset tagging, asset images/media, asset association (link/unlink), delete rules and impact analysis, asset location and utilization tracking | Full hierarchy with dynamic metadata schemas, utilization tracking, and relationship modeling |
| B2 | Connectivity & Protocol Management | Edge gateway lifecycle and industrial protocol support. Manages the connection between physical devices and the cloud platform. | Gateway provisioning and configuration, protocol adapters (Modbus RTU, OPC-UA, MQTT, BACnet, EtherNet/IP), protocol auto-discovery, connection health monitoring, certificate management, 4G/LTE cellular connectivity | Multi-protocol support with auto-discovery, cellular connectivity, and health monitoring |
| B3 | Data Ingestion & Stream Processing | Real-time data pipelines from device to cloud. Normalization, enrichment, and routing of telemetry streams. | Message ingestion (IoT Hub, MQTT broker, Event Hub), stream processing (windowed aggregation, enrichment, filtering), data normalization, dead-letter handling, backpressure management, multi-signal sampling (vibration, ultrasound, temperature, RPM) | Stream processing with in-flight enrichment, multi-signal support, and configurable routing |
| B4 | Time-Series Storage & Query | Purpose-built storage for high-volume, time-stamped sensor data with configurable retention. | Dedicated time-series database, hot/warm/cold tiering, downsampling policies, configurable retention per tenant or asset, raw vs. aggregated query paths, time-range queries with resolution selection, spectral data storage (FFT, envelope, waveform) | Tiered storage with automatic downsampling, retention policies, and spectral data support |

### Condition Monitoring & Reliability

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B5 | AI Failure Detection & Diagnostics | AI-driven detection of machine failures from sensor signals. Prioritizes alerts by severity and asset criticality with evidence-backed diagnosis. | Anomaly detection on vibration/ultrasound/temperature streams, failure mode classification (bearing wear, misalignment, unbalance, cavitation, looseness), severity-based alert ranking, asset criticality weighting, fault frequency analysis (BPFO, BPFI), AI-generated root cause explanations | AI failure detection with fault classification, severity ranking, and explainable diagnosis |
| B6 | Vibration Analysis & Monitoring | Signal-level analysis tools for vibration data. Supports trending, spectral analysis, and comparative views for expert diagnosis. | RMS trending over time, spectral analysis (FFT), envelope analysis, time waveform display, fault frequency overlay, bearing library integration, comparative analysis (before/after, asset-to-asset), baseline establishment | Full spectral analysis with fault frequency libraries and comparative trending |
| B7 | Condition-Based Lubrication | Ultrasonic monitoring that triggers lubrication based on actual machine condition rather than static schedules. | Continuous ultrasound monitoring, friction/impact/turbulence detection, condition-triggered lubrication alerts, lubrication effectiveness verification (before/after comparison), lubrication history tracking | Continuous ultrasound with condition-triggered lubrication and effectiveness verification |
| B8 | Reliability & Root Cause Analysis | Structured analysis of failure root causes with evidence from sensor data, maintenance history, and operating context. | Root cause classification, failure mode and effects analysis (FMEA) support, reliability inspection workflows, grouped insight assignment and tracking, MTBF tracking, MTTR tracking, reliability trending and reporting | FMEA-integrated root cause analysis with inspection workflows and reliability metrics |
| B9 | Failure Lifecycle Management | End-to-end tracking from failure detection through intervention to resolution verification. | Alert-to-work-order conversion, evidence attachment (sensor data, photos), repair tracking, post-repair verification (sensor data confirms fix), failure history and trending, downtime attribution | Closed-loop lifecycle from detection through verified resolution with post-repair data |

### Alerting & Rules Engine

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B10 | Alerting & Rules Engine | Threshold-based and complex event processing for operational alerting with severity prioritization. | Threshold rule CRUD, complex event processing (CEP), rule chaining and conditional logic, alert routing (user, role, escalation), alert acknowledgment and resolution workflow, alert history and analytics, severity-based prioritization with asset criticality | CEP with rule chaining, severity-based prioritization, and multi-channel routing |

### Analytics & Business Intelligence

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B11 | Analytics & Business Intelligence | Dashboards, reports, and KPI visualization for operational and maintenance decision-making. | Pre-built dashboards (maintenance, reliability, production), custom dashboard builder, KPI library (MTBF, MTTR, OEE, availability), report scheduling and export, embedded BI (Power BI, Tableau, Looker), cost reports and savings tracking, downtime reporting | Embedded BI with custom dashboards, KPI library, cost tracking, and scheduled exports |
| B12 | OEE & Production Monitoring | Real-time tracking of Overall Equipment Effectiveness. Measures availability, performance, and quality to identify production losses. | OEE calculation (availability x performance x quality), cycle time tracking, production count tracking (actual vs. target), downtime cause categorization, micro-stop detection, shift-level performance comparison, operator performance tracking, production sensor integration | Real-time OEE with cycle-level tracking, loss categorization, and operator performance |
| B13 | Quality Management | Digitized quality inspection and tracking integrated with production monitoring. | Quality checklist creation and execution, defect categorization, quality KPI tracking (first pass yield, scrap rate), quality inspection workflows, integration with OEE quality factor, SPC chart support | Digitized quality inspection integrated with OEE and SPC support |
| B14 | Utilities & Energy Monitoring | Monitoring and analytics for utility consumption tied to production and asset operations. | Utility meter integration, consumption tracking by asset/line/plant, energy cost allocation, energy efficiency KPIs, consumption-vs-production correlation, utility anomaly detection | Per-asset utility tracking with cost allocation and efficiency analytics |

### Maintenance Management (CMMS)

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B15 | Work Order Management | Mobile-first work order lifecycle from creation through completion with offline support. | Work order creation (manual, alert-triggered, schedule-triggered), task assignment and routing, work order lifecycle (open, in-progress, completed, closed), priority management, time and labor tracking, offline/mobile execution, photo and evidence attachment, work order templates | Mobile-first with offline support, alert-triggered creation, and evidence attachment |
| B16 | Preventive Maintenance | Calendar-based and condition-based preventive maintenance scheduling with dynamic plan adjustment. | PM schedule creation (time-based, meter-based, condition-based), PM calendar view, PM compliance tracking, dynamic schedule adjustment based on condition data, maintenance plan templates, PM cost tracking | Condition-based scheduling with compliance tracking and dynamic adjustment |
| B17 | AI Troubleshooting & SOPs | AI-generated standard operating procedures and troubleshooting guides based on asset history and failure patterns. | AI-generated troubleshooting steps, SOP library creation and management, checklist builder, step-by-step guided repair, tribal knowledge capture, SOP versioning, SOP attachment to work orders | AI-generated SOPs with tribal knowledge capture and work order integration |
| B18 | Parts & Inventory Management | Spare parts inventory linked to assets and work orders with stock tracking and reorder automation. | Parts catalog, stock level tracking, reorder point alerts, part-to-asset linking, part consumption tracking per work order, vendor management, purchase requisition, barcode/QR scanning | Parts linked to assets with consumption tracking and automated reorder alerts |

### Platform Services

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B19 | User & Access Management | User identity, authentication, and role-based access control with SSO and tenant-scoped permissions. | User profiles and lifecycle, RBAC (roles, permissions, assignments), SSO integration (OIDC, SAML), multi-factor authentication, tenant-scoped role assignments, user groups, EULA management | SSO + RBAC with tenant-scoped permissions and MFA |
| B20 | Multi-Tenancy & Organization Management | Tenant isolation, organization hierarchy, multi-site support, and subscription management. | Tenant CRUD and lifecycle, tenant hierarchy (parent/child), multi-site management, customer account management, data isolation enforcement, tenant-level configuration overrides | Full data isolation with multi-site support and tenant-level configuration |
| B21 | OTA / Firmware Management | Over-the-air firmware updates for edge devices with staged rollout and campaign management. | Firmware artifact upload and versioning, deployment group management, update campaign creation, staged rollout (canary, phased), rollback capability, update status monitoring | Staged rollouts with automatic rollback and campaign monitoring |
| B22 | Command & Control | Remote command execution on IoT devices with synchronous and asynchronous patterns. | Command invocation (direct method, message), command cancellation, command status tracking, batch/multi-device commands, command scheduling, firmware commands, command retry and timeout policies | Batch commands with scheduling, retry policies, and full audit trail |

### Communication & Integration

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B23 | Notification & Communication | Multi-channel notification delivery for operational alerts and system events. | Real-time push (WebSocket/SignalR), email notifications, SMS notifications, in-app notifications, webhook outbound, Slack/Teams integrations, notification preferences per user, notification templates | Multi-channel (push + email + SMS + webhook) with user preferences |
| B24 | Integrations & API Management | Pre-built integrations with enterprise systems and an API surface for custom integrations. | ERP integration (SAP, Oracle NetSuite), CMMS integration (IBM Maximo), BI integration (Power BI), API key management, rate limiting, developer documentation, webhook outbound, import/export tools (CSV, spreadsheet) | Pre-built ERP/CMMS integrations + API + import/export tools |
| B25 | Data Export & Reporting | Capabilities for customers to extract data and generate operational reports. | Bulk export (CSV, PDF), scheduled report generation, maintenance cost reports, reliability reports, KPI dashboards, data retention policy management, regulatory compliance export | Scheduled reports with bulk export and compliance support |

### Compliance & Operations

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B26 | Audit & Compliance | Comprehensive audit trail for entity mutations and maintenance activities. | Entity-level audit trail (who-did-what-when), maintenance audit log, work order history, compliance reporting, data sovereignty controls, access audit | Full entity and maintenance audit with compliance export |
| B27 | Event Sourcing & History | Event journal for system and device lifecycle events with timeline visualization. | Event production and persistence, event query by entity and time range, event timeline visualization, event correlation, downtime event tracking | Event journal with timeline, correlation, and downtime tracking |

### Advanced Capabilities

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B28 | Machine Learning & Predictive Maintenance | ML model deployment for anomaly detection, RUL prediction, and condition-based recommendations. | ML model training pipeline, model deployment and versioning, RUL prediction, prediction-to-alert integration, feedback loop for model improvement, bearing library ML enrichment | Deployed ML models with automated retraining and alerting integration |
| B29 | Digital Twin | Virtual representation of physical assets with state synchronization and simulation. | Digital twin model definition, real-time state synchronization, simulation engine, what-if scenario analysis, 3D visualization | State-synchronized twins with simulation and what-if analysis |
| B30 | Edge Computing & Logic | Ability to deploy compute logic at the edge for local processing and offline resilience. | Edge module deployment, edge rule engine, local data filtering, store-and-forward for offline resilience, edge-to-cloud synchronization | Edge rule deployment with store-and-forward and remote diagnostics |
| B31 | Geospatial & Mapping | Spatial awareness of asset locations with map visualization and floor plan support. | Asset location tracking, map visualization (indoor/outdoor), floor plan overlay, geofencing and alerts, spatial queries | Map visualization with floor plans and geofencing |
| B32 | Mobile Workforce | Mobile-first tools for field technicians including offline capability and evidence capture. | Native mobile app (iOS/Android), offline work order execution, barcode/QR scanning for parts and assets, photo/video capture for evidence, push notifications to mobile, location-aware task assignment | Native mobile app with offline execution, scanning, and evidence capture |
| B33 | Product Information Management | Product catalog for spare parts, interchange references, and equipment specifications. | Product CRUD, brand management, part interchange lookup, equipment-to-product mapping, product attribute schemas | Product catalog with interchange lookup and equipment mapping |

## How to Use This Blueprint

When running `10-blueprint`:

1. Map each capability above to the system's L1 capabilities from `06-capabilities.md`
2. Assess coverage as Full, Partial, Gap, or N/A using the sub-capabilities list to determine completeness
3. Use the Maturity Indicator column to calibrate "Full" -- a system with basic work orders but no offline support or alert-triggered creation would be Partial for B15
4. Not every system needs every capability. Mark capabilities as N/A when they don't apply (e.g., B12 OEE may not apply to a pure monitoring platform; B7 Condition-Based Lubrication may not apply to non-rotating-equipment platforms)
5. IIoT platforms often specialize in one pillar (Condition Monitoring, CMMS, or OEE) and have gaps in the others -- this is expected and should be documented, not treated as a failure

## Capability Count

| Category | Capabilities |
| --- | --- |
| Core Asset & Device Management | 4 (B1-B4) |
| Condition Monitoring & Reliability | 5 (B5-B9) |
| Alerting & Rules Engine | 1 (B10) |
| Analytics & Business Intelligence | 4 (B11-B14) |
| Maintenance Management (CMMS) | 4 (B15-B18) |
| Platform Services | 4 (B19-B22) |
| Communication & Integration | 3 (B23-B25) |
| Compliance & Operations | 2 (B26-B27) |
| Advanced | 6 (B28-B33) |
| **Total** | **33** |
