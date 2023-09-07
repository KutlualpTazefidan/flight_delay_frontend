"use client";
import styles from "./calculatebutton.module.css";
import { MdOutlineCalculate } from "react-icons/md";
import { useState } from "react";
// Storage
// import { storage } from "../storage/storage";
// import { useSnapshot } from "valtio";

export default function CalculateButton() {
  // const snap = useSnapshot(storage);
  const [estDelay, setEstDelay] = useState(0);

  async function fetchData() {
    console.log("Fetching data!");
    try {
      const response = await fetch("https://flight-delay-api.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrstn: 1,
          depstn: 1,
          std: 20160103103000,
          sta: 20160113150500,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstDelay(data["prediction"]);
      // Use the data in your Next.js app
      console.log(data);
      console.log(data["prediction"]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  return (
    <>
      <span className={styles.title}>
        Calculate the Estimated Flight Delay for Your Trip:
      </span>
      <a className={styles.button_container} onClick={() => fetchData()}>
        <MdOutlineCalculate className={styles.icon} />
      </a>
      <span className={styles.results_text}>
        We anticipate a flight delay of approximately:
      </span>
      <span className={styles.results_number}>{estDelay} minutes</span>
    </>
  );
}
