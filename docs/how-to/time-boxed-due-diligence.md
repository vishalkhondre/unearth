# How to Run a Time-Boxed Discovery (Due Diligence Mode)

**Use when:** You have a fixed time window — M&A technical due diligence, a consulting engagement kickoff, a rapid assessment before a modernization decision — and need specific deliverables within that window.

**Time budgets covered:** 2-hour briefing, 4-hour assessment, 8-hour full report.

---

## The Problem with Open-Ended Exploration

Without a time constraint, discovery tends to expand into whatever is interesting. Due diligence is different: someone needs a specific answer by a specific time, and the answer needs to be defensible.

Time-boxed discovery means choosing which questions to answer in the available time, running only the skills that answer those questions, and producing outputs sized to the audience.

---

## Step 0: Clarify the Question Being Answered

Before choosing which skills to run, agree on what question the discovery is answering. Everything else follows from this.


| Question                                        | Deliverable               | Skills Needed                       |
| ----------------------------------------------- | ------------------------- | ----------------------------------- |
| "What is this system and how is it structured?" | Architecture briefing     | S-00 through S-04                   |
| "What are the technical risks?"                 | Risk register             | S-00 through S-05, S-08, S-09, S-11 |
| "Is this codebase maintainable?"                | Tech debt assessment      | S-00 through S-05, S-11             |
| "What does this system do for its users?"       | Capability map            | S-00 through S-06                   |
| "How does this compare to industry standards?"  | Gap analysis              | S-00 through S-06, S-10             |
| "Should we acquire / invest in this?"           | Full due diligence report | S-00 through S-13                   |


---

## 2-Hour Window: Architecture Briefing

**Deliverable:** A crisp summary of what the system is, what it does, how it's structured, and the top 3 risks.

**Run this pipeline:**

```
1. /recon                   → ~20 min
2. /entry-points            → ~20 min
3. /actors                  → ~15 min
4. /containers              → ~30 min
5. Manual synthesis         → ~35 min (agent produces briefing from outputs)
```

**Tell the agent at the start:**

```
I have 2 hours. I need a briefing document covering:
1. Technology stack and system structure
2. Deployment architecture (what gets deployed, where)
3. System boundary (who uses it, what external systems it touches)
4. Top 3 risks or concerns based on what you find

Load skills/using-unearth/SKILL.md for pipeline guidance.
Use the architecture-archaeologist persona from agents/architecture-archaeologist.md.
Save all outputs to outputs/.
```

**What to produce:**

After the skills run, ask the agent to synthesize a single briefing document:

```
Based on outputs 00 through 04, write a 1-2 page architecture briefing.
Format: executive summary (3 sentences), system overview (C4 Container diagram in text form),
top 3 risks with evidence, and a "questions to investigate further" list.
```

---

## 4-Hour Window: Technical Risk Assessment

**Deliverable:** A prioritized list of technical risks with evidence, severity, and remediation effort estimates.

**Run this pipeline:**

```
1. /recon                   → ~20 min
2. /entry-points            → ~20 min
3. /actors                  → ~15 min
4. /containers              → ~30 min
5. /components (top 2 containers only) → ~40 min
6. S-08 patterns skill      → ~25 min
7. S-09 dependencies skill  → ~20 min
8. S-11 tech-debt skill     → ~30 min
                              ─────────
                              ~3h20min (leaves 40 min for review)
```

**Tell the agent upfront:**

```
I have 4 hours. Goal: technical risk assessment.
Run skills 00–05 (components on the 2 largest containers only),
then 08 (patterns), 09 (dependencies), and 11 (tech-debt).
Do not run capabilities, data-model, blueprint, traceability, or documentation.
Focus on risks, anti-patterns, and coupling issues.
Persona: agents/tech-debt-auditor.md
```

**For the components skill, be explicit about which containers to prioritize:**

```
Run 05-components on these containers only (from 04-containers.md):
1. [largest or most complex container by file count]
2. [container with most external system connections]
Skip the remaining containers — note them as "not analyzed" in the output.
```

**What to produce:**

```
Based on all outputs, produce a risk register with:
- Risk description
- Evidence (file path or pattern)
- Severity (Critical / High / Medium / Low)
- Effort to remediate (days estimate)
Sort by severity descending.
```

---

## 8-Hour Window: Full Due Diligence Report

**Deliverable:** A complete architecture document suitable for investment committee, acquisition review, or board-level technical briefing.

**Run the full pipeline:**

```
1. /recon                   → ~20 min
2. /entry-points            → ~20 min
3. /actors                  → ~15 min
4. /containers              → ~30 min
5. /components (all)        → ~45 min per container
6. /capabilities            → ~40 min
7. S-07 data-model          → ~30 min
8. S-08 patterns            → ~25 min
9. S-09 dependencies        → ~20 min
10. /blueprint              → ~30 min
11. S-11 tech-debt          → ~30 min
12. S-12 traceability       → ~25 min
13. S-13 documentation      → ~45 min
```

For a system with 3–5 containers, this fits in 8 hours. For larger systems, apply scoping (see [scope-large-codebase.md](scope-large-codebase.md)).

**Tell the agent upfront:**

```
I have 8 hours. Run the full Unearth pipeline end-to-end.
Load the migration-advisor persona from agents/migration-advisor.md.
For blueprint comparison, use blueprints/iiot-saas.md (adjust to your domain).
After all skills complete, produce the final architecture knowledge base
using templates/architecture-knowledge-base.md as the output template.
```

---

## Managing Quality Under Time Pressure

Time pressure creates a temptation to skip CHECKPOINTs and accept the first draft. Resist it.

**What to skip:**

- Deep documentation of well-understood areas (if you already know the auth system, mark it confirmed and move on)
- `[NEEDS VERIFICATION]` follow-ups during the run (collect them, address after the main pipeline)
- Detailed traceability (skip `12-traceability` if time runs out — it's the least immediately useful under time pressure)

**What never to skip:**

- CHECKPOINT gates in each skill — they catch wrong assumptions before they cascade into the next skill
- Evidence citations — a finding without a file reference is not defensible in a due diligence context
- The Key Findings section of each output — these are the critical observations the next skills rely on

---

## Structuring the Final Output for the Audience

Different audiences need different things from the same discovery run.

**For technical stakeholders** (CTOs, engineering leads):
Use the raw skill outputs as-is. They're designed for technical readers.

**For non-technical stakeholders** (investors, executive sponsors):
Ask the agent to produce a synthesis layer:

```
Based on all outputs, write a 2-page executive summary for a non-technical audience.
Use plain language. Replace technical terms with business equivalents.
Include: what the system does, scale indicators (users served, transaction volumes if visible),
top 3 risks in business terms, and a modernization effort estimate (person-months, rough order).
```

**For a legal/compliance audience:**
Focus the summary on data model, external system connections, and security patterns:

```
Based on outputs 03 (external systems), 07 (data-model), and the security findings
in 11 (tech-debt), write a data handling and dependency summary.
Include: what data is stored, where it flows, which third-party systems it touches,
and any identified security or compliance risks.
```

---

## Time-Box Checklist

Before starting:

- Question being answered is agreed and written down
- Time window and deliverable format are clear
- Scope is defined (which repos, which containers to prioritize)
- Audience for the final output is known
- Appropriate persona loaded

During the run:

- Each skill output reviewed before starting the next
- `[NEEDS VERIFICATION]` items logged but not followed up mid-run
- Scope narrowed if any skill is running longer than estimated

At the end:

- All promised deliverables exist as output files
- Synthesis layer produced if non-technical audience
- Open questions documented for follow-up

