import axiosInstance from "./axiosInstance";

export const getPendingLogs = async () => {
  const res = await axiosInstance.get("/logbook/supervisor/pending");
  return res.data;
};
export const getReviewedLogs = async () => {
  const res = await axiosInstance.get("/logbook/supervisor/reviewed");
  return res.data;
};
export const getSupervisorStudents = async () => {
  const res = await axiosInstance.get("/enroll/supervisor/students");
  return res.data;
};
export const getSupervisorStudent = async (studentId: number) => {
  const res = await axiosInstance.get(
    `/enroll/supervisor/students/${studentId}`
  );
  return res.data;
};
