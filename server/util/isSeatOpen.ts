import { iCourse } from "../interface/course";
import { iSection } from "../interface/sections";

export const isSeatOpen = (CRN: number, course: iCourse): boolean => {
  if (
    (course.sections.filter((section: iSection) => section.crn == CRN)[0]
      .rem as number) <= 0
  ) {
    return false;
  }
  return true;
};
