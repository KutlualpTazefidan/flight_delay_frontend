import { proxy } from "valtio";
import dayjs from "dayjs";

const storage = proxy({
  departure_airport: "Select your deparutre airport",
  arrival_airport: "Select your arrival airport",
  departure_time: dayjs(),
  arrival_time: dayjs(),
});

export { storage };
