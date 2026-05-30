import { useState, useCallback, useRef } from "react";
import { GeneratedDoc, DOC_KEYS, DocKey } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export interface ProgressInfo {
  docLabel: string;
  docKey: DocKey;
  current: number;
  total: number;
  status: "generating" | "done" | "error";
  elapsed: number;
}

const DOC_LABELS: Record<DocKey, string> = {
  executiveSummary: "Executive Summary",
  prd: "PRD",
  userFlow: "User Flow",
  architecture: "Architecture",
  workflow: "Workflow",
  sprintPlan: "Sprint Plan",
  riskMatrix: "Risk Matrix",
  successMetrics: "Success Metrics",
};

interface UseGenerateReturn {
  isGenerating: boolean;
  docs: Record<DocKey, string>;
  currentStream: string;
  currentDocKey: DocKey | null;
  error: string | null;
  progress: ProgressInfo | null;
  generate: (prompt: string) => Promise<GeneratedDoc | null>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [docs, setDocs] = useState<Record<DocKey, string>>(() =>
    Object.fromEntries(DOC_KEYS.map((k) => [k, ""])) as Record<DocKey, string>
  );
  const [currentStream, setCurrentStream] = useState("");
  const [currentDocKey, setCurrentDocKey] = useState<DocKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setDocs(Object.fromEntries(DOC_KEYS.map((k) => [k, ""])) as Record<DocKey, string>);
    setCurrentStream("");
    setCurrentDocKey(null);
    setError(null);
    setProgress(null);
  }, []);

  const generate = useCallback(
    async (prompt: string): Promise<GeneratedDoc | null> => {
      reset();
      setIsGenerating(true);
      abortRef.current = new AbortController();
      const startTime = Date.now();

      const newDocs = Object.fromEntries(
        DOC_KEYS.map((k) => [k, ""])
      ) as Record<DocKey, string>;

      try {
        for (let i = 0; i < DOC_KEYS.length; i++) {
          const docKey = DOC_KEYS[i];
          const label = DOC_LABELS[docKey];

          setCurrentDocKey(docKey);
          setCurrentStream("");
          setProgress({
            docLabel: label,
            docKey,
            current: i + 1,
            total: DOC_KEYS.length,
            status: "generating",
            elapsed: Date.now() - startTime,
          });

          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, docType: docKey }),
            signal: abortRef.current.signal,
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || `Server error (${res.status})`);
          }

          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            setCurrentStream(accumulated);
          }

          newDocs[docKey] = accumulated.trim();
          setDocs({ ...newDocs });

          setProgress({
            docLabel: label,
            docKey,
            current: i + 1,
            total: DOC_KEYS.length,
            status: "done",
            elapsed: Date.now() - startTime,
          });
        }

        setCurrentDocKey(null);
        setCurrentStream("");

        const titleMatch = newDocs.prd.match(/^##\s+(.+)/m);
        const title = titleMatch?.[1]?.trim() || prompt.slice(0, 50);

        return {
          id: uuidv4(),
          title,
          prompt,
          prdContent: newDocs.prd,
          workflowContent: newDocs.workflow,
          createdAt: Date.now(),
        };
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return null;
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [reset]
  );

  return { isGenerating, docs, currentStream, currentDocKey, error, progress, generate, reset };
}
