Run the Unearth reconnaissance skill on this codebase.

Read `skills/00-recon/SKILL.md` and follow its process exactly. This is the first skill in the pipeline — it scans repository structure, detects the technology stack, identifies project organization, counts files, and detects build systems.

Scope: $ARGUMENTS

If no scope is specified, scan all repositories accessible in the current workspace.

After completing the skill:
1. Save the output to `outputs/00-recon.md` following the exact output format in the skill.
2. Run through the verification checklist at the end of the skill.
3. Suggest which stack adapter to load based on the detected technology.
4. Suggest running `/entry-points` as the next step.
