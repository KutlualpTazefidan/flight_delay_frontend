"use client";
import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import styles from "./customdatepicker.module.css";

export default function CustomDatePicker() {
  const [startDate, setStartDate] = useState(new Date());

  // const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  //   <button className="example-custom-input" onClick={onClick} ref={ref}>
  //     {value}
  //   </button>
  // ));

  // ExampleCustomInput.displayName = "ExampleCustomInput";
  return (
    <div className={styles.date_wrapper}>
      <span className={styles.date_label}>Flight Date</span>
      <DatePicker
        // showIcon
        wrapperClassName={styles.datePicker}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        // customInput={<ExampleCustomInput />}
      />
      <IoCalendarOutline className={styles.calendar_icon} />
    </div>
  );
}
