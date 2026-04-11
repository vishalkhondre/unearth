---
name: 00-recon
description: >
  Scans repository structure to build an initial codebase mental model.
  Detects programming languages, frameworks, build systems, project
  organization, file distribution, deployment configuration, and CI/CD
  pipelines. Use when starting discovery on a new codebase, when
  additional repositories are added to the scope, or when re-orienting
  after significant scope changes. This is always the first skill to run.
---

# Reconnaissance

Scans the repository structure to build a grounded mental model of the codebase before making any architectural claims. Detects programming languages, frameworks, build systems, project organization, and file distribution.

Without this step, the agent risks misidentifying the tech stack, missing entire projects in a monorepo, or making assumptions that compound errors through every subsequent skill.

## Pipeline Position

| Attribute       | Value                                           |
| --------------- | ----------------------------------------------- |
| **Stage**       | 1 — Reconnaissance                              |
| **Skill**       | 00-recon                                        |
| **Runs after**  | (none — first skill in the pipeline)            |
| **Runs before** | `01-entry-points`                               |
| **Required by** | All downstream skills                           |

## Inputs

### Required
- Access to the repository file system (local clone or remote read access)
- Knowledge of which repositories are in scope (single repo, multi-repo, or monorepo)

### Optional (improves results)
- A stack adapter for the suspected technology (e.g., `stack-adapters/dotnet/`)
- README or documentation files (treated as claims to verify, not as truth)

## When to Use

**Use when:**
- Starting discovery on a codebase for the first time
- Additional repositories are added to the discovery scope
- The previous recon output is suspected to be outdated (e.g., after a major refactor)
- You are unsure about the tech stack and need a verified starting point

**Do not use when:**
- You already have a verified `outputs/00-recon.md` and the repository has not changed
- You are resuming a discovery mid-pipeline and recon was already completed

## Process

### Step 1: Enumerate Repositories in Scope

List every repository included in this discovery. For each repository, record:
- Repository name or path
- Remote URL (if available)
- The root directory where the agent will scan

If this is a single-repo discovery, record that explicitly.

If multiple repos are in scope, establish a naming convention now (e.g., `repo-1`, `repo-2`) that will be used consistently through all downstream skills.

```
CHECKPOINT: The agent must be able to list every repository in scope
with its root path before proceeding.
```

### Step 2: Scan Root Structure

For each repository, list all top-level files and directories. Classify each as one of:

| Classification       | Examples                                                            |
| -------------------- | ------------------------------------------------------------------- |
| Source code           | `src/`, `app/`, `lib/`, project directories                        |
| Configuration         | `appsettings.json`, `.env`, `config/`                              |
| Build system          | `Makefile`, `pom.xml`, `package.json`, `*.csproj`, `*.sln`        |
| CI/CD                 | `.github/workflows/`, `azure-pipelines.yml`, `Jenkinsfile`        |
| Containerization      | `Dockerfile`, `docker-compose.yml`, `.dockerignore`               |
| Infrastructure        | `terraform/`, `bicep/`, `helm/`, `k8s/`, `deploy/`               |
| Documentation         | `README.md`, `docs/`, `CHANGELOG.md`, `CONTRIBUTING.md`          |
| Test                  | `tests/`, `test/`, `*.Tests/`, `*.UnitTests/`, `__tests__/`      |
| Tooling / IDE         | `.vscode/`, `.idea/`, `.editorconfig`, `.eslintrc`                |
| Dependency lock files | `package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`    |

Record anything that doesn't fit these categories and flag it for investigation.

```
CHECKPOINT: Every top-level file and directory must be classified.
Nothing should be listed as "unknown" without an explicit note
explaining why.
```

### Step 3: Detect Technology Stack

Scan for build and configuration files to identify the technology stack. Check for these indicators in order:

**Language detection:**
- `.csproj`, `.sln`, `.fsproj` → .NET / C# / F#
- `pom.xml`, `build.gradle`, `build.gradle.kts` → Java / Kotlin
- `package.json` → JavaScript / TypeScript (check `tsconfig.json` for TS)
- `requirements.txt`, `setup.py`, `pyproject.toml`, `Pipfile` → Python
- `Gemfile` → Ruby
- `go.mod` → Go
- `Cargo.toml` → Rust
- `composer.json` → PHP

**Framework detection (from config files, not just code):**
- `angular.json` or `angular-cli.json` → Angular (check `version` in `package.json`)
- `next.config.js` or `next.config.mjs` → Next.js
- `nuxt.config.ts` → Nuxt
- `vite.config.*` → Vite-based app
- `host.json` + `local.settings.json` → Azure Functions
- `serverless.yml` → Serverless Framework
- `application.properties` or `application.yml` → Spring Boot
- `manage.py` + `settings.py` → Django
- `app.py` or `main.py` + `requirements.txt` with `flask` → Flask
- `config/routes.rb` → Ruby on Rails

**Runtime version detection:**
- Check `TargetFramework` in `.csproj` files (e.g., `net7.0`, `net8.0`)
- Check `engines` in `package.json` (e.g., `"node": ">=18"`)
- Check `python_requires` in `setup.py` or `pyproject.toml`
- Check `java.version` in `pom.xml` properties

For each detected technology, record the **file path** that proves it and the **version** where detectable.

If a stack adapter is loaded, consult its "Technology Detection" section for framework-specific patterns beyond this generic list.

```
CHECKPOINT: Every technology claim must have a file path citation.
"The project uses Angular" must be backed by "angular.json found at
/repo/ua-perceptiv-dashboard/angular.json, version 16.x per
package.json".
```

### Step 4: Identify Project Organization

Determine how the codebase is organized:

| Organization Type  | How to Detect                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Single project** | One build target, one deployable artifact, one language                                         |
| **Multi-project**  | One repo with multiple build targets (e.g., `.sln` with multiple `.csproj`, or Gradle modules) |
| **Monorepo**       | Multiple independent services/apps in one repo, often with separate CI/CD per service           |
| **Multi-repo**     | Multiple repositories in the discovery scope, each with its own build                           |

For multi-project and monorepo cases, list every project/service and its:
- Name
- Root directory relative to repo root
- Technology (may differ per project)
- Role (API, web app, worker, shared library, test project, tooling)

```
CHECKPOINT: Project organization type must be determined with evidence.
For multi-project repos, every sub-project must be listed with its
technology and role.
```

### Step 5: Count and Classify Files

For each project (or each sub-project in a multi-project repo), count files by category:

| Category             | What to count                                                     |
| -------------------- | ----------------------------------------------------------------- |
| **Source files**      | `.cs`, `.java`, `.ts`, `.js`, `.py`, `.rb`, `.go`, `.rs`, etc.   |
| **Test files**        | Files in test directories or matching `*Test*`, `*Spec*` patterns |
| **Configuration**     | `.json`, `.yml`, `.yaml`, `.xml`, `.env`, `.config` files        |
| **Markup / styling**  | `.html`, `.css`, `.scss`, `.razor`, `.jsx`, `.tsx`, `.vue`       |
| **Documentation**     | `.md`, `.txt`, `.rst` files                                      |
| **Build / CI**        | Pipeline configs, Dockerfiles, IaC files                         |

Record the total and per-project breakdown. Flag notable ratios:
- Test-to-source ratio (below 0.5:1 is a flag; zero tests is critical)
- Any project with zero source files (may be a shared library, tooling, or dead project)

### Step 6: Detect Build System and CI/CD

**Build system:**
- Identify the primary build tool (MSBuild, Maven, Gradle, npm/yarn, pip, cargo, etc.)
- Record the build configuration file path
- Note any multi-stage or multi-target builds

**CI/CD pipeline:**
- Search for pipeline configurations: `.github/workflows/`, `azure-pipelines.yml`, `Jenkinsfile`, `.gitlab-ci.yml`, `.circleci/`, `bitbucket-pipelines.yml`, `cloudbuild.yaml`
- For each pipeline found, record: tool, file path, and what it does (build, test, deploy)
- Note deployment targets if visible (cloud provider, service type)

**Containerization:**
- Search for `Dockerfile`, `docker-compose.yml`, `docker-compose.*.yml` at root and in each project directory
- Record what's containerized and what's not
- If no Docker files exist, state this explicitly (it's architecturally significant)

**Infrastructure as Code:**
- Search for `terraform/`, `bicep/`, `arm/`, `pulumi/`, `cdk/`, `helm/`, `k8s/`, `charts/`
- Record what's found or explicitly note absence

```
CHECKPOINT: The build system, CI/CD pipeline, and containerization
status must each be determined (present + details, or explicitly absent).
```

### Step 7: Scan for Anomalies and Surprises

Review the findings so far and flag anything unexpected:

- Mixed framework versions (e.g., some projects on .NET 7, others on .NET 8)
- Dead or unused projects (exist in repo but not referenced by build/CI)
- Multiple languages where one was expected
- Configuration for services not present in the code (ghost dependencies)
- README claims that contradict what was found in the code
- Unusually large or small projects relative to their apparent role

Record each anomaly with evidence and a brief note on potential impact.

### Step 8: Compile Recon Output

Assemble all findings into the output file following the Output Format below. Review the output for completeness before marking the skill as done.

## Output Format

This skill produces a single Markdown file: `outputs/00-recon.md`

### Required Structure

```markdown
# Recon — {System Name}

> **Pipeline stage:** 00-recon
> **Date:** {date}
> **Input:** (none — first skill in pipeline)
> **Scope:** {list of repositories/projects}

---

## 1. Scan Scope and Approach

| Attribute | Value |
| --- | --- |
| **Repositories in scope** | {list of repo names / paths} |
| **Scanning method** | {file system scan / remote read} |
| **Stack adapter used** | {name or None} |
| **Notes** | {anything that constrained or shaped the scan} |

---

## 2. Repositories in Scope

| Repository | Path | Remote URL |
| --- | --- | --- |
| {name} | {local path} | {URL or N/A} |

---

## 3. Technology Stack

| Technology | Version | Evidence (file path) |
| --- | --- | --- |
| {language} | {version} | {file path that proves it} |
| {framework} | {version} | {config file path} |

---

## 4. Project Organization

**Type:** {single-project / multi-project / monorepo / multi-repo}

| Project | Directory | Technology | Role |
| --- | --- | --- | --- |
| {name} | {path} | {tech + version} | {API / web app / worker / library / test} |

---

## 5. File Inventory

### Summary

| Project | Source Files | Test Files | Config | Docs | Test:Source Ratio |
| --- | ---:| ---:| ---:| ---:| --- |
| {project} | {n} | {n} | {n} | {n} | {ratio} |
| **Total** | **{n}** | **{n}** | **{n}** | **{n}** | **{ratio}** |

### Flags
- {any notable findings: zero tests, dead projects, extreme ratios}

---

## 6. Build System & CI/CD

### Build
| Attribute | Value |
| --- | --- |
| Build tool | {tool} |
| Config file | {path} |
| Targets | {what it builds} |

### CI/CD
| Pipeline | Tool | File | Stages |
| --- | --- | --- | --- |
| {name} | {tool} | {path} | {build → test → deploy targets} |

### Containerization
{status: Dockerized / Not containerized / Partially containerized}
{details with file paths}

### Infrastructure as Code
{status: Present / Not found}
{details with file paths}

---

## 7. Anomalies and Surprises

| # | Finding | Evidence | Potential Impact |
| --- | --- | --- | --- |
| 1 | {description} | {file path / comparison} | {why it matters} |

---

## 8. Items Flagged [NEEDS VERIFICATION]

| # | Item | Why | Impact if Wrong |
| --- | --- | --- | --- |
| 1 | {what needs verification} | {why it's uncertain} | {what breaks downstream} |
```

## Stack Adapter Hooks

This skill benefits from stack adapter input at:

- **Step 3 (Detect Technology Stack):** Adapter provides framework-specific file patterns beyond the generic list. For example, the `.NET` adapter knows to check `host.json` for Azure Functions version, `launchSettings.json` for local profiles, and `.csproj` properties like `OutputType` and `AzureFunctionsVersion`.
- **Step 4 (Identify Project Organization):** Adapter provides project structure heuristics. For example, the `java-spring` adapter knows that `settings.gradle` lists submodules, or the `.NET` adapter knows that `.sln` files enumerate all projects.

If no stack adapter is loaded, the skill uses the generic detection heuristics defined in Step 3.

## Evidence Standards

| Claim Type               | Acceptable Evidence                                                         |
| ------------------------ | --------------------------------------------------------------------------- |
| Language detected        | File extension counts + build/config file path                              |
| Framework detected       | Framework-specific config file path with version string                     |
| Runtime version          | Version string extracted from config file, with file path                   |
| Project organization     | Directory listing + build file evidence (e.g., `.sln` contents)            |
| File counts              | Actual counts from file system scan (not estimates)                         |
| CI/CD pipeline           | Pipeline config file path + summary of stages                              |
| Containerization status  | Presence/absence of Dockerfile with paths searched                          |
| IaC status               | Presence/absence of IaC directories with paths searched                     |
| Anomaly / surprise       | Specific files or comparisons that demonstrate the anomaly                  |
| NOT FOUND claims         | List of locations searched and what was expected but absent                 |

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can tell the tech stack from the file extensions alone" | File extensions miss framework versions, build configurations, and multi-framework setups. A `.cs` file tells you C# but not whether it's ASP.NET Core, Azure Functions, or a console app. Always check config files. |
| "The README already describes the stack and architecture" | READMEs are frequently outdated. We found production codebases where the README described a tech stack two major versions behind. The code is the source of truth. Verify every README claim against actual files. |
| "This is a simple project, I can skip the full scan" | "Simple" projects have produced the most surprising findings in practice — hidden dependencies, dead code, misconfigured builds, phantom projects. Run the full process every time. |
| "I'll fill in the details later when I need them" | Downstream skills depend on specific data from this output (file counts, project list, technology versions). Incomplete recon produces incomplete everything else. Do it thoroughly now. |
| "The file count doesn't matter, I just need the architecture" | File counts reveal critical signals: zero-test projects, dead code, imbalanced complexity distribution. A project with 193 source files and 0 tests is an architectural risk. Count everything. |
| "I already know this stack, I don't need to scan" | Familiarity breeds assumptions. Even experienced engineers miss projects in monorepos, version mismatches between sub-projects, and ghost configuration. Scan systematically. |

## Red Flags

- Making technology claims without citing the config file that proves them
- Stating a framework version without extracting it from a config file
- Missing entire sub-projects in a multi-project repository
- Not flagging any [NEEDS VERIFICATION] items (every codebase has ambiguity)
- File counts that look like estimates rather than actual counts (round numbers are suspicious)
- Skipping the anomalies section (every codebase has at least one surprise)
- Output file that's under 50 lines for a non-trivial codebase
- Copying README descriptions instead of verifying them against the file system

## Verification

Before marking this skill complete, confirm:

- [ ] Every repository in scope is listed with its path
- [ ] Every detected language has a file extension count AND a config file citation
- [ ] Every detected framework has a config file path AND a version where available
- [ ] Project organization type is determined with structural evidence
- [ ] Every sub-project (in multi-project repos) is listed with technology and role
- [ ] File counts are recorded per project for source, test, config, and docs
- [ ] Test-to-source ratios are calculated and anomalies flagged
- [ ] Build system is identified with config file path
- [ ] CI/CD pipeline is identified with config file path and stage summary (or explicitly absent)
- [ ] Containerization status is determined (or explicitly absent with paths searched)
- [ ] Infrastructure-as-code status is determined (or explicitly absent with paths searched)
- [ ] Anomalies section has at least one finding (or explicit statement that none were found, with justification)
- [ ] All uncertain findings are flagged as [NEEDS VERIFICATION]
- [ ] Output file is saved to `outputs/00-recon.md`
- [ ] Output file follows the required structure from the Output Format section
