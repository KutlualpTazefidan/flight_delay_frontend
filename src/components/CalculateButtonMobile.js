import styles from "./calculatebuttonmobile.module.css";
import { MdOutlineCalculate } from "react-icons/md";

export default function CalculateButtonMobile() {
  const result = 30;
  return (
    <div className={styles.calculation_side}>
      <div className={styles.calculation_wrapper}>
        <span className={styles.title}>Estimate Flight Delay:</span>
        <a className={styles.button_container} href="#">
          <MdOutlineCalculate className={styles.icon} />
          {/* <span className={styles.inner}></span> */}
        </a>
      </div>
      <div className={styles.result_wrapper}>
        <span className={styles.results_text}>Predicted Flight Delay:</span>
        <span className={styles.results_number}>{result} minutes</span>
      </div>
    </div>
  );
}
