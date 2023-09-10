"use client";
import styles from "./dropdown.module.css";
import { FaAngleDown } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";
import useLocalStorageState from "use-local-storage-state";

import SingleDropdown from "./SingleDropdown";

export default function AirportDropdown({ title, airportsData }) {
  const [selectedItem, setSelectedItem] = useState();

  // List of countries from an external library
  const countryList = require("country-list"); // Import the country-list library

  // Split the title into words
  const titleWords = title.split(" ");

  const [localObjectsStorage, setLocalObjectsStorage] = useLocalStorageState(
    "FlightDelayStorage",
    { defaultValue: storage }
  );
  const snap = useSnapshot(storage);
  // Retrieving store items to see if they changed
  const {
    departure_airport,
    arrival_airport,
    departure_city,
    arrival_city,
    departure_country,
    arrival_country,
  } = useSnapshot(storage);

  const [selectedAirport, setSelectedAirport] = useState(
    title === "Departure Airport"
      ? snap.departure_airport
      : snap.arrival_airport
  );

  const [isAirportsActive, setIsAirportsActive] = useState(false);
  const [isCountriesActive, setIsCountriesActive] = useState(false);
  const [searchValueAirport, setSearchValueAirport] = useState("");
  const [searchValueCountry, setSearchValueCountry] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [allAirports, setAllAirports] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const dropdownRef = useRef(null);
  const [renderTrigger, setRenderTrigger] = useState(false);

  useEffect(() => {
    // Extract all airports to show initially
    setAllAirports(Object.keys(airportsData));

    // Extract all countries to make list
    const countries = [];
    const cities = [];
    const countryCodes = [];
    for (const airportKey in airportsData) {
      if (airportsData.hasOwnProperty(airportKey)) {
        const countryCode = airportsData[airportKey].country;
        let country = "";
        if (countryCode === "XK") {
          country = "Kosovo";
        } else {
          country = countryList.getName(countryCode); // Assuming 'countries' is the country attribute
        }

        // Extend airportsData with country name
        airportsData[airportKey].countryName = country;

        // Check if the country is not already in the uniqueCountries array
        if (!countries.includes(country)) {
          countries.push(country);
          countryCodes.push(countryCode);
        }

        // saving city
        const city = airportsData[airportKey].city;
        if (!cities.includes(city)) {
          cities.push(airportsData[airportKey].city);
        }
        // console.log("Following key not found: ", airportsData[airportKey]);
      }
    }
    setFilteredCountries(countries);
    setFilteredCities(cities);
    setFilteredAirports(Object.keys(airportsData));
    console.log("set", allCountries);
  }, [airportsData]);

  function getCitiesByCountry(countryName) {
    // Filter the airports based on the selected country code
    const filteredAirports = Object.values(airportsData).filter(
      (airport) => airport.countryName === countryName
    );

    // Filter the cities based on the selected country code
    const cities = Object.values(airportsData)
      .filter((airport) => airport.countryName === countryName)
      .map((airport) => airport.city);

    // Create a flat list of airports
    const airportKeys = filteredAirports.map((airport) => airport.iata);

    return [cities, airportKeys];
  }

  useEffect(() => {
    setLocalObjectsStorage(storage);
    console.log("saving to storage");

    let citiesInSelectedCountry = [];
    let airportsInSelectedCountry = [];
    if (snap.departure_country != "Select") {
      [citiesInSelectedCountry, airportsInSelectedCountry] = getCitiesByCountry(
        snap.departure_country
      );
    }
    setFilteredAirports(airportsInSelectedCountry);
    setFilteredCities(citiesInSelectedCountry);
  }, [renderTrigger]);

  return (
    <>
      <span className={styles.title}>{titleWords[0]}</span>
      <div className={styles.airportCountryWrapper} ref={dropdownRef}>
        {/* Country */}
        <SingleDropdown
          dd_title={"Country"}
          allItems={filteredCountries}
          varConnectedToStorage={"departure_country"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
        <SingleDropdown
          dd_title={"City"}
          allItems={filteredCities}
          varConnectedToStorage={"departure_city"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
        <SingleDropdown
          dd_title={"Airport"}
          allItems={filteredAirports}
          varConnectedToStorage={"departure_airport"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
      </div>
    </>
  );
}
