"use client";
import { useEffect, useState } from "react";

// Date time picker
import styles from "./customdatepicker.module.css";
import { DateTimePicker } from "react-rainbow-components";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";

export default function CustomDatePicker() {
  // State variables to store the selected departure and arrival dates
  const snap = useSnapshot(storage);

  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());

  useEffect(() => {
    storage.departure_time = departureDate;
    storage.arrival_time = arrivalDate;
  }, [departureDate, arrivalDate]);

  return (
    <div className={styles.date_wrapper}>
      <span className={styles.date_label}>Depature Date</span>
      <DateTimePicker
        id="departure_time_picker"
        // label="DateTimePicker label"
        value={departureDate}
        onChange={(value) => setDepartureDate(value)}
        formatStyle="large"
        locale={"en-US"}
        okLabel={"OK"}
        cancelLabel={"Cancel"}
        hour24={true}
      />
      <span className={styles.date_label}>Arrival Date</span>
      <DateTimePicker
        id="arrival_time_picker"
        value={arrivalDate}
        onChange={(value) => setArrivalDate(value)}
        formatStyle="large"
        locale={"en-US"}
        okLabel={"OK"}
        cancelLabel={"Cancel"}
        hour24={true}
      />
    </div>
  );
}
