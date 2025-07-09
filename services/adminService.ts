import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/dashboard-stats");
  return response.data;
};

export const getAllStudents = async () => {
  const response = await axiosInstance.get("/admin/students");
  return response.data;
};

export const getAllSupervisors = async () => {
  const response = await axiosInstance.get("/admin/supervisors");
  console.log(response);
  return response.data;
};

export const getAllEnrollments = async () => {
  const response = await axiosInstance.get("/admin/enrollments");
  return response.data;
};
