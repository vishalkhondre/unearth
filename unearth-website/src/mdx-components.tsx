import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { PipelineFlow } from "@/components/pipeline-flow";
import { OutputExample } from "@/components/output-example";
import { InputOutput } from "@/components/input-output";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PipelineFlow,
    OutputExample,
    InputOutput,
    ...components,
  };
}
