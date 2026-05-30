"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: "AI-Powered",
    desc: "Deskripsikan project kamu, AI generate PRD lengkap dengan workflow 7 fase.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Structured PRD",
    desc: "12 sections lengkap: overview, goals, user stories, features, tech requirements, timeline.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
    title: "Development Workflow",
    desc: "7 fase workflow: Discovery → Design → Development → Testing → Deploy → Launch → Iterate.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Export Anywhere",
    desc: "Download sebagai Markdown, Plain Text, atau HTML. Copy ke clipboard dengan satu klik.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: "Reasoning Model",
    desc: "Lihat proses berpikir AI secara real-time sebelum PRD dihasilkan.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25z" />
      </svg>
    ),
    title: "Command Palette",
    desc: "Cmd+K untuk search, navigate, dan kontrol semua fitur dari keyboard.",
  },
];

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px]">
            <div className="w-[3px] h-3 rounded-[1px] bg-orange" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/40" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/15" />
          </div>
          <span className="text-sm font-semibold tracking-tight ml-1">FlowPRD</span>
        </div>
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <Link
              href="/login"
              className="px-3 py-1.5 text-[12px] font-mono text-ink-dim hover:text-ink transition-colors"
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href="/profile"
              className="px-3 py-1.5 text-[12px] font-mono text-ink-dim hover:text-ink transition-colors"
            >
              Profile
            </Link>
          )}
          <Link
            href={isLoggedIn ? "/app" : "/login"}
            className="px-4 py-1.5 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg tracking-tight transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <div className="flex gap-1 justify-center mb-8 opacity-20">
            <div className="w-1.5 h-14 rounded-sm bg-orange" />
            <div className="w-1.5 h-14 rounded-sm bg-orange/70" />
            <div className="w-1.5 h-14 rounded-sm bg-orange/40" />
            <div className="w-1.5 h-14 rounded-sm bg-aqua/40" />
            <div className="w-1.5 h-14 rounded-sm bg-aqua/70" />
            <div className="w-1.5 h-14 rounded-sm bg-aqua" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight mb-4">
            Dari Ide ke PRD
            <br />
            <span className="text-orange">dalam hitungan detik</span>
          </h1>

          <p className="text-ink-mid text-[15px] leading-relaxed max-w-md mx-auto mb-8">
            Deskripsikan project kamu, AI akan generate 8 dokumen lengkap —
            PRD, workflow, architecture, dan lainnya dalam hitungan detik.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href={isLoggedIn ? "/app" : "/login"}
              className="px-6 py-2.5 rounded-lg bg-orange hover:bg-orange-dim text-[13px] font-semibold text-bg tracking-tight transition-all"
            >
              {isLoggedIn ? "Buka App" : "Mulai Sekarang"}
            </Link>
            <a
              href="#features"
              className="px-6 py-2.5 rounded-lg border border-border hover:border-border text-[13px] font-medium text-ink-mid hover:text-ink transition-colors"
            >
              Pelajari
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-[11px] font-mono text-ink-ghost">
            <span>12 PRD Sections</span>
            <span className="w-1 h-1 rounded-full bg-ink-ghost" />
            <span>7 Workflow Phases</span>
            <span className="w-1 h-1 rounded-full bg-ink-ghost" />
            <span>Reasoning AI</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-ink text-center mb-10">
            Fitur Utama
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-border-dim hover:border-border transition-colors"
              >
                <div className="text-orange mb-3">{f.icon}</div>
                <h3 className="text-[13px] font-semibold text-ink mb-1">
                  {f.title}
                </h3>
                <p className="text-[12px] text-ink-dim leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-ink mb-10">
            Cara Kerja
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { step: "1", label: "Deskripsikan", desc: "Ketik ide project kamu" },
              { step: "2", label: "Clarify", desc: "AI tanya detail jika kurang" },
              { step: "3", label: "Generate", desc: "PRD + Workflow jadi" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 sm:flex-col sm:text-center">
                <div className="w-8 h-8 rounded-full bg-orange/10 border border-orange/30 flex items-center justify-center text-[12px] font-mono text-orange font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-ink">{s.label}</p>
                  <p className="text-[11px] text-ink-ghost">{s.desc}</p>
                </div>
                {i < 2 && (
                  <svg className="w-4 h-4 text-ink-ghost hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-ink text-center mb-3">
            Harga
          </h2>
          <p className="text-[13px] text-ink-dim text-center mb-10">
            Mulai gratis, upgrade saat butuh lebih banyak.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Free", price: "Rp 0", limit: "3x/bulan", highlight: false, features: ["3 generate per bulan", "8 dokumen per generate", "Export PDF"] },
              { name: "Premium", price: "Rp 79.000", limit: "10x/bulan", highlight: true, features: ["10 generate per bulan", "Cloud save + Share link", "Clarification questions"] },
              { name: "Premium+", price: "Rp 189.000", limit: "25x/bulan", highlight: false, features: ["25 generate per bulan", "Auto-improve + Presentation", "Custom branding PDF"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-4 rounded-lg border ${
                  plan.highlight ? "border-orange/50 bg-panel" : "border-border bg-panel"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-2 left-4 px-2 py-0.5 rounded bg-orange text-[10px] font-bold text-bg">Popular</div>
                )}
                <h3 className="text-[11px] font-mono text-ink-ghost uppercase tracking-wider mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-lg font-bold text-ink">{plan.price}</span>
                  {plan.price !== "Rp 0" && <span className="text-[11px] text-ink-ghost">/bulan</span>}
                </div>
                <p className="text-[11px] text-aqua font-mono mb-3">{plan.limit}</p>
                <ul className="flex flex-col gap-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-ink-dim">
                      <span className="text-ok mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/pricing" className="text-[12px] text-aqua hover:underline">
              Lihat detail semua plan →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 border-t border-border text-center">
        <h2 className="text-lg font-semibold text-ink mb-3">
          Siap bikin PRD?
        </h2>
        <p className="text-[13px] text-ink-dim mb-6">
          3 generate gratis per bulan. Upgrade kapan saja.
        </p>
        <Link
          href={isLoggedIn ? "/app" : "/login"}
          className="inline-block px-6 py-2.5 rounded-lg bg-orange hover:bg-orange-dim text-[13px] font-semibold text-bg tracking-tight transition-all"
        >
          {isLoggedIn ? "Buka App" : "Get Started"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border text-center">
        <p className="text-[10px] font-mono text-ink-ghost">
          FlowPRD — AI-Powered PRD & Workflow Generator
        </p>
      </footer>
    </div>
  );
}
