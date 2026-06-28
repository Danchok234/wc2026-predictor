import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Round = "R32" | "R16" | "QF" | "SF" | "Final";
export type Player = "danya" | "dima";
export type MatchStatus = "upcoming" | "locked" | "finished";

export interface Match {
  id: string;
  round: Round;
  match_number: number;
  home_team: string | null;
  away_team: string | null;
  home_slot: string | null;
  away_slot: string | null;
  match_date: string;
  actual_home_score: number | null;
  actual_away_score: number | null;
  actual_winner: string | null;
  status: MatchStatus;
  feeds_match_id: string | null;
  feeds_slot: "home" | "away" | null;
  created_at: string;
}

export interface Prediction {
  id: string;
  match_id: string;
  player: Player;
  predicted_home_score: number;
  predicted_away_score: number;
  predicted_winner: string;
  submitted_at: string;
}

export const OTHER_PLAYER: Record<Player, Player> = {
  danya: "dima",
  dima: "danya",
};

export const PLAYER_NAMES: Record<Player, string> = {
  danya: "Danya",
  dima: "Dima",
};

export const ROUND_LABELS: Record<Round, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-Finals",
  SF: "Semi-Finals",
  Final: "Final",
};

export const ROUND_ORDER: Round[] = ["R32", "R16", "QF", "SF", "Final"];

export function teamLabel(match: Match, side: "home" | "away"): string {
  const team = side === "home" ? match.home_team : match.away_team;
  const slot = side === "home" ? match.home_slot : match.away_slot;
  return team || slot || "TBD";
}

export function isLocked(match: Match): boolean {
  if (match.status !== "upcoming") return true;
  return new Date(match.match_date).getTime() <= Date.now();
}
