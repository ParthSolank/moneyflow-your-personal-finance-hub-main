import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5204/api"
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        try {
          const response = await axios.post("http://localhost:5204/api/auth/refresh-token", {
            token: user.token,
            refreshToken: user.refreshToken
          });
          const newUser = { ...user, token: response.data.token, refreshToken: response.data.refreshToken };
          localStorage.setItem("user", JSON.stringify(newUser));
          originalRequest.headers.Authorization = `Bearer ${newUser.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
