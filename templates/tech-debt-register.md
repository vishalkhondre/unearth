# Tech Debt Register — {System Name}

> **Pipeline stage:** S-11 (tech debt)
> **Date:** {date}
> **Scope:** {list of repositories/projects}

## Debt Register

### CRITICAL

| ID | Finding | Category | Source | Components | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TD-{cat}-{nn} | {description} | {CQ/TC/AR/RS/SE/DP/DM/RD} | S-{nn} | {BC/TC/CON IDs} | {S/M/L/XL} | {file paths, line counts} |

### HIGH

| ID | Finding | Category | Source | Components | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TD-{cat}-{nn} | {description} | {category} | S-{nn} | {IDs} | {effort} | {evidence} |

### MEDIUM

| ID | Finding | Category | Source | Components | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TD-{cat}-{nn} | {description} | {category} | S-{nn} | {IDs} | {effort} | {evidence} |

### LOW

| ID | Finding | Category | Source | Components | Effort | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TD-{cat}-{nn} | {description} | {category} | S-{nn} | {IDs} | {effort} | {evidence} |

## Summary Statistics

| Metric | Value |
| --- | --- |
| Total debt items | {n} |
| Critical | {n} |
| High | {n} |
| Medium | {n} |
| Low | {n} |

### By Category

| Category | Count | % |
| --- | ---:| --- |
| Code quality (CQ) | {n} | {%} |
| Test coverage (TC) | {n} | {%} |
| Architecture (AR) | {n} | {%} |
| Resilience (RS) | {n} | {%} |
| Security (SE) | {n} | {%} |
| Dependency (DP) | {n} | {%} |
| Data model (DM) | {n} | {%} |
| Redundancy (RD) | {n} | {%} |

### Most Affected Components

| Component | Debt Items | Most Severe |
| --- | ---:| --- |
| {BC/TC/CON ID}: {name} | {count} | {highest severity} |

## Remediation Roadmap

### Quick Wins

| Priority | Debt ID(s) | Action | Expected Outcome |
| --- | --- | --- | --- |
| 1 | TD-{id} | {what to do} | {result} |

### Planned Work

| Priority | Debt ID(s) | Action | Prerequisite | Expected Outcome |
| --- | --- | --- | --- | --- |
| 1 | TD-{id} | {what to do} | {none or TD-{id}} | {result} |

### Strategic Items

| Priority | Debt ID(s) | Action | Prerequisite | Expected Outcome |
| --- | --- | --- | --- | --- |
| 1 | TD-{id} | {what to do} | {prerequisite} | {result} |

### Deferred

| Debt ID(s) | Reason |
| --- | --- |
| TD-{id} | {why deferred} |
