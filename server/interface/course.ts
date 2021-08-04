import { iSection } from "./sections";

export interface iCourse {
  title: string;
  subj: string;
  crse: number;
  id: string;
  sections: iSection[];
}
