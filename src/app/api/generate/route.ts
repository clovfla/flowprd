import { NextRequest } from "next/server";

const PROVIDERS = [
  {
    url: "https://clovievalen-clovie-router.hf.space/v1/chat/completions",
    key: "clovie-a32e5ab0ef37a3369313727b207557e8868a02c859e3fcb7",
    models: ["mimo-v2.5-pro", "mimo-v2.5", "mimo-v2-pro"],
  },
  {
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: process.env.OPENROUTER_API_KEY || "",
    models: [
      "google/gemma-4-31b-it:free",
      "z-ai/glm-4.5-air:free",
      "qwen/qwen3-coder:free",
      "deepseek/deepseek-v4-flash:free",
      "moonshotai/kimi-k2.6:free",
    ],
  },
];

const DOC_PROMPTS: Record<string, string> = {
  executiveSummary: `Buatkan Executive Summary dalam markdown.
Isi: masalah yang diselesaikan, solusi, target market, value proposition, 3 key metrics, timeline singkat.
Format: gunakan ## heading. Maksimal 300 kata. Bahasa Indonesia profesional.`,

  prd: `Buatkan PRD (Product Requirement Document) lengkap dalam markdown.
Section WAJIB:
## Product Overview
## Goals & Objectives (3-5 bullet)
## Target Users (2-3 persona singkat)
## User Stories (tabel: #, Sebagai, Saya ingin, Sehingga — 5 row)
## Core Features (P0: 3 fitur, P1: 3 fitur, P2: 2 fitur — masing-masing 1 kalimat)
## Technical Requirements (tabel: layer, technology)
## Non-Functional Requirements (3-4 bullet)
## Data Model (3 tabel utama: nama, kolom)
## Risks & Mitigations (tabel: risk, impact, mitigation — 3 row)
## Timeline (4 milestone)
Bahasa Indonesia profesional. Detail dan actionable.`,

  userFlow: `Buatkan User Flow lengkap dalam markdown.
Format: 5-7 step journey user dari buka aplikasi sampai selesai.
Setiap step: heading ### Step N: [nama], 1 kalimat deskripsi, 2 sub-bullet (happy path + edge case).
Termasuk: error handling, loading state, empty state.
Bahasa Indonesia profesional.`,

  architecture: `Buatkan Architecture Document dalam markdown.
Isi:
## Tech Stack (tabel: Layer, Technology, Alasan — frontend, backend, database, infra, tools)
## API Endpoints (tabel: Method, Path, Description — 6-8 endpoints)
## Database Schema (3 tabel utama dengan kolom dan tipe data)
## System Architecture (deskripsi text tentang alur data)
Berikan alasan untuk setiap pilihan teknologi. Bahasa Indonesia profesional.`,

  workflow: `Buatkan Development Workflow dalam markdown.
7 fase: Discovery & Research, Design & Prototyping, Development, Testing & QA, Deployment, Launch, Post-Launch.
Format: ## per fase, lalu checklist (- [ ] task) 3-4 task per fase, estimasi durasi, dan dependency dari fase sebelumnya.
Bahasa Indonesia profesional.`,

  sprintPlan: `Buatkan Sprint Plan dalam markdown.
4 sprint (2 mingguan).
Format: ## Sprint 1: [nama], lalu:
- Goals (2-3 bullet)
- Tasks (tabel: task, assignee role, status — 4-5 row)
- Deliverables (2-3 bullet)
Ulangi untuk Sprint 2-4. Bahasa Indonesia profesional.`,

  riskMatrix: `Buatkan Risk Matrix dalam markdown.
Format: tabel dengan kolom: #, Risk Description, Probability (H/M/L), Impact (H/M/L), Mitigation Strategy, Owner.
Minimal 8 risks. Prioritas dari yang paling berisiko.
Bahasa Indonesia profesional.`,

  successMetrics: `Buatkan Success Metrics dalam markdown.
## KPIs (tabel: Metric, Target, Measurement Method — 5 row)
## OKRs (3 objectives, masing-masing 3 key results)
## Dashboard Description (layout suggestion untuk monitoring)
Bahasa Indonesia profesional.`,
};

export async function POST(req: NextRequest) {
  const { prompt, docType } = await req.json();

  if (!prompt || !docType || !DOC_PROMPTS[docType]) {
    return new Response(
      JSON.stringify({ error: "prompt and valid docType required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const systemMsg =
    "Kamu adalah Senior Product Manager dan Technical Architect. Tulis dalam markdown. Bahasa Indonesia profesional. Detail dan actionable.";
  const userMsg = `Project: "${prompt.trim()}"\n\n${DOC_PROMPTS[docType]}`;

  const stream = new ReadableStream({
    async start(controller) {
      for (const provider of PROVIDERS) {
        if (!provider.key) continue;
        for (const model of provider.models) {
          try {
            const abort = new AbortController();
            const timer = setTimeout(() => abort.abort(), 180_000);

            const headers: Record<string, string> = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${provider.key}`,
            };
            if (provider.url.includes("openrouter")) {
              headers["HTTP-Referer"] = "https://flowprd.app";
              headers["X-Title"] = "FlowPRD";
            }

            const res = await fetch(provider.url, {
              method: "POST",
              headers,
              signal: abort.signal,
              body: JSON.stringify({
                model,
                temperature: 0.7,
                stream: true,
                messages: [
                  { role: "system", content: systemMsg },
                  { role: "user", content: userMsg },
                ],
              }),
            });

            clearTimeout(timer);
            if (!res.ok) continue;

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk
                .split("\n")
                .filter((l) => l.startsWith("data: "));
              for (const line of lines) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  if (!delta) continue;
                  if (delta.content?.length > 0)
                    controller.enqueue(encoder.encode(delta.content));
                } catch {}
              }
            }

            controller.close();
            return;
          } catch {
            continue;
          }
        }
      }

      controller.enqueue(encoder.encode("Error: semua model tidak tersedia."));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
