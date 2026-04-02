import axios from "axios";
import { httpClient } from "./httpClient";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const loginRequest = async (payload) => {
  const response = await axios.post(`${baseURL}/auth/login`, payload);
  return response.data;
};

export const logoutRequest = async (refreshToken) => {
  const response = await httpClient.post("/auth/logout", { refreshToken });
  return response.data;
};
