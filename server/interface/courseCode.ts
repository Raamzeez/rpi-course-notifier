import { iCourse } from "./course";

export interface iCourseCode {
  name: string;
  code: string;
  courses: iCourse[];
}
