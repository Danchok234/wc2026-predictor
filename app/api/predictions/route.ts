import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("predictions").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ predictions: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { match_id, player, predicted_home_score, predicted_away_score, predicted_winner_side } = body;

  if (!match_id || !player || predicted_home_score == null || predicted_away_score == null || !predicted_winner_side) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (player !== "danya" && player !== "dima") {
    return NextResponse.json({ error: "Invalid player" }, { status: 400 });
  }

  if (predicted_winner_side !== "home" && predicted_winner_side !== "away") {
    return NextResponse.json({ error: "Invalid winner side" }, { status: 400 });
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", match_id)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const isLocked = match.status !== "upcoming" || new Date(match.match_date).getTime() <= Date.now();
  if (isLocked) {
    return NextResponse.json({ error: "This match is locked — predictions are closed" }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from("predictions")
    .select("id")
    .eq("match_id", match_id)
    .eq("player", player)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Prediction already submitted for this match" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("predictions")
    .insert({
      match_id,
      player,
      predicted_home_score,
      predicted_away_score,
      predicted_winner_side,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ prediction: data });
}
