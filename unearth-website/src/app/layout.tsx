import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Unearth",
    default: "Unearth — AI Agent Skills for Architecture Discovery",
  },
  description:
    "Turn legacy code into living knowledge. A structured set of AI agent skills that guide systematic codebase discovery.",
  metadataBase: new URL("https://unearth.dev"),
  openGraph: {
    title: "Unearth — AI Agent Skills for Architecture Discovery",
    description:
      "Turn legacy code into living knowledge. A structured set of AI agent skills that guide systematic codebase discovery.",
    url: "https://unearth.dev",
    siteName: "Unearth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unearth — AI Agent Skills for Architecture Discovery",
    description:
      "Turn legacy code into living knowledge. A structured set of AI agent skills that guide systematic codebase discovery.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
