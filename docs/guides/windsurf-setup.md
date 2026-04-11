# Windsurf Setup

How to use Unearth with Windsurf.

## Prerequisites

- Windsurf installed ([windsurf.com](https://windsurf.com))
- A local clone of the target codebase
- Unearth cloned locally

## Setup

### Step 1: Add Skills to Windsurf Rules

Copy Unearth skill content into your Windsurf rules configuration. The exact method depends on your Windsurf version:

**Option A: Copy to rules directory**

```bash
mkdir -p .windsurf/rules
for skill in /path/to/unearth/skills/*/; do
    name=$(basename $skill)
    cp "$skill/SKILL.md" ".windsurf/rules/$name.md"
done
```

**Option B: Reference in conversation**

Paste the contents of a SKILL.md file directly into your Windsurf conversation when you need it.

### Step 2: Copy References (Optional)

```bash
cp /path/to/unearth/references/*.md .windsurf/rules/
```

## Running Discovery

In Windsurf, reference the skill:

```
I've loaded the 00-recon skill into my rules. Follow its process
on this codebase and save the output to outputs/00-recon.md.
```

For the next skill:

```
Now follow the 01-entry-points skill. Use outputs/00-recon.md as input.
```

## Tips

- Windsurf's Cascade mode works well for multi-step skill execution
- Load one skill at a time to avoid context overflow
- Skills are plain Markdown — if Windsurf's rules format differs, paste the SKILL.md content directly into the conversation
