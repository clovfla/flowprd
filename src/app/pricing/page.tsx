"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "Rp 0",
    period: "",
    desc: "Untuk coba-coba dan eksplorasi",
    features: [
      "3 generate per bulan",
      "8 dokumen per generate",
      "Export PDF & Markdown",
      "History lokal",
    ],
    coba: "Mulai Gratis",
    cta: "/app",
    highlight: false,
    badge: null,
  },
  {
    name: "Premium",
    price: "Rp 79.000",
    period: "/bulan",
    desc: "Untuk freelancer dan product manager",
    features: [
      "10 generate per bulan",
      "8 dokumen per generate",
      "Export PDF, DOCX, Notion",
      "Cloud save (Supabase)",
      "Unlimited prompt library",
      "Share link publik",
      "Clarification questions",
    ],
    coba: "Coming Soon",
    cta: "#",
    highlight: true,
    badge: "Popular",
  },
  {
    name: "Premium+",
    price: "Rp 189.000",
    period: "/bulan",
    desc: "Untuk tim dan startup",
    features: [
      "25 generate per bulan",
      "Semua fitur Premium",
      "Auto-improve per section (AI enhance)",
      "Presentation export (HTML slides)",
      "Share link dengan analytics",
      "Custom branding PDF (logo + warna)",
      "Document comparison (side-by-side)",
      "Priority support",
    ],
    coba: "Coming Soon",
    cta: "#",
    highlight: false,
    badge: null,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex gap-[3px]">
            <div className="w-[3px] h-3 rounded-[1px] bg-orange" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/40" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/15" />
          </div>
          <span className="text-sm font-semibold tracking-tight ml-1">FlowPRD</span>
        </Link>
        <Link
          href="/app"
          className="px-4 py-1.5 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg transition-colors"
        >
          Get Started
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-ink mb-3">
            Harga yang <span className="text-orange">Terjangkau</span>
          </h1>
          <p className="text-[14px] text-ink-dim max-w-md mx-auto">
            Mulai gratis, upgrade saat butuh lebih banyak generate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-5 rounded-lg border transition-colors ${
                plan.highlight
                  ? "border-orange/50 bg-panel"
                  : "border-border bg-panel"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded bg-orange text-[10px] font-bold text-bg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-[13px] font-mono text-ink-ghost uppercase tracking-wider mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-ink">{plan.price}</span>
                  {plan.period && (
                    <span className="text-[12px] text-ink-ghost">{plan.period}</span>
                  )}
                </div>
                <p className="text-[12px] text-ink-dim mt-1">{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-ink-mid">
                    <svg className="w-3.5 h-3.5 text-ok shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.cta === "#" ? (
                <div className="py-2 rounded border border-border text-center text-[12px] font-mono text-ink-ghost">
                  Coming Soon
                </div>
              ) : (
                <Link
                  href={plan.cta}
                  className={`py-2 rounded text-center text-[12px] font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-orange hover:bg-orange-dim text-bg"
                      : "border border-border hover:border-orange/30 text-ink-mid hover:text-ink"
                  }`}
                >
                  {plan.coba}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-[11px] text-ink-ghost mt-8 text-center">
          Limit reset setiap tanggal 1. Pembayaran via Stripe (coming soon).
        </p>
      </div>
    </div>
  );
}
