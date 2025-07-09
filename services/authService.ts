import {
  LoginRequest,
  StudentRegisterRequest,
  SupervisorRegisterRequest,
} from "@/types/auth";
import axiosInstance from "./axiosInstance";

export const getUser = async () => {
  const res = await axiosInstance.get("/auth/getUser");
  return res.data;
};

export const loginUser = async (credentials: LoginRequest) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};
export const forgotPassword = async (data: { email: string; url: string }) => {
  console.log(data);
  const res = await axiosInstance.post("/auth/forgot-password", data);
  return res.data;
};
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const res = await axiosInstance.post("/auth/reset-password", data);
  return res.data;
};

export const registerUser = async (
  data: StudentRegisterRequest | SupervisorRegisterRequest
) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};
