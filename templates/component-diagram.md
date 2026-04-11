# Component Diagram — {Container Name} ({Container ID})

> **Pipeline stage:** S-05 (components)
> **Date:** {date}
> **Scope:** {container ID, name, source directory}

## Container Under Analysis

| Attribute | Value |
| --- | --- |
| **Container** | {CON-ID}: {name} |
| **Technology** | {framework + version} |
| **Source files** | {count} |
| **Test files** | {count} |
| **Entry points** | {count} |

## Layer Structure

| Layer | Directory | Files | Key Files |
| --- | --- | ---:| --- |
| Entry | {path} | {n} | {notable files} |
| Services | {path} | {n} | {notable files} |
| Data Access | {path} | {n} | {notable files} |
| Models | {path} | {n} | {notable files} |
| Validation | {path} | {n} | {notable files} |

## Business Components

### {BC-ID}: {Component Name}

**Responsibilities:** {2-3 sentences}

| Layer | Files |
| --- | --- |
| Entry | {file list} |
| Service | {file list} |
| Repository | {file list} |
| Models | {file list} |
| Tests | {file list} |

**Business Rules:**

| Rule | Enforced In | Method |
| --- | --- | --- |
| {rule} | {class} | {how} |

**Known Issues:**

| ID | Type | Severity | Description |
| --- | --- | --- | --- |
| {id} | {GOD/TEST/COUPLING} | {severity} | {description} |

## Technical Components

| ID | Name | Files | Used By |
| --- | --- | --- | --- |
| TC-01 | {name} | {files} | {BC-IDs} |

## God Classes

| File | Lines | Layer | Component | Severity |
| --- | ---:| --- | --- | --- |
| {path} | {n} | {layer} | {BC-ID} | {HIGH/MEDIUM} |

## Test Coverage

| Component | Has Tests? | Test Methods | Gaps |
| --- | --- | ---:| --- |
| {BC-ID}: {name} | {Yes/No/Partial} | {n} | {what's not tested} |
