import styles from "./ScoreBoard.module.scss";

interface ScoreBoardProps {
  danyaPoints: number;
  dimaPoints: number;
}

export default function ScoreBoard({ danyaPoints, dimaPoints }: ScoreBoardProps) {
  return (
    <div className={styles.board}>
      <div className={styles.label}>HEAD TO HEAD</div>
      <div className={styles.row}>
        <div className={styles.player}>
          <div className={styles.name}>Danya</div>
          <div className={styles.score}>{danyaPoints}</div>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={styles.player}>
          <div className={styles.name}>Dima</div>
          <div className={styles.score}>{dimaPoints}</div>
        </div>
      </div>
    </div>
  );
}
