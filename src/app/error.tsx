"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-lg bg-err/10 border border-err/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-err text-lg">!</span>
        </div>
        <h2 className="text-base font-semibold text-ink mb-2">
          Terjadi kesalahan
        </h2>
        <p className="text-[12px] text-ink-dim mb-6">
          {error.message || "Something went wrong"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg transition-colors cursor-pointer"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
