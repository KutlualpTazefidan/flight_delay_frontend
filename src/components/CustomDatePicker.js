"use client";
import { useEffect, useState } from "react";

// Date time picker
import styles from "./customdatepicker.module.css";
import { DateTimePicker } from "react-rainbow-components";

// Storage
import { storage } from "../storage/storage";
import { useSnapshot } from "valtio";
import useLocalStorageState from "use-local-storage-state";

export default function CustomDatePicker({ title }) {
  const [localObjectsStorage, setLocalObjectsStorage] = useLocalStorageState(
    "FlightDelayStorage",
    { defaultValue: storage }
  );
  // State variables to store the selected departure and arrival dates
  const snap = useSnapshot(storage);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (title != undefined) storage[title + "_time"] = selectedDate;
    setLocalObjectsStorage(storage);
    console.log(new Date("2000"));
  }, [selectedDate]);

  return (
    <div className={styles.date_wrapper}>
      <span className={styles.date_label}>Date</span>
      <DateTimePicker
        id={title + "departure_time_picker"}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        formatStyle="middle"
        locale={"en-US"}
        okLabel={"OK"}
        cancelLabel={"Cancel"}
        hour24={true}
        valueAlignment={"center"}
        minDate={new Date("2010")}
        maxDate={new Date("2040")}
        disabledDays={[]}
      />
    </div>
  );
}
