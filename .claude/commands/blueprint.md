Run the Unearth blueprint comparison to assess this system against industry standards.

This command completes the Knowledge stage and runs the first Assessment skill:

**Step 1: Patterns** (if `outputs/08-patterns.md` doesn't exist)
Read `skills/08-patterns/SKILL.md` and follow its process. Detects architecture patterns and anti-patterns. Save to `outputs/08-patterns.md`.

**Step 2: Dependencies** (if `outputs/09-dependencies.md` doesn't exist)
Read `skills/09-dependencies/SKILL.md` and follow its process. Maps dependency landscape and version risks. Save to `outputs/09-dependencies.md`.

**Step 3: Blueprint Comparison**
Read `skills/10-blueprint/SKILL.md` and follow its process. Compares capabilities against the selected industry blueprint.

Blueprint: $ARGUMENTS

If no blueprint is specified, suggest the best-matching blueprint from `blueprints/` based on the system's domain (identified in `outputs/06-capabilities.md`). If no blueprint matches, note this and offer to run the comparison against a generic SaaS blueprint.

Prerequisites: `outputs/06-capabilities.md` must exist. If it doesn't, run `/capabilities` first.

After completing:
1. Save the blueprint output to `outputs/10-blueprint.md`.
2. Present the scorecard summary.
3. Highlight the critical gaps.
4. Suggest running `/assess` for the full assessment (tech debt, traceability, documentation).
