import { NextRequest } from "next/server";

const PROVIDERS = [
  {
    url: "https://clovievalen-clovie-router.hf.space/v1/chat/completions",
    key: "clovie-a32e5ab0ef37a3369313727b207557e8868a02c859e3fcb7",
    models: ["mimo-v2.5-pro", "mimo-v2.5", "mimo-v2-pro"],
  },
];

export async function POST(req: NextRequest) {
  const { section, sectionName } = await req.json();

  if (!section) {
    return Response.json({ error: "Missing section" }, { status: 400 });
  }

  const systemPrompt = `Kamu adalah Senior Product Manager. Tugasmu adalah meningkatkan kualitas section PRD berikut.

Rules:
- Tambahkan detail yang kurang
- Perjelas yang ambigu
- Tambahkan contoh konkret jika memungkinkan
- Pertahankan format markdown yang sama
- Jangan kurangi konten, hanya TAMBAH dan PERJELAS
- Output HANYA section yang sudah di-improve
- Bahasa Indonesia profesional`;

  const userPrompt = `Improve section ini:

${section}

Nama section: ${sectionName || "Unknown"}

Output section yang sudah di-improve:`;

  for (const provider of PROVIDERS) {
    for (const model of provider.models) {
      try {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 60_000);

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
        if (content.length > 100) {
          return Response.json({ improved: content.trim() });
        }
      } catch {
        continue;
      }
    }
  }

  return Response.json({ error: "Gagal improve section" }, { status: 502 });
}
