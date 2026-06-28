"use client";

import { useState } from "react";
import { Match, Player, teamLabel, ROUND_LABELS } from "@/lib/supabase";
import { flagFor } from "@/lib/flags";
import { suggestWinner } from "@/lib/scoring";
import ConfirmModal from "./ConfirmModal";
import styles from "./PredictForm.module.scss";

interface PredictFormProps {
  match: Match;
  player: Player;
  onSubmitted: () => void;
}

export default function PredictForm({ match, player, onSubmitted }: PredictFormProps) {
  const home = teamLabel(match, "home");
  const away = teamLabel(match, "away");

  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hs = parseInt(homeScore, 10);
  const as = parseInt(awayScore, 10);
  const scoresValid = homeScore !== "" && awayScore !== "" && !isNaN(hs) && !isNaN(as) && hs >= 0 && as >= 0;
  const autoWinner = scoresValid ? suggestWinner(home, away, hs, as) : "";
  const effectiveWinner = winner || autoWinner;
  const isDraw = scoresValid && hs === as;
  const canSubmit = scoresValid && effectiveWinner;

  function pickWinner(team: string) {
    setWinner(team);
  }

  async function confirmSubmit() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        match_id: match.id,
        player,
        predicted_home_score: hs,
        predicted_away_score: as,
        predicted_winner: effectiveWinner,
      }),
    });
    setSubmitting(false);
    setShowConfirm(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to submit");
      return;
    }
    onSubmitted();
  }

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span>{ROUND_LABELS[match.round]} · M{match.match_number}</span>
        <span>{new Date(match.match_date).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className={styles.teams}>
        <div className={styles.team}>
          <span>{flagFor(home)}</span>
          <span>{home}</span>
        </div>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          inputMode="numeric"
          value={homeScore}
          onChange={(e) => { setHomeScore(e.target.value); setWinner(""); }}
        />
        <span className={styles.dash}>–</span>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          inputMode="numeric"
          value={awayScore}
          onChange={(e) => { setAwayScore(e.target.value); setWinner(""); }}
        />
        <div className={`${styles.team} ${styles.teamAway}`}>
          <span>{away}</span>
          <span>{flagFor(away)}</span>
        </div>
      </div>

      {isDraw && (
        <div className={styles.winnerRow}>
          <button
            className={`${styles.winnerBtn} ${winner === home ? styles.selected : ""}`}
            onClick={() => pickWinner(home)}
          >
            {flagFor(home)} {home} (ET/pens)
          </button>
          <button
            className={`${styles.winnerBtn} ${winner === away ? styles.selected : ""}`}
            onClick={() => pickWinner(away)}
          >
            {flagFor(away)} {away} (ET/pens)
          </button>
        </div>
      )}

      <button className={styles.submit} disabled={!canSubmit} onClick={() => setShowConfirm(true)}>
        Submit Prediction
      </button>
      {error && <div className={styles.error}>{error}</div>}

      {showConfirm && (
        <ConfirmModal
          title="Lock it in?"
          message={`${home} ${hs} – ${as} ${away}, winner: ${effectiveWinner}. You cannot change this. Are you sure?`}
          confirmLabel={submitting ? "Submitting…" : "Submit"}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
