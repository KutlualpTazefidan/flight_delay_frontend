"use client";
import styles from "./page.module.css";
import AirportDropdown from "../components/AirportDropdown";
import CustomDatePicker from "../components/CustomDatePicker";
import { MdOutlineFlight } from "react-icons/md";
import { Exo } from "next/font/google";
import CalculateButton from "@/components/CalculateButton";
import CalculateButtonMobile from "@/components/CalculateButtonMobile";
import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { useSnapshot } from "valtio";
import { storage } from "../storage/storage";

const exo = Exo({ subsets: ["latin"] });

export default function Home() {
  const [airportsData, setAirportsData] = useState([]);
  const [airports, setAirports] = useState([]);

  // Retrieving store items to see if they changed
  const { departure_airport, arrival_airport, departure_time, arrival_time } =
    useSnapshot(storage);

  // Storing files on local storage
  const [localObjectsStorage, setLocalObjectsStorage] = useLocalStorageState(
    "FlightDelayStorage",
    { defaultValue: storage }
  );

  function getItem(key) {
    const localStore = localStorage.getItem(key);
    if (localStore !== null) {
      return JSON.parse(localStore);
    }
    return null;
  }

  useEffect(() => {
    // retrieve data from local storage
    const retrievedStorage = getItem("FlightDelayStorage");
    if (retrievedStorage) {
      storage.departure_airport = retrievedStorage.departure_airport;
      storage.arrival_airport = retrievedStorage.arrival_airport;
      storage.departure_time = retrievedStorage.departure_time;
      storage.arrival_time = retrievedStorage.arrival_time;
      setLocalObjectsStorage(storage);
    }
    // Import airport data
    fetch("./data/airportsdata.json")
      .then((response) => response.json())
      .then((airportsJson) => {
        setAirportsData(airportsJson);
        // setAirports(Object.keys(airportsJson));
      })
      .catch((error) => {
        console.error("Error fetching JSON airportsData:", error);
      });
  }, []);

  return (
    <>
      <main className={styles.main}>
        <nav className={styles.glasscard_nav}>
          <ul>
            <li>home</li>
            <li>about</li>
            <li>dashboard</li>
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
          <div className={styles.glasscard_wrapper}>
            <div className={styles.glasscard}>
              <h1 className={styles.card_head}>Your Flight</h1>
              <ul className={styles.card_ul}>
                <li>
                  <AirportDropdown
                    title={"Departure Airport"}
                    airportsData={airportsData}
                  />
                </li>
                <li>
                  <AirportDropdown
                    title={"Arrival Airport"}
                    airportsData={airportsData}
                  />
                </li>
                <li>
                  <CustomDatePicker />
                </li>
              </ul>
            </div>
            <CalculateButtonMobile />
          </div>

          <div className={styles.calculation_side}>
            <CalculateButton />
          </div>
        </div>
      </main>
    </>
  );
}
