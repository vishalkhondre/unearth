import Link from "next/link";
import { PipelineFlow } from "@/components/pipeline-flow";
import { FeatureCard } from "@/components/feature-card";
import { ToolBadge } from "@/components/tool-badge";
import { OutputExample } from "@/components/output-example";
import { features, tools } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 text-center max-w-5xl mx-auto">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-fd-muted-foreground)] mb-4">
          AI Agent Skills for Architecture Discovery
        </p>
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1.1] tracking-tight mb-6">
          Turn legacy code into
          <br />
          <span className="text-unearth-primary">living knowledge</span>
        </h1>
        <p className="text-xl text-[var(--color-fd-muted-foreground)] max-w-2xl mx-auto mb-8 leading-relaxed">
          A structured set of AI agent skills that guide systematic codebase
          discovery -- extracting architecture, capabilities, data models, and
          domain knowledge from any codebase, in any language, at any scale.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/docs"
            className="inline-flex items-center px-7 py-3 rounded-lg bg-unearth-primary text-white font-semibold no-underline hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/unearth-dev/unearth"
            className="inline-flex items-center px-7 py-3 rounded-lg border border-[var(--color-fd-border)] font-semibold no-underline text-[var(--color-fd-foreground)] hover:border-[var(--color-fd-muted-foreground)]/40 transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </section>

      {/* Problem -> Solution */}
      <section className="px-6 pb-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--color-fd-border)] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-fd-muted-foreground)] mb-3">
              Without Unearth
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-fd-muted-foreground)]">
              <li>Weeks of reading code to understand the architecture</li>
              <li>Tribal knowledge locked in the heads of people who left</li>
              <li>Stale wiki pages that contradict the actual codebase</li>
              <li>Unknown unknowns -- risks discovered in production</li>
            </ul>
          </div>
          <div className="rounded-xl border border-unearth-primary/30 bg-unearth-primary/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-unearth-primary mb-3">
              With Unearth
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-fd-foreground)]">
              <li>Structured capability map in hours, not months</li>
              <li>C4 diagrams generated from actual code evidence</li>
              <li>Every claim traces to a specific file, class, or config</li>
              <li>Industry blueprint comparison reveals what is missing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">
          The Discovery Pipeline
        </h2>
        <p className="text-center text-[var(--color-fd-muted-foreground)] max-w-xl mx-auto mb-8">
          14 skills across 4 stages. Each skill has defined inputs, outputs, and
          verification gates. Run them all, or pick the stage you need.
        </p>
        <PipelineFlow />
      </section>

      {/* What You Get */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">
          What You Get
        </h2>
        <p className="text-center text-[var(--color-fd-muted-foreground)] max-w-xl mx-auto mb-8">
          Every skill produces a structured output file with evidence-backed findings.
          Here is a taste of what the pipeline generates.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <OutputExample filename="outputs/00-recon.md">
            <h4 className="text-sm font-bold mb-2">Technology Stack</h4>
            <table>
              <thead>
                <tr><th>Technology</th><th>Version</th><th>Evidence</th></tr>
              </thead>
              <tbody>
                <tr><td>.NET</td><td>8.0</td><td><code>OrderApi.csproj</code></td></tr>
                <tr><td>Angular</td><td>17.x</td><td><code>angular.json</code></td></tr>
                <tr><td>PostgreSQL</td><td>15</td><td><code>docker-compose.yml</code></td></tr>
              </tbody>
            </table>
          </OutputExample>

          <OutputExample filename="outputs/06-capabilities.md">
            <h4 className="text-sm font-bold mb-2">L1 Capabilities</h4>
            <table>
              <thead>
                <tr><th>#</th><th>Capability</th><th>Projects</th></tr>
              </thead>
              <tbody>
                <tr><td>L1-1</td><td>Order Management</td><td>API, BFF, UI</td></tr>
                <tr><td>L1-2</td><td>Inventory Tracking</td><td>API, Worker</td></tr>
                <tr><td>L1-3</td><td>Customer Accounts</td><td>API, UI</td></tr>
              </tbody>
            </table>
          </OutputExample>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Unearth?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} icon={f.icon} />
          ))}
        </div>
      </section>

      {/* Tool Setup */}
      <section className="px-6 py-12 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">
          Works with your AI coding tool
        </h2>
        <p className="text-[var(--color-fd-muted-foreground)] mb-6">
          Skills are plain markdown. No plugins, no extensions, no vendor lock-in.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {tools.map((t) => (
            <ToolBadge key={t.name} name={t.name} path={t.path} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center border-t border-[var(--color-fd-border)]">
        <h2 className="text-xl font-bold mb-4">
          Ready to discover your architecture?
        </h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/docs/getting-started"
            className="inline-flex px-7 py-3 rounded-lg bg-unearth-primary text-white font-semibold no-underline hover:opacity-90 transition-opacity"
          >
            Get Started in 5 Minutes
          </Link>
          <Link
            href="/docs/tutorial/your-first-discovery"
            className="inline-flex px-7 py-3 rounded-lg border border-[var(--color-fd-border)] font-semibold no-underline text-[var(--color-fd-foreground)] hover:border-[var(--color-fd-muted-foreground)]/40 transition-colors"
          >
            Follow the Tutorial
          </Link>
        </div>
      </section>
    </main>
  );
}
