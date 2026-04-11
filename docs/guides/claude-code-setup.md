# Claude Code Setup

How to use Unearth with Claude Code (recommended agent).

## Prerequisites

- Claude Code installed ([code.claude.com](https://code.claude.com))
- A local clone of the target codebase
- Unearth cloned locally (`git clone https://github.com/vkhondre/unearth.git`)

## Setup

### Step 1: Add Unearth as a Skill Source

In your target project, create or edit `CLAUDE.md` and add a reference to Unearth's skills:

```markdown
# Import Unearth discovery skills
# Skills loaded from: /path/to/unearth/skills/
```

Claude Code will discover the SKILL.md files in each skill directory and make them available for activation.

### Step 2: Copy Slash Commands

Copy the Unearth slash commands into your project:

```bash
mkdir -p .claude/commands
cp /path/to/unearth/.claude/commands/*.md .claude/commands/
```

This gives you all 10 pipeline commands: `/recon`, `/entry-points`, `/actors`, `/containers`, `/components`, `/capabilities`, `/data-model`, `/blueprint`, `/discover`, `/assess`.

### Step 3: Copy Agent Personas (Optional)

If you want to use specialized personas:

```bash
mkdir -p agents
cp /path/to/unearth/agents/*.md agents/
```

## Running Discovery

### Quick Start

```
/recon
```

This runs the first skill and produces `outputs/00-recon.md`.

### Full Pipeline

```
/discover
```

This runs all 14 skills in sequence. Expect 6-8 hours for a complete pipeline run on a medium-sized codebase.

### With a Persona

Tell Claude Code: "Load `agents/tech-debt-auditor.md` and begin discovery on this codebase."

### With a Stack Adapter

After `/recon` detects the technology, tell Claude Code: "Load `stack-adapters/dotnet/ADAPTER.md` for the remaining skills."

## Tips

- Claude Code has the deepest integration with Unearth — slash commands, skill auto-discovery, and persona loading all work natively
- Use `/recon` first, then decide how deep to go based on the initial findings
- For large codebases, run Stage 1 (Reconnaissance) in one session, then resume later with `/containers`
- The session hooks in `hooks/` help track progress across sessions
