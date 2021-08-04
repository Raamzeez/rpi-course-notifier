import axios from "axios";
import { iCourse } from "../interface/course";
import { iCourseCode } from "../interface/courseCode";
import { iSection } from "../interface/sections";

export const validateCRN = async (CRN: number): Promise<null | iCourse> => {
  const response = await axios.get(
    "https://raw.githubusercontent.com/quacs/quacs-data/master/semester_data/202109/courses.json",
    { validateStatus: () => true }
  );
  if (response.status !== 200) {
    return null;
  }
  let foundCourse = null;
  const rawData = response.data;
  rawData.forEach((courseCode: iCourseCode) => {
    courseCode.courses.forEach((course: iCourse) => {
      course.sections.forEach((section: iSection) => {
        if (section.crn == CRN) {
          foundCourse = course;
        }
      });
    });
  });
  if (!foundCourse) {
    return null;
  }
  return foundCourse;
};
