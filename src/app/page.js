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
import SingleDropdown from "@/components/SingleDropdown";
var airlineCodeTranslator = require("airline-codes");
const exo = Exo({ subsets: ["latin"] });

export default function Home() {
  const [airportsData, setAirportsData] = useState([]);
  const [unfilteredAirportsData, setUnfilteredAirportsData] = useState([]);
  const [airline_codes, setAirlineCodes] = useState([]);
  const [airline_names, setAirlineNames] = useState([]);
  const [orgAirports, setOrgAirports] = useState([]);
  const [renderTriggerAirline, setRenderTriggerAirline] = useState(false);

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
    async function fetchDataFromJson() {
      try {
        const [
          airportsDataResponse,
          orgAirportsResponse,
          airlineCodesResponse,
        ] = await Promise.all([
          fetch("./data/airportsdata.json").then((response) => response.json()),
          fetch("./data/airports_in_org_dataset.json").then((response) =>
            response.json()
          ),
          fetch("./data/airline_codes.json").then((response) =>
            response.json()
          ),
        ]);
        setUnfilteredAirportsData(airportsDataResponse);
        setOrgAirports(orgAirportsResponse.airports);
        setAirlineCodes(airlineCodesResponse.airline_code);

        // console.log(
        //   "hello3a",
        //   orgAirports.includes(unfilteredAirportsData["CMN"].iata)
        // );
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    }
    fetchDataFromJson();
  }, []);

  useEffect(() => {
    const filteredData = {};
    Object.keys(unfilteredAirportsData).forEach((airportCode) => {
      const airport = unfilteredAirportsData[airportCode];
      if (orgAirports.includes(airport.iata)) {
        filteredData[airportCode] = airport;
      }
    });
    console.log("hello_5_fil", filteredData);
    // console.log("hello_5_fil", filtered_data);
    setAirportsData(filteredData);
  }, [unfilteredAirportsData]);

  useEffect(() => {
    const translations = [];

    // Loop through the list of airline codes and translate them
    airline_codes.forEach((code) => {
      const airline = airlineCodeTranslator.findWhere({ iata: code });
      if (airline) {
        translations.push(airline.get("name"));
      } else {
        translations.push(code); // Handle cases where the code is not found
      }
    });

    setAirlineNames(translations.slice().sort());
    console.log("codes", airline_codes);
  }, [airline_codes]);

  useEffect(() => {
    setLocalObjectsStorage(storage);
  }, [renderTriggerAirline]);
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
          <div className={styles.left_content}>
            <div className={styles.main_logo_container}>
              <div className={styles.main_logo}>
                <MdOutlineFlight className={styles.main_logo_icon} />
                <span className={exo.className}>Travel Planer</span>
              </div>
              <span className={styles.slogan}>On Time, In Control </span>
            </div>
            <div className={styles.glasscard_wrapper}>
              <div className={styles.glasscard}>
                <div className={styles.head_container}>
                  <h1 className={styles.card_head}>Your Flight</h1>
                  <SingleDropdown
                    dd_title={"Airline"}
                    allItems={airline_names}
                    varConnectedToStorage={"airline"}
                    renderTrigger={renderTriggerAirline}
                    setRenderTrigger={setRenderTriggerAirline}
                  />
                </div>
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
                </ul>
              </div>
              <CalculateButtonMobile />
            </div>
          </div>

          <div className={styles.calculation_side}>
            <CalculateButton airportsData={airportsData} />
          </div>
        </div>
      </main>
    </>
  );
}
