"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";
import { generateQRDataURL } from "@/lib/qr";
import { getSiteConfig } from "@/lib/data";

type DownloadState = "idle" | "generating" | "error";

export function CVDownloadButton() {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  // const [isMobile, setIsMobile] = useState(false); // SSR-safe: start false

  // useEffect(() => {
  //   const mql = window.matchMedia("(max-width: 767px)");
  //   setIsMobile(mql.matches);
  //   const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
  //   mql.addEventListener("change", handleChange);
  //   return () => mql.removeEventListener("change", handleChange);
  // }, []);

  const handleClick = async () => {
    if (downloadState === "generating") return;

    setDownloadState("generating");
    try {
      const site = getSiteConfig();
      const qrDataUrl = await generateQRDataURL(site.siteUrl);
      const blob = await pdf(<CVDocument qrDataUrl={qrDataUrl} />).toBlob();

      const filename = `${site.owner.name.replace(/\s+/g, "-")}-CV.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadState("idle");
    } catch (err) {
      console.error("CV PDF generation failed:", err);
      setDownloadState("error");
    }
  };

  const label =
    downloadState === "generating"
      ? "Generating..."
      : downloadState === "error"
        ? "Export failed — please try again"
        : "Download CV";

  return (
    <button
      onClick={handleClick}
      disabled={downloadState === "generating"}
      aria-live="polite"
      aria-busy={downloadState === "generating"}
      className="px-space-6 py-space-4 border-border-active text-text-primary text-small duration-micro hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded border font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
