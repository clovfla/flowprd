"use client";

import { Toast } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border shadow-lg text-[12px] font-mono"
          style={{ animation: "slide-up 0.2s ease-out" }}
        >
          {toast.type === "success" && (
            <span className="w-1.5 h-1.5 rounded-full bg-ok shrink-0" />
          )}
          {toast.type === "error" && (
            <span className="w-1.5 h-1.5 rounded-full bg-err shrink-0" />
          )}
          {toast.type === "info" && (
            <span className="w-1.5 h-1.5 rounded-full bg-aqua shrink-0" />
          )}
          <span className="text-ink-mid">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-ink-ghost hover:text-ink-dim ml-1 cursor-pointer"
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
