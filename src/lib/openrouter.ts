import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

interface Provider {
  url: string;
  key: string;
  models: string[];
}

const PROVIDERS: Provider[] = [
  {
    url: "https://clovievalen-clovie-router.hf.space/v1/chat/completions",
    key: "clovie-a32e5ab0ef37a3369313727b207557e8868a02c859e3fcb7",
    models: ["mimo-v2.5-pro", "mimo-v2.5", "mimo-v2-pro", "mimo-v2-flash"],
  },
  {
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: process.env.OPENROUTER_API_KEY || "",
    models: [
      "qwen/qwen3-coder:free",
      "deepseek/deepseek-v4-flash:free",
      "moonshotai/kimi-k2.6:free",
      "google/gemma-4-31b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free",
    ],
  },
];

// Format: REASONING|<text> atau CONTENT|<text> per baris
export async function streamGenerate(prompt: string): Promise<ReadableStream<string>> {
  let lastError: Error | null = null;

  for (const provider of PROVIDERS) {
    if (!provider.key) continue;

    for (const model of provider.models) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 180_000);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.key}`,
        };
        if (provider.url.includes("openrouter")) {
          headers["HTTP-Referer"] = "https://flowprd.app";
          headers["X-Title"] = "FlowPRD";
        }

        const response = await fetch(provider.url, {
          method: "POST",
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            model,
            temperature: 0.7,
            max_tokens: 12000,
            stream: true,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: buildUserPrompt(prompt) },
            ],
          }),
        });

        clearTimeout(timer);

        if (!response.ok) {
          lastError = new Error(`${model}: HTTP ${response.status}`);
          continue;
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        return new ReadableStream<string>({
          async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                if (!delta) continue;

                const content: string | undefined = delta.content;
                const reasoning: string | undefined = delta.reasoning;

                if (content && content.length > 0) {
                  // Kirim content dengan prefix CONTENT|
                  controller.enqueue("CONTENT|" + content);
                } else if (reasoning && reasoning.length > 0) {
                  // Kirim reasoning dengan prefix REASONING|
                  controller.enqueue("REASONING|" + reasoning);
                }
              } catch {
                // skip malformed
              }
            }
          },
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          lastError = new Error(`${model}: timeout`);
          continue;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
    }
  }

  throw lastError || new Error("Semua model sedang tidak tersedia.");
}
