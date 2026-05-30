"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "flowprd_favorites";

export interface Favorite {
  id: string;
  prompt: string;
  label: string;
  createdAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  const saveLocal = (favs: Favorite[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  };

  const add = useCallback(
    (prompt: string, label?: string) => {
      const fav: Favorite = {
        id: Date.now().toString(),
        prompt,
        label: label || prompt.slice(0, 40),
        createdAt: Date.now(),
      };
      setFavorites((prev) => {
        const updated = [fav, ...prev];
        saveLocal(updated);
        return updated;
      });

      // Cloud save
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        supabase.from("favorites").insert({
          user_id: data.user.id,
          fav_id: fav.id,
          prompt: fav.prompt,
          label: fav.label,
        }).then(() => {});
      });
    },
    []
  );

  const remove = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const updated = prev.filter((f) => f.id !== id);
        saveLocal(updated);
        return updated;
      });

      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        supabase.from("favorites").delete().eq("fav_id", id).eq("user_id", data.user.id).then(() => {});
      });
    },
    []
  );

  return { favorites, add, remove };
}
