"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Command } from "cmdk";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import { getSiteConfig } from "@/lib/data";

export interface CommandItem {
  id: string;
  label: string;
  href?: string;
  actionId?: "download-cv" | "toggle-crt" | "run-diagnostics";
  group: "Pages" | "Projects" | "System Options";
  keywords?: string[];
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const { open, setOpen, close } = useCommandPalette();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const systemItems: CommandItem[] = [
    {
      id: "action-download-cv",
      label: isExporting
        ? "Exporting CV PDF..."
        : "Export CV PDF (Print-ready documentation)",
      actionId: "download-cv",
      group: "System Options",
      keywords: ["cv", "resume", "download", "pdf", "export"],
    },
    {
      id: "action-toggle-crt",
      label: "Toggle Cathode-Ray Tube (CRT) Screen Effect",
      actionId: "toggle-crt",
      group: "System Options",
      keywords: [
        "crt",
        "retro",
        "glow",
        "monitor",
        "scanline",
        "appearance",
        "vibe",
      ],
    },
    {
      id: "action-system-diagnostics",
      label: "Run Integrated Site Diagnostics Suite",
      actionId: "run-diagnostics",
      group: "System Options",
      keywords: [
        "diagnostic",
        "status",
        "test",
        "benchmark",
        "fps",
        "performance",
        "speed",
      ],
    },
  ];

  const allItems = [...items, ...systemItems];

  const pageItems = allItems.filter((item) => item.group === "Pages");
  const projectItems = allItems.filter((item) => item.group === "Projects");
  const sysItems = allItems.filter((item) => item.group === "System Options");

  const handleSelect = async (item: CommandItem) => {
    if (item.actionId === "download-cv") {
      if (isExporting) return;
      setIsExporting(true);
      try {
        const site = getSiteConfig();
        const { pdf } = await import("@react-pdf/renderer");
        const { CVDocument } = await import("./cv/CVDocument");
        const { generateQRDataURL } = await import("@/lib/qr");

        const qrDataUrl = await generateQRDataURL(site.siteUrl);
        const blob = await pdf(<CVDocument qrDataUrl={qrDataUrl} />).toBlob();
        const filename = `${site.owner.name.replace(/\s+/g, "-")}-CV.pdf`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Command palette CV export failed:", err);
      } finally {
        setIsExporting(false);
        close();
      }
      return;
    }

    close();

    if (item.actionId === "toggle-crt") {
      window.dispatchEvent(new CustomEvent("toggle-crt"));
      return;
    }

    if (item.actionId === "run-diagnostics") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("run-diagnostics"));
      }, 300);
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command palette"
    >
      <Command.Input placeholder="Search pages and projects…" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Pages">
          {pageItems.map((item) => (
            <Command.Item
              key={item.id}
              value={item.label}
              keywords={item.keywords ?? []}
              onSelect={() => handleSelect(item)}
            >
              {item.label}
            </Command.Item>
          ))}
        </Command.Group>

        {projectItems.length > 0 && (
          <Command.Group heading="Projects">
            {projectItems.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                keywords={item.keywords ?? []}
                onSelect={() => handleSelect(item)}
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="System Options">
          {sysItems.map((item) => (
            <Command.Item
              key={item.id}
              value={item.label}
              keywords={item.keywords ?? []}
              onSelect={() => handleSelect(item)}
            >
              {item.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
