"use client";

interface StatusBarProps {
  wordCount: number;
  readingTime: number;
  isGenerating: boolean;
  elapsed: number;
}

export function StatusBar({
  wordCount,
  readingTime,
  isGenerating,
  elapsed,
}: StatusBarProps) {
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="flex items-center justify-between h-7 px-4 border-t border-border-dim bg-inset text-[10px] font-mono text-ink-ghost shrink-0">
      <div className="flex items-center gap-4">
        <span>{wordCount} words</span>
        <span>~{readingTime} min read</span>
      </div>
      <div className="flex items-center gap-3">
        {isGenerating && (
          <span className="text-orange">{formatTime(elapsed)}</span>
        )}
      </div>
    </div>
  );
}
