"use client";

import { useState, useEffect, useCallback } from "react";
import { GeneratedDoc } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "flowprd_history";
const MAX_LOCAL = 50;

export function useHistory() {
  const [history, setHistory] = useState<GeneratedDoc[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const saveLocal = (docs: GeneratedDoc[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs.slice(0, MAX_LOCAL)));
  };

  const addEntry = useCallback((doc: GeneratedDoc) => {
    setHistory((prev) => {
      const updated = [doc, ...prev].slice(0, MAX_LOCAL);
      saveLocal(updated);
      return updated;
    });

    // Also save to Supabase if logged in (cloud backup)
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from("documents").upsert({
        user_id: data.user.id,
        doc_id: doc.id,
        title: doc.title,
        prompt: doc.prompt,
        prd_content: doc.prdContent,
        workflow_content: doc.workflowContent,
      }).then(() => {});
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveLocal(updated);
      return updated;
    });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from("documents").delete().eq("doc_id", id).eq("user_id", data.user.id).then(() => {});
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from("documents").delete().eq("user_id", data.user.id).then(() => {});
    });
  }, []);

  return { history, addEntry, removeEntry, clearAll };
}
