"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  provider: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      const user = data.user;
      setProfile({
        email: user.email || "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
        provider: user.app_metadata?.provider || "email",
        createdAt: user.created_at
          ? new Date(user.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
      });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
      </div>
    );
  }

  const showAvatar = profile.avatar && !imgError;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 h-10 border-b border-border bg-panel shrink-0">
        <button
          onClick={() => router.push("/app")}
          className="flex items-center gap-1 text-[11px] font-mono text-ink-ghost hover:text-ink-dim transition-colors cursor-pointer"
        >
          ← Kembali
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-sm">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {showAvatar ? (
              <img
                src={profile.avatar}
                alt=""
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange flex items-center justify-center text-2xl font-bold text-bg">
                {profile.name
                  ? profile.name[0].toUpperCase()
                  : profile.email[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          {profile.name && (
            <h1 className="text-lg font-semibold text-ink text-center mb-1">
              {profile.name}
            </h1>
          )}

          {/* Email */}
          <p className="text-[13px] text-ink-mid text-center mb-6">
            {profile.email}
          </p>

          {/* Info card */}
          <div className="bg-panel border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border-dim flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-ghost uppercase tracking-wider">
                Provider
              </span>
              <span className="text-[12px] text-ink-mid capitalize">
                {profile.provider}
              </span>
            </div>
            <div className="px-4 py-3 border-b border-border-dim flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-ghost uppercase tracking-wider">
                Joined
              </span>
              <span className="text-[12px] text-ink-mid">
                {profile.createdAt}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-ghost uppercase tracking-wider">
                Plan
              </span>
              <span className="text-[12px] text-aqua font-mono">Free</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => router.push("/app")}
              className="w-full py-2 rounded bg-orange hover:bg-orange-dim text-[12px] font-semibold text-bg transition-colors cursor-pointer"
            >
              Go to App
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded border border-border hover:border-err/30 text-[12px] font-mono text-ink-ghost hover:text-err transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
