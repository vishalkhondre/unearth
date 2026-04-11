# Session Start Hook

Run this at the beginning of an Unearth discovery session. It establishes context, loads configuration, and prepares the agent for pipeline execution.

## When This Runs

- At the start of any Unearth discovery session
- When resuming a previously started pipeline
- When switching to a different target codebase

## Steps

### 1. Identify the Target Codebase

Determine which repositories are in scope for this discovery session:

- List all repositories accessible in the current workspace
- Confirm which ones are in scope (single repo, multi-repo, or monorepo)
- Note the root paths for each repository

### 2. Check for Existing Outputs

Look for an `outputs/` directory in the workspace:

- If `outputs/` exists and contains pipeline files, this is a resumed session
- Identify the last completed skill by the highest-numbered output file
- Report: "Found existing outputs through skill {XX}. Ready to resume from skill {next}."
- If `outputs/` is empty or doesn't exist, this is a fresh session

### 3. Load Stack Adapter (if available)

Check if a stack adapter has been specified or can be auto-detected:

- If `outputs/00-recon.md` exists, read the technology stack and suggest the matching adapter
- If specified by the user, load the adapter file from `stack-adapters/{name}/ADAPTER.md`
- If no adapter is available, note this and proceed without one

### 4. Load Agent Persona (if specified)

If the user has requested a specific persona:

- Load the persona file from `agents/{name}.md`
- Adjust focus and output emphasis per the persona's guidance
- If no persona is specified, use the default full-pipeline approach

### 5. Report Session Status

Summarize the session context:

```
Session: {fresh / resumed from S-{XX}}
Scope: {repository list}
Stack adapter: {loaded / not loaded}
Persona: {loaded / default}
Next skill: {skill ID and name}
```
