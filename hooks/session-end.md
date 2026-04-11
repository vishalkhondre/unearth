# Session End Hook

Run this at the end of an Unearth discovery session. It summarizes what was accomplished, flags incomplete work, and prepares for resumption.

## When This Runs

- At the end of a discovery session (before the agent context closes)
- When the user explicitly ends the session
- When switching away from discovery to a different task

## Steps

### 1. Inventory Completed Outputs

List all output files produced or updated during this session:

```
Outputs produced this session:
  outputs/00-recon.md          — completed
  outputs/01-entry-points.md   — completed
  outputs/02-actors-and-boundaries.md — completed
  outputs/03-external-systems.md — in progress (Step 5 of 8)
```

### 2. Report Pipeline Progress

Summarize which stages and skills are complete:

```
Pipeline progress:
  Stage 1 (Reconnaissance): COMPLETE (3/3)
  Stage 2 (Structure): IN PROGRESS (1/3 — S-03 partial)
  Stage 3 (Knowledge): NOT STARTED
  Stage 4 (Assessment): NOT STARTED
```

### 3. Flag Incomplete Work

If a skill was started but not finished:

- Note which step the agent was on when the session ended
- Note any intermediate findings that haven't been written to the output file
- Note any CHECKPOINTs that were pending verification

### 4. Summarize Key Findings So Far

Provide a brief summary of the most important findings discovered during this session (3-5 bullet points):

- Technology stack and primary frameworks detected
- Number of entry points, containers, or capabilities found
- Any critical findings (god classes, zero-test components, EOL frameworks)
- Any items flagged as [NEEDS VERIFICATION]

### 5. Provide Resume Instructions

Tell the user how to resume:

```
To resume this discovery:
  1. Start a new session
  2. The session-start hook will detect outputs/ and identify S-{XX} as the resume point
  3. Read skills/{XX}-{name}/SKILL.md and continue from Step {N}
```

### 6. Suggest Next Actions

Based on what's been completed, suggest 1-3 next actions:

- "Run `/containers` to begin Stage 2 (Structure)"
- "Analyze container CON-003 with `/components` — it has the most entry points"
- "Load the .NET stack adapter for better pattern detection in remaining skills"
