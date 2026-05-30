import { GeneratedDoc } from "./types";

const STORAGE_KEY = "flowprd_history";
const MAX_ITEMS = 50;

export function loadHistory(): GeneratedDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(doc: GeneratedDoc): void {
  const history = loadHistory();
  const updated = [doc, ...history].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteFromHistory(id: string): void {
  const history = loadHistory();
  const updated = history.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
