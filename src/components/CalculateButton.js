import styles from "./calculatebutton.module.css";
import { MdOutlineCalculate } from "react-icons/md";

export default function CalculateButton() {
  return (
    <a className={styles.button_container} href="#">
      <MdOutlineCalculate className={styles.icon} />
      {/* <span className={styles.inner}></span> */}
    </a>
  );
}
