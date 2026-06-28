"use client";

import { useState } from "react";
import styles from "./PinModal.module.scss";

interface PinModalProps {
  title: string;
  onSubmit: (pin: string) => boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinModal({ title, onSubmit, onSuccess, onCancel }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function pressDigit(digit: string) {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setError("");
    setPin(next);
    if (next.length === 4) {
      const ok = onSubmit(next);
      if (ok) {
        onSuccess();
      } else {
        setError("Incorrect PIN");
        setTimeout(() => setPin(""), 300);
      }
    }
  }

  function backspace() {
    setPin((p) => p.slice(0, -1));
    setError("");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`${styles.dot} ${i < pin.length ? styles.filled : ""}`} />
          ))}
        </div>
        <div className={styles.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} className={styles.key} onClick={() => pressDigit(d)}>
              {d}
            </button>
          ))}
          <button className={styles.key} onClick={backspace}>
            ⌫
          </button>
          <button className={styles.key} onClick={() => pressDigit("0")}>
            0
          </button>
          <span />
        </div>
        <div className={styles.error}>{error}</div>
        <button className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
