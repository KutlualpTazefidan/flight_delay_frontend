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
    for (const airportKey in airportsData) {
      if (airportsData.hasOwnProperty(airportKey)) {
        const countryCode = airportsData[airportKey].country;
        let country = "";
        if (countryCode === "XK") {
          country = "Kosovo";
        } else {
          country = countryList.getName(countryCode); // Assuming 'countries' is the country attribute
        }

        // Check if the country is not already in the uniqueCountries array
        if (!countries.includes(country)) {
          countries.push(country);
        }

        // saving city
        const city = airportsData[airportKey].city;
        if (!cities.includes(city)) {
          cities.push(airportsData[airportKey].city);
        }
        // console.log("Following key not found: ", airportsData[airportKey]);
      }
    }
    setAllCountries(countries);
    setAllCities(cities);
    console.log("set", allCountries);
  }, [airportsData]);

  useEffect(() => {
    setLocalObjectsStorage(storage);
    // console.log("saving to storage");
    // console.log("storage", storage);
  }, [renderTrigger]);

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [departure_airport, arrival_airport]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Click occurred outside the dropdown, so close it
      setIsAirportsActive(false);
      setIsCountriesActive(false);
    }
  };

  const updateSelectedAirport = (selectedAirport) => {
    setSelectedAirport(selectedAirport);
    title === "Departure Airport"
      ? (storage.departure_airport = selectedAirport)
      : (storage.arrival_airport = selectedAirport);
    setIsAirportsActive(false); // Close the dropdown when a country is selected
    setLocalObjectsStorage(storage);
  };

  const handleSearchInputChangeAirports = (event) => {
    const value = event.target.value;
    let c_filteredAirports = [];
    if (value != "") {
      c_filteredAirports = allAirports.filter((airport) => {
        return airport.toLowerCase().startsWith(value.toLowerCase());
      });
    } else {
      c_filteredAirports = [];
    }
    c_filteredAirports.length == 0
      ? setFilteredAirports(["None"])
      : setFilteredAirports(c_filteredAirports);
    setSearchValueAirport(value);
  };

  const renderOptionsForAirports = () => {
    const airportsToRender =
      filteredAirports.length > 0 ? filteredAirports : ["Search Results"];
    return airportsToRender.map((airport, index) => (
      <li
        onClick={() => updateSelectedAirport(airport)}
        key={"airport" + index}
      >
        {airport}
      </li>
    ));
  };

  const toggleWrapperAirports = () => {
    setIsAirportsActive(!isAirportsActive);
    if (!isAirportsActive) setIsCountriesActive(false);
  };
  return (
    <>
      <span className={styles.title}>{titleWords[0]}</span>
      <div className={styles.airportCountryWrapper} ref={dropdownRef}>
        {/* Country */}
        <SingleDropdown
          dd_title={"Country"}
          allItems={allCountries}
          varConnectedToStorage={"departure_country"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
        <SingleDropdown
          dd_title={"City"}
          allItems={allCities}
          varConnectedToStorage={"departure_city"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
        <SingleDropdown
          dd_title={"Airport"}
          allItems={allAirports}
          varConnectedToStorage={"departure_airport"}
          renderTrigger={renderTrigger}
          setRenderTrigger={setRenderTrigger}
        />
      </div>
    </>
  );
}
