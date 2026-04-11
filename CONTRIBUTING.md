# Contributing to Unearth

Thank you for your interest in contributing to Unearth. This guide covers everything you need to know to contribute effectively.

## Ways to Contribute

| Contribution Type | Where | Impact |
| --- | --- | --- |
| **New stack adapter** | `stack-adapters/{name}/` | Helps Unearth work better with your technology ecosystem |
| **New blueprint** | `blueprints/{name}.md` | Enables gap analysis for a new industry domain |
| **Skill improvement** | `skills/{name}/SKILL.md` | Better workflows, tighter verification, fewer false positives |
| **Bug fix** | Any file | Fixes incorrect patterns, broken cross-references, or misleading guidance |
| **Documentation** | `docs/` | Tutorials, guides, concept explanations, case studies |
| **Case study** | `docs/case-studies/` | Anonymized results from real discovery projects |

## Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-contribution`)
3. Make your changes following the guidelines below
4. Run validation checks (see below)
5. Commit with a clear message
6. Submit a pull request

## Contribution Guidelines by Type

### Skills

Skills are the core of Unearth. They must be workflow-oriented, evidence-based, and agent-followable.

**Before modifying a skill:**
- Read `docs/skill-anatomy.md` for the full format specification
- Read `AGENTS.md` for the skill authoring guidelines section
- Study 2-3 existing skills to understand the pattern

**Requirements for new or modified skills:**

| Requirement | Minimum | Check |
| --- | --- | --- |
| YAML frontmatter | `name` + `description` fields | Parse with `python3 -c "import yaml; yaml.safe_load(open('SKILL.md'))"` |
| No em dashes in frontmatter | Use `--` in YAML, `—` in body | Search for `—` between the `---` delimiters |
| Standard sections | All 10 in order | Pipeline Position, Inputs, When to Use, Process, Output Format, Stack Adapter Hooks, Evidence Standards, Common Rationalizations, Red Flags, Verification |
| CHECKPOINTs | At least 2 | Code blocks with `CHECKPOINT:` prefix |
| Common Rationalizations | At least 3 rows | `\| "rationalization" \| reality \|` table |
| Red Flags | At least 4 items | Bullet list under `## Red Flags` |
| Verification checklist | Required | `- [ ]` checkboxes, last item: "All uncertain findings are flagged as [NEEDS VERIFICATION]" |
| Line count | Under 500 lines | `wc -l SKILL.md` |
| Spelling | American English | No `analysing`, `organisation`, `colour`, etc. |
| Output title | `# {Skill Name} — {System Name}` | Em dash in body |
| Output header | 4 fields | Pipeline stage, Date, Input, Scope |

**Testing a skill:**
- Run the skill against at least one real codebase
- Verify the output follows the Output Format template exactly
- Check that every CHECKPOINT is reachable and verifiable
- Confirm the verification checklist catches real issues

### Stack Adapters

Stack adapters provide technology-specific pattern hints for the skills.

**Requirements:**
- YAML frontmatter with `name`, `stack`, `languages`, `frameworks`
- Sections keyed to specific skills (`## S-00: Recon Hints`, `## S-01: Entry Point Hints`, etc.)
- Concrete detection patterns ("look for `@Entity` annotation") not vague advice ("check for entities")
- Package-to-system mapping table for `S-03`
- EOL framework dates for `S-09`
- Validated against at least one codebase in the target ecosystem

**File location:** `stack-adapters/{name}/ADAPTER.md`

### Blueprints

Blueprints are industry reference architectures for gap analysis.

**Requirements:**
- YAML frontmatter with `name`, `domain`, `version`, `sources`
- Sources must cite real industry frameworks (not invented)
- Each capability needs: ID, name, description, sub-capabilities, and maturity indicator
- Sub-capabilities must be specific enough to assess as present/absent
- Include a "How to Use This Blueprint" section
- Include a capability count summary table

**File location:** `blueprints/{name}.md`

### Agent Personas

Agent personas provide specialized lenses for discovery.

**Requirements:**
- 7 standard sections: Role, Focus Area, Approach, Output Emphasis, Skills Used, What to Watch For, Output Format
- Clear differentiation from existing personas (don't duplicate)
- Specific skill references (not "run the pipeline" but "prioritize S-05, S-08, S-11")
- Under 100 lines

**File location:** `agents/{name}.md`

### Documentation

Documentation follows the FastAPI progressive disclosure pattern.

**Requirements:**
- Hook the reader in the first paragraph (what will they learn/achieve?)
- Practical examples over abstract explanations
- Code blocks with copy-pasteable commands
- Cross-references to relevant skills, adapters, or blueprints
- No assumptions about prior Unearth knowledge (each doc is self-contained for its audience)

**File location:** `docs/` (subdirectory depends on type: `guides/`, `tutorial/`, `concepts/`, `advanced/`, `case-studies/`)

## Validation Checks

Before submitting a PR, run these checks:

### YAML Frontmatter Validation

```bash
# Validate all SKILL.md files
for f in skills/*/SKILL.md; do
    python3 -c "
import yaml
with open('$f') as fh:
    content = fh.read()
parts = content.split('---', 2)
data = yaml.safe_load(parts[1])
assert 'name' in data, 'missing name'
assert 'description' in data, 'missing description'
print(f'OK: {data[\"name\"]}')
" || echo "FAIL: $f"
done
```

### Em Dash Check

```bash
# Ensure no em dashes in YAML frontmatter
for f in skills/*/SKILL.md; do
    frontmatter=$(sed -n '2,/^---$/p' "$f" | head -n -1)
    if echo "$frontmatter" | grep -P '—' > /dev/null 2>&1; then
        echo "FAIL: $f has em dash in frontmatter"
    fi
done
```

### Line Count Check

```bash
# Ensure all skills are under 500 lines
for f in skills/*/SKILL.md; do
    lines=$(wc -l < "$f")
    if [ "$lines" -gt 500 ]; then
        echo "FAIL: $f is $lines lines (max 500)"
    fi
done
```

### Section Order Check

```bash
# Verify standard sections exist in order
for f in skills/*/SKILL.md; do
    name=$(basename $(dirname "$f"))
    sections=$(grep "^## " "$f" | grep -v "^## [0-9]")
    echo "--- $name ---"
    echo "$sections"
done
```

## Commit Messages

Use clear, descriptive commit messages:

```
Add Java Spring stack adapter (SA-02)

- Covers S-00 through S-09 skill hooks
- 24 Maven/Gradle package-to-system mappings
- Spring Boot, Spring Cloud, Spring Data patterns
- Validated against sample Spring Boot 3.x codebase
```

```
Improve S-06 capability extraction process

- Add guidance for microservice architectures where most candidates auto-confirm
- Expand Step 4 (Action Determination) with SPLIT criteria
- Add 2 new rationalizations for common microservice assumptions
```

## Pull Request Process

1. **Title:** Brief description of the change
2. **Description:** What changed, why, and how you validated it
3. **Checklist:**
   - [ ] YAML frontmatter validates on all changed files
   - [ ] No em dashes in YAML frontmatter
   - [ ] All skills under 500 lines
   - [ ] Tested against at least one real codebase (for skills/adapters)
   - [ ] No broken cross-references to other files
   - [ ] American English spelling throughout

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Questions?

Open an issue on GitHub or start a discussion. We're happy to help with contribution ideas, skill design questions, or blueprint sourcing.
