"use client";

import { useEffect, useState } from "react";
import { useMatchesAndPredictions } from "@/lib/hooks";
import { getIsAdmin, setIsAdmin, clearIsAdmin, verifyAdminPin } from "@/lib/auth";
import { ROUND_ORDER, ROUND_LABELS } from "@/lib/supabase";
import PinModal from "@/components/PinModal";
import AdminMatchRow from "@/components/AdminMatchRow";
import styles from "./page.module.scss";

export default function AdminPage() {
  const { matches, refresh } = useMatchesAndPredictions();
  const [isAdmin, setAdmin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAdmin(getIsAdmin());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!isAdmin) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.subtitle}>Enter actual results and progress the bracket.</p>
        <div className={styles.chooser}>
          <button className={styles.bigBtn} onClick={() => setShowPin(true)}>
            Admin Login
          </button>
        </div>
        {showPin && (
          <PinModal
            title="Admin PIN"
            onSubmit={(pin) => verifyAdminPin(pin)}
            onSuccess={() => {
              const pinValue = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "";
              setIsAdmin(pinValue);
              setAdmin(true);
              setShowPin(false);
            }}
            onCancel={() => setShowPin(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.subtitle}>
        Logged in as admin.{" "}
        <button
          className={styles.btn}
          style={{ display: "inline", padding: "0.2rem 0.6rem" }}
          onClick={() => { clearIsAdmin(); setAdmin(false); }}
        >
          Log out
        </button>
      </div>
      {ROUND_ORDER.map((round) => {
        const roundMatches = matches.filter((m) => m.round === round).sort((a, b) => a.match_number - b.match_number);
        if (roundMatches.length === 0) return null;
        return (
          <div key={round} className={styles.roundSection}>
            <div className={styles.roundTitle}>{ROUND_LABELS[round]}</div>
            {roundMatches.map((match) => (
              <AdminMatchRow key={match.id} match={match} onSaved={refresh} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
