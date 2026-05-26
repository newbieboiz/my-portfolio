# Deferred Work

Items here are pre-existing issues surfaced during code review but not caused by the triggering change. Address in a future session.

---

## AnimatedSection.tsx pre-existing issues
_Surfaced during: fix-animated-section-double-animation-on-navigation_

- **[F1] `toggleActions` is dead code alongside `once: true`**  
  `toggleActions: "play none none none"` is never evaluated once `once: true` kills the trigger after the first fire. The attached comment `// fire once, no reverse` also misattributes the mechanism. Safe to remove `toggleActions` entirely.

- **[F2] Non-null assertion `containerRef.current!` in stagger branch**  
  Should be replaced with an early-return guard `if (!containerRef.current) return;` at the top of the `useGSAP` callback to match the default branch's null-tolerant behaviour.

- **[F3] `stagger` prop not in `useGSAP` dependency array**  
  If a parent re-renders `<AnimatedSection stagger={true}>` after initial mount, the animation branch is frozen to whichever ran on first mount. Add `dependencies: [stagger]` if dynamic usage is ever needed.

- **[F4] Empty children in stagger mode creates a dead trigger before late-arriving children**  
  `gsap.from([], ...)` creates a ScrollTrigger that fires immediately on an empty target list, then `once: true` kills it. Children rendered after that point are never animated. Add a guard: `if (!containerRef.current?.children.length) return;`.
