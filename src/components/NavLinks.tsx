"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types/site";

export function NavLinks({ navigation }: { navigation: NavigationItem[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    pathname ? pathname === href || pathname.startsWith(href + "/") : false;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu if viewport transitions to desktop while open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleDesktopChange);
    return () => {
      mediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isOpen]);

  const focusRingClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded";

  return (
    <>
      {/* Desktop nav links */}
      <ul className="gap-space-6 hidden items-center lg:flex">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-text-secondary hover:text-text-primary duration-micro transition-colors ${focusRingClasses} ${
                isActive(item.href) ? "text-accent" : ""
              }`}
              {...(item.isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger button */}
      <button
        className={`text-text-secondary hover:text-text-primary duration-micro z-50 flex size-5 items-center justify-center transition-colors lg:hidden ${focusRingClasses}`}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="bg-bg-primary/95 fixed top-16 left-0 z-40 flex h-dvh w-screen flex-col items-center justify-center backdrop-blur-sm lg:hidden"
        >
          <ul className="gap-space-8 -mt-32 flex flex-col items-center">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`text-h3 text-text-secondary hover:text-text-primary duration-micro font-mono transition-colors ${focusRingClasses} ${
                    isActive(item.href) ? "text-accent" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                  {...(item.isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
