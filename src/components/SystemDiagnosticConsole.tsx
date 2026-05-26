"use client";

import { useEffect, useState, useRef } from "react";

interface LogLine {
  text: string;
  type: "info" | "success" | "warn" | "system";
}

const DIAGNOSTIC_STEPS: LogLine[] = [
  { text: "Initializing diagnostic scan...", type: "system" },
  { text: "CPU/Thread check: Operational.", type: "system" },
  {
    text: "Environment detected: Next.js 16.2.6 + React 19.0.0-canary",
    type: "info",
  },
  {
    text: "Style layer: Tailwind CSS v4.0.0 (Custom design token architecture)",
    type: "info",
  },
  { text: "Reading static content schemas...", type: "system" },
  { text: "  -> projects.json: 2 records compiled", type: "info" },
  { text: "  -> experience.json: 4 records loaded", type: "info" },
  { text: "  -> skills.json: Loaded and categorized", type: "info" },
  { text: "Verifying web metrics (NFR-1)...", type: "system" },
  {
    text: "  - First Contentful Paint (FCP): < 1.0s (Target: 1.5s) [PASS]",
    type: "success",
  },
  {
    text: "  - Cumulative Layout Shift (CLS): 0.00 (Target: < 0.1) [PASS]",
    type: "success",
  },
  {
    text: "  - Interaction to Next Paint (INP): < 10ms (Target: < 200ms) [PASS]",
    type: "success",
  },
  { text: "Validating navigation systems...", type: "system" },
  { text: "  - Global cmdk Command Palette: READY", type: "info" },
  {
    text: "  - Keyboard Navigation Chord Engine (G+key): ONLINE",
    type: "info",
  },
  { text: "Checking CV Document Generator...", type: "system" },
  { text: "  - Dynamic @react-pdf/renderer Engine: STANDBY", type: "info" },
  { text: "  - QR Code Bridge Generator: READY", type: "info" },
  {
    text: "Security and accessibility (WCAG AA) standards: 100/100",
    type: "success",
  },
  { text: "DIAGNOSTIC COMPLETE: Craft rating: ELITE.", type: "success" },
  {
    text: "VERDICT: BaoBao is exceptionally hireable. Recommendation: Schedule interview.",
    type: "success",
  },
  {
    text: "Press [ESC] or click close to terminate console session.",
    type: "warn",
  },
];

export function SystemDiagnosticConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setLogs([]);

      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      let stepIndex = 0;
      const runStep = () => {
        if (stepIndex < DIAGNOSTIC_STEPS.length) {
          setLogs((prev) => [...prev, DIAGNOSTIC_STEPS[stepIndex]]);
          stepIndex++;
          // Randomize typing speed slightly for realism (120ms to 240ms)
          const delay =
            stepIndex === 19 || stepIndex === 20
              ? 600
              : Math.random() * 120 + 80;
          timerRef.current = setTimeout(runStep, delay);
        }
      };

      // Start sequence
      runStep();
    };

    window.addEventListener("run-diagnostics", handleTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("run-diagnostics", handleTrigger);
      window.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Diagnostic Console"
      className="border-border-subtle bg-bg-secondary fixed right-0 bottom-0 left-0 z-105 border-t font-mono text-xs shadow-2xl transition-all"
    >
      {/* Console Header */}
      <div className="border-border-subtle bg-bg-primary flex h-9 items-center justify-between border-b px-6">
        <div className="gap-space-2 text-text-secondary flex items-center select-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
          </span>
          <span>DIAGNOSTIC_SESSION // active_terminal</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-text-muted hover:text-accent duration-micro cursor-pointer text-xs transition-colors"
        >
          [close]
        </button>
      </div>

      {/* Output Stream */}
      <div
        ref={scrollRef}
        className="text-text-secondary flex h-64 flex-col gap-1 overflow-y-auto px-6 py-4 leading-normal"
        style={{ scrollBehavior: "smooth" }}
      >
        {logs.map((line, index) => {
          let typeColor = "text-text-secondary";
          if (line.type === "success") typeColor = "text-accent font-semibold";
          if (line.type === "warn") typeColor = "text-warning";
          if (line.type === "system") typeColor = "text-info";

          return (
            <div
              key={index}
              className="gap-space-2 selection:bg-accent selection:text-bg-primary flex items-start"
            >
              <span className="text-text-muted select-none">$&gt;</span>
              <span className={typeColor}>{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
