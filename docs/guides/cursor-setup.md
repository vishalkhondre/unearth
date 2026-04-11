# Cursor Setup

How to use Unearth with Cursor.

## Prerequisites

- Cursor installed ([cursor.com](https://cursor.com))
- A local clone of the target codebase
- Unearth cloned locally

## Setup

### Step 1: Copy Skills to Rules

Copy the SKILL.md files you need into Cursor's rules directory:

```bash
# Copy all skills
mkdir -p .cursor/rules
for skill in /path/to/unearth/skills/*/; do
    name=$(basename $skill)
    cp "$skill/SKILL.md" ".cursor/rules/$name.md"
done
```

Or copy individual skills:

```bash
cp /path/to/unearth/skills/00-recon/SKILL.md .cursor/rules/00-recon.md
cp /path/to/unearth/skills/01-entry-points/SKILL.md .cursor/rules/01-entry-points.md
```

### Step 2: Copy References (Optional)

For richer context, copy the reference guides:

```bash
cp /path/to/unearth/references/*.md .cursor/rules/
```

## Running Discovery

In Cursor Chat, reference the skill by name:

```
Read the 00-recon rule and follow its process on this codebase.
Save the output to outputs/00-recon.md.
```

For subsequent skills:

```
Read the 01-entry-points rule. Use outputs/00-recon.md as input.
Follow the process and save to outputs/01-entry-points.md.
```

### Loading a Stack Adapter

```
Read the file at /path/to/unearth/stack-adapters/dotnet/ADAPTER.md
and apply its hints for all subsequent skills.
```

### Using a Persona

```
Read the file at /path/to/unearth/agents/architecture-archaeologist.md
and use it as your approach for this discovery session.
```

## Tips

- Cursor loads rules automatically from `.cursor/rules/` — skills activate when relevant
- For large codebases, work through one skill at a time rather than asking for the full pipeline
- Cursor's codebase indexing complements Unearth's manual scanning — use both
- If Cursor truncates long skill files, copy only the skills you're actively using
