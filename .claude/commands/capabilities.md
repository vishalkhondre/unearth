Run the Unearth capabilities skill to extract what this system does for its users.

Read `skills/06-capabilities/SKILL.md` and follow its process exactly. This skill seeds capability candidates from backend components, API surface, and UI modules. Analyzes each for cohesion and boundaries. Confirms, merges, splits, or de-scopes each candidate. Produces an L1/L2 capability hierarchy with coverage verification.

Prerequisites: At least one `outputs/05-components-*.md` file must exist, plus `outputs/00-recon.md` and `outputs/01-entry-points.md`. If they don't, run the upstream skills first.

After completing the skill:
1. Save the output to `outputs/06-capabilities.md` following the exact output format.
2. Run through the verification checklist.
3. Verify coverage is >90% across all projects.
4. Suggest running `/data-model` as the next step.
