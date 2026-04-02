import { httpClient } from "./httpClient";

export const fetchUsers = async () => {
  const response = await httpClient.get("/admin/users");
  return response.data;
};

export const createPermission = async (payload) => {
  const response = await httpClient.post("/permissions", payload);
  return response.data;
};

export const approveMissedExam = async (payload) => {
  const response = await httpClient.put("/dos/approve", payload);
  return response.data;
};

export const allowMissedExam = async (payload) => {
  const response = await httpClient.put("/teacher/allow-exam", payload);
  return response.data;
};

export const logExit = async (payload) => {
  const response = await httpClient.post("/security/exit", payload);
  return response.data;
};

export const logReturn = async (payload) => {
  const response = await httpClient.post("/security/return", payload);
  return response.data;
};
