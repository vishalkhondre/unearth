# How to Use a Custom Blueprint for Gap Analysis

**Use when:** The built-in blueprints don't match your system's domain, or you want to compare a codebase against your organization's own reference architecture.

**Time required:** ~1–2 hours to create the blueprint; 30 minutes to run the comparison.

---

## What a Blueprint Does

A blueprint is a reference capability model — a list of capabilities that a well-designed system in a given domain *should* have. When you run skill `10-blueprint`, the agent compares what you discovered in skill `06-capabilities` against the blueprint and produces:

- **Full matches** — capabilities the system has and the blueprint expects
- **Partial matches** — capabilities present but incomplete or under-developed
- **Critical gaps** — capabilities the blueprint expects that are entirely missing
- **Surprises** — capabilities the system has that the blueprint doesn't expect

The blueprint itself is not a judgment about quality. It's a structured baseline for a conversation.

---

## Step 1: Check if an Existing Blueprint Fits

Before creating a custom blueprint, check what's available:

```
blueprints/
└── iiot-saas.md     → Industrial IoT SaaS (22 capabilities, based on IIC IIRA + ISA-95)
```

If your system is an Industrial IoT platform, use this directly. Skip to Step 4.

For other domains (e-commerce, fintech, healthcare, B2B SaaS, logistics, etc.), you'll need to create one.

---

## Step 2: Define Your Domain and Tier

A blueprint has a domain and a tier that set expectations. Be specific.

**Domain examples:**
- "Multi-tenant B2B SaaS platform"
- "Core banking system (retail)"
- "E-commerce platform with marketplace model"
- "Healthcare patient portal (patient-facing)"
- "Industrial asset monitoring platform"

**Tier:** What level of maturity are you benchmarking against?

| Tier | Meaning | Use When |
| --- | --- | --- |
| `foundational` | Basic capabilities any system in this domain must have | Assessing a legacy system or MVP |
| `standard` | What a well-run production system should have | Most commercial due diligence |
| `advanced` | What market leaders in this domain have built | Competitive analysis, aspirational roadmap |

---

## Step 3: Build the Capability List

Create a Markdown file at `blueprints/<domain-slug>.md`. The structure mirrors the existing `iiot-saas.md` blueprint.

### Template

```markdown
---
name: <blueprint-name>
domain: <domain>
tier: <foundational | standard | advanced>
version: "1.0"
based-on: <source frameworks, standards, or reference architectures>
---

# <Blueprint Name> Reference Architecture

Brief description of the domain and what this blueprint covers. 1–2 sentences.

## Capability Model

### L1: <Category Name>

| ID | Capability | Description | Priority |
| --- | --- | --- | --- |
| CAP-01 | <Capability Name> | What this capability enables for users or operators | Must Have / Should Have / Nice to Have |
| CAP-02 | ... | ... | ... |

### L1: <Next Category Name>

| ID | Capability | Description | Priority |
| --- | --- | --- | --- |
| CAP-10 | ... | ... | ... |

## Benchmark Notes

Optional section. Add notes about how to interpret specific capabilities,
common partial-match scenarios, or capabilities that are often present
but implemented differently across systems.
```

---

## Step 4: Populate the Capabilities

A good blueprint has 15–30 L1 capabilities grouped into 5–8 categories.

**Where to source the capabilities:**
- Industry standards relevant to your domain (BIAN for banking, HL7 FHIR for healthcare, ISA-95 for industrial, TOGAF for enterprise)
- Cloud provider reference architectures (Azure Well-Architected Framework, AWS Reference Architectures)
- Domain-specific analyst frameworks (Gartner, Forrester) for commercial software categories
- Your organization's own architecture standards or platform design guidelines

**Writing good capability descriptions:**
- Describe what the capability *enables* for users or operators — not what it is technically
- Keep each capability at the right level of abstraction — "User Identity Management" not "JWT token generation"
- A capability should map to 2–5 L2 sub-capabilities in the discovered system

**Example — B2B SaaS platform:**

```markdown
### L1: Tenant Management

| ID | Capability | Description | Priority |
| --- | --- | --- | --- |
| CAP-01 | Tenant Provisioning | Create, configure, and onboard new tenant organizations with isolated data and settings | Must Have |
| CAP-02 | Tenant Configuration | Allow each tenant to customize behavior, branding, and feature flags | Should Have |
| CAP-03 | Tenant Suspension | Suspend, deactivate, or terminate tenants with data retention controls | Must Have |
| CAP-04 | Usage Metering | Track per-tenant resource consumption for billing and capacity planning | Should Have |
| CAP-05 | Tenant Impersonation | Allow support staff to safely access tenant context for troubleshooting | Should Have |

### L1: Identity and Access

| ID | Capability | Description | Priority |
| --- | --- | --- | --- |
| CAP-06 | User Authentication | Authenticate users via username/password, SSO, or MFA | Must Have |
| CAP-07 | Role-Based Authorization | Control access to features and data by role within a tenant | Must Have |
| CAP-08 | API Key Management | Issue, rotate, and revoke programmatic access credentials for integrations | Should Have |
```

---

## Step 5: Run the Capabilities Skill First

Before using your blueprint, you need the capabilities output from the codebase you're analyzing. If you haven't already:

```
Read skills/06-capabilities/SKILL.md.
Use all upstream outputs (00-recon through 05-components).
Save output to outputs/06-capabilities.md.
```

The blueprint comparison is meaningless without a capabilities map to compare against.

---

## Step 6: Run the Blueprint Comparison

```
Read skills/10-blueprint/SKILL.md.
Use outputs/06-capabilities.md as the primary input.
Use blueprints/<your-domain>.md as the reference architecture.
Save output to outputs/10-blueprint.md.
```

Tell the agent explicitly which blueprint to use:

```
Reference architecture for this comparison: blueprints/b2b-saas.md
Domain: Multi-tenant B2B SaaS platform
Tier: standard
```

---

## Step 7: Interpret the Results

The blueprint output has five sections to focus on:

**Critical Gaps** — capabilities in the blueprint with `Must Have` priority that are entirely absent from the discovered system. These are the highest-value findings. For due diligence, a critical gap is a risk. For a modernization roadmap, it's a near-term investment.

**Partial Matches** — capabilities present but incomplete. Look at what's missing within the partial match. "User Authentication" partially matching might mean SSO is absent, or MFA isn't implemented.

**Full Matches** — capabilities the system has that meet the benchmark. Don't ignore these — they're evidence of what the team has built well.

**Surprises** — capabilities the system has that the blueprint doesn't expect. These can be competitive differentiators or scope creep, depending on context.

**Overlap / Redundancy** — if the system has multiple implementations of the same capability (common in legacy systems), the blueprint comparison will surface them.

---

## Calibrating the Blueprint After the First Run

The first comparison often reveals that your blueprint needs adjustment. Common calibration needs:

**Blueprint is too broad for the codebase:**
The system is a narrow point solution (e.g., a single billing microservice) but the blueprint covers a full platform. Narrow the blueprint's scope or add a "capabilities in scope" list.

**Blueprint is missing domain-specific capabilities:**
The first run surfaces capabilities in the codebase that you didn't anticipate. Add them to the blueprint and re-run.

**Capability names don't align:**
The discovered system uses different terminology than the blueprint. Add an "also known as" note to the benchmark:
```
| CAP-07 | Role-Based Authorization | ... | also called "RBAC", "permissions model", "access control" |
```

After calibrating, re-run the comparison skill with the updated blueprint.

---

## Sharing and Versioning Blueprints

If you're creating a blueprint for organizational use (not just one project), version it explicitly:

```yaml
---
name: My Company Reference Architecture
domain: B2B SaaS
tier: standard
version: "2.1"
last-updated: 2025-04
based-on: Internal ADR-001, AWS SaaS Reference Architecture
---
```

Store it in the `blueprints/` directory and reference it by filename in your discovery runs. Bump the version number when capability definitions change — stale blueprints produce misleading gap analyses.

---

## Blueprint Checklist

Before running the comparison:
- [ ] Blueprint file exists in `blueprints/`
- [ ] Blueprint has 15–30 L1 capabilities in 5–8 categories
- [ ] Every capability has a `Priority` field (`Must Have`, `Should Have`, `Nice to Have`)
- [ ] `outputs/06-capabilities.md` exists from a completed capabilities skill run
- [ ] Domain and tier are explicitly stated when invoking the blueprint skill
