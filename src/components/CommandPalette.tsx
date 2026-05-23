"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";

import { useCommandPalette } from "@/hooks/useCommandPalette";

export interface CommandItem {
  id: string;
  label: string;
  href: string;
  group: "Pages" | "Projects";
  keywords?: string[];
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const { open, setOpen, close } = useCommandPalette();
  const router = useRouter();

  const pageItems = items.filter((item) => item.group === "Pages");
  const projectItems = items.filter((item) => item.group === "Projects");

  const handleSelect = (href: string) => {
    close();
    router.push(href);
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
              onSelect={() => handleSelect(item.href)}
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
                onSelect={() => handleSelect(item.href)}
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
