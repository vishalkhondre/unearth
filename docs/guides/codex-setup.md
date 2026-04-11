# Codex Setup

How to use Unearth with OpenAI Codex CLI.

## Prerequisites

- Codex CLI installed ([github.com/openai/codex](https://github.com/openai/codex))
- A local clone of the target codebase
- Unearth cloned locally

## Setup

### Step 1: Add Skills to Codex Instructions

Create or edit `AGENTS.md` in your project root (Codex reads this file for agent guidance):

```markdown
# Discovery Skills

When performing architecture discovery, use the Unearth skills
from /path/to/unearth/skills/. Each skill directory contains a
SKILL.md with the complete workflow.

Key conventions:
- Read the full SKILL.md before executing
- Follow process steps in order
- Stop at CHECKPOINTs and verify conditions
- Save outputs to outputs/ directory
- Cite file paths for every claim
- Mark uncertainty as [NEEDS VERIFICATION]
```

### Step 2: Reference Skills in Conversation

Load skills by asking Codex to read them:

```
Read /path/to/unearth/skills/00-recon/SKILL.md and follow its
process on this codebase.
```

## Running Discovery

```
Read the skill file at /path/to/unearth/skills/00-recon/SKILL.md.
Follow every step in the Process section. Save the output to
outputs/00-recon.md using the exact Output Format template.
```

For subsequent skills:

```
Now read /path/to/unearth/skills/01-entry-points/SKILL.md.
Use outputs/00-recon.md as input. Follow the process and save
to outputs/01-entry-points.md.
```

## Tips

- Codex's sandbox execution works well for file scanning steps in the pipeline
- Load one skill at a time to keep context focused
- Codex reads `AGENTS.md` at session start — use it to set the discovery context
- Skills are plain Markdown — they work with any agent that follows instructions
