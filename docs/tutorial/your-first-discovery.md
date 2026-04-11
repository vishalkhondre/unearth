# Tutorial: Your First Discovery

A hands-on walkthrough of running Unearth on a real codebase. By the end, you'll have completed Stage 1 (Reconnaissance) and produced 3 output files.

**Time required:** ~30 minutes
**Prerequisites:** An AI coding agent set up with Unearth (see [Getting Started](../getting-started.md))

## What You'll Build

By the end of this tutorial, you'll have:
- `outputs/00-recon.md` — technology stack, project organization, file inventory
- `outputs/01-entry-points.md` — every HTTP route, event trigger, and message handler
- `outputs/02-actors-and-boundaries.md` — actors, system boundary, actor-to-system relationships

These three files give you enough to have an informed conversation about any codebase.

## Step 1: Choose Your Target Codebase

Pick a codebase you have access to. Ideal characteristics for a first run:
- A backend application with HTTP APIs (any language)
- 10-100 source files (large enough to be interesting, small enough to be fast)
- A technology you're familiar with (so you can verify the findings)

If you don't have a codebase handy, use any open-source project with a backend API.

## Step 2: Run Recon

Tell your agent:

```
Read skills/00-recon/SKILL.md and follow its process on this codebase.
Save the output to outputs/00-recon.md.
```

**What happens:** The agent scans the repository structure, detects languages and frameworks, identifies projects, counts files, and detects build systems.

**What to check in the output:**
- Does Section 2 (Technology Stack) correctly identify the languages and frameworks?
- Does Section 3 (Project Organization) list all projects?
- Does Section 4 (File Inventory) have reasonable counts?

**If something looks wrong:** The agent may have missed a project or misidentified a framework. Tell it: "Check again — I expected to see {framework} in the technology stack. Look for {config file}."

## Step 3: Load a Stack Adapter (Optional)

If your codebase uses a technology with an available adapter, load it now:

```
Read stack-adapters/dotnet/ADAPTER.md and apply its hints for all subsequent skills.
```

Available adapters: `dotnet`, `java-spring`, `python-django`, `node-express`, `ruby-rails`, `generic`.

**Why this helps:** The adapter tells the agent what to look for in your specific ecosystem — which files indicate entry points, how to find database entities, what package names map to which external services.

## Step 4: Find Entry Points

Tell your agent:

```
Read skills/01-entry-points/SKILL.md. Use outputs/00-recon.md as input.
Follow the process and save to outputs/01-entry-points.md.
```

**What happens:** The agent scans every project for HTTP endpoints, event triggers, scheduled jobs, message handlers, WebSocket hubs, and background workers.

**What to check in the output:**
- Does Section 1 (Summary) show entry point counts per project?
- Does Section 2 (HTTP Endpoints) list routes you recognize?
- Does Section 3 (Non-HTTP Triggers) catch event handlers or timer jobs?

**Common surprise:** Most teams don't realize how many entry points their system has. A "simple API" often has 50+ endpoints when you count health checks, internal routes, and event triggers.

## Step 5: Identify Actors and Boundaries

Tell your agent:

```
Read skills/02-actors-and-boundaries/SKILL.md.
Use outputs/00-recon.md and outputs/01-entry-points.md as input.
Follow the process and save to outputs/02-actors-and-boundaries.md.
```

**What happens:** The agent examines authentication patterns on every entry point to identify who (or what) calls the system. It then draws the system boundary — what's inside vs. outside.

**What to check in the output:**
- Does Section 2 (Human Actors) list the right user types?
- Does Section 3 (System Actors) catch external services calling in?
- Does Section 4 (System Boundary) correctly classify what's inside vs. outside?

**Common surprise:** Monitoring probes, load balancer health checks, and partner API consumers are often "invisible" actors that the team doesn't think about — but they're real entry points with real auth patterns.

## Step 6: Review What You've Learned

In 30 minutes, you've produced a grounded understanding of:

| Question | Where to Find the Answer |
| --- | --- |
| What technology does this system use? | `00-recon.md` Section 2 |
| How many projects are in the repo? | `00-recon.md` Section 3 |
| How many entry points exist? | `01-entry-points.md` Section 1 |
| Who uses the system? | `02-actors-and-boundaries.md` Section 2-3 |
| What's inside vs. outside? | `02-actors-and-boundaries.md` Section 4 |

Every answer is backed by file-level evidence — not assumptions or documentation claims.

## What's Next

You've completed Stage 1 (Reconnaissance). From here, you can:

- **Go deeper:** Run `/containers` to begin Stage 2 and map the deployment architecture
- **Extract capabilities:** Run through Stage 2 + `/capabilities` to produce a business capability map
- **Run the full pipeline:** Use `/discover` to run all 14 skills end-to-end
- **Try a persona:** Load the Tech Debt Auditor persona for a quality-focused analysis

See `skills/using-unearth/SKILL.md` for all partial run options and time estimates.
