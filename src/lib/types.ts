export interface GeneratedDoc {
  id: string;
  title: string;
  prompt: string;
  prdContent: string;
  workflowContent: string;
  createdAt: number;
}

export type DocKey =
  | "executiveSummary"
  | "prd"
  | "userFlow"
  | "architecture"
  | "workflow"
  | "sprintPlan"
  | "riskMatrix"
  | "successMetrics";

export const DOC_KEYS: DocKey[] = [
  "executiveSummary",
  "prd",
  "userFlow",
  "architecture",
  "workflow",
  "sprintPlan",
  "riskMatrix",
  "successMetrics",
];

export type DocCategory = "planning" | "building" | "tracking";

export const CATEGORIES: Record<
  DocCategory,
  { label: string; icon: string; tabs: { key: DocKey; label: string }[] }
> = {
  planning: {
    label: "Planning",
    icon: "📋",
    tabs: [
      { key: "executiveSummary", label: "Executive Summary" },
      { key: "prd", label: "PRD" },
      { key: "userFlow", label: "User Flow" },
    ],
  },
  building: {
    label: "Building",
    icon: "🔧",
    tabs: [
      { key: "architecture", label: "Architecture" },
      { key: "workflow", label: "Workflow" },
      { key: "sprintPlan", label: "Sprint Plan" },
    ],
  },
  tracking: {
    label: "Tracking",
    icon: "📊",
    tabs: [
      { key: "riskMatrix", label: "Risk Matrix" },
      { key: "successMetrics", label: "Success Metrics" },
    ],
  },
};
