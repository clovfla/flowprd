"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  premium: 10,
  premium_plus: 25,
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  premium_plus: "Premium+",
};

interface UsageInfo {
  plan: string;
  planLabel: string;
  limit: number;
  used: number;
  remaining: number;
  canGenerate: boolean;
  refreshUsage: () => Promise<void>;
  incrementUsage: () => Promise<void>;
}

export function useUsage(): UsageInfo {
  const [plan, setPlan] = useState("free");
  const [used, setUsed] = useState(0);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const userId = userData.user.id;

    // Get or create subscription
    let { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();

    // Auto-create subscription if missing (user signup sebelum SQL di-run)
    if (!sub) {
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan: "free",
      });
      sub = { plan: "free" };
    }

    setPlan(sub.plan);

    // Get or create usage for current month
    const month = new Date().toISOString().slice(0, 7); // "2026-05"

    let { data: usage } = await supabase
      .from("usage")
      .select("count")
      .eq("user_id", userId)
      .eq("year_month", month)
      .single();

    // Auto-create usage row if missing
    if (!usage) {
      await supabase.from("usage").insert({
        user_id: userId,
        year_month: month,
        count: 0,
      });
      usage = { count: 0 };
    }

    setUsed(usage.count);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const incrementUsage = useCallback(async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const userId = userData.user.id;
    const month = new Date().toISOString().slice(0, 7);

    // Read current count from server (bukan dari state, biar gak race condition)
    const { data: existing } = await supabase
      .from("usage")
      .select("count")
      .eq("user_id", userId)
      .eq("year_month", month)
      .single();

    const newCount = (existing?.count || 0) + 1;

    if (existing) {
      // Update existing row
      await supabase
        .from("usage")
        .update({ count: newCount })
        .eq("user_id", userId)
        .eq("year_month", month);
    } else {
      // Insert new row
      await supabase.from("usage").insert({
        user_id: userId,
        year_month: month,
        count: newCount,
      });
    }

    // Update local state
    setUsed(newCount);
  }, []);

  const limit = PLAN_LIMITS[plan] || 3;
  const remaining = Math.max(0, limit - used);

  return {
    plan,
    planLabel: PLAN_LABELS[plan] || "Free",
    limit,
    used,
    remaining,
    canGenerate: remaining > 0,
    refreshUsage: fetchData,
    incrementUsage,
  };
}
