"use client";

interface SectionPickerProps {
  selectedSections: string[];
  onToggle: (section: string) => void;
}

const SECTIONS = [
  { id: "overview", label: "Product Overview" },
  { id: "goals", label: "Goals & Objectives" },
  { id: "users", label: "Target Users" },
  { id: "stories", label: "User Stories" },
  { id: "features", label: "Core Features" },
  { id: "tech", label: "Technical Requirements" },
  { id: "nfr", label: "Non-Functional Requirements" },
  { id: "data", label: "Data Model" },
  { id: "integrations", label: "Integrations" },
  { id: "risks", label: "Risks & Mitigations" },
  { id: "metrics", label: "Success Metrics" },
  { id: "timeline", label: "Timeline" },
];

export function SectionPicker({
  selectedSections,
  onToggle,
}: SectionPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono text-ink-ghost uppercase tracking-[0.12em]">
          Sections
        </label>
        <button
          onClick={() => {
            const allSelected = SECTIONS.every((s) =>
              selectedSections.includes(s.id)
            );
            SECTIONS.forEach((s) => {
              if (allSelected) {
                onToggle(s.id); // deselect all
              } else if (!selectedSections.includes(s.id)) {
                onToggle(s.id); // select all
              }
            });
          }}
          className="text-[10px] font-mono text-ink-ghost hover:text-aqua cursor-pointer"
        >
          {SECTIONS.every((s) => selectedSections.includes(s.id))
            ? "clear"
            : "all"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {SECTIONS.map((s) => {
          const active = selectedSections.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                active
                  ? "border-orange/40 text-orange bg-orange-soft"
                  : "border-border-dim text-ink-ghost hover:text-ink-dim hover:border-border"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SECTIONS };
