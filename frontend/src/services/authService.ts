import api from "../utils/api";

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
