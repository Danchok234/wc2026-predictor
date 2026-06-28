"use client";

import { useEffect, useState } from "react";
import { useMatchesAndPredictions } from "@/lib/hooks";
import { getSessionPlayer } from "@/lib/auth";
import { ROUND_ORDER, ROUND_LABELS } from "@/lib/supabase";
import MatchCard from "@/components/MatchCard";
import styles from "./page.module.scss";

const ROUND_HEIGHT_PX = 2300;

export default function BracketPage() {
  const { matches, predictions, loading } = useMatchesAndPredictions();
  const [viewer, setViewer] = useState<ReturnType<typeof getSessionPlayer>>(null);

  useEffect(() => {
    setViewer(getSessionPlayer());
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Bracket</h1>
      {loading ? (
        <p style={{ padding: "0 1rem", color: "var(--grey)" }}>Loading…</p>
      ) : (
        <div className={styles.scroller}>
          <div className={styles.bracket}>
            {ROUND_ORDER.map((round, idx) => {
              const roundMatches = matches
                .filter((m) => m.round === round)
                .sort((a, b) => a.match_number - b.match_number);
              const isLast = idx === ROUND_ORDER.length - 1;
              return (
                <div
                  key={round}
                  className={`${styles.column} ${isLast ? styles.lastCol : ""}`}
                  style={{ height: `${ROUND_HEIGHT_PX}px` }}
                >
                  <div className={styles.roundHeader}>{ROUND_LABELS[round]}</div>
                  {roundMatches.map((match) => (
                    <div key={match.id} className={styles.slot}>
                      <MatchCard match={match} predictions={predictions} viewer={viewer} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
