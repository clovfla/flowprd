"use client";

import { useEffect, useState, useRef } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface DocumentOutlineProps {
  content: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

function extractHeadings(md: string): Heading[] {
  const headings: Heading[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function DocumentOutline({ content, containerRef }: DocumentOutlineProps) {
  const [headings] = useState<Heading[]>(() => extractHeadings(content));
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || headings.length === 0) return;

    // Assign IDs to heading elements in the rendered markdown
    const headingElements = container.querySelectorAll("h2, h3");
    headingElements.forEach((el) => {
      const text = el.textContent?.trim() || "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      el.id = id;
    });

    // IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { root: container, rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [content, headings, containerRef]);

  const scrollTo = (id: string) => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector(`#${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono text-ink-ghost uppercase tracking-[0.12em] mb-1 px-1">
        Daftar Isi
      </span>
      {headings.map((h) => (
        <button
          key={h.id}
          onClick={() => scrollTo(h.id)}
          className={`text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer truncate ${
            h.level === 3 ? "pl-4" : ""
          } ${
            activeId === h.id
              ? "text-orange bg-orange-soft"
              : "text-ink-dim hover:text-ink-mid hover:bg-hover"
          }`}
        >
          {h.text}
        </button>
      ))}
    </div>
  );
}
