"use client";
import styles from "./calculatebutton.module.css";
import { MdOutlineCalculate } from "react-icons/md";
import { useState } from "react";
// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";
import { getDistance } from "geolib";
var airlineCodeTranslator = require("airline-codes");

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
    console.log("Sending Data to the API!");

    const departure_airport_data = airportsData[departure_airport];
    const arrival_airport_data = airportsData[arrival_airport];
    // Formating  data for api
    const id = "w_id_0";
    const datop = departure_time.toISOString().split("T")[0];
    const fltid = airlineCodeTranslator
      .findWhere({ name: airline })
      .get("icao"); // abbriviation needed
    const depstn = departure_airport_data["iata"];
    const arrstn = arrival_airport_data["iata"];

    // date
    const std = departure_time
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const sta = arrival_time
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const status = "ATA";
    const ac = airlineCodeTranslator.findWhere({ name: airline }).get("icao");
    const dep_iata = departure_airport_data["iata"];
    const dep_country = departure_airport_data["country"];
    const dep_elevation = departure_airport_data["elevation"];
    const dep_lat = departure_airport_data["lat"];
    const dep_lon = departure_airport_data["lon"];
    const arr_iata = arrival_airport_data["iata"];
    const arr_country = arrival_airport_data["country"];
    const arr_elevation = arrival_airport_data["elevation"];
    const arr_lat = arrival_airport_data["lat"];
    const arr_lon = arrival_airport_data["lon"];

    console.log(
      `id (Type: ${typeof id}): ${id}\n` +
        `datop (Type: ${typeof datop}): ${datop}\n` +
        `fltid (Type: ${typeof fltid}): ${fltid}\n` +
        `depstn (Type: ${typeof depstn}): ${depstn}\n` +
        `arrstn (Type: ${typeof arrstn}): ${arrstn}\n` +
        `std (Type: ${typeof std}): ${std}\n` +
        `sta (Type: ${typeof sta}): ${sta}\n` +
        `status (Type: ${typeof status}): ${status}\n` +
        `ac (Type: ${typeof ac}): ${ac}\n` +
        `dep_iata (Type: ${typeof dep_iata}): ${dep_iata}\n` +
        `dep_country (Type: ${typeof dep_country}): ${dep_country}\n` +
        `dep_elevation (Type: ${typeof dep_elevation}): ${dep_elevation}\n` +
        `dep_lat (Type: ${typeof dep_lat}): ${dep_lat}\n` +
        `dep_lon (Type: ${typeof dep_lon}): ${dep_lon}\n` +
        `arr_iata (Type: ${typeof arr_iata}): ${arr_iata}\n` +
        `arr_country (Type: ${typeof arr_country}): ${arr_country}\n` +
        `arr_elevation (Type: ${typeof arr_elevation}): ${arr_elevation}\n` +
        `arr_lat (Type: ${typeof arr_lat}): ${arr_lat}\n` +
        `arr_lon (Type: ${typeof arr_lon}): ${arr_lon}`
    );

    console.log(
      "trying",
      airlineCodeTranslator.findWhere({ name: airline }).get("icao")
    );

    try {
      const response = await fetch(
        // "https://flight-delay-api.onrender.com/preprocessdata",
        "http://localhost:10000/preprocessdata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            datop: datop,
            fltid: fltid,
            depstn: depstn,
            arrstn: arrstn,
            std: std,
            sta: sta,
            status: status,
            ac: ac,
            dep_iata: dep_iata,
            dep_country: dep_country,
            dep_elevation: dep_elevation,
            dep_lat: dep_lat,
            dep_lon: dep_lon,
            arr_iata: arr_iata,
            arr_country: arr_country,
            arr_elevation: arr_elevation,
            arr_lat: arr_lat,
            arr_lon: arr_lon,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // setEstDelay(data["prediction"]);
      // Use the data in your Next.js app
      console.log(data);
      // console.log(data["prediction"]);
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
