"use client";
import styles from "./dropdown.module.css";
import { useState, useRef, useEffect } from "react";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";
import useLocalStorageState from "use-local-storage-state";

import SingleDropdown from "./SingleDropdown";
import CustomDatePicker from "./CustomDatePicker";

export default function AirportDropdown({ title, airportsData }) {
  const [selectedItem, setSelectedItem] = useState();

  // List of countries from an external library
  const countryList = require("country-list"); // Import the country-list library

  // Split the title into words
  const titleWords = title.split(" ");
  const prefix = titleWords[0].toLowerCase();

  const [localObjectsStorage, setLocalObjectsStorage] = useLocalStorageState(
    "FlightDelayStorage",
    { defaultValue: storage }
  );
  const snap = useSnapshot(storage);

  const [filteredAirports, setFilteredAirports] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const dropdownRef = useRef(null);
  const [renderTriggerCountry, setRenderTriggerCountry] = useState(false);
  const [renderTriggerCity, setRenderTriggerCity] = useState(false);
  const [renderTriggerAirport, setRenderTriggerAirport] = useState(false);

  useEffect(() => {
    // Extract all airports to show initially
    // setAllAirports(Object.keys(airportsData));

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
    setFilteredCountries(countries.slice().sort());
    setFilteredCities(cities.slice().sort());
    setFilteredAirports(Object.keys(airportsData).slice().sort());
    console.log(filteredCities);
  }, [airportsData]);

  // Using UseEffect and functions
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
    const airports = filteredAirports.map((airport) => airport.iata);

    return [cities, airports];
  }

  function getCountryNameForCity(city) {
    for (const airportKey in airportsData) {
      if (airportsData.hasOwnProperty(airportKey)) {
        const airport = airportsData[airportKey];
        if (airport.city === city) {
          return airport.countryName; // Found a match, return the countryName
        }
      }
    }
    // City not found, return null or an appropriate default value
    return null; // You can return null or any other default value as needed
  }

  function getAirportsByCityAndCountry(cityName, countryName) {
    const matchingAirports = [];
    for (const airportKey in airportsData) {
      if (airportsData.hasOwnProperty(airportKey)) {
        const airport = airportsData[airportKey];
        if (airport.city === cityName && airport.countryName === countryName) {
          matchingAirports.push(airport);
        }
      }
    }
    return matchingAirports;
  }

  function getForACityGetCountryAirports(cityName) {
    const countryName = getCountryNameForCity(cityName);
    const airports = getAirportsByCityAndCountry(cityName, countryName);
    return [[countryName], airports];
  }

  function getForAirportGetCityCountry(airportCode) {
    const airport = airportsData[airportCode];
    return [airport?.country, airport?.city];
  }
  useEffect(() => {
    setLocalObjectsStorage(storage);
    console.log("saving to storage");

    let citiesInSelectedCountry = [];
    let airportsInSelectedCountry = [];
    if (snap[prefix + "_country"] != "Select") {
      [citiesInSelectedCountry, airportsInSelectedCountry] = getCitiesByCountry(
        snap[prefix + "_country"]
      );
    }
    setFilteredAirports(airportsInSelectedCountry);
    setFilteredCities(citiesInSelectedCountry);
  }, [renderTriggerCountry]);

  useEffect(() => {
    setLocalObjectsStorage(storage);
    console.log("saving to storage");
    let airports = [];
    let country = [];

    [country, airports] = getForACityGetCountryAirports(snap[prefix + "_city"]);
    console.log(airports);
    if (country[0] !== null) storage[prefix + "_country"] = country[0];
  }, [renderTriggerCity]);

  useEffect(() => {
    setLocalObjectsStorage(storage);
    let country = "";
    let city = "";
    [country, city] = getForAirportGetCityCountry(snap[prefix + "_airport"]);
    console.log(country, city, "hey");
    if (country !== undefined) storage[prefix + "_country"] = country;
    if (city !== undefined) storage[prefix + "_city"] = city;
    setRenderTriggerCountry(!renderTriggerCountry);
    setRenderTriggerCity(!renderTriggerCity);
  }, [renderTriggerAirport]);

  return (
    <>
      <span className={styles.title}>{titleWords[0]}</span>
      <CustomDatePicker title={prefix} />
      <div className={styles.airportCountryWrapper} ref={dropdownRef}>
        {/* Country */}
        <SingleDropdown
          dd_title={"Country"}
          allItems={filteredCountries}
          varConnectedToStorage={prefix + "_country"}
          renderTrigger={renderTriggerCountry}
          setRenderTrigger={setRenderTriggerCountry}
        />
        <SingleDropdown
          dd_title={"City"}
          allItems={filteredCities}
          varConnectedToStorage={prefix + "_city"}
          renderTrigger={renderTriggerCity}
          setRenderTrigger={setRenderTriggerCity}
        />
        <SingleDropdown
          dd_title={"Airport"}
          allItems={filteredAirports}
          varConnectedToStorage={prefix + "_airport"}
          renderTrigger={renderTriggerAirport}
          setRenderTrigger={setRenderTriggerAirport}
        />
      </div>
    </>
  );
}
