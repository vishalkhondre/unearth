# Context Diagram — {System Name}

> **Pipeline stage:** S-02 + S-03 (actors, boundaries, external systems)
> **Date:** {date}
> **Scope:** {list of repositories/projects}

## Actors

| Actor | Type | Auth Pattern | Description |
| --- | --- | --- | --- |
| {name} | {Human / System} | {JWT Bearer / API Key / Anonymous / etc.} | {what they do with the system} |

## System Boundary

**Inside:** {list of projects/containers that are part of the system}

**Outside:** {list of external systems and actors}

## External Systems

| System | Classification | Access Direction | Purpose |
| --- | --- | --- | --- |
| {name} | {data store / messaging / identity / observability / etc.} | {READ / WRITE / READ+WRITE} | {what it provides to the system} |

## Relationships

| From | To | Description | Protocol |
| --- | --- | --- | --- |
| {actor or system} | {actor or system} | {what flows between them} | {HTTPS / AMQP / WebSocket / etc.} |

## C4 Context Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title System Context Diagram — {System Name}

' Actors
Person(actor1, "{Actor Name}", "{Description}")

' System
System(system, "{System Name}", "{System Description}")

' External Systems
System_Ext(ext1, "{External System}", "{Description}")

' Relationships
Rel(actor1, system, "{description}", "{protocol}")
Rel(system, ext1, "{description}", "{protocol}")

@enduml
```
