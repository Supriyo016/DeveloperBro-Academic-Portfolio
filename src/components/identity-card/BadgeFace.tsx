import Image from "next/image";
import { badge, barcodeBars } from "./identity-card-data";
import styles from "./identity-card.module.css";

/** The printed front of the badge. Layers sit at different depths so the card shows parallax when it turns. */
export function BadgeFace() {
  const bars = barcodeBars(badge.barcodeSeed);
  return (
    <div className={styles.face}>
      <span className={styles.slot} aria-hidden />
      <span className={styles.perforation} data-side="left" aria-hidden />
      <span className={styles.perforation} data-side="right" aria-hidden />

      <div className={styles.header}>
        <span>{badge.pass}</span>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden />
          {badge.status}
        </span>
      </div>

      <div className={styles.photo}>
        <Image src={badge.portrait} alt={`Photograph of ${badge.name}`} width={1034} height={1292} sizes="220px" className={styles.photoImg} priority />
        <span className={styles.bracket} data-corner="tl" aria-hidden />
        <span className={styles.bracket} data-corner="tr" aria-hidden />
      </div>

      <p className={styles.role}>{badge.role}</p>
      <p className={styles.name}>{badge.name}</p>

      <div className={styles.footer}>
        <span>{badge.footer}</span>
        <svg className={styles.barcode} viewBox={`0 0 ${bars.reduce((sum, width) => sum + width + 1, 0)} 20`} preserveAspectRatio="none" aria-hidden>
          {bars.map((width, index) => {
            const x = bars.slice(0, index).reduce((sum, value) => sum + value + 1, 0);
            return <rect key={index} x={x} width={width} height="20" fill="currentColor" />;
          })}
        </svg>
      </div>
    </div>
  );
}
