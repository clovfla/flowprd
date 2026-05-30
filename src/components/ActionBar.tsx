"use client";

import { useState } from "react";
import { exportMarkdown, exportPlainText, exportHTML, exportDOCX, exportNotion, exportPresentation } from "@/lib/exporters";

interface ActionBarProps {
  content: string;
  label: string;
  allDocs?: Record<string, string>;
  onToast?: (type: "success" | "error" | "info", msg: string) => void;
}

export function ActionBar({ content, label, allDocs, onToast }: ActionBarProps) {
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onToast?.("success", "Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExport = (format: string) => {
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    switch (format) {
      case "md":
        exportMarkdown(content, slug);
        onToast?.("success", "Downloaded as .md");
        break;
      case "txt":
        exportPlainText(content, slug);
        onToast?.("success", "Downloaded as .txt");
        break;
      case "html":
        exportHTML(content, slug);
        onToast?.("success", "Downloaded as .html");
        break;
      case "docx":
        exportDOCX(content, slug);
        onToast?.("success", "Downloaded as .doc");
        break;
      case "notion":
        exportNotion(content, slug);
        onToast?.("success", "Downloaded for Notion");
        break;
      case "slides":
        exportPresentation(content, slug);
        onToast?.("success", "Presentation downloaded");
        break;
    }
    setShowExport(false);
  };

  return (
    <div className="flex items-center gap-1.5 h-9 px-4 border-t border-border-dim bg-panel shrink-0">
      <button
        onClick={copy}
        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded border border-border-dim text-ink-ghost hover:text-aqua hover:border-aqua/20 transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <svg className="w-3 h-3 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            copied
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            copy
          </>
        )}
      </button>

      {/* Export dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowExport(!showExport)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded border border-border-dim text-ink-ghost hover:text-aqua hover:border-aqua/20 transition-colors cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          export
          <svg className="w-2.5 h-2.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {showExport && (
          <div className="absolute bottom-full left-0 mb-1 bg-panel border border-border rounded-lg shadow-lg overflow-hidden min-w-[120px]">
            {[
              { format: "md", label: "Markdown (.md)" },
              { format: "txt", label: "Plain Text (.txt)" },
              { format: "html", label: "HTML (.html)" },
              { format: "docx", label: "Word (.doc)" },
              { format: "notion", label: "Notion (.md)" },
              { format: "slides", label: "Presentation (.html)" },
            ].map(({ format, label: fmtLabel }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full text-left px-3 py-1.5 text-[11px] font-mono text-ink-mid hover:bg-hover hover:text-ink transition-colors cursor-pointer"
              >
                {fmtLabel}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Share button */}
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/share", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                docId: label,
                title: label,
                docs: allDocs || { prd: content },
              }),
            });
            const data = await res.json();
            if (data.url) {
              const fullUrl = `${window.location.origin}${data.url}`;
              await navigator.clipboard.writeText(fullUrl);
              onToast?.("success", "Share link copied!");
            } else {
              onToast?.("error", data.error || "Gagal membuat share link");
            }
          } catch {
            onToast?.("error", "Gagal membuat share link");
          }
        }}
        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded border border-border-dim text-ink-ghost hover:text-aqua hover:border-aqua/20 transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        share
      </button>
    </div>
  );
}
