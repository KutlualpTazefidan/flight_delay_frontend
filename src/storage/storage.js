import { proxy } from "valtio";
import dayjs from "dayjs";

const storage = proxy({
  departure_airport: "Select",
  departure_city: "Select",
  departure_country: "Select",
  arrival_airport: "Select",
  arrival_city: "Select",
  arrival_country: "Select",
  departure_time: dayjs(),
  arrival_time: dayjs(),
  airline: "Select",
  airline_code: "Select",
});

export { storage };
