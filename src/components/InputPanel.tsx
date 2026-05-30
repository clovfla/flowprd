"use client";

import { useState, useRef, useEffect } from "react";
import { QuestionModal } from "./QuestionModal";
import { SectionPicker, SECTIONS } from "./SectionPicker";

interface InputPanelProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  templatePrompt?: string | null;
  plan?: string;
}

const EXAMPLES = [
  "E-commerce sepatu sneakers",
  "Booking dokter online",
  "SaaS manajemen inventaris",
  "Social media komunitas kopi",
];

export function InputPanel({ onGenerate, isGenerating, templatePrompt, plan = "free" }: InputPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [showSections, setShowSections] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    SECTIONS.map((s) => s.id)
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set prompt from template
  useEffect(() => {
    if (templatePrompt) {
      setPrompt(templatePrompt);
    }
  }, [templatePrompt]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
  }, [prompt]);

  const startGenerate = (finalPrompt: string) => {
    // Append selected sections info if not all are selected
    const allSections = SECTIONS.map((s) => s.id);
    const notAllSelected = !allSections.every((s) => selectedSections.includes(s));
    let sectionHint = "";
    if (notAllSelected && selectedSections.length > 0) {
      const names = SECTIONS.filter((s) => selectedSections.includes(s.id)).map((s) => s.label);
      sectionHint = `\n\nHanya buat section berikut: ${names.join(", ")}.`;
    }
    onGenerate(finalPrompt + sectionHint);
    setQuestions(null);
  };

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Clarification questions — premium only
    if (plan !== "free") {
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompt.trim() }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.sufficient === false && data.questions?.length > 0) {
            setQuestions(data.questions);
            setIsAnalyzing(false);
            return;
          }
        }
      } catch {
        // fallback: langsung generate
      }
      setIsAnalyzing(false);
    }

    startGenerate(prompt.trim());
  };

  const handleAnswerQuestions = (answers: string[]) => {
    const answered = questions!
      .map((q, i) => (answers[i]?.trim() ? `${q} ${answers[i].trim()}` : ""))
      .filter(Boolean)
      .join(". ");

    const finalPrompt = answered
      ? `${prompt.trim()}. ${answered}`
      : prompt.trim();

    startGenerate(finalPrompt);
  };

  const handleSkipQuestions = () => {
    startGenerate(prompt.trim());
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <label className="text-[10px] font-mono text-ink-ghost uppercase tracking-[0.12em]">
          Project
        </label>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Deskripsikan project kamu..."
          className="w-full min-h-[68px] max-h-[100px] px-3 py-2.5 rounded bg-inset border border-border-dim text-[13px] text-ink placeholder:text-ink-ghost resize-none focus:outline-none focus:border-orange/30 transition-colors"
          disabled={isGenerating || isAnalyzing}
        />
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating || isAnalyzing}
          className="w-full h-8 rounded bg-orange hover:bg-orange-dim disabled:opacity-20 disabled:cursor-not-allowed text-[12px] font-semibold text-bg tracking-tight transition-all cursor-pointer"
          style={isGenerating ? { animation: "pulse-orange 2s ease-in-out infinite" } : {}}
        >
          {isAnalyzing
            ? "Analyzing..."
            : isGenerating
            ? "Generating..."
            : "Generate"}
        </button>
        <div className="flex flex-wrap gap-1">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              disabled={isGenerating || isAnalyzing}
              className="px-2 py-0.5 text-[10px] font-mono rounded border border-border-dim text-ink-ghost hover:text-ink-dim hover:border-border transition-colors cursor-pointer disabled:opacity-25"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Section picker toggle */}
        <button
          onClick={() => setShowSections(!showSections)}
          className="flex items-center gap-1 text-[10px] font-mono text-ink-ghost hover:text-ink-dim transition-colors cursor-pointer"
        >
          <svg className={`w-2.5 h-2.5 transition-transform ${showSections ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Custom sections
        </button>
        {showSections && (
          <SectionPicker
            selectedSections={selectedSections}
            onToggle={toggleSection}
          />
        )}
      </div>

      {/* Question modal */}
      {questions && (
        <QuestionModal
          questions={questions}
          onAnswer={handleAnswerQuestions}
          onSkip={handleSkipQuestions}
          onClose={() => setQuestions(null)}
        />
      )}
    </>
  );
}
