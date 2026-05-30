"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { DocKey, DocCategory, CATEGORIES } from "@/lib/types";
import Link from "next/link";

const EMPTY_DOCS: Record<DocKey, string> = {
  executiveSummary: "", prd: "", userFlow: "", architecture: "",
  workflow: "", sprintPlan: "", riskMatrix: "", successMetrics: "",
};

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [title, setTitle] = useState("");
  const [docs, setDocs] = useState<Record<DocKey, string>>(EMPTY_DOCS);
  const [category, setCategory] = useState<DocCategory>("planning");
  const [activeTab, setActiveTab] = useState<DocKey>("prd");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    const supabase = createClient();
    supabase
      .from("share_links")
      .select("title, prd_content, workflow_content, view_count")
      .eq("token", token)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setTitle(data.title || "Untitled");
          setViewCount((data.view_count || 0) + 1);

          // Try to parse as JSON (new format with all 8 docs)
          try {
            const parsed = JSON.parse(data.prd_content);
            if (typeof parsed === "object" && parsed.prd) {
              setDocs({ ...EMPTY_DOCS, ...parsed });
            } else {
              // Old format — just PRD content
              setDocs({ ...EMPTY_DOCS, prd: data.prd_content, workflow: data.workflow_content || "" });
            }
          } catch {
            // Old format — plain text PRD
            setDocs({ ...EMPTY_DOCS, prd: data.prd_content, workflow: data.workflow_content || "" });
          }

          // Increment view count
          supabase
            .from("share_links")
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq("token", token)
            .then(() => {});
        }
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-mid mb-4">Link tidak ditemukan</p>
          <Link href="/" className="text-[12px] text-aqua hover:underline">Kembali ke beranda</Link>
        </div>
      </div>
    );
  }

  const tabContent = docs[activeTab] || "";
  const hasDocContent = (key: DocKey) => (docs[key] || "").length > 0;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border bg-panel">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex gap-[3px]">
            <div className="w-[3px] h-3 rounded-[1px] bg-orange" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/40" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/15" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight ml-1">FlowPRD</span>
        </Link>
        <span className="text-[10px] font-mono text-ink-ghost">{viewCount} views</span>
      </header>

      {/* Title */}
      <div className="px-4 md:px-6 py-3 border-b border-border-dim">
        <h1 className="text-base md:text-lg font-semibold text-ink">{title}</h1>
        <p className="text-[10px] text-ink-ghost font-mono mt-0.5">Shared document</p>
      </div>

      {/* Category bar */}
      <div className="flex items-center h-9 px-4 md:px-6 border-b border-border-dim bg-inset overflow-x-auto">
        {(Object.keys(CATEGORIES) as DocCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setActiveTab(CATEGORIES[cat].tabs[0].key);
            }}
            className={`h-full px-3 text-[11px] font-mono uppercase tracking-[0.06em] transition-colors cursor-pointer relative whitespace-nowrap ${
              category === cat ? "text-ink" : "text-ink-ghost hover:text-ink-dim"
            }`}
          >
            {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
            {category === cat && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-orange rounded-t" />}
          </button>
        ))}
      </div>

      {/* Sub-tab bar */}
      <div className="flex items-center h-8 px-4 md:px-6 border-b border-border-dim bg-panel overflow-x-auto">
        {CATEGORIES[category].tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`h-full px-2.5 text-[11px] font-mono transition-colors cursor-pointer relative whitespace-nowrap ${
              activeTab === t.key ? "text-ink" : "text-ink-ghost hover:text-ink-dim"
            }`}
          >
            {t.label}
            {hasDocContent(t.key) && <span className="ml-1 inline-block w-1 h-1 rounded-full bg-ok" />}
            {activeTab === t.key && <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-aqua rounded-t" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 max-w-3xl mx-auto w-full">
        {tabContent ? (
          <MarkdownRenderer content={tabContent} />
        ) : (
          <p className="text-[12px] text-ink-ghost font-mono text-center py-16">
            Dokumen ini tidak tersedia
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 md:px-6 py-3 border-t border-border text-center">
        <p className="text-[10px] font-mono text-ink-ghost">
          Generated by <a href="/" className="text-aqua hover:underline">FlowPRD</a>
        </p>
      </footer>
    </div>
  );
}
