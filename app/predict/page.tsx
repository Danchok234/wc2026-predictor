"use client";

import { useEffect, useState } from "react";
import { useMatchesAndPredictions } from "@/lib/hooks";
import { getSessionPlayer, setSessionPlayer, clearSessionPlayer, verifyPin } from "@/lib/auth";
import { Player, isLocked, teamLabel, PLAYER_NAMES } from "@/lib/supabase";
import { flagFor } from "@/lib/flags";
import PinModal from "@/components/PinModal";
import PredictForm from "@/components/PredictForm";
import styles from "./page.module.scss";

export default function PredictPage() {
  const { matches, predictions, loading, refresh } = useMatchesAndPredictions();
  const [player, setPlayer] = useState<Player | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlayer(getSessionPlayer());
    setReady(true);
  }, []);

  function logout() {
    clearSessionPlayer();
    setPlayer(null);
  }

  if (!ready) return null;

  if (!player) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Who&apos;s predicting?</h1>
        <p className={styles.subtitle}>Enter your PIN to make your picks.</p>
        <div className={styles.chooser}>
          <button className={styles.bigBtn} onClick={() => setPendingPlayer("danya")}>
            Danya
          </button>
          <button className={styles.bigBtn} onClick={() => setPendingPlayer("dima")}>
            Dima
          </button>
        </div>
        {pendingPlayer && (
          <PinModal
            title={`${PLAYER_NAMES[pendingPlayer]}'s PIN`}
            onSubmit={(pin) => verifyPin(pendingPlayer, pin)}
            onSuccess={() => {
              setSessionPlayer(pendingPlayer);
              setPlayer(pendingPlayer);
              setPendingPlayer(null);
            }}
            onCancel={() => setPendingPlayer(null)}
          />
        )}
      </div>
    );
  }

  const myPredictions = predictions.filter((p) => p.player === player);
  const predictedMatchIds = new Set(myPredictions.map((p) => p.match_id));

  const upcomingUnpredicted = matches
    .filter((m) => !isLocked(m) && !predictedMatchIds.has(m.id))
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());

  const myLockedPicks = matches
    .filter((m) => predictedMatchIds.has(m.id))
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  return (
    <div className={styles.page}>
      <div className={styles.who}>
        <span>Predicting as <strong>{PLAYER_NAMES[player]}</strong></span>
        <button className={styles.switch} onClick={logout}>Switch</button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Upcoming matches</div>
        {loading && <div className={styles.empty}>Loading…</div>}
        {!loading && upcomingUnpredicted.length === 0 && (
          <div className={styles.empty}>No open matches to predict right now</div>
        )}
        {upcomingUnpredicted.map((match) => (
          <PredictForm key={match.id} match={match} player={player} onSubmitted={refresh} />
        ))}
      </div>

      {myLockedPicks.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Your locked picks</div>
          {myLockedPicks.map((match) => {
            const pred = myPredictions.find((p) => p.match_id === match.id)!;
            const home = teamLabel(match, "home");
            const away = teamLabel(match, "away");
            return (
              <div key={match.id} className={styles.lockedCard}>
                <span className={styles.lockedTeams}>
                  {flagFor(home)} {home} vs {away} {flagFor(away)}
                </span>
                <span className={styles.lockedScore}>
                  {pred.predicted_home_score} – {pred.predicted_away_score}
                </span>
                <span className={styles.padlock}>🔒</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
