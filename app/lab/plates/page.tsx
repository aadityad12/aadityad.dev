import { PLATES } from "../../plates";
import styles from "../../plates/plates.module.css";

export const metadata = { title: "Plates (lab)", robots: { index: false } };

export default function PlatesLab() {
  return (
    <main className={styles.lab} aria-label="Signal plates">
      {Object.entries(PLATES).map(([name, Plate]) => (
        <figure key={name}>
          <figcaption>{name}</figcaption>
          <Plate playing />
        </figure>
      ))}
    </main>
  );
}
