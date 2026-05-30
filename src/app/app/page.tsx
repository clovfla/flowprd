"use client";

import { useState, useRef, useEffect } from "react";
import { GeneratedDoc } from "@/lib/types";
import { useGenerate } from "@/hooks/useGenerate";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/hooks/useToast";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { HistoryList } from "@/components/HistoryList";
import { StatusBar } from "@/components/StatusBar";
import { ToastContainer } from "@/components/ToastContainer";
import { TemplateSelector } from "@/components/TemplateSelector";
import { CommandPalette } from "@/components/CommandPalette";
import { Template } from "@/lib/templates";
import { generatePDF } from "@/lib/pdf-generator";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUsage } from "@/hooks/useUsage";
import { UpgradePopup } from "@/components/UpgradePopup";

export default function AppPage() {
  const router = useRouter();
  const { isGenerating, docs, currentStream, currentDocKey, error, progress, generate, reset } =
    useGenerate();
  const { history, addEntry, removeEntry } = useHistory();
  const { toasts, addToast, removeToast } = useToast();
  const usage = useUsage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);

  // Auth check — non-blocking, runs in background
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserEmail(data.session.user.email || "");
        setUserAvatar(data.session.user.user_metadata?.avatar_url || "");
      }
    });
    // Also verify with server (slower, but catches expired sessions)
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email || "");
        setUserAvatar(data.user.user_metadata?.avatar_url || "");
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  useEffect(() => {
    if (!isGenerating) return;
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleGenerate = async (prompt: string) => {
    if (!usage.canGenerate) {
      addToast("error", `Limit habis (${usage.used}/${usage.limit}). Upgrade ke Premium!`);
      return;
    }
    setSelectedId(null);
    setElapsed(0);
    const doc = await generate(prompt);
    if (doc) {
      addEntry(doc);
      await usage.incrementUsage();
      addToast("success", `Generate berhasil (${usage.remaining - 1}/${usage.limit} tersisa)`);
    }
  };

  const handleSelect = (doc: GeneratedDoc) => {
    reset();
    setSelectedId(doc.id);
  };

  const handleNew = () => {
    reset();
    setSelectedId(null);
    setElapsed(0);
  };

  const [templatePrompt, setTemplatePrompt] = useState<string | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setShowTemplates(false);
    setTemplatePrompt(template.prompt);
  };

  const handleDownloadPDF = () => {
    const titleMatch = displayDocs.prd?.match(/^##\s+(.+)/m);
    const title = titleMatch?.[1]?.trim() || "Project";
    generatePDF(displayDocs, title);
    addToast("success", "PDF berhasil di-download");
  };

  const selectedDoc = selectedId
    ? history.find((d) => d.id === selectedId)
    : null;

  const displayDocs = selectedDoc
    ? {
        executiveSummary: "",
        prd: selectedDoc.prdContent,
        userFlow: "",
        architecture: "",
        workflow: selectedDoc.workflowContent,
        sprintPlan: "",
        riskMatrix: "",
        successMetrics: "",
      }
    : docs;

  const hasResult = Object.values(displayDocs).some((v) => v.length > 0) || isGenerating;
  const allContent = Object.values(displayDocs).join(" ");
  const wordCount = allContent.trim()
    ? allContent.trim().split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const commands = [
    { id: "new", label: "New Document", shortcut: "", action: handleNew },
    { id: "templates", label: "Pilih Template", shortcut: "", action: () => setShowTemplates(true) },
    { id: "focus", label: focusMode ? "Exit Focus Mode" : "Focus Mode", shortcut: "", action: () => setFocusMode(!focusMode) },
    ...history.slice(0, 10).map((doc) => ({
      id: `history-${doc.id}`,
      label: `History: ${doc.title}`,
      shortcut: "",
      action: () => handleSelect(doc),
    })),
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header hasResult={hasResult} onNew={handleNew} onDownloadPDF={handleDownloadPDF} isGenerating={isGenerating} userEmail={userEmail} userAvatar={userAvatar} />

      <div className="flex flex-1 min-h-0">
        {!focusMode && (
          <aside
            className="shrink-0 border-r border-border flex flex-col bg-panel transition-[width] duration-300 overflow-hidden"
            style={{ width: hasResult ? 260 : 300 }}
          >
            <div className="p-4 border-b border-border-dim">
              {/* Usage indicator */}
              <div className="mb-3 px-2 py-1.5 rounded bg-inset border border-border-dim">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-ink-ghost">
                    {usage.planLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange transition-all"
                        style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-ink-dim">
                      {usage.used}/{usage.limit}
                    </span>
                  </div>
                </div>
                {usage.plan === "free" && (
                  <a
                    href="/pricing"
                    className="block text-[10px] font-mono text-aqua hover:underline"
                  >
                    Upgrade ke Premium →
                  </a>
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="text-[10px] font-mono text-ink-ghost hover:text-aqua transition-colors cursor-pointer"
                >
                  Templates
                </button>
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="flex items-center gap-1 text-[10px] font-mono text-ink-ghost hover:text-ink-dim transition-colors cursor-pointer"
                >
                  <kbd className="px-1 py-0.5 rounded bg-surface border border-border-dim text-[9px]">⌘K</kbd>
                </button>
              </div>
              <InputPanel
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                templatePrompt={templatePrompt}
              />
            </div>

            {error && (
              <div className="mx-3 mt-2 p-2.5 rounded bg-err/6 border border-err/15">
                <p className="text-[11px] text-err font-mono leading-relaxed break-all">
                  {error}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3">
              <HistoryList
                history={history}
                onSelect={handleSelect}
                onDelete={removeEntry}
                selectedId={selectedId}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-bg">
          {focusMode && (
            <div className="flex items-center h-8 px-4 border-b border-border-dim bg-panel">
              <button
                onClick={() => setFocusMode(false)}
                className="text-[10px] font-mono text-ink-ghost hover:text-ink-dim cursor-pointer"
              >
                ← Exit focus mode
              </button>
            </div>
          )}
          <OutputPanel
            docs={displayDocs}
            currentStream={currentStream}
            currentDocKey={currentDocKey}
            isGenerating={isGenerating}
            progress={progress}
            contentRef={contentRef}
            onToast={addToast}
          />
          <StatusBar
            wordCount={wordCount}
            readingTime={readingTime}
            isGenerating={isGenerating}
            elapsed={elapsed}
          />
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showTemplates && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showCommandPalette && (
        <CommandPalette
          commands={commands}
          onClose={() => setShowCommandPalette(false)}
        />
      )}

      {/* Upgrade popup */}
      <UpgradePopup plan={usage.plan} />
    </div>
  );
}
