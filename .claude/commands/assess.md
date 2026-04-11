Run the Unearth assessment stage on this codebase.

This command runs Stage 4 (Assessment) skills, assuming Stages 1-3 have already been completed:

**Step 1: Blueprint Comparison** (if `outputs/10-blueprint.md` doesn't exist)
Read `skills/10-blueprint/SKILL.md`. Select the best-matching blueprint from `blueprints/` based on the system's domain. Save to `outputs/10-blueprint.md`.

**Step 2: Tech Debt Register**
Read `skills/11-tech-debt/SKILL.md`. Harvests findings from all upstream outputs into a prioritized register. Save to `outputs/11-tech-debt.md`.

**Step 3: Traceability**
Read `skills/12-traceability/SKILL.md`. Maps files to components to capabilities. Assesses migration readiness. Save to `outputs/12-traceability.md`.

**Step 4: Documentation**
Read `skills/13-documentation/SKILL.md`. Synthesizes everything into the final architecture document. Save to `outputs/13-documentation.md`.

Prerequisites: At minimum, `outputs/05-components-*.md` and `outputs/06-capabilities.md` must exist. For best results, all Stage 1-3 outputs should be present.

After completing:
1. Present the executive summary from the documentation output.
2. Present the scorecard from the blueprint comparison.
3. List the top 5 quick wins from the tech debt register.
4. List the top 3 easiest and hardest components for migration from the traceability output.
