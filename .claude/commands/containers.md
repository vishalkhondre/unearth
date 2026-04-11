Run the Unearth external systems and containers skills on this codebase.

This command runs two skills in sequence:

**Step 1: External Systems**
Read `skills/03-external-systems/SKILL.md` and follow its process. Maps every external dependency — databases, APIs, message brokers, identity providers, cloud services. Save output to `outputs/03-external-systems.md`.

**Step 2: Containers**
Read `skills/04-containers/SKILL.md` and follow its process. Identifies independently deployable units, maps inter-container communication, detects architecture patterns. Save output to `outputs/04-containers.md`.

Prerequisites: `outputs/00-recon.md`, `outputs/01-entry-points.md`, and `outputs/02-actors-and-boundaries.md` must exist. If they don't, run `/recon`, `/entry-points`, and `/actors` first.

After completing both skills:
1. Verify both output files follow their respective output formats.
2. Run the verification checklist for each skill.
3. Suggest which container(s) to deep-dive into with `/components` based on complexity and risk.
