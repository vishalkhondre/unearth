# Data Model — {System Name}

> **Pipeline stage:** S-07 (data model)
> **Date:** {date}
> **Scope:** {list of repositories/projects}

## Entity Inventory

### Storage Entities

| Entity | Source Project | Storage Technology | Collection/Table | Key Fields | File Path |
| --- | --- | --- | --- | --- | --- |
| {name} | {project} | {MongoDB / SQL / Gremlin / Blob} | {collection name} | {PK, partition key} | {path} |

### Projections and DTOs

| Entity | Source Project | Type | Maps To | File Path |
| --- | --- | --- | --- | --- |
| {name} | {project} | {request / response / event / view model} | {storage entity} | {path} |

### Summary

| Category | Count |
| --- | --- |
| Storage entities | {n} |
| Projections / DTOs | {n} |
| View models | {n} |
| **Total** | **{n}** |

## Key Entity Details

### {Entity Name} ({Storage Technology})

| Attribute | Data Type | Constraints | Business Meaning |
| --- | --- | --- | --- |
| {field} | {type} | {PK / required / unique / FK} | {meaning} |

**Business rules:** {rules governing this entity}

## Entity Relationships

| Source | Relationship | Target | Type | Enforcement |
| --- | --- | --- | --- | --- |
| {source} | {description} | {target} | {FK / edge / embedded / implied} | {DB constraint / app logic / none} |

## Capability Alignment

| Entity | Owning Capability | Shared? | Referenced By |
| --- | --- | --- | --- |
| {name} | L1-{n} | {Yes/No} | {other L1s} |

### Coupling Hotspots

| Entity | Capabilities | Risk |
| --- | ---:| --- |
| {name} | {n} | {why this is a risk} |
