# GitHub Copilot Setup

How to use Unearth with GitHub Copilot.

## Prerequisites

- GitHub Copilot enabled in your IDE (VS Code, JetBrains, etc.)
- Copilot Chat available
- A local clone of the target codebase
- Unearth cloned locally

## Setup

### Step 1: Set Up Agent Personas

Copy Unearth's agent personas for Copilot:

```bash
mkdir -p .github/agents
cp /path/to/unearth/agents/*.md .github/agents/
```

Copilot will recognize these as agent definitions.

### Step 2: Add Skills to Copilot Instructions

Create or edit `.github/copilot-instructions.md` with key Unearth conventions:

```markdown
# Discovery Instructions

When performing architecture discovery, follow the Unearth methodology:
- Every claim must cite a file path, class name, or config entry
- Mark uncertain findings as [NEEDS VERIFICATION]
- Follow the skill process steps in order — do not skip CHECKPOINTs
- Save outputs to the outputs/ directory
```

### Step 3: Copy Skills for Reference

```bash
mkdir -p .github/skills
cp -r /path/to/unearth/skills/ .github/skills/
```

## Running Discovery

In Copilot Chat, load a skill and persona:

```
Use the architecture-archaeologist agent persona from .github/agents/.
Read the skill at .github/skills/00-recon/SKILL.md and follow its
process on this codebase.
```

For subsequent skills:

```
Continue with .github/skills/01-entry-points/SKILL.md.
Use outputs/00-recon.md as input.
```

## Tips

- Copilot works best with focused requests — run one skill at a time
- Use the agent personas for targeted analysis (tech debt auditor for quality reviews, migration advisor for decomposition planning)
- Copilot's code navigation complements Unearth's scanning — let it find files while you follow the skill process
- Keep instructions concise — summarize key rules rather than pasting full skill files if context is limited
