import { NextRequest } from "next/server";

const PROVIDERS = [
  {
    url: "https://clovievalen-clovie-router.hf.space/v1/chat/completions",
    key: "clovie-a32e5ab0ef37a3369313727b207557e8868a02c859e3fcb7",
    models: ["mimo-v2-flash"],
  },
];

const ANALYZE_PROMPT = `Kamu adalah product manager. Analisis deskripsi project berikut.

Tentukan apakah deskripsi ini CUKUP DETAIL untuk membuat PRD lengkap, atau PERLU DITAMBAH.

Jawab HANYA dalam format JSON (tanpa markdown, tanpa explanation):
{
  "sufficient": true/false,
  "questions": ["pertanyaan 1", "pertanyaan 2", "pertanyaan 3"]
}

Jika sufficient=true, questions harus array kosong [].
Jika sufficient=false, buat MAKSIMAL 3 pertanyaan singkat yang paling penting untuk membuat PRD yang baik.
Pertanyaan harus singkat (maks 15 kata) dan spesifik.`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ sufficient: true, questions: [] });
  }

  for (const provider of PROVIDERS) {
    for (const model of provider.models) {
      try {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 15_000);

        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
          },
          signal: abort.signal,
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 500,
            stream: false,
            messages: [
              { role: "system", content: ANALYZE_PROMPT },
              { role: "user", content: prompt },
            ],
          }),
        });

        clearTimeout(timer);

        if (!res.ok) continue;

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json({
            sufficient: Boolean(parsed.sufficient),
            questions: Array.isArray(parsed.questions)
              ? parsed.questions.slice(0, 3)
              : [],
          });
        }
      } catch {
        continue;
      }
    }
  }

  // Fallback: langsung generate tanpa tanya
  return Response.json({ sufficient: true, questions: [] });
}
