import axios from "axios";

// Backend base URL
// const API_BASE_URL = "http://localhost:8080/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  // baseURL: "https://music-forum-be.onrender.com/api",
  // baseURL: "http://localhost:8080/api",
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response, // Başarılı yanıt
  async (error) => {
    const originalRequest = error.config;

    // Eğer access token süresi dolmuşsa (401 Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token ile yeni Access Token al
        const refreshResponse = await axios.post("/api/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"), // Refresh Token'ı buradan al
        });

        const newAccessToken = refreshResponse.data.accessToken;

        // Yeni Access Token'ı sakla
        localStorage.setItem("accessToken", newAccessToken);

        // Yeni token ile orijinal isteği tekrar gönder
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token da geçersizse, kullanıcıyı girişe yönlendir
        console.error("Session expired. Please log in again.", refreshError);
        window.location.href = "/auth"; // Giriş sayfasına yönlendirme
      }
    }

    return Promise.reject(error);
  }
);