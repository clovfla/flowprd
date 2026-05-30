"use client";

import { GeneratedDoc } from "@/lib/types";

interface HistoryListProps {
  history: GeneratedDoc[];
  onSelect: (doc: GeneratedDoc) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
}

function ago(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function HistoryList({ history, onSelect, onDelete, selectedId }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono text-ink-ghost uppercase tracking-[0.12em] mb-1 px-1">
        History
      </span>
      {history.map((doc) => (
        <div
          key={doc.id}
          className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
            selectedId === doc.id
              ? "bg-hover border-l-2 border-l-orange"
              : "hover:bg-hover border-l-2 border-l-transparent"
          }`}
          onClick={() => onSelect(doc)}
        >
          <span className="flex-1 text-[12px] text-ink-dim truncate">
            {doc.title}
          </span>
          <span className="text-[10px] font-mono text-ink-ghost shrink-0">
            {ago(doc.createdAt)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
            className="opacity-0 group-hover:opacity-100 text-ink-ghost hover:text-err transition-opacity cursor-pointer shrink-0"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
