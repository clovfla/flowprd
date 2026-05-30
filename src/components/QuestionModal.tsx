"use client";

import { useState } from "react";

interface QuestionModalProps {
  questions: string[];
  onAnswer: (answers: string[]) => void;
  onSkip: () => void;
  onClose: () => void;
}

export function QuestionModal({
  questions,
  onAnswer,
  onSkip,
  onClose,
}: QuestionModalProps) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));

  const handleSubmit = () => {
    onAnswer(answers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-panel border border-border rounded-lg shadow-2xl w-full max-w-md mx-4"
        style={{ animation: "slide-up 0.2s ease-out" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua" />
            <span className="text-[12px] font-mono text-aqua">
              Clarification
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-ghost hover:text-ink-dim cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p className="text-[12px] text-ink-dim">
            Untuk menghasilkan PRD yang lebih baik, jawab beberapa pertanyaan:
          </p>

          {questions.map((q, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-ink-mid">
                {i + 1}. {q}
              </label>
              <input
                type="text"
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                placeholder="Jawaban singkat..."
                className="w-full px-3 py-1.5 rounded bg-inset border border-border-dim text-[13px] text-ink placeholder:text-ink-ghost focus:outline-none focus:border-orange/30 transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border-dim">
          <button
            onClick={onSkip}
            className="text-[11px] font-mono text-ink-ghost hover:text-ink-dim cursor-pointer"
          >
            Skip, langsung generate
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg transition-colors cursor-pointer"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
