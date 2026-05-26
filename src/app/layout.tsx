import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig, getProjects } from "@/lib/data";
import { StatusStripe } from "@/components/StatusStripe";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CommandPalette, type CommandItem } from "@/components/CommandPalette";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { PageTransition } from "@/components/PageTransition";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BaoBao — Full-Stack Engineer",
  description:
    "Full-stack engineer portfolio — projects, experience, and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = getSiteConfig();
  const projects = getProjects();

  const commandItems: CommandItem[] = [
    { id: "page-home", label: "Home", href: "/", group: "Pages" },
    {
      id: "page-projects",
      label: "Projects",
      href: "/projects",
      group: "Pages",
    },
    { id: "page-about", label: "About", href: "/about", group: "Pages" },
    { id: "page-contact", label: "Contact", href: "/contact", group: "Pages" },
    ...projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      href: `/projects/${p.slug}`,
      group: "Projects" as const,
      keywords: [...p.techStack, p.slug, p.description],
    })),
  ];
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StatusStripe config={siteConfig} />
        <a
          href="#main-content"
          className="focus:bg-bg-secondary focus:text-accent focus:ring-accent focus:top-space-4 focus:left-space-4 focus:px-space-4 focus:py-space-2 focus:text-small sr-only focus:not-sr-only focus:fixed focus:z-60 focus:rounded focus:ring-1 focus:outline-none"
        >
          Skip to main content
        </a>
        <NavBar config={siteConfig} />
        <CommandPalette items={commandItems} />
        <KeyboardShortcutsHelp />
        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer config={siteConfig} />
      </body>
    </html>
  );
}
