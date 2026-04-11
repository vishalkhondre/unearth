# Creating Blueprints

A guide to creating new industry blueprints for Unearth. Blueprints are reference capability models that skill `10-blueprint` uses for gap analysis — comparing what a system has against what a mature platform in its domain should have.

## What a Blueprint Does

A blueprint defines the complete capability landscape for a specific industry domain. When Unearth runs the blueprint comparison, it maps the system's discovered capabilities against the blueprint to identify full matches, partial coverage, and gaps.

The result is a scorecard that tells stakeholders: "Your system covers 18 of 33 IIoT platform capabilities, with 4 critical gaps in condition monitoring and maintenance management."

## Blueprint Structure

Every blueprint lives in `blueprints/{name}.md` and follows this structure:

```markdown
---
name: {identifier}
domain: "{Industry Domain Name}"
version: "{semver}"
sources:
  - {Industry framework or standard 1}
  - {Industry framework or standard 2}
  - Vendor feature sets -- {Vendor 1, Vendor 2, Vendor 3}
---

# {Domain Name} Blueprint

{One paragraph describing the domain and what this blueprint covers.}

## When to Use This Blueprint
{Criteria for when this blueprint applies and when it doesn't.}

## Capability Domains

### {Category Name}

| ID | Capability | Description | Sub-Capabilities | Maturity Indicator |
| --- | --- | --- | --- | --- |
| B1 | {name} | {description} | {comma-separated sub-capabilities} | {what "Full" looks like} |

## How to Use This Blueprint
{Guidance for running 10-blueprint with this reference.}

## Capability Count
{Summary table by category.}
```

## How to Research a Blueprint

### Step 1: Identify Industry Frameworks

Every domain has standards bodies and reference architectures. Find 2-3 authoritative sources:

| Domain | Example Sources |
| --- | --- |
| E-commerce | MACH Alliance principles, Shopify/Magento feature sets, PCI DSS requirements |
| Fintech | PSD2/Open Banking standards, Plaid/Stripe capabilities, ISO 20022 |
| Healthcare | HL7 FHIR, HIPAA requirements, Epic/Cerner feature sets |
| SaaS B2B | SaaCI maturity model, Salesforce/HubSpot capabilities, SOC 2 requirements |
| IIoT | IIC IIRA, ISA-95, Azure IoT / AWS IoT SiteWise architectures |

### Step 2: Study Leading Vendors

Pick 3-5 leading vendors in the domain and study their solution pages:
- What capabilities do they advertise?
- How do they organize their feature set?
- What do they consider table-stakes vs. differentiating?

This grounds the blueprint in real market expectations, not abstract standards.

### Step 3: Define Capability Categories

Group capabilities into 6-10 categories. Categories should reflect how domain practitioners think about the platform, not technical layers.

**Good categories:** "Condition Monitoring & Reliability", "Maintenance Management", "Analytics & BI"
**Bad categories:** "Backend Services", "Data Layer", "UI Features"

### Step 4: Write Capability Entries

For each capability:

**ID:** Sequential within the blueprint (B1, B2, B3...).

**Name:** Business-language name that a domain practitioner would recognize.

**Description:** 1-2 sentences explaining what this capability covers. Be specific enough that someone could assess whether their system has it.

**Sub-Capabilities:** Comma-separated list of specific functions within the capability. These are the checklist for determining Full vs. Partial coverage. Aim for 5-10 sub-capabilities per capability.

**Maturity Indicator:** What "Full" coverage looks like for a mature platform. This sets the bar — a system with basic CRUD for users but no SSO or MFA would be Partial, not Full, for User Management.

## Quality Checklist

Before submitting a new blueprint:

- [ ] YAML frontmatter with `name`, `domain`, `version`, `sources`
- [ ] At least 3 sources cited (industry frameworks + vendor feature sets)
- [ ] 15-35 capabilities organized into 5-10 categories
- [ ] Every capability has: ID, name, description, sub-capabilities, maturity indicator
- [ ] Sub-capabilities are specific enough to assess as present/absent
- [ ] "When to Use" section defines inclusion and exclusion criteria
- [ ] "How to Use" section provides assessment guidance
- [ ] Capability count summary table at the bottom
- [ ] No capabilities that only apply to one specific vendor (keep it vendor-neutral)
- [ ] "N/A" guidance: which capabilities are optional for which types of platforms

## Existing Blueprints for Reference

- `blueprints/iiot-saas.md` — the reference implementation (33 capabilities, 10 categories, 7 sources including Tractian capability extraction)

Study this blueprint before writing a new one. It demonstrates the expected level of research, specificity, and assessment guidance.

## Capability Count Guidelines

| Domain Complexity | Suggested Range |
| --- | --- |
| Focused tool (e.g., monitoring-only) | 15-20 capabilities |
| Full platform (e.g., IIoT SaaS) | 25-35 capabilities |
| Enterprise suite (e.g., ERP) | 35-50 capabilities |

Too few capabilities means the gap analysis won't find meaningful differences. Too many means every system looks incomplete.

## File Location

Save your blueprint to: `blueprints/{name}.md`

Use lowercase kebab-case names: `e-commerce`, `fintech-core-banking`, `saas-b2b`, `healthcare-ehr`.
