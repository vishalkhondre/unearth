# Container Diagram — {System Name}

> **Pipeline stage:** S-04 (containers)
> **Date:** {date}
> **Scope:** {list of repositories/projects}

## Container Inventory

| ID | Name | Technology | Type | Entry Points | Primary Responsibility | Deploy Target |
| --- | --- | --- | --- | ---:| --- | --- |
| CON-001 | {name} | {tech + version} | {Web App / API / Function / SPA / Hub} | {count} | {one sentence} | {target} |

## Non-Container Projects

| Project | Classification | Justification |
| --- | --- | --- |
| {name} | {shared library / test / tooling} | {why it's not a container} |

## Communication Map

| # | Source | Target | Protocol | Direction | Notes |
| --- | --- | --- | --- | --- | --- |
| CC-01 | {CON-ID (name)} | {CON-ID (name)} | {HTTPS / WebSocket / AMQP / etc.} | {sync / async / bidirectional} | {notes} |

## Architecture Patterns

| Pattern | Containers Involved | Assessment |
| --- | --- | --- |
| {pattern name} | {CON-IDs} | {well-implemented / partial / problematic} |

## Communication Topology

```
{ASCII diagram showing containers and their connections}
```

## Key Request Flows

### Flow 1: {Name}
{CON-001 → CON-002 → CON-003 → response}

## Risks

| # | Risk | Severity | Containers Affected |
| --- | --- | --- | --- |
| 1 | {description} | {HIGH / MEDIUM / LOW} | {CON-IDs} |
