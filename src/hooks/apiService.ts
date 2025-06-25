import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
// import { createUserStore } from "../app/data/UserStore"; // Import the UserStore

// const { setUser } = createUserStore(); // Create the user store instance

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    // await fetchUserData(token);
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = Cookies.get("refresh_token");
          const { data } = await api.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          const newToken = data.token;
          Cookies.set("token", newToken);
          onRefreshed(newToken);
          isRefreshing = false;
        } catch (refreshError) {
          console.error("Refresh token invalid or expired", refreshError);
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          toast.error("Your session has expired. Please log in again.", {
            duration: 5000,
            position: "top-center",
          });
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
