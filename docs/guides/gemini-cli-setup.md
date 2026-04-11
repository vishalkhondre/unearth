# Gemini CLI Setup

How to use Unearth with Google Gemini CLI.

## Prerequisites

- Gemini CLI installed ([github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli))
- A local clone of the target codebase
- Unearth cloned locally

## Setup

### Option A: Install as Native Skills

Gemini CLI supports native skill auto-discovery:

```bash
gemini skills install /path/to/unearth/skills/
```

Skills are automatically available and activate based on their `description` field in the YAML frontmatter.

### Option B: Add to GEMINI.md

In your target project, create or edit `GEMINI.md`:

```markdown
# Import Unearth discovery skills
# Skills loaded from: /path/to/unearth/skills/

When performing architecture discovery, follow the Unearth methodology:
- Read the full SKILL.md before executing any skill
- Every claim must cite a file path or code evidence
- Follow process steps in order, stop at CHECKPOINTs
- Save outputs to outputs/ directory
- Mark uncertain findings as [NEEDS VERIFICATION]
```

### Option C: Per-Session Loading

Load a skill directly in conversation:

```
Read the file at /path/to/unearth/skills/00-recon/SKILL.md
and follow its process on this codebase.
```

## Running Discovery

With native skills installed:

```
Run the recon skill on this codebase.
```

With GEMINI.md:

```
Follow the 00-recon discovery skill on this codebase.
Save output to outputs/00-recon.md.
```

## Tips

- Gemini CLI's native skill installation provides the smoothest experience
- For large codebases, Gemini's long context window is an advantage — you can load multiple skills simultaneously
- Use the `description` field in each skill's frontmatter to understand when each skill applies
- Stack adapters can be loaded alongside skills for technology-specific hints
