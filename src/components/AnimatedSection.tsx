"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once at module scope — safe to call multiple times (idempotent)
gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export function AnimatedSection({
  children,
  className,
  stagger = false,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (stagger) {
          // Stagger mode: animate each direct child element individually
          gsap.from(Array.from(containerRef.current!.children), {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08, // 80ms between each card — matches epics spec
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none", // fire once, no reverse
            },
          });
        } else {
          // Default mode: animate the whole container as one unit
          gsap.from(containerRef.current, {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
