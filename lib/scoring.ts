import { Match, Prediction, actualWinnerSide } from "./supabase";

export interface ScoreResult {
  points: 0 | 1 | 3;
  exactScore: boolean;
  correctWinner: boolean;
}

export function scorePrediction(match: Match, prediction: Prediction): ScoreResult {
  if (match.actual_home_score === null || match.actual_away_score === null || !match.actual_winner) {
    return { points: 0, exactScore: false, correctWinner: false };
  }

  const exactScore =
    prediction.predicted_home_score === match.actual_home_score &&
    prediction.predicted_away_score === match.actual_away_score;

  const correctWinner = prediction.predicted_winner_side === actualWinnerSide(match);

  if (exactScore) return { points: 3, exactScore: true, correctWinner };
  if (correctWinner) return { points: 1, exactScore: false, correctWinner: true };
  return { points: 0, exactScore: false, correctWinner: false };
}

export interface PlayerTotals {
  total: number;
  byRound: Record<string, number>;
}

export function tallyPlayer(
  matches: Match[],
  predictions: Prediction[],
  player: "danya" | "dima"
): PlayerTotals {
  const byRound: Record<string, number> = {};
  let total = 0;

  for (const match of matches) {
    if (match.status !== "finished") continue;
    const prediction = predictions.find((p) => p.match_id === match.id && p.player === player);
    if (!prediction) continue;
    const { points } = scorePrediction(match, prediction);
    total += points;
    byRound[match.round] = (byRound[match.round] ?? 0) + points;
  }

  return { total, byRound };
}

export function suggestWinnerSide(homeScore: number, awayScore: number): "home" | "away" | "" {
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return "";
}
