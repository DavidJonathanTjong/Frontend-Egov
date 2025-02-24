import axios from "axios";
import Router from "next/router";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// let isRefreshing = false; // Apakah refresh token sedang diproses
// let refreshSubcribers = []; // Menyimpan permintaan yang menunggu token baru

// // Fungsi untuk memproses ulang permintaan yang tertunda
// const onRefreshed = (newAccessToken) => {
//   refreshSubcribers.forEach((callback) => callback(newAccessToken));
//   let refreshSubcribers = [];
// };

// // interceptor permintaan
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// // interceptor response
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Jika status 401, maka lakukan refresh token
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true; // mencegah chain request

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           const refreshToken = await api.post("/auth/refresh", {
//             refresh_token: localStorage.getItem("refresh_token"),
//           });

//           const newAccessToken = refreshToken.data.token;
//           localStorage.setItem("token", newAccessToken);

//           onRefreshed(newAccessToken);

//           isRefreshing = false;
//         } catch (error) {
//           console.log("Refresh token invalid or expired ", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("refresh_token");
//           useUserStore().user = null;
//           router.push("/");
//           toast.error("Sesi Anda telah berakhir. Silakan login kembali.", {
//             autoClose: 5000,
//             position: "top",
//           });
//           isRefreshing = false;
//           return Promise.reject(error);
//         }
//       }

//       // Tambahkan ke antrean
//       return new Promise((res) => {
//         refreshSubcribers.push((newToken) => {
//           originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//           res(api(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
