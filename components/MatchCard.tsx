import { Match, Prediction, Player, isLocked, teamLabel, ROUND_LABELS } from "@/lib/supabase";
import { flagFor } from "@/lib/flags";
import { scorePrediction } from "@/lib/scoring";
import styles from "./MatchCard.module.scss";

interface MatchCardProps {
  match: Match;
  predictions: Prediction[];
  viewer?: Player | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    " · " +
    date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function MatchCard({ match, predictions, viewer }: MatchCardProps) {
  const locked = isLocked(match);
  const danyaPred = predictions.find((p) => p.match_id === match.id && p.player === "danya");
  const dimaPred = predictions.find((p) => p.match_id === match.id && p.player === "dima");
  const bothSubmitted = !!danyaPred && !!dimaPred;
  const canSeeAll = bothSubmitted || locked;

  const home = teamLabel(match, "home");
  const away = teamLabel(match, "away");
  const hasResult = match.actual_home_score != null && match.actual_away_score != null;

  function renderPrediction(player: Player, pred: Prediction | undefined) {
    const visible = canSeeAll || viewer === player;
    if (!pred) {
      return (
        <div className={styles.predictionBox}>
          <div className={styles.predictionName}>{player === "danya" ? "Danya" : "Dima"}</div>
          <div className={styles.hidden}>No pick yet</div>
        </div>
      );
    }
    if (!visible) {
      return (
        <div className={styles.predictionBox}>
          <div className={styles.predictionName}>{player === "danya" ? "Danya" : "Dima"}</div>
          <div className={styles.hidden}>🔒 Hidden</div>
        </div>
      );
    }
    const result = hasResult ? scorePrediction(match, pred) : null;
    return (
      <div className={styles.predictionBox}>
        <div className={styles.predictionName}>{player === "danya" ? "Danya" : "Dima"}</div>
        <div className={styles.predictionScore}>
          {pred.predicted_home_score} – {pred.predicted_away_score}
        </div>
        {result && (
          <div className={`${styles.predictionPoints} ${styles[`points${result.points}`]}`}>
            +{result.points} pt{result.points === 1 ? "" : "s"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span>{ROUND_LABELS[match.round]} · M{match.match_number}</span>
        <span className={`${styles.statusBadge} ${styles[match.status]}`}>{match.status}</span>
      </div>
      <div className={styles.teams}>
        <div className={styles.team}>
          <span>{flagFor(home)}</span>
          <span>{home}</span>
        </div>
        <div className={styles.score}>
          {hasResult ? (
            <>
              {match.actual_home_score}
              <span className={styles.dash}> – </span>
              {match.actual_away_score}
            </>
          ) : (
            formatDate(match.match_date)
          )}
        </div>
        <div className={`${styles.team} ${styles.teamAway}`}>
          <span>{away}</span>
          <span>{flagFor(away)}</span>
        </div>
      </div>
      {(danyaPred || dimaPred) && (
        <div className={styles.predictions}>
          {renderPrediction("danya", danyaPred)}
          {renderPrediction("dima", dimaPred)}
        </div>
      )}
    </div>
  );
}
