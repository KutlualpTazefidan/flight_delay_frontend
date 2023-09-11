"use client";
import styles from "./calculatebutton.module.css";
import { MdOutlineCalculate } from "react-icons/md";
import { useState } from "react";
// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";
import { getDistance } from "geolib";

export default function CalculateButton({ airportsData }) {
  const {
    departure_airport,
    departure_city,
    departure_country,
    departure_time,
    arrival_airport,
    arrival_city,
    arrival_country,
    arrival_time,
    airline,
  } = useSnapshot(storage);
  const [estDelay, setEstDelay] = useState(0);

  async function fetchData() {
    console.log("Fetching data!");
    console.log(
      `Departure Airport (Type: ${typeof departure_airport}): ${departure_airport}\n` +
        `Departure City (Type: ${typeof departure_city}): ${departure_city}\n` +
        `Departure Country (Type: ${typeof departure_country}): ${departure_country}\n` +
        `Departure Time (Type: ${typeof departure_time}): ${departure_time}\n` +
        `Arrival Airport (Type: ${typeof arrival_airport}): ${arrival_airport}\n` +
        `Arrival City (Type: ${typeof arrival_city}): ${arrival_city}\n` +
        `Arrival Country (Type: ${typeof arrival_country}): ${arrival_country}\n` +
        `Arrival Time (Type: ${typeof arrival_time}): ${arrival_time}\n` +
        `Airline (Type: ${typeof airline}): ${airline}`
    );
    // Formating  data for api

    // date
    // Format the date to 'YYYY-MM-DD HH:mm:ss'
    const departure_time_f = departure_time
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const arrival_time_f = arrival_time
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const year = departure_time.getFullYear();
    const month = (departure_time.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
    const day = departure_time.getDate().toString().padStart(2, "0");
    const datop = `${year}${month}${day}`;

    const dhour = departure_time.getHours().toString().padStart(2, "0");
    const dminute = departure_time.getMinutes().toString().padStart(2, "0");
    const dsecond = departure_time.getSeconds().toString().padStart(2, "0");
    const std_time = `${dhour}${dminute}${dsecond}`;

    const ahour = departure_time.getHours().toString().padStart(2, "0");
    const aminute = departure_time.getMinutes().toString().padStart(2, "0");
    const asecond = departure_time.getSeconds().toString().padStart(2, "0");
    const sta_time = `${ahour}${aminute}${asecond}`;

    // Determine the season based on the month and assign a numerical value
    let season = 0;
    if (month >= 3 && month <= 5) {
      season = 0; // Spring
    } else if (month >= 6 && month <= 8) {
      season = 1; // Summer
    } else if (month >= 9 && month <= 11) {
      season = 2; // Autumn
    } else {
      season = 3; // Winter
    }

    const departure_airport_data = airportsData[departure_airport];
    const arrival_airport_data = airportsData[arrival_airport];
    console.log(airportsData[departure_airport]);
    const departure_lon = departure_airport_data["lon"];
    const departure_lat = departure_airport_data["lat"];
    const departure_elevation = departure_airport_data["elevation"];
    const arrival_lon = arrival_airport_data["lon"];
    const arrival_lat = arrival_airport_data["lat"];
    const arrival_elevation = arrival_airport_data["elevation"];
    const elevation_difference = departure_elevation - arrival_elevation;
    console.log(
      getDistance(
        { latitude: departure_lat, longitude: departure_lon },
        { latitude: arrival_lat, longitude: arrival_lon }
      )
    );
    // try {
    //   const response = await fetch("https://flight-delay-api.onrender.com", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       departure_airport: str,
    //       departure_city: str,
    //       departure_country: str,
    //       departure_time: str,
    //       arrival_airport: str,
    //       arrival_city: str,
    //       arrival_country: str,
    //       arrival_time: str,
    //       airline: str,
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const data = await response.json();
    //   setEstDelay(data["prediction"]);
    //   // Use the data in your Next.js app
    //   console.log(data);
    //   console.log(data["prediction"]);
    // } catch (error) {
    //   console.error("There was a problem with the fetch operation:", error);
    // }
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
