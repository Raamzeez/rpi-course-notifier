import { iTimeSlots } from "./timeslots";

export interface iSection {
  crn: number;
  subj: string;
  crse: number;
  sec: string;
  credMin: number;
  credMax: number;
  title: string;
  cap: number;
  act: number;
  rem: number;
  attribute: string;
  timeslots: iTimeSlots[];
}
