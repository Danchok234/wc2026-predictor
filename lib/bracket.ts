import { Match, Player, Prediction, Round } from "./supabase";

const PREV_ROUND: Record<Round, Round | null> = {
  R32: null,
  R16: "R32",
  QF: "R16",
  SF: "QF",
  Final: "SF",
};

export interface ResolvedTeams {
  home: string | null;
  away: string | null;
}

function findMatch(matches: Match[], round: Round, matchNumber: number): Match | undefined {
  return matches.find((m) => m.round === round && m.match_number === matchNumber);
}

/**
 * Resolves the team occupying one side of a match for a given player's personal bracket.
 * If the official team is already known, that wins. Otherwise it walks back to the two
 * matches that feed this slot and follows that player's own predicted winner, recursively.
 */
export function resolveTeamForSide(
  matches: Match[],
  predictions: Prediction[],
  player: Player,
  match: Match,
  side: "home" | "away"
): string | null {
  const official = side === "home" ? match.home_team : match.away_team;
  if (official) return official;

  const prevRound = PREV_ROUND[match.round];
  if (!prevRound) return null;

  const sourceNumber = side === "home" ? match.match_number * 2 - 1 : match.match_number * 2;
  const sourceMatch = findMatch(matches, prevRound, sourceNumber);
  if (!sourceMatch) return null;

  const homeTeam = resolveTeamForSide(matches, predictions, player, sourceMatch, "home");
  const awayTeam = resolveTeamForSide(matches, predictions, player, sourceMatch, "away");

  const pred = predictions.find((p) => p.match_id === sourceMatch.id && p.player === player);
  if (!pred) return null;

  return pred.predicted_winner_side === "home" ? homeTeam : awayTeam;
}

export function resolveMatchTeams(
  matches: Match[],
  predictions: Prediction[],
  player: Player,
  match: Match
): ResolvedTeams {
  return {
    home: resolveTeamForSide(matches, predictions, player, match, "home"),
    away: resolveTeamForSide(matches, predictions, player, match, "away"),
  };
}

export function isMatchReadyForPlayer(
  matches: Match[],
  predictions: Prediction[],
  player: Player,
  match: Match
): boolean {
  const { home, away } = resolveMatchTeams(matches, predictions, player, match);
  return !!home && !!away;
}
