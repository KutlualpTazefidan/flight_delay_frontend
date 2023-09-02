import styles from "./page.module.css";
import AirportDropdown from "../components/AirportDropdown";
import CustomDatePicker from "../components/CustomDatePicker";
import { MdOutlineFlight } from "react-icons/md";
import { Exo } from "next/font/google";
const exo = Exo({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <nav className={styles.glasscard_nav}>
          <ul>
            <li>home</li>
            <li>about</li>
          </ul>
        </nav>
        <div className={styles.page_content}>
          <div className={styles.main_logo_container}>
            <div className={styles.main_logo}>
              <MdOutlineFlight className={styles.main_logo_icon} />
              <span className={exo.className}>Travel Planer</span>
            </div>
            <span className={styles.slogan}>On Time, In Control </span>
          </div>
          <div className={styles.glasscard}>
            <h1 className={styles.card_head}>Your Flight</h1>
            <ul className={styles.card_ul}>
              <li>
                <AirportDropdown title={"Depature Airport"} />
              </li>
              <li>
                <AirportDropdown title={"Arrival Airport"} />
              </li>
              <li>
                <CustomDatePicker />
              </li>
            </ul>
          </div>
          <div className={styles.calculation_side}>
            <span className={styles.title}>
              Calculate the Estimated Flight Delay for Your Trip!
            </span>
            <a href="#">
              <span class="inner"></span>
              <i class="icon-github"></i>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
