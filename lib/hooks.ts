"use client";

import { useEffect, useState, useCallback } from "react";
import { Match, Prediction } from "./supabase";

export function useMatchesAndPredictions() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [matchesRes, predictionsRes] = await Promise.all([
      fetch("/api/matches").then((r) => r.json()),
      fetch("/api/predictions").then((r) => r.json()),
    ]);
    setMatches(matchesRes.matches ?? []);
    setPredictions(predictionsRes.predictions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { matches, predictions, loading, refresh };
}
