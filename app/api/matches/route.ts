import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("round", { ascending: true })
    .order("match_number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ matches: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { adminPin, id, ...updates } = body;

  if (adminPin !== process.env.NEXT_PUBLIC_ADMIN_PIN) {
    return NextResponse.json({ error: "Invalid admin PIN" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing match id" }, { status: 400 });
  }

  const allowedFields = [
    "home_team",
    "away_team",
    "actual_home_score",
    "actual_away_score",
    "actual_winner",
    "status",
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) patch[key] = updates[key];
  }

  const { data, error } = await supabaseAdmin
    .from("matches")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ match: data });
}
