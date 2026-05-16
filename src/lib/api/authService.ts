import api from "./client";

const API_URL = "/auth";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await api.post(`${API_URL}/register`, { email, password, fullName });
    return response.data;
  },

  async refreshToken(token: string, refreshToken: string): Promise<AuthResponse> {
    const response = await api.post(`${API_URL}/refresh-token`, { token, refreshToken });
    return response.data;
  }
};
