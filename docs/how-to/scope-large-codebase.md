# How to Scope a Large Codebase

**Use when:** The codebase has 500+ source files, or the agent is hitting context limits, producing shallow outputs, or taking too long per skill.

**Time required:** Scoping decisions add ~15 minutes upfront but save hours overall.

---

## Why Scoping Matters

Unearth skills work by reading code and reasoning about it. At scale, two things break down:

1. **Context saturation** — the agent can only hold so much in context. A 2,000-file repo means the agent is sampling, not reading. Samples miss things.
2. **Output dilution** — a 50-container system is harder to analyze in one pass than a focused 8-container slice.

Scoping doesn't mean ignoring parts of the codebase. It means choosing where to look first, and building up the full picture incrementally.

---

## Step 1: Run Recon Unscoped First

Always start with full recon — it's fast and gives you the map you need to make scoping decisions:

```
Read skills/00-recon/SKILL.md and run it against the full repository.
Save output to outputs/00-recon.md.
```

**What you're looking for in the output:**

- Section 3 (Project Organization) — how many distinct projects exist?
- Section 4 (File Inventory) — which projects have the most files?
- Section 6 (Build and Deployment) — which projects are independently deployable?

If recon itself is slow or shallow, the codebase is too large to analyze even in recon. In that case, start with the dominant language subdirectory:

```
Read skills/00-recon/SKILL.md.
Scope: src/backend/ only. Ignore src/frontend/, docs/, and tools/.
Save output to outputs/00-recon-backend.md.
```

---

## Step 2: Choose a Scoping Strategy

Based on the recon output, pick the strategy that fits your goal:

### Strategy A: Vertical Slice (Recommended for First Passes)

Analyze one business domain end-to-end rather than the whole system at surface level.

**When to use:** You need to understand one area deeply — e.g., the payments domain, the authentication system, or the data ingestion pipeline.

**How:** After recon, identify the most business-critical or highest-risk area. Run all subsequent skills scoped to that slice.

```
From here, focus on the [Orders domain]:
- src/OrderService/
- src/OrderWorker/
- src/Contracts/Orders/
Run all skills scoped to these directories only.
```

### Strategy B: Container-by-Container

Analyze the system one deployable unit at a time, completing all skills for each container before moving to the next.

**When to use:** You're doing full documentation of a large system and want accurate component-level outputs.

**How:** Run recon and containers first to get the full container inventory. Then pick the highest-priority container and run the full pipeline on it.

```
After running 04-containers, the system has 12 containers.
Priority order for deep analysis:
1. OrderProcessingAPI (most critical, highest entry-point count)
2. InventoryWorker (highest tech debt indicators from recon)
3. NotificationService (simplest, use as calibration check)
```

### Strategy C: Pipeline Depth Limit

Run all skills but stop at a specific depth — useful when you need breadth over depth.

**When to use:** You need a complete system map quickly (e.g., for a stakeholder briefing) but don't need component-level detail.

```
Run the pipeline to Stage 2 only (through 04-containers).
Do not run 05-components.
```


| Depth       | Stops After | Outputs                     | Good For                                  |
| ----------- | ----------- | --------------------------- | ----------------------------------------- |
| Orientation | S-02        | Recon, entry points, actors | "What is this?"                           |
| Structure   | S-04        | + Containers                | Stakeholder briefing, architecture review |
| Knowledge   | S-07        | + Capabilities, data model  | Domain mapping, migration planning        |
| Full        | S-13        | Everything                  | Complete documentation, due diligence     |


---

## Step 3: Communicate Scope to the Agent

Be explicit. Agents don't infer scope — they need it stated:

```
For all remaining skills, scope your analysis to:
- src/backend/OrderService/
- src/backend/Shared/

Explicitly ignore:
- src/frontend/ (out of scope for this run)
- src/legacy/ (deprecated, not in scope)
- test/ (analyze test coverage as a signal, but don't analyze test files as primary sources)
```

Add scope context to the output header:

```
When writing output files, include a scope note at the top:
"Analysis scoped to OrderService and Shared components only.
Frontend and Legacy directories excluded."
```

---

## Step 4: Watch for Scale Signals During the Run

These are signs the agent is hitting scale limits during a skill run:


| Signal                                                 | What It Means                               | What to Do                                      |
| ------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------- |
| Output is significantly shorter than expected          | Agent is sampling, not reading              | Narrow the scope further or split into sub-runs |
| Many `[NEEDS VERIFICATION]` items                      | Agent is guessing due to incomplete context | Run the skill on a smaller scope                |
| Findings are generic ("this service handles requests") | Not enough context per file                 | Run the skill on 1–2 components at a time       |
| Agent says it can't read more files                    | Context limit hit                           | Restart with explicit file exclusions           |


---

## Step 5: Merge Partial Results

If you ran skills in multiple scoped passes, merge the outputs before running downstream skills.

**For recon:** Manually or with the agent, combine `00-recon-backend.md` and `00-recon-frontend.md` into a single `00-recon.md` summary that downstream skills can reference.

Tell the agent:

```
I have two recon outputs from separate passes:
- outputs/00-recon-backend.md
- outputs/00-recon-frontend.md

Combine them into outputs/00-recon.md.
Keep all evidence. Where the same project appears in both, merge the entries.
```

**For containers:** Run `04-containers` on the combined picture once you have enough upstream context. Don't run it per-scope.

---

## Rough File Count Guidelines


| File Count        | Recommended Approach                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| < 200 files       | Run the full pipeline unscoped                                                       |
| 200–500 files     | Run unscoped; consider container-by-container for `05-components`                    |
| 500–1,000 files   | Use Strategy A (vertical slice) or Strategy C (depth limit)                          |
| 1,000–3,000 files | Use Strategy B (container-by-container) with explicit scope per skill                |
| > 3,000 files     | Run recon only on full repo; all subsequent skills scoped to one container at a time |


These are guidelines, not rules. A 500-file repo with a flat structure is easier than a 300-file repo with deep abstraction layers.

---

## Scoping Checklist

Before starting a large codebase run:

- Recon has completed and Section 3 (Project Organization) is populated
- You've identified which projects are in scope and which are out of scope
- You've chosen a scoping strategy (vertical slice, container-by-container, or depth limit)
- The scope is explicitly stated in the first message of the agent session
- Out-of-scope directories are explicitly listed as exclusions
- You have a plan for merging partial outputs if running in passes

