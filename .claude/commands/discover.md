Run the full Unearth discovery pipeline on this codebase.

Read `skills/using-unearth/SKILL.md` for the complete pipeline overview, then execute all skills in order:

**Stage 1: Reconnaissance**
1. `skills/00-recon/SKILL.md` → `outputs/00-recon.md`
2. Load the matching stack adapter from `stack-adapters/` based on the detected technology.
3. `skills/01-entry-points/SKILL.md` → `outputs/01-entry-points.md`
4. `skills/02-actors-and-boundaries/SKILL.md` → `outputs/02-actors-and-boundaries.md`

**Stage 2: Structure**
5. `skills/03-external-systems/SKILL.md` → `outputs/03-external-systems.md`
6. `skills/04-containers/SKILL.md` → `outputs/04-containers.md`
7. `skills/05-components/SKILL.md` → `outputs/05-components-{id}.md` for the top 1-3 containers by complexity.

**Stage 3: Knowledge**
8. `skills/06-capabilities/SKILL.md` → `outputs/06-capabilities.md`
9. `skills/07-data-model/SKILL.md` → `outputs/07-data-model.md`
10. `skills/08-patterns/SKILL.md` → `outputs/08-patterns.md`
11. `skills/09-dependencies/SKILL.md` → `outputs/09-dependencies.md`

**Stage 4: Assessment**
12. `skills/10-blueprint/SKILL.md` → `outputs/10-blueprint.md` (select the best-matching blueprint from `blueprints/`)
13. `skills/11-tech-debt/SKILL.md` → `outputs/11-tech-debt.md`
14. `skills/12-traceability/SKILL.md` → `outputs/12-traceability.md`
15. `skills/13-documentation/SKILL.md` → `outputs/13-documentation.md`

Scope: $ARGUMENTS

If no scope is specified, discover all repositories in the current workspace.

For each skill: read its SKILL.md, follow the process, stop at CHECKPOINTs, produce the output, and run the verification checklist before proceeding to the next skill.

After completing the full pipeline, present:
- The executive summary from `outputs/13-documentation.md`
- The blueprint scorecard from `outputs/10-blueprint.md`
- The top 5 tech debt items from `outputs/11-tech-debt.md`
