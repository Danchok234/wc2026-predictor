"use client";

import { useState } from "react";
import { Match, teamLabel } from "@/lib/supabase";
import styles from "@/app/admin/page.module.scss";

interface AdminMatchRowProps {
  match: Match;
  onSaved: () => void;
}

export default function AdminMatchRow({ match, onSaved }: AdminMatchRowProps) {
  const [homeTeam, setHomeTeam] = useState(match.home_team ?? "");
  const [awayTeam, setAwayTeam] = useState(match.away_team ?? "");
  const [homeScore, setHomeScore] = useState(match.actual_home_score?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(match.actual_away_score?.toString() ?? "");
  const [winner, setWinner] = useState(match.actual_winner ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const adminPin = typeof window !== "undefined" ? sessionStorage.getItem("wc2026_admin_pin") : null;

  async function save(status?: "upcoming" | "locked" | "finished") {
    setSaving(true);
    setSaved(false);
    const patch: Record<string, unknown> = {
      id: match.id,
      adminPin,
      home_team: homeTeam || null,
      away_team: awayTeam || null,
    };
    if (homeScore !== "") patch.actual_home_score = parseInt(homeScore, 10);
    if (awayScore !== "") patch.actual_away_score = parseInt(awayScore, 10);
    if (winner) patch.actual_winner = winner;
    if (status) patch.status = status;

    const res = await fetch("/api/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      onSaved();
    }
  }

  const home = teamLabel(match, "home");
  const away = teamLabel(match, "away");

  return (
    <div className={styles.row}>
      <div className={styles.meta}>
        <span>M{match.match_number} · {match.status}</span>
        <span>{new Date(match.match_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
      </div>
      <div className={styles.teamInputs}>
        <input
          className={styles.input}
          placeholder={match.home_slot ?? "Home team"}
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder={match.away_slot ?? "Away team"}
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        />
      </div>
      <div className={styles.scoreRow}>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
        />
        <span>–</span>
        <input
          className={styles.scoreInput}
          type="number"
          min={0}
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
        />
        <select className={styles.select} value={winner} onChange={(e) => setWinner(e.target.value)}>
          <option value="">Winner (ET/pens)…</option>
          {home && <option value={home}>{home}</option>}
          {away && <option value={away}>{away}</option>}
        </select>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} disabled={saving} onClick={() => save()}>
          Save
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving} onClick={() => save("finished")}>
          Mark Finished
        </button>
      </div>
      {saved && <div className={styles.saved}>Saved ✓</div>}
    </div>
  );
}
