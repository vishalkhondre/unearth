# Getting Started with Unearth

Turn legacy code into living knowledge. This guide gets you from zero to your first architecture discovery in under 30 minutes.

## What You'll Get

After running even the first 3 skills (~30 minutes), you'll have:
- A technology stack inventory with file counts and framework versions
- Every entry point into the system (HTTP routes, event triggers, jobs, message handlers)
- A list of all actors (users, partners, systems) and the system boundary definition

After the full pipeline (~6-8 hours), you'll have a complete architecture knowledge base: C4 diagrams, capability map, data model, pattern inventory, gap analysis, tech debt register, and a prioritized remediation roadmap.

## Prerequisites

- An AI coding agent that accepts Markdown instructions (Claude Code, Cursor, GitHub Copilot, Gemini CLI, Codex, Windsurf, or any similar tool)
- Read access to the codebase you want to analyze
- A local clone of the target codebase

## Installation

### Option 1: Clone (recommended)

```bash
git clone https://github.com/vkhondre/unearth.git
```

This gives you the full repo — skills, commands, agents, blueprints, stack adapters, and docs.

### Option 2: Cherry-pick skills

If you only need specific skills, copy individual `SKILL.md` files into your agent's configuration:

```bash
# Copy just the recon skill
cp unearth/skills/00-recon/SKILL.md /your/agent/rules/00-recon.md
```

## Setup by Agent Tool

### Claude Code

Claude Code is the recommended agent for Unearth. It supports slash commands, skill auto-discovery, and agent personas natively.

**Step 1: Add Unearth as a skill source**

In your target project's `CLAUDE.md`, add a reference to the Unearth skills directory:

```markdown
# In your project's CLAUDE.md, add:
# Import Unearth skills from /path/to/unearth/skills/
```

**Step 2: Copy slash commands (optional but recommended)**

```bash
# From your target project root:
cp -r /path/to/unearth/.claude/commands/ .claude/commands/
```

This gives you `/recon`, `/discover`, and all other pipeline commands.

**Step 3: Verify**

```bash
# In Claude Code, type:
/recon
```

If configured correctly, the agent will read `skills/00-recon/SKILL.md` and begin scanning your codebase.

### Cursor

**Step 1: Copy skills to rules**

```bash
# Copy all skills (or just the ones you need)
mkdir -p .cursor/rules
for skill in /path/to/unearth/skills/*/; do
    name=$(basename $skill)
    cp "$skill/SKILL.md" ".cursor/rules/$name.md"
done
```

**Step 2: Start discovery**

In Cursor chat, say: "Read the 00-recon rule and follow its process on this codebase."

Cursor will read the skill file and execute the workflow. For subsequent skills, reference them by name: "Now read the 01-entry-points rule and follow its process."

### GitHub Copilot

**Step 1: Set up agent personas**

```bash
mkdir -p .github/agents
cp /path/to/unearth/agents/*.md .github/agents/
```

**Step 2: Add skill content to instructions**

```bash
mkdir -p .github/skills
cp -r /path/to/unearth/skills/ .github/skills/
```

**Step 3: Start discovery**

In Copilot Chat, say: "Use the architecture-archaeologist agent persona. Read the skill at `.github/skills/00-recon/SKILL.md` and follow its process on this codebase."

### Gemini CLI

```bash
# Install Unearth skills for auto-discovery
gemini skills install /path/to/unearth/skills/
```

Or add to your project's `GEMINI.md`:

```markdown
# Import Unearth skills from /path/to/unearth/skills/
```

### Any Other Agent

Skills are plain Markdown files. For any agent that accepts instructions:

1. Open the relevant `SKILL.md` file
2. Paste its content into the agent's system prompt, rules file, or conversation
3. Ask the agent to follow the process steps

The workflow is agent-agnostic. If the tool can read Markdown and follow numbered steps, it can run Unearth skills.

## Your First Discovery

### Quick Recon (~10 minutes)

Start with skill `00-recon` to get an initial understanding of the codebase:

**With Claude Code:**
```
/recon
```

**With any other agent:**
Say: "Read `skills/00-recon/SKILL.md` and follow its process on this codebase."

The agent will scan the repo structure, detect languages and frameworks, identify projects, count files, and detect build systems. The output is saved to `outputs/00-recon.md`.

**What to check in the output:**
- Does the technology stack match what you expected?
- Are all projects in the repo listed?
- Are file counts reasonable for the codebase size?

### Expand to Entry Points (~15 minutes more)

Next, run skill `01-entry-points`:

**With Claude Code:**
```
/entry-points
```

This discovers every HTTP route, event trigger, scheduled job, and message handler in the system. Check the summary table — does the entry point count match your expectations?

### Complete Reconnaissance (~15 minutes more)

Run skill `02-actors-and-boundaries`:

**With Claude Code:**
```
/actors
```

This identifies who uses the system (users, partners, monitoring probes) and draws the system boundary. You now have enough for a C4 Context diagram.

**At this point, you've completed Stage 1 (Reconnaissance) and have a solid understanding of what the codebase is.**

## Loading a Stack Adapter

After `00-recon` detects the technology stack, load the matching stack adapter for better results in subsequent skills:

```
Available adapters:
  stack-adapters/dotnet/       → .NET / C# / ASP.NET Core / Azure Functions
  stack-adapters/java-spring/  → Java / Spring Boot / Spring Cloud
  stack-adapters/python-django/ → Python / Django / Flask / FastAPI
  stack-adapters/node-express/  → Node.js / Express / NestJS
  stack-adapters/ruby-rails/   → Ruby / Rails
  stack-adapters/generic/      → Any other language
```

Tell the agent: "Load the stack adapter from `stack-adapters/dotnet/ADAPTER.md` for the remaining skills."

The adapter provides framework-specific pattern hints for entry point detection, layer identification, entity discovery, and anti-pattern detection.

## Choosing What to Run

You don't have to run the full pipeline. Common stopping points:

| What You Need | Run Through | Time | Output |
| --- | --- | --- | --- |
| "What is this system?" | S-00 through S-02 | ~30 min | Tech stack, entry points, actors, boundary |
| "How is it structured?" | S-00 through S-05 | ~2 hours | C4 Context + Container diagrams, component internals |
| "What does it do?" | S-00 through S-06 | ~3 hours | All of the above + L1/L2 capability map |
| "How does it compare?" | S-00 through S-10 | ~5 hours | All of the above + blueprint gap analysis |
| "What should we fix?" | S-00 through S-13 | ~6-8 hours | Complete architecture document with roadmap |

See `skills/using-unearth/SKILL.md` for detailed guidance on partial runs and resuming.

## Loading an Agent Persona

For specialized analysis, load one of the pre-configured personas from `agents/`:

| Persona | When to Use | Command |
| --- | --- | --- |
| Architecture Archaeologist | Full discovery, C4 diagrams | "Use the architecture-archaeologist persona" |
| Domain Analyst | Capability extraction, business rules | "Use the domain-analyst persona" |
| Tech Debt Auditor | Code quality, remediation planning | "Use the tech-debt-auditor persona" |
| Migration Advisor | Decomposition, extraction feasibility | "Use the migration-advisor persona" |

Tell the agent: "Load `agents/architecture-archaeologist.md` and begin discovery on this codebase."

Personas are optional. The skills work without them — personas add focus, not requirements.

## Selecting a Blueprint

For gap analysis (skill `10-blueprint`), select the industry blueprint that matches your system's domain:

| Blueprint | Domain | File |
| --- | --- | --- |
| IIoT SaaS | Industrial IoT platform | `blueprints/iiot-saas.md` |

Tell the agent: "Use `blueprints/iiot-saas.md` as the reference architecture for the blueprint comparison."

More blueprints (e-commerce, fintech, SaaS B2B, healthcare) are coming. See `docs/advanced/creating-blueprints.md` for how to create your own.

## Output Directory

All skill outputs are saved to `outputs/` in your project root (this directory is gitignored by default):

```
outputs/
├── 00-recon.md                    # Technology stack, project organization
├── 01-entry-points.md             # Every entry point in the system
├── 02-actors-and-boundaries.md    # Actors, boundary definition
├── 03-external-systems.md         # External dependency inventory
├── 04-containers.md               # Deployable units, communication map
├── 05-components-con-003.md       # Component deep-dive (per container)
├── 06-capabilities.md             # L1/L2 business capability map
├── 07-data-model.md               # Entity inventory, relationships
├── 08-patterns.md                 # Architecture patterns detected
├── 09-dependencies.md             # Dependency landscape, risks
├── 10-blueprint.md                # Industry comparison, gaps
├── 11-tech-debt.md                # Prioritized debt register
├── 12-traceability.md             # File-to-capability mapping
└── 13-documentation.md            # Complete architecture document
```

Each output file is self-contained with a standard header (pipeline stage, date, inputs consumed, scope) and is cross-referenced by downstream skills.

## Troubleshooting

**The agent doesn't follow the skill steps:**
Make sure it reads the full SKILL.md file, not just the name. Say explicitly: "Read the complete file at `skills/00-recon/SKILL.md` and follow every step in its Process section."

**Output quality is low or claims lack evidence:**
The agent may be skipping CHECKPOINTs. Remind it: "Stop at every CHECKPOINT in the skill and verify the condition before proceeding."

**The agent invents findings not backed by code:**
Reinforce the evidence standard: "Every claim must cite a specific file path, class name, or configuration entry. If you can't find evidence, mark it as [NEEDS VERIFICATION]."

**Stack adapter not loading:**
Make sure the agent reads the full adapter file: "Read `stack-adapters/dotnet/ADAPTER.md` and apply its hints for all subsequent skills."

**Output file not created:**
Remind the agent: "Save the output to `outputs/00-recon.md` following the exact Output Format template in the skill."

## What's Next

- **Run the full pipeline** on a codebase you know well — you'll be surprised what the systematic approach uncovers
- **Try a different persona** — run the same pipeline with the Tech Debt Auditor and see how the emphasis shifts
- **Create a blueprint** for your industry domain — see `docs/advanced/creating-blueprints.md`
- **Contribute** — see `CONTRIBUTING.md` for how to add stack adapters, blueprints, or skill improvements

## How-To Guides

Practical guides for specific scenarios:

| Guide | Use When |
| --- | --- |
| [Analyze a multi-repo system](how-to/analyze-multi-repo-system.md) | The codebase spans multiple repositories |
| [Scope a large codebase](how-to/scope-large-codebase.md) | 500+ files, agent hitting context limits, or analysis is too slow |
| [Time-boxed discovery (due diligence)](how-to/time-boxed-due-diligence.md) | Fixed time window — M&A, consulting kickoff, rapid assessment |
| [Use a custom blueprint](how-to/use-custom-blueprint.md) | No built-in blueprint matches your domain, or you have an org-specific reference architecture |
