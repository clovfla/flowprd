"use client";

import { useState } from "react";
import { DocKey, DocCategory, CATEGORIES } from "@/lib/types";
import { ProgressInfo } from "@/hooks/useGenerate";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ActionBar } from "./ActionBar";
import { SkeletonLoader } from "./SkeletonLoader";

interface OutputPanelProps {
  docs: Record<DocKey, string>;
  currentStream: string;
  currentDocKey: DocKey | null;
  isGenerating: boolean;
  progress: ProgressInfo | null;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onToast?: (type: "success" | "error" | "info", msg: string) => void;
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function OutputPanel({
  docs,
  currentStream,
  currentDocKey,
  isGenerating,
  progress,
  contentRef,
  onToast,
}: OutputPanelProps) {
  const [category, setCategory] = useState<DocCategory>("planning");
  const [activeTab, setActiveTab] = useState<DocKey>("prd");

  const hasContent = Object.values(docs).some((v) => v.length > 0);
  const tabContent = docs[activeTab] || "";

  // Show stream only if this tab is the one currently being generated
  const isThisTabGenerating = currentDocKey === activeTab;
  const showStream = isGenerating && isThisTabGenerating && currentStream.length > 0 && !tabContent;
  const showSkeleton = isGenerating && isThisTabGenerating && !currentStream && !tabContent;
  const isWaiting = isGenerating && !isThisTabGenerating && !tabContent;

  // Empty state
  if (!hasContent && !isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="flex gap-1 justify-center mb-6 opacity-15">
            <div className="w-1 h-10 rounded-sm bg-orange" />
            <div className="w-1 h-10 rounded-sm bg-orange/60" />
            <div className="w-1 h-10 rounded-sm bg-orange/30" />
            <div className="w-1 h-10 rounded-sm bg-aqua/30" />
            <div className="w-1 h-10 rounded-sm bg-aqua/60" />
            <div className="w-1 h-10 rounded-sm bg-aqua" />
          </div>
          <p className="text-sm text-ink-mid mb-2">Belum ada dokumen</p>
          <p className="text-[12px] text-ink-ghost leading-relaxed">
            Ketik deskripsi project di panel kiri, lalu tekan{" "}
            <span className="text-orange font-medium">Generate</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-1 min-h-0"
      style={{ animation: "slide-in-right 0.3s ease-out" }}
    >
      {/* Category bar */}
      <div className="flex items-center h-9 px-4 border-b border-border-dim shrink-0 bg-panel">
        {(Object.keys(CATEGORIES) as DocCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setActiveTab(CATEGORIES[cat].tabs[0].key);
            }}
            className={`h-full px-3 text-[11px] font-mono uppercase tracking-[0.06em] transition-colors cursor-pointer relative ${
              category === cat ? "text-ink" : "text-ink-ghost hover:text-ink-dim"
            }`}
          >
            {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
            {category === cat && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-orange rounded-t" />
            )}
          </button>
        ))}

        {/* Progress */}
        {progress && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-mono text-aqua">{progress.docLabel}</span>
            <span className="text-[10px] font-mono text-ink-ghost">
              {progress.current}/{progress.total}
            </span>
            {progress.status === "generating" && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
            )}
            {progress.status === "done" && (
              <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            )}
            <span className="text-[10px] font-mono text-ink-ghost">
              {formatElapsed(progress.elapsed)}
            </span>
          </div>
        )}
      </div>

      {/* Sub-tab bar */}
      <div className="flex items-center h-8 px-4 border-b border-border-dim shrink-0 bg-inset">
        {CATEGORIES[category].tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`h-full px-2.5 text-[11px] font-mono transition-colors cursor-pointer relative ${
              activeTab === t.key ? "text-ink" : "text-ink-ghost hover:text-ink-dim"
            }`}
          >
            {t.label}
            {docs[t.key]?.length > 0 && (
              <span className="ml-1 inline-block w-1 h-1 rounded-full bg-ok" />
            )}
            {currentDocKey === t.key && isGenerating && (
              <span className="ml-1 inline-block w-1 h-1 rounded-full bg-orange animate-pulse" />
            )}
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-aqua rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        <div className="px-6 py-5">
          {tabContent ? (
            // Completed doc
            <div style={{ animation: "fade-in 0.2s ease-out" }} key={activeTab}>
              <MarkdownRenderer content={tabContent} />
            </div>
          ) : showStream ? (
            // Currently streaming this tab
            <div style={{ animation: "fade-in 0.2s ease-out" }}>
              <MarkdownRenderer content={currentStream} />
            </div>
          ) : showSkeleton ? (
            // Waiting for stream to start on this tab
            <SkeletonLoader />
          ) : isWaiting ? (
            // This tab's turn hasn't come yet
            <p className="text-[12px] text-ink-ghost font-mono text-center py-16">
              menunggu giliran...
            </p>
          ) : (
            // Not generating, no content
            <p className="text-[12px] text-ink-ghost font-mono text-center py-16">
              section ini belum tersedia
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {tabContent && !isGenerating && (
        <ActionBar content={tabContent} label={activeTab} allDocs={docs} onToast={onToast} />
      )}
    </div>
  );
}
