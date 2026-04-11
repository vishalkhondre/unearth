Run the Unearth components skill to deep-dive into a specific container.

Read `skills/05-components/SKILL.md` and follow its process exactly. This skill analyzes a single container's internals — layers, business components, technical components, god classes, test coverage, and business rules.

Target container: $ARGUMENTS

If no container is specified, suggest the best candidate based on `outputs/04-containers.md` (prioritize by entry point count, external connections, and risk flags).

Prerequisites: `outputs/04-containers.md` must exist. If it doesn't, run `/containers` first.

This skill is repeatable — run it on multiple containers by invoking `/components` again with a different container ID.

After completing the skill:
1. Save the output to `outputs/05-components-{container-id}.md` (e.g., `outputs/05-components-con-003.md`).
2. Run through the verification checklist.
3. If more containers should be analyzed, suggest the next candidate.
4. When container analysis is sufficient, suggest running `/capabilities` to begin Stage 3 (Knowledge).
