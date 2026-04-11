import Link from "next/link";

const skills = [
  { id: "00", name: "Recon", stage: 1 },
  { id: "01", name: "Entry Points", stage: 1 },
  { id: "02", name: "Actors", stage: 1 },
  { id: "03", name: "External Systems", stage: 2 },
  { id: "04", name: "Containers", stage: 2 },
  { id: "05", name: "Components", stage: 2 },
  { id: "06", name: "Capabilities", stage: 3 },
  { id: "07", name: "Data Model", stage: 3 },
  { id: "08", name: "Patterns", stage: 3 },
  { id: "09", name: "Dependencies", stage: 3 },
  { id: "10", name: "Blueprint", stage: 4 },
  { id: "11", name: "Tech Debt", stage: 4 },
  { id: "12", name: "Traceability", stage: 4 },
  { id: "13", name: "Documentation", stage: 4 },
];

const stages = [
  {
    num: 1,
    name: "Reconnaissance",
    color: "#6366f1",
    desc: "Scan the codebase. Map the surface area.",
    skills: skills.filter((s) => s.stage === 1),
  },
  {
    num: 2,
    name: "Structure",
    color: "#2563eb",
    desc: "Identify containers, components, and boundaries.",
    skills: skills.filter((s) => s.stage === 2),
  },
  {
    num: 3,
    name: "Knowledge",
    color: "#059669",
    desc: "Extract capabilities, data models, and patterns.",
    skills: skills.filter((s) => s.stage === 3),
  },
  {
    num: 4,
    name: "Assessment",
    color: "#d97706",
    desc: "Compare, score, and plan the path forward.",
    skills: skills.filter((s) => s.stage === 4),
  },
];

const features = [
  {
    title: "15 Discovery Skills",
    desc: "Each skill has defined inputs, outputs, verification gates, and anti-shortcut thinking. An agent following a skill produces consistent results.",
    icon: "🔍",
  },
  {
    title: "Any AI Coding Tool",
    desc: "Works with Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini CLI, and more. Skills are plain markdown — no vendor lock-in.",
    icon: "🔌",
  },
  {
    title: "Any Language, Any Scale",
    desc: "Stack adapters provide framework-specific hints for .NET, Java/Spring, Python/Django, Node/Express, Ruby/Rails, and a generic fallback.",
    icon: "🌐",
  },
  {
    title: "Industry Blueprints",
    desc: "Compare your system against reference architectures for IIoT, E-commerce, Fintech, SaaS B2B, and Healthcare EHR.",
    icon: "📋",
  },
  {
    title: "Evidence-Based",
    desc: "Every architectural claim cites specific files, classes, or configurations. No hallucinated architecture diagrams.",
    icon: "📎",
  },
  {
    title: "Open Source (MIT)",
    desc: "Free to use, modify, and extend. Contribute skills, adapters, blueprints, and personas back to the community.",
    icon: "💎",
  },
];

const tools = [
  { name: "Claude Code", path: "/docs/guides/claude-code-setup" },
  { name: "Cursor", path: "/docs/guides/cursor-setup" },
  { name: "Copilot", path: "/docs/guides/copilot-setup" },
  { name: "Windsurf", path: "/docs/guides/windsurf-setup" },
  { name: "Gemini CLI", path: "/docs/guides/gemini-cli-setup" },
  { name: "Codex", path: "/docs/guides/codex-setup" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-fd-muted-foreground)",
            marginBottom: "1rem",
          }}
        >
          AI Agent Skills for Architecture Discovery
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
          }}
        >
          Turn legacy code into
          <br />
          <span style={{ color: "#2563eb" }}>living knowledge</span>
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--color-fd-muted-foreground)",
            maxWidth: "40rem",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
          }}
        >
          A structured set of AI agent skills that guide systematic codebase
          discovery — extracting architecture, capabilities, data models, and
          domain knowledge from any codebase, in any language, at any scale.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/docs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "background-color 0.15s",
            }}
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/unearth-dev/unearth"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-fd-border)",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              color: "var(--color-fd-foreground)",
            }}
          >
            View on GitHub
          </Link>
        </div>
      </section>

      {/* Pipeline Diagram */}
      <section
        style={{
          padding: "3rem 1.5rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          The Discovery Pipeline
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-fd-muted-foreground)",
            marginBottom: "2.5rem",
            maxWidth: "36rem",
            margin: "0 auto 2.5rem",
          }}
        >
          14 skills across 4 stages. Each skill has defined inputs, outputs, and
          verification gates. Run them all, or pick the stage you need.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {stages.map((stage) => (
            <div
              key={stage.num}
              style={{
                borderRadius: "0.75rem",
                border: "1px solid var(--color-fd-border)",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  backgroundColor: stage.color,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "1.75rem",
                    height: "1.75rem",
                    borderRadius: "50%",
                    backgroundColor: stage.color,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {stage.num}
                </span>
                <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  {stage.name}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-fd-muted-foreground)",
                  marginBottom: "1rem",
                }}
              >
                {stage.desc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {stage.skills.map((skill) => (
                  <Link
                    key={skill.id}
                    href={`/docs/skills/${
                      stage.num === 1
                        ? "reconnaissance"
                        : stage.num === 2
                        ? "structure"
                        : stage.num === 3
                        ? "knowledge"
                        : "assessment"
                    }/${skill.id}-${skill.name.toLowerCase().replace(/ /g, "-")}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.375rem 0.625rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.8125rem",
                      color: "var(--color-fd-foreground)",
                      textDecoration: "none",
                      backgroundColor: "var(--color-fd-secondary)",
                      transition: "background-color 0.15s",
                    }}
                  >
                    <code
                      style={{
                        fontSize: "0.6875rem",
                        color: stage.color,
                        fontWeight: 600,
                      }}
                    >
                      {skill.id}
                    </code>
                    {skill.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section
        style={{
          padding: "4rem 1.5rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          Why Unearth?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: "0.75rem",
                border: "1px solid var(--color-fd-border)",
                padding: "1.5rem",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-fd-muted-foreground)",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Setup */}
      <section
        style={{
          padding: "3rem 1.5rem 4rem",
          maxWidth: "72rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Works with your AI coding tool
        </h2>
        <p
          style={{
            color: "var(--color-fd-muted-foreground)",
            marginBottom: "2rem",
          }}
        >
          Skills are plain markdown. No plugins, no extensions, no vendor lock-in.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {tools.map((t) => (
            <Link
              key={t.name}
              href={t.path}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-fd-border)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-fd-foreground)",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "4rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--color-fd-border)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
          Ready to discover your architecture?
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/docs/getting-started"
            style={{
              display: "inline-flex",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get Started in 5 Minutes
          </Link>
          <Link
            href="/docs/tutorial/your-first-discovery"
            style={{
              display: "inline-flex",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-fd-border)",
              fontWeight: 600,
              textDecoration: "none",
              color: "var(--color-fd-foreground)",
            }}
          >
            Follow the Tutorial
          </Link>
        </div>
      </section>
    </main>
  );
}
