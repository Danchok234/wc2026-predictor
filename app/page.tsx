"use client";

import { useMatchesAndPredictions } from "@/lib/hooks";
import { tallyPlayer } from "@/lib/scoring";
import { ROUND_ORDER, ROUND_LABELS } from "@/lib/supabase";
import ScoreBoard from "@/components/ScoreBoard";
import MatchCard from "@/components/MatchCard";
import styles from "./page.module.scss";

export default function LeaderboardPage() {
  const { matches, predictions, loading } = useMatchesAndPredictions();

  const danya = tallyPlayer(matches, predictions, "danya");
  const dima = tallyPlayer(matches, predictions, "dima");

  const finishedMatches = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
    .slice(0, 8);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>WC2026 Predictor</h1>
      <ScoreBoard danyaPoints={danya.total} dimaPoints={dima.total} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Points by round</div>
        <div className={styles.roundGrid}>
          {ROUND_ORDER.map((round) => (
            <div key={round} className={styles.roundCol}>
              <div className={styles.roundLabel}>{round}</div>
              <div className={styles.roundScores}>
                <span className={styles.danyaColor}>{danya.byRound[round] ?? 0}</span>
                {" / "}
                <span className={styles.dimaColor}>{dima.byRound[round] ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Recent results</div>
        {loading && <div className={styles.empty}>Loading…</div>}
        {!loading && finishedMatches.length === 0 && (
          <div className={styles.empty}>No finished matches yet</div>
        )}
        {finishedMatches.map((match) => (
          <MatchCard key={match.id} match={match} matches={matches} predictions={predictions} />
        ))}
      </div>
    </div>
  );
}
