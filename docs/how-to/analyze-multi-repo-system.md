# How to Analyze a Multi-Repo System

**Use when:** The codebase you're analyzing spans multiple repositories — e.g., a backend API in one repo, a frontend in another, shared libraries in a third.

**Core idea:** Give the agent access to all repositories at once and let each skill analyze them as a single unified system from the start. Don't run skills repo by repo.

---

## The Right Mental Model

The discovery pipeline treats the system as its unit of analysis, not the repository. A multi-repo system is still one system — it just happens to be stored in multiple directories. The agent already knows how to reason across files and directories; your job is to make sure all the repos are visible to it simultaneously.

Running recon on each repo separately and merging outputs later is unnecessary extra work and introduces gaps at the seams. Instead:

1. Clone all repos side by side (or ensure the agent has read access to all of them)
2. Tell the agent where they all are in the first message
3. Run each skill once, with all repos in scope

---

## Step 1: Lay Out the Repos

Clone all repositories into a common parent directory:

```bash
mkdir discovery && cd discovery
git clone https://github.com/company/api
git clone https://github.com/company/frontend
git clone https://github.com/company/shared-lib
git clone https://github.com/company/infra
```

The result:

```
discovery/
├── api/
├── frontend/
├── shared-lib/
└── infra/
```

The agent will work from this parent directory. All repos are visible, all at once.

---

## Step 2: Set the Scene in the First Message

At the start of the session, tell the agent what it's looking at — once, clearly:

```
I have a multi-repo system. All repositories are available in the current working directory:

- api/           → Backend REST API and background workers (.NET / ASP.NET Core)
- frontend/      → Single-page application (React / TypeScript)
- shared-lib/    → Shared domain models and contracts (.NET class library)
- infra/         → Infrastructure as code (Terraform / Azure)

Treat all of these as parts of a single system throughout this entire session.
The system boundary encloses all four repositories.
When a skill asks you to scan or analyze the codebase, include all four.
```

This framing persists for the whole session — you don't need to repeat it per skill.

---

## Step 3: Run the Pipeline Normally

From here, run skills exactly as you would for a single repo. Each skill will naturally span all repos.

**Recon:**
```
Read skills/00-recon/SKILL.md and follow its process.
The codebase is the four repositories described above. Scan all of them.
Save output to outputs/00-recon.md.
```

The recon output's Project Organization section will list all four repos as projects within the system.

**Entry Points:**
```
Read skills/01-entry-points/SKILL.md.
Use outputs/00-recon.md as input.
Find entry points across all repositories.
Save output to outputs/01-entry-points.md.
```

The agent will find HTTP routes in `api/`, page routes in `frontend/`, and correctly identify that `shared-lib/` has no runtime entry points.

**All remaining skills** follow the same pattern — invoke once, all repos in scope, one output file per skill.

---

## What the Skills Handle for You

Because the agent has the full picture from the start, the skills naturally resolve things that would require manual merging in a repo-by-repo approach:

| Concern | How it's handled |
| --- | --- |
| Cross-repo dependencies | The agent sees `shared-lib/` imported in `api/` and correctly maps it as an internal component, not an external system |
| Shared database connections | Both `api/` and a worker in the same repo pointing to the same connection string → one external system entry, not two |
| Event flows across repos | A publisher in `api/` and a consumer in a second service both visible → the agent maps the full flow |
| Containers spanning repos | `api/` has two deployable units (web app + worker) → both appear in the containers output alongside the frontend |

---

## One Thing to Make Explicit: Scope Boundaries

The agent benefits from knowing upfront which repos are runtime systems and which are supporting assets. This isn't about running skills differently — it's about setting the right expectations for the output:

```
Additional context:
- shared-lib/ is a compile-time dependency only (NuGet package). It is not deployed independently.
- infra/ is Terraform — infrastructure as code, not a running service.
- api/ and frontend/ are independently deployable.

In the containers output, shared-lib should appear as a component of its consumers,
not as a standalone container.
```

Without this, the agent may treat `shared-lib/` as a container candidate — technically correct (it's a project), but not meaningful in the C4 Container diagram.

---

## Output Files Are Still One Per Skill

Even though all repos are in scope, outputs remain one file per skill:

```
outputs/
├── 00-recon.md                     ← covers all four repos
├── 01-entry-points.md              ← all entry points across all repos
├── 02-actors-and-boundaries.md     ← system-level boundary (one system)
├── 03-external-systems.md          ← external deps found in any repo
├── 04-containers.md                ← deployable units from all repos
├── 05-components-api.md            ← one file per container (per repo slice)
├── 05-components-frontend.md
├── 06-capabilities.md              ← one capability map for the whole system
└── ...
```

The only skill that runs more than once is `05-components` — once per deployable container, regardless of which repo it lives in.

---

## Common Pitfall: Forgetting to Re-State Scope After a Context Reset

In long sessions, some agents reset context between conversations. If you resume a discovery session after a break, re-state the multi-repo framing at the top of the new session before running the next skill. A single sentence is enough:

```
Continuing discovery. The system spans four repos: api/, frontend/, shared-lib/, infra/.
All are in the current working directory. Treat them as one system.
Next: read skills/04-containers/SKILL.md and follow its process.
```
