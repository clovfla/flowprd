"use client";

import { TEMPLATES, Template } from "@/lib/templates";

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-panel border border-border rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
        style={{ animation: "slide-up 0.2s ease-out" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
          <span className="text-[12px] font-mono text-ink-mid">Pilih Template</span>
          <button onClick={onClose} className="text-ink-ghost hover:text-ink-dim cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="flex items-start gap-3 p-3 rounded-lg border border-border-dim hover:border-orange/30 hover:bg-hover transition-colors cursor-pointer text-left"
            >
              <span className="text-lg shrink-0">{t.icon}</span>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-ink">{t.name}</p>
                <p className="text-[10px] text-ink-ghost mt-0.5">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
