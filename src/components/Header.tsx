"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  hasResult: boolean;
  onNew: () => void;
  onDownloadPDF?: () => void;
  isGenerating?: boolean;
  userEmail?: string;
  userAvatar?: string;
}

export function Header({
  hasResult,
  onNew,
  onDownloadPDF,
  isGenerating,
  userEmail,
  userAvatar,
}: HeaderProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const showAvatar = userAvatar && !imgError;

  return (
    <header className="flex items-center justify-between px-4 h-10 border-b border-border bg-panel shrink-0">
      <div className="flex items-center gap-2">
        <a href="/" className="flex items-center gap-2">
          <div className="flex gap-[3px]">
            <div className="w-[3px] h-3 rounded-[1px] bg-orange" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/40" />
            <div className="w-[3px] h-3 rounded-[1px] bg-orange/15" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight ml-1">
            FlowPRD
          </span>
        </a>
      </div>
      <div className="flex items-center gap-2">
        {hasResult && onDownloadPDF && !isGenerating && (
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded border border-aqua/30 text-aqua hover:bg-aqua/10 transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            PDF
          </button>
        )}
        {hasResult && (
          <button
            onClick={onNew}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded border border-border text-ink-dim hover:text-orange hover:border-orange/30 transition-colors cursor-pointer"
          >
            <span className="text-[13px] leading-none">+</span> new
          </button>
        )}
        {userEmail && (
          <div className="flex items-center gap-2 ml-1 pl-2 border-l border-border-dim">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-1.5 cursor-pointer"
              title="Profile"
            >
              {showAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-orange flex items-center justify-center text-[9px] text-bg font-bold">
                  {userEmail[0]?.toUpperCase() || "?"}
                </div>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-[10px] font-mono text-ink-ghost hover:text-err transition-colors cursor-pointer"
              title="Logout"
            >
              logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
