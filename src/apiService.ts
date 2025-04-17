import axios from "axios";
import Router from "next/router";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false; // Apakah refresh token sedang diproses
let refreshSubcribers: ((token: string) => void)[] = []; // Menyimpan permintaan yang menunggu token baru

// // Fungsi untuk memproses ulang permintaan yang tertunda
const onRefreshed = (newAccessToken: string) => {
  refreshSubcribers.forEach((callback) => callback(newAccessToken));
  refreshSubcribers = [];
};

// // interceptor permintaan
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// // interceptor response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika status 401, maka lakukan refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // mencegah chain request

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await api.post("/auth/refresh", {
            refresh_token: Cookies.get("refresh_token"),
          });

          const newAccessToken = refreshToken.data.token;
          Cookies.set("token", newAccessToken, { expires: 1 });
          onRefreshed(newAccessToken);
          isRefreshing = false;
        } catch (error) {
          console.log("Refresh token invalid or expired ", error);
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          Router.push("/login");
          return Promise.reject(error);
        }
      }

      // Tambahkan ke antrean
      return new Promise((res) => {
        refreshSubcribers.push((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          res(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
