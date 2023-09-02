import styles from "./page.module.css";
import AirportDropdown from "../components/AirportDropdown";
export default function Home() {
  return (
    <>
      <main>
        <nav className={styles.glasscard_nav}>
          <ul>
            <li>home</li>
            <li>about</li>
            <li>contact</li>
          </ul>
        </nav>
        <div className={styles.glasscard}>
          <h1 className={styles.card_head}>Your Flight</h1>
          <ul className={styles.card_ul}>
            <li>
              <AirportDropdown title={"Depature Airport"} />
            </li>
            <li>
              <AirportDropdown title={"Arrival Airport"} />
            </li>
            <li>Date of your flight</li>
          </ul>
        </div>
      </main>
    </>
  );
}
