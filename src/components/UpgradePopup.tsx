"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DISMISS_KEY = "flowprd_upgrade_dismissed";

function isDismissedToday(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissed = new Date(raw);
    const today = new Date();
    return (
      dismissed.getFullYear() === today.getFullYear() &&
      dismissed.getMonth() === today.getMonth() &&
      dismissed.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
}

function dismissToday() {
  localStorage.setItem(DISMISS_KEY, new Date().toISOString());
}

interface UpgradePopupProps {
  plan: string;
}

export function UpgradePopup({ plan }: UpgradePopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (plan !== "free") return;
    if (isDismissedToday()) return;
    // Show after 2 seconds delay
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, [plan]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-panel border border-border rounded-lg shadow-2xl w-full max-w-sm mx-4"
        style={{ animation: "slide-up 0.2s ease-out" }}
      >
        <div className="p-5 text-center">
          <div className="flex gap-[3px] justify-center mb-4">
            <div className="w-1 h-6 rounded-sm bg-orange" />
            <div className="w-1 h-6 rounded-sm bg-orange/60" />
            <div className="w-1 h-6 rounded-sm bg-orange/30" />
          </div>
          <h3 className="text-base font-semibold text-ink mb-2">
            Upgrade ke Premium
          </h3>
          <p className="text-[12px] text-ink-dim mb-4">
            Dapatkan <strong className="text-ink">10 generate/bulan</strong> dengan Premium
            atau <strong className="text-ink">25 generate/bulan</strong> dengan Premium+.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 rounded border border-border text-center">
              <p className="text-[10px] font-mono text-ink-ghost mb-1">Premium</p>
              <p className="text-sm font-bold text-ink">Rp 79rb</p>
              <p className="text-[10px] text-aqua">10x/bulan</p>
            </div>
            <div className="p-2.5 rounded border border-orange/40 text-center">
              <p className="text-[10px] font-mono text-ink-ghost mb-1">Premium+</p>
              <p className="text-sm font-bold text-ink">Rp 189rb</p>
              <p className="text-[10px] text-aqua">25x/bulan</p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="block w-full py-2 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg transition-colors mb-2"
            onClick={() => setShow(false)}
          >
            Lihat Detail Harga
          </Link>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                dismissToday();
                setShow(false);
              }}
              className="text-[10px] font-mono text-ink-ghost hover:text-ink-dim cursor-pointer"
            >
              Jangan tampilkan hari ini
            </button>
            <button
              onClick={() => setShow(false)}
              className="text-[10px] font-mono text-ink-ghost hover:text-ink-dim cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
