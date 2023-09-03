import styles from "./calculatebutton.module.css";
import { MdOutlineCalculate } from "react-icons/md";

export default function CalculateButton() {
  const result = 30;
  return (
    <>
      <span className={styles.title}>
        Calculate the Estimated Flight Delay for Your Trip:
      </span>
      <a className={styles.button_container} href="#">
        <MdOutlineCalculate className={styles.icon} />
        {/* <span className={styles.inner}></span> */}
      </a>
      <span className={styles.results_text}>
        We anticipate a flight delay of approximately:
      </span>
      <span className={styles.results_number}>{result} minutes</span>
    </>
  );
}
