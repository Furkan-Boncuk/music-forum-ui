import axios from "axios";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-library-read",
  "user-library-modify",
].join(" ");

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

export const redirectToSpotifyLogin = () => {
  console.log("🔄 Spotify yetkilendirme sayfasına yönlendiriliyor...");
  console.log("Yetkilendirme URL'si:", AUTH_URL);

  localStorage.setItem("lastVisitedPage", window.location.pathname);
  window.location.href = AUTH_URL;
};


export const getSpotifyAccessToken = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
};

export const refreshSpotifyAccessToken = async () => {
  const refreshToken = localStorage.getItem("spotifyRefreshToken");

  if (!refreshToken) {
    console.log("❌ Refresh token bulunamadı.");
    return null;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/spotify/refresh`, // BACKEND ENDPOINT
      { refreshToken }
    );

    // 🎯 Yeni gelen accessToken'ı al
    const { accessToken } = response.data;

    // ✅ Yeni token'ı kaydet
    localStorage.setItem("spotifyAccessToken", accessToken);
    console.log("✅ Yeni Access Token alındı:", accessToken);

    return accessToken;
  } catch (error) {
    console.error("❌ Spotify token yenileme hatası:", error);
    return null;
  }
};

export const handleSpotifyCallback = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  if (!code) {
    console.error("❌ Spotify yetkilendirme kodu bulunamadı!");
    return;
  }

  console.log("✅ Spotify Yetkilendirme Kodu:", code);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/spotify/callback`,
      { code }
    );

    const { accessToken, refreshToken } = response.data;

    if (!accessToken || !refreshToken) {
      console.error("❌ Access veya Refresh Token alınamadı!");
      return;
    }

    localStorage.setItem("spotifyAccessToken", accessToken);
    localStorage.setItem("spotifyRefreshToken", refreshToken);

    console.log("✅ Access Token:", accessToken);
    console.log("🔄 Refresh Token:", refreshToken);

    // Kullanıcıyı en son ziyaret ettiği sayfaya yönlendir
    const lastPage = localStorage.getItem("lastVisitedPage") || "/";
    localStorage.removeItem("lastVisitedPage");
    window.location.href = lastPage;

  } catch (error) {
    console.error("❌ Spotify yetkilendirme işlemi başarısız oldu:", error);
  }
};
