import { NextRequest } from "next/server";

const PROVIDERS = [
  {
    url: "https://clovievalen-clovie-router.hf.space/v1/chat/completions",
    key: "clovie-a32e5ab0ef37a3369313727b207557e8868a02c859e3fcb7",
    models: ["mimo-v2-flash"],
  },
];

export async function POST(req: NextRequest) {
  const { section, instruction } = await req.json();

  if (!section || !instruction) {
    return Response.json({ error: "Missing section or instruction" }, { status: 400 });
  }

  const systemPrompt = `Kamu adalah Senior Product Manager. Tugasmu adalah memperbaiki section PRD berikut berdasarkan instruksi user.

Rules:
- Output HANYA section yang sudah diperbaiki, dalam markdown
- Jangan tambahkan explanation atau comment
- Jangan ubah heading level (tetap ## atau ###)
- Pertahankan format dan style yang sama
- Tulis dalam bahasa Indonesia profesional`;

  const userPrompt = `Section yang perlu diperbaiki:
---
${section}
---

Instruksi: ${instruction}

Output section yang sudah diperbaiki:`;

  for (const provider of PROVIDERS) {
    for (const model of provider.models) {
      try {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 30_000);

        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
          },
          signal: abort.signal,
          body: JSON.stringify({
            model,
            temperature: 0.5,
            max_tokens: 4000,
            stream: false,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          }),
        });

        clearTimeout(timer);

        if (!res.ok) continue;

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";

        return Response.json({ refined: content.trim() });
      } catch {
        continue;
      }
    }
  }

  return Response.json({ error: "Gagal refine section" }, { status: 502 });
}
