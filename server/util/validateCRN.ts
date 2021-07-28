import axios from "axios";
import { iCourse } from "../interface/course";

export const validateCRN = async (CRN: number): Promise<null | iCourse> => {
  if (CRN.toString().length !== 6) {
    return null;
  }
  const response = await axios.get(
    "https://raw.githubusercontent.com/quacs/quacs-data/master/semester_data/202109/courses.json",
    { validateStatus: () => true }
  );
  if (response.status !== 200) {
    return null;
  }
  const rawData = response.data;
  rawData.forEach();
  return {
    name: "Test",
  };
};
