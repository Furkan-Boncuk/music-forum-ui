import { api } from "../api";

// Login işlemi
export const login = async (usernameOrEmail: string, password: string) => {
  const response = await api.post("/auth/login", {
    usernameOrEmail,
    password,
  });
  return response.data; // Örn: { token, user, expireIn }
};

// Signup işlemi
export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response.data; // Örn: { message }
};
