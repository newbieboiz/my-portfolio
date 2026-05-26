---
title: "Fix animated section double animation on navigation"
type: "bugfix"
created: "2026-05-26"
status: "done"
route: "one-shot"
---

## Intent

**Problem:** `AnimatedSection` scroll-entrance animations fire twice when navigating between pages. Framer Motion's `AnimatePresence` page fade triggers GSAP's internal `ScrollTrigger.refresh()`, which re-evaluates trigger positions and re-fires the `onEnter` action a second time even though `toggleActions: "play none none none"` was set — because `refresh()` resets the "entered" state.

**Approach:** Add `once: true` to both ScrollTrigger configs (default and stagger branches). This kills each trigger after its first fire, so any subsequent `refresh()` call finds no live trigger and cannot re-play the animation.

## Suggested Review Order

1. [src/components/AnimatedSection.tsx](../../src/components/AnimatedSection.tsx) — the two `once: true` additions; verify both branches are covered
